import type { Order, OrderStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { toCents } from '../utils/money.js';
import { badRequest, conflict, notFound } from '../utils/httpError.js';
import { quote } from './pricing.service.js';
import { fetchTransaction, generateReference, integritySignature, type WompiTransaction } from './wompi.service.js';
import { events } from '../notifications/index.js';
import { toLocale } from '../notifications/types.js';

export async function createOrder(userId: string, courseId: string, couponCode?: string) {
  const course = await prisma.course.findFirst({ where: { id: courseId, published: true } });
  if (!course) throw notFound('Curso no encontrado');

  const already = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (already) throw conflict('Ya estás inscrito en este curso');

  const q = await quote(course, couponCode);
  const reference = generateReference();
  const amountInCents = toCents(q.totalCOP);

  // Cupón del 100%: no pasa por Wompi, se aprueba e inscribe directamente.
  if (amountInCents === 0) {
    const order = await prisma.order.create({
      data: {
        reference, userId, courseId, subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP,
        amountInCents, couponId: q.coupon?.id, status: 'PENDING',
      },
    });
    await transitionOrder(order, { status: 'APPROVED', paymentMethod: 'COUPON' });
    return { orderId: order.id, free: true as const };
  }

  const order = await prisma.order.create({
    data: {
      reference, userId, courseId, subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP,
      amountInCents, couponId: q.coupon?.id,
    },
  });

  return {
    orderId: order.id,
    free: false as const,
    checkout: {
      publicKey: env.WOMPI_PUBLIC_KEY,
      currency: 'COP',
      amountInCents,
      reference,
      signature: integritySignature(reference, amountInCents, 'COP'),
      redirectUrl: `${env.CLIENT_URL}/pago/resultado?order=${order.id}`,
    },
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
  next: { status: OrderStatus; transactionId?: string; paymentMethod?: string; message?: string | null },
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
  if (transitioned) await publishOrderEvent(order.id, next.status);
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
      { ...base, totalCOP: o.amountInCents / 100, paymentMethod: o.paymentMethod, paidAt: o.paidAt ?? new Date() },
      { id: o.id },
    );
  } else {
    void events.emit('ORDER_FAILED', { ...base, status, occurredAt: o.updatedAt }, { id: `${o.id}:${status}` });
  }
}

/** Procesa una transacción de Wompi (del webhook o de una consulta a su API). */
export async function applyWompiTransaction(tx: WompiTransaction) {
  const order = await prisma.order.findUnique({ where: { reference: tx.reference } });
  if (!order) {
    console.warn(`Wompi: orden con referencia ${tx.reference} no existe`);
    return { handled: false as const, reason: 'order_not_found' };
  }

  // El monto y la moneda deben coincidir con lo que firmamos
  if (tx.amount_in_cents !== order.amountInCents || tx.currency !== order.currency) {
    console.error(`Wompi: monto/moneda no coincide para ${order.reference}`, tx);
    await transitionOrder(order, { status: 'ERROR', transactionId: tx.id, message: 'Monto no coincide' });
    return { handled: true as const, reason: 'amount_mismatch' };
  }

  if (tx.status === 'PENDING') {
    if (!order.wompiTransactionId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { wompiTransactionId: tx.id, paymentMethod: tx.payment_method_type },
      });
    }
    return { handled: true as const, reason: 'pending' };
  }

  const changed = await transitionOrder(order, {
    status: tx.status,
    transactionId: tx.id,
    paymentMethod: tx.payment_method_type,
    message: tx.status_message,
  });
  return { handled: true as const, reason: changed ? 'updated' : 'already_processed' };
}

/**
 * Estado de la orden para /pago/resultado. Si sigue PENDING (p. ej. el webhook aún
 * no llega), se reconcilia consultando la transacción directamente a Wompi.
 */
export async function getOrderStatus(userId: string, orderId: string, txHint?: string) {
  let order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw notFound('Orden no encontrada');

  const txId = order.wompiTransactionId ?? txHint;
  if (order.status === 'PENDING' && txId) {
    const tx = await fetchTransaction(txId).catch(() => null);
    // Solo se usa si Wompi confirma que la transacción pertenece a esta orden
    if (tx && tx.reference === order.reference) {
      await applyWompiTransaction(tx);
      order = (await prisma.order.findUnique({ where: { id: order.id } }))!;
    }
  }

  const course = await prisma.course.findUniqueOrThrow({
    where: { id: order.courseId },
    select: { id: true, slug: true, title: true },
  });
  return {
    id: order.id,
    reference: order.reference,
    status: order.status,
    amountInCents: order.amountInCents,
    discountCOP: order.discountCOP,
    paymentMethod: order.paymentMethod,
    statusMessage: order.statusMessage,
    course,
  };
}

export async function previewCoupon(courseId: string, code: string) {
  const course = await prisma.course.findFirst({ where: { id: courseId, published: true } });
  if (!course) throw badRequest('Curso inválido');
  const q = await quote(course, code);
  return { code, subtotalCOP: q.subtotalCOP, discountCOP: q.discountCOP, totalCOP: q.totalCOP };
}
