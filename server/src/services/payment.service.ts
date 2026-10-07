import { Prisma, type Order, type OrderStatus } from '@prisma/client';
import type Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { toCents } from '../utils/money.js';
import { HttpError, badRequest, conflict, notFound } from '../utils/httpError.js';
import { quote } from './pricing.service.js';
import { fetchTransaction, generateReference, paymentDetail, type WompiTransaction } from './wompi.service.js';
import { describePayment, ensureCustomer, intentForOrder, lastErrorCode, retrieveIntent, stripeEnabled } from './stripe.service.js';
import type { Billing } from '../schemas/order.schema.js';
import { events } from '../notifications/index.js';
import { toLocale } from '../notifications/types.js';

/** Moneda en la que están los precios (Course.priceCOP). Un solo lugar para cambiarla cuando haya precios regionales. */
export const PRICE_CURRENCY = 'COP';

/** Una orden pendiente se reutiliza durante este tiempo (doble clic, recarga, reintento). */
const REUSE_WINDOW_MS = 24 * 3_600_000;

const log = (msg: string, data: Record<string, unknown>) => console.info(`[payments] ${msg}`, JSON.stringify(data));

/**
 * Crea (o reutiliza) la orden de un usuario autenticado y su PaymentIntent.
 * El precio, el descuento y la moneda los resuelve SIEMPRE el servidor: el
 * cliente solo envía qué curso y qué cupón.
 */
export async function createOrder(userId: string, courseId: string, couponCode: string | undefined, billing: Billing) {
  const course = await prisma.course.findFirst({ where: { id: courseId, published: true } });
  if (!course) throw notFound('Curso no encontrado');

  const already = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (already) throw conflict('Ya estás inscrito en este curso');

  const q = await quote(course, couponCode);
  const amountInCents = toCents(q.totalCOP);
  const billingJson = billing as Prisma.InputJsonValue;

  // Cupón del 100%: no pasa por el proveedor, se aprueba e inscribe directamente.
  if (amountInCents === 0) {
    const order = await prisma.order.create({
      data: {
        reference: generateReference(), userId, courseId, subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP,
        amountInCents, couponId: q.coupon?.id, provider: 'none', billing: billingJson,
      },
    });
    await transitionOrder(order, { status: 'APPROVED', paymentMethod: 'COUPON' });
    log('free order approved', { orderId: order.id });
    return { orderId: order.id, free: true as const };
  }

  if (!stripeEnabled()) throw new HttpError(503, 'Los pagos no están disponibles en este momento');

  // Idempotencia: misma persona, mismo curso, mismo monto → misma orden y mismo PaymentIntent
  const reusable = await prisma.order.findFirst({
    where: {
      userId, courseId, provider: 'stripe', status: 'PENDING', amountInCents, couponId: q.coupon?.id ?? null,
      createdAt: { gte: new Date(Date.now() - REUSE_WINDOW_MS) },
    },
    orderBy: { createdAt: 'desc' },
  });
  const order = reusable
    ? await prisma.order.update({ where: { id: reusable.id }, data: { billing: billingJson } })
    : await prisma.order.create({
        data: {
          reference: generateReference(), userId, courseId, subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP,
          amountInCents, currency: PRICE_CURRENCY, couponId: q.coupon?.id, provider: 'stripe', billing: billingJson,
        },
      });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { id: true, email: true, name: true, stripeCustomerId: true } });
  const customerId = await ensureCustomer(user);
  const intent = await intentForOrder(order, customerId, course.title);
  if (order.providerPaymentId !== intent.id) {
    await prisma.order.update({ where: { id: order.id }, data: { providerPaymentId: intent.id } });
  }
  log(reusable ? 'checkout reused' : 'checkout started', { orderId: order.id, intent: intent.id, amount: amountInCents });

  // Si ya se pagó (p. ej. en otra pestaña), se concilia y el cliente va directo al resultado
  if (intent.status === 'succeeded') await applyStripeIntent(await retrieveIntent(intent.id));

  return {
    orderId: order.id,
    free: false as const,
    provider: 'stripe' as const,
    clientSecret: intent.client_secret!,
    status: intent.status,
    amountInCents,
    currency: PRICE_CURRENCY,
    returnUrl: `${env.CLIENT_URL}/pago/resultado?order=${order.id}`,
    summary: { subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP, totalCOP: q.totalCOP },
  };
}

