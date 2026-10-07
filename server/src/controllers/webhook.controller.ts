import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { verifyEventChecksum, type WompiEvent } from '../services/wompi.service.js';
import { applyStripeIntent, applyStripeRefund, applyWompiTransaction } from '../services/payment.service.js';
import { verifyWebhook } from '../services/stripe.service.js';
import { env } from '../config/env.js';
import { notificationStore } from '../notifications/index.js';
import { RESEND_STATUS, verifyResendSignature, type ResendWebhookEvent } from '../notifications/providers/resend.webhook.js';
import { parseBrevoEvent, verifyBrevoToken, type BrevoWebhookEvent } from '../notifications/providers/brevo.webhook.js';

/**
 * Webhook de Stripe. La firma se verifica con el body exacto (rawBody); un evento
 * repetido se registra una sola vez y su procesamiento es idempotente. Si algo
 * falla (p. ej. la base de datos), respondemos 500 y Stripe reintenta: quien pagó
 * siempre termina con acceso.
 */
export async function stripe(req: Request, res: Response) {
  let event;
  try {
    event = verifyWebhook(req.rawBody ?? '', req.get('stripe-signature'));
  } catch (err) {
    console.warn('[payments] webhook de Stripe con firma inválida:', (err as Error).message);
    res.status(400).json({ error: 'Firma inválida' });
    return;
  }

  const handled = ['payment_intent.succeeded', 'payment_intent.processing', 'payment_intent.payment_failed', 'payment_intent.canceled', 'charge.refunded'];
  if (!handled.includes(event.type)) {
    res.status(200).json({ ignored: true });
    return;
  }

  const obj = event.data.object as { id: string; status?: string; metadata?: Record<string, string>; payment_intent?: unknown };
  // Auditoría: el id del evento es único, así que un reenvío no crea otra fila
  await prisma.paymentEvent.createMany({
    data: [
      {
        eventKey: `stripe:${event.id}`,
        reference: obj.metadata?.orderId ?? (typeof obj.payment_intent === 'string' ? obj.payment_intent : obj.id),
        transactionId: obj.id,
        status: event.type,
        // Solo lo necesario para soporte; el objeto completo está en el Dashboard de Stripe
        payload: { id: event.id, type: event.type, created: event.created, livemode: event.livemode, object: obj.id, status: obj.status ?? null },
      },
    ],
    skipDuplicates: true,
  });

  const result =
    event.type === 'charge.refunded'
      ? await applyStripeRefund(event.data.object as Parameters<typeof applyStripeRefund>[0])
      : await applyStripeIntent(event.data.object as Parameters<typeof applyStripeIntent>[0]);
  console.info('[payments] webhook', JSON.stringify({ event: event.id, type: event.type, ...result }));
  res.status(200).json({ received: true, ...result });
}

export async function wompi(req: Request, res: Response) {
  const event = req.body as WompiEvent;

  if (!verifyEventChecksum(event)) {
    console.warn('Wompi webhook: checksum inválido');
    res.status(401).json({ error: 'Checksum inválido' });
    return;
  }
  if (event.event !== 'transaction.updated' || !event.data?.transaction) {
    res.status(200).json({ ignored: true });
    return;
  }

  const tx = event.data.transaction;

  // Auditoría. Un evento repetido (mismo id + estado) choca con el índice único y se ignora.
  await prisma.paymentEvent.createMany({
    data: [
      {
        eventKey: `${tx.id}:${tx.status}`,
        reference: tx.reference,
        transactionId: tx.id,
        status: tx.status,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    ],
    skipDuplicates: true,
  });

  // applyWompiTransaction es idempotente por sí misma, así que reintentos son seguros
  const result = await applyWompiTransaction(tx);
  res.status(200).json({ received: true, ...result });
}

/** Estados de entrega de Resend (delivered / bounced / complained) → log de notificaciones. */
export async function resend(req: Request, res: Response) {
  const ok = verifyResendSignature(
    req.rawBody?.toString('utf8') ?? '',
    { id: req.get('svix-id'), timestamp: req.get('svix-timestamp'), signature: req.get('svix-signature') },
    env.RESEND_WEBHOOK_SECRET,
  );
  if (!ok) {
    res.status(401).json({ error: 'Firma inválida' });
    return;
  }
  const event = req.body as ResendWebhookEvent;
  const status = RESEND_STATUS[event.type];
  if (status && event.data?.email_id) {
    await notificationStore.updateDeliveryStatus(event.data.email_id, status, new Date(event.created_at ?? Date.now()));
  }
  res.status(200).json({ received: true });
}

/** Estados de entrega de Brevo. Autenticado con el token secreto de la URL (?token=...). */
export async function brevo(req: Request, res: Response) {
  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  if (!verifyBrevoToken(token, env.BREVO_WEBHOOK_TOKEN)) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
  // Brevo puede enviar un evento o un lote
  const items = (Array.isArray(req.body) ? req.body : [req.body]) as BrevoWebhookEvent[];
  for (const item of items) {
    const parsed = parseBrevoEvent(item);
    if (parsed) await notificationStore.updateDeliveryStatus(parsed.messageId, parsed.status, parsed.at);
  }
  res.status(200).json({ received: true });
}
