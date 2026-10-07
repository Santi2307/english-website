import Stripe from 'stripe';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

/**
 * Integración con Stripe. Todo lo que toca la API de Stripe vive aquí:
 * clientes, PaymentIntents, descripción del medio de pago y firma de webhooks.
 *
 * Seguridad: la tarjeta la captura el Payment Element de Stripe en el navegador.
 * Este servidor solo ve ids (pi_…, cus_…) y datos ya enmascarados (marca, últimos 4).
 */
let client: Stripe | null = null;

export const stripeEnabled = () => !!env.STRIPE_SECRET_KEY && !!env.STRIPE_PUBLISHABLE_KEY;

export function stripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new Error('Stripe no está configurado (STRIPE_SECRET_KEY)');
  return (client ??= new Stripe(env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2, timeout: 15_000, appInfo: { name: 'English Academy' } }));
}

/** Cliente de Stripe del usuario (se crea una vez y se reutiliza). Vincula los pagos a la cuenta, no al email. */
export async function ensureCustomer(user: { id: string; email: string; name: string; stripeCustomerId: string | null }) {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe().customers.create(
    { email: user.email, name: user.name, metadata: { userId: user.id } },
    { idempotencyKey: `customer:${user.id}` },
  );
  // Condicional: si dos pestañas lo crean a la vez, gana la primera y la otra reutiliza ese id
  const res = await prisma.user.updateMany({ where: { id: user.id, stripeCustomerId: null }, data: { stripeCustomerId: customer.id } });
  if (res.count === 0) {
    const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { stripeCustomerId: true } });
    return fresh.stripeCustomerId!;
  }
  return customer.id;
}

const REUSABLE: Stripe.PaymentIntent.Status[] = ['requires_payment_method', 'requires_confirmation', 'requires_action'];

/**
 * PaymentIntent de una orden. Si la orden ya tiene uno utilizable se reutiliza
 * (doble clic, recarga o reintento no crean cobros nuevos); si cambió el monto
 * (por un cupón), se actualiza en vez de crear otro.
 */
export async function intentForOrder(order: {
  id: string;
  userId: string;
  courseId: string;
  amountInCents: number;
  currency: string;
  providerPaymentId: string | null;
}, customerId: string, description: string) {
  const s = stripe();
  if (order.providerPaymentId) {
    const existing = await s.paymentIntents.retrieve(order.providerPaymentId);
    if (REUSABLE.includes(existing.status)) {
      if (existing.amount === order.amountInCents) return existing;
      return s.paymentIntents.update(existing.id, { amount: order.amountInCents });
    }
    if (existing.status === 'succeeded' || existing.status === 'processing') return existing;
  }
  return s.paymentIntents.create(
    {
      amount: order.amountInCents,
      currency: order.currency.toLowerCase(),
      customer: customerId,
      description,
      // Stripe decide qué medios mostrar (tarjeta, Apple Pay, Google Pay, Link…) según el dispositivo,
      // la moneda y lo que esté activado en el Dashboard. No mostramos nada que no esté disponible.
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id, userId: order.userId, courseId: order.courseId },
    },
    { idempotencyKey: `intent:${order.id}:${order.amountInCents}` },
  );
}

export const retrieveIntent = (id: string) => stripe().paymentIntents.retrieve(id, { expand: ['latest_charge'] });

const WALLETS: Record<string, string> = { apple_pay: 'Apple Pay', google_pay: 'Google Pay', link: 'Link' };

/** "VISA •••• 4242", "VISA •••• 4242 · Apple Pay", "Link". Solo datos que Stripe ya enmascara. */
export function describePayment(pi: Stripe.PaymentIntent): { method: string | null; detail: string | null; receiptUrl: string | null } {
  const charge = typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
  const pm = charge?.payment_method_details;
  if (!pm) return { method: null, detail: null, receiptUrl: charge?.receipt_url ?? null };
  if (pm.type === 'card' && pm.card) {
    const wallet = pm.card.wallet?.type ? WALLETS[pm.card.wallet.type] ?? null : null;
    const card = `${(pm.card.brand ?? 'card').toUpperCase()} •••• ${pm.card.last4 ?? ''}`.trim();
    return { method: 'CARD', detail: wallet ? `${card} · ${wallet}` : card, receiptUrl: charge?.receipt_url ?? null };
  }
  return { method: pm.type.toUpperCase(), detail: WALLETS[pm.type] ?? null, receiptUrl: charge?.receipt_url ?? null };
}

/** Verifica la firma del webhook con el body exacto que envió Stripe. Lanza si no es válida. */
export function verifyWebhook(rawBody: Buffer | string, signature: string | undefined, secret = env.STRIPE_WEBHOOK_SECRET): Stripe.Event {
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET no está configurado');
  if (!signature) throw new Error('Falta la firma Stripe-Signature');
  // Helper estático: verificar la firma no necesita la llave secreta ni llamar a la API
  return Stripe.webhooks.constructEvent(rawBody, signature, secret);
}

/** Código de error del último intento (para mapearlo a un mensaje humano en la UI). Nunca el texto técnico. */
export function lastErrorCode(pi: Stripe.PaymentIntent): string | null {
  const e = pi.last_payment_error;
  if (!e) return null;
  return e.decline_code ?? e.code ?? e.type ?? 'unknown';
}