/**
 * Aplica un cambio de estado de forma idempotente.
 * - El update es condicional al estado actual: si dos webhooks llegan a la vez, solo uno gana.
 * - La inscripción usa upsert sobre (userId, courseId): nunca se duplica.
 * - Los efectos secundarios (email, cupón) solo corren si esta llamada hizo la transición.
 */
async function transitionOrder(
  order: Order,
  next: { status: OrderStatus; transactionId?: string; paymentMethod?: string | null; paymentDetail?: string | null; receiptUrl?: string | null; message?: string | null },
) {
  const allowedFrom: OrderStatus[] = next.status === 'VOIDED' ? ['PENDING', 'APPROVED'] : ['PENDING'];
  if (order.status === next.status || !allowedFrom.includes(order.status)) return false;

  const transitioned = await prisma.$transaction(async (tx) => {
    const res = await tx.order.updateMany({
      where: { id: order.id, status: { in: allowedFrom } },
      data: {
        status: next.status,
        wompiTransactionId: next.transactionId ?? order.wompiTransactionId,
        paymentMethod: next.paymentMethod ?? order.paymentMethod,
        paymentDetail: next.paymentDetail ?? order.paymentDetail,
        receiptUrl: next.receiptUrl ?? order.receiptUrl,
        statusMessage: next.message ?? null,
        paidAt: next.status === 'APPROVED' ? new Date() : undefined,
      },
    });
    if (res.count === 0) return false;

    if (next.status === 'APPROVED') {
      await tx.enrollment.upsert({
        where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
        create: { userId: order.userId, courseId: order.courseId, orderId: order.id },
        update: {},
      });
      if (order.couponId) {
        await tx.coupon.update({ where: { id: order.couponId }, data: { redemptions: { increment: 1 } } });
      }
    }
    if (next.status === 'VOIDED' && order.status === 'APPROVED') {
      await tx.enrollment.deleteMany({ where: { orderId: order.id } });
    }
    return true;
  });

  // Solo quien hizo la transición publica el evento: webhooks repetidos no generan emails repetidos
  if (transitioned) {
    log(`order ${next.status.toLowerCase()}`, { orderId: order.id });
    await publishOrderEvent(order.id, next.status);
  }
  return transitioned;
}

async function publishOrderEvent(orderId: string, status: OrderStatus) {
  if (status === 'PENDING') return;
  const o = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true, course: true } });
  if (!o) return;
  const user = { id: o.user.id, email: o.user.email, name: o.user.name, locale: toLocale(o.user.locale) };
  const base = { user, orderId: o.id, reference: o.reference, courseTitle: o.course.title, courseSlug: o.course.slug };
  if (status === 'APPROVED') {
    void events.emit(
      'ORDER_APPROVED',
      { ...base, totalCOP: o.amountInCents / 100, paymentMethod: o.paymentDetail ?? o.paymentMethod, paidAt: o.paidAt ?? new Date() },
      { id: o.id },
    );
  } else if (status === 'DECLINED' || status === 'ERROR') {
    void events.emit('ORDER_FAILED', { ...base, status, occurredAt: o.updatedAt }, { id: `${o.id}:${status}` });
  }
}

// ─── Stripe ─────────────────────────────────────────────────────────────────

/**
 * Concilia un PaymentIntent con su orden (desde el webhook o consultando a Stripe).
 * Idempotente y tolerante al orden de llegada: un intento fallido deja la orden
 * PENDING (el usuario puede reintentar con el mismo intent) y solo `succeeded`
 * activa el acceso.
 */
export async function applyStripeIntent(pi: Stripe.PaymentIntent) {
  const order =
    (await prisma.order.findUnique({ where: { providerPaymentId: pi.id } })) ??
    (pi.metadata?.orderId ? await prisma.order.findUnique({ where: { id: pi.metadata.orderId } }) : null);
  if (!order) {
    console.warn(`[payments] intent ${pi.id} sin orden`);
    return { handled: false as const, reason: 'order_not_found' };
  }

  // El monto y la moneda deben coincidir con lo que calculó el servidor
  if (pi.amount !== order.amountInCents || pi.currency.toUpperCase() !== order.currency) {
    console.error(`[payments] monto/moneda no coincide en ${order.reference}`, { intent: pi.id, amount: pi.amount, currency: pi.currency });
    await transitionOrder(order, { status: 'ERROR', message: 'Monto no coincide' });
    return { handled: true as const, reason: 'amount_mismatch' };
  }

  if (pi.status === 'succeeded') {
    const paid = typeof pi.latest_charge === 'object' ? pi : await retrieveIntent(pi.id);
    const d = describePayment(paid);
    const changed = await transitionOrder(order, { status: 'APPROVED', paymentMethod: d.method, paymentDetail: d.detail, receiptUrl: d.receiptUrl });
    return { handled: true as const, reason: changed ? 'updated' : 'already_processed' };
  }
  if (pi.status === 'canceled') {
    const changed = await transitionOrder(order, { status: 'ERROR', message: pi.cancellation_reason ?? 'canceled' });
    return { handled: true as const, reason: changed ? 'canceled' : 'already_processed' };
  }
  // processing / requires_* : sigue pendiente (PSE-like, 3DS en curso o intento fallido reintentable)
  if (pi.last_payment_error) log('payment attempt failed', { orderId: order.id, code: lastErrorCode(pi) });
  return { handled: true as const, reason: 'pending' };
}

/** Reembolso total → la orden pasa a VOIDED y se retira el acceso. Los parciales solo se registran. */
export async function applyStripeRefund(charge: Stripe.Charge) {
  const intentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!intentId) return { handled: false as const, reason: 'no_intent' };
  const order = await prisma.order.findUnique({ where: { providerPaymentId: intentId } });
  if (!order) return { handled: false as const, reason: 'order_not_found' };
  if (!charge.refunded) {
    log('partial refund', { orderId: order.id, refunded: charge.amount_refunded });
    return { handled: true as const, reason: 'partial_refund' };
  }
  const changed = await transitionOrder(order, { status: 'VOIDED', message: 'refunded' });
  return { handled: true as const, reason: changed ? 'refunded' : 'already_processed' };
}

// ─── Wompi (órdenes anteriores) ─────────────────────────────────────────────

/** Procesa una transacción de Wompi. Se mantiene para conciliar órdenes creadas antes de Stripe. */
export async function applyWompiTransaction(tx: WompiTransaction) {
  const order = await prisma.order.findUnique({ where: { reference: tx.reference } });
  if (!order) {
    console.warn(`Wompi: orden con referencia ${tx.reference} no existe`);
    return { handled: false as const, reason: 'order_not_found' };
  }
  if (tx.amount_in_cents !== order.amountInCents || tx.currency !== order.currency) {
    console.error(`Wompi: monto/moneda no coincide para ${order.reference}`, tx);
    await transitionOrder(order, { status: 'ERROR', transactionId: tx.id, message: 'Monto no coincide' });
    return { handled: true as const, reason: 'amount_mismatch' };
  }
  if (tx.status === 'PENDING') {
    if (!order.wompiTransactionId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { wompiTransactionId: tx.id, paymentMethod: tx.payment_method_type, paymentDetail: paymentDetail(tx) },
      });
    }
    return { handled: true as const, reason: 'pending' };
  }
  const changed = await transitionOrder(order, {
    status: tx.status,
    transactionId: tx.id,
    paymentMethod: tx.payment_method_type,
    paymentDetail: paymentDetail(tx),
    message: tx.status_message,
  });
  return { handled: true as const, reason: changed ? 'updated' : 'already_processed' };
}

// ─── Consultas ──────────────────────────────────────────────────────────────

/**
 * Estado de la orden para la página de resultado. Si sigue PENDING (el webhook aún
 * no llega), se concilia consultando directamente al proveedor: así el acceso se
 * activa aunque el redirect llegue antes que el webhook, o el webhook nunca llegue.
 */
export async function getOrderStatus(userId: string, orderId: string, txHint?: string) {
  let order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw notFound('Orden no encontrada');

  let attemptError: string | null = null;
  if (order.status === 'PENDING' && order.provider === 'stripe' && order.providerPaymentId && stripeEnabled()) {
    const pi = await retrieveIntent(order.providerPaymentId).catch(() => null);
    if (pi) {
      await applyStripeIntent(pi);
      attemptError = pi.status === 'requires_payment_method' ? lastErrorCode(pi) : null;
      order = (await prisma.order.findUnique({ where: { id: order.id } }))!;
    }
  } else if (order.status === 'PENDING' && order.provider === 'wompi') {
    const txId = order.wompiTransactionId ?? txHint;
    const tx = txId ? await fetchTransaction(txId).catch(() => null) : null;
    if (tx && tx.reference === order.reference) {
      await applyWompiTransaction(tx);
      order = (await prisma.order.findUnique({ where: { id: order.id } }))!;
    }
  }

  const [course, user] = await Promise.all([
    prisma.course.findUniqueOrThrow({ where: { id: order.courseId }, select: { id: true, slug: true, title: true } }),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true } }),
  ]);
  return {
    id: order.id,
    reference: order.reference,
    status: order.status,
    amountInCents: order.amountInCents,
    subtotalCOP: order.subtotalCOP,
    discountCOP: order.discountCOP,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentDetail: order.paymentDetail,
    receiptUrl: order.receiptUrl,
    // Solo un código (card_declined, insufficient_funds…): la UI lo traduce. El texto técnico se queda aquí.
    attemptError,
    statusMessage: null,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    receiptEmail: user.email,
    course,
  };
}

/** Historial de compras del usuario (Ajustes → Compras). */
export async function listOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId, OR: [{ status: { not: 'PENDING' } }, { wompiTransactionId: { not: null } }] },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { course: { select: { slug: true, title: true } } },
  });
  return orders.map((o) => ({
    id: o.id,
    reference: o.reference,
    status: o.status,
    totalCOP: o.amountInCents / 100,
    currency: o.currency,
    paymentMethod: o.paymentMethod,
    paymentDetail: o.paymentDetail,
    receiptUrl: o.receiptUrl,
    createdAt: o.createdAt,
    paidAt: o.paidAt,
    course: o.course,
  }));
}

/**
 * Lo que el checkout necesita antes de pagar: si los pagos están activos, la llave
 * pública de Stripe y los datos de facturación de la última compra (para no pedirlos otra vez).
 */
export async function checkoutConfig(userId: string) {
  const last = await prisma.order.findFirst({
    where: { userId, billing: { not: Prisma.DbNull } },
    orderBy: { createdAt: 'desc' },
    select: { billing: true },
  });
  return {
    provider: 'stripe' as const,
    enabled: stripeEnabled(),
    publishableKey: stripeEnabled() ? env.STRIPE_PUBLISHABLE_KEY : null,
    currency: PRICE_CURRENCY,
    savedBilling: (last?.billing as Billing | null) ?? null,
  };
}

export async function previewCoupon(courseId: string, code: string) {
  const course = await prisma.course.findFirst({ where: { id: courseId, published: true } });
  if (!course) throw badRequest('Curso inválido');
  const q = await quote(course, code);
  return {
    code,
    type: q.coupon?.type ?? null,
    value: q.coupon?.value ?? null,
    subtotalCOP: q.subtotalCOP,
    discountCOP: q.discountCOP,
    totalCOP: q.totalCOP,
    currency: PRICE_CURRENCY,
  };
}
