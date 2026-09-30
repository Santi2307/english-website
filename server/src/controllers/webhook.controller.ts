import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { verifyEventChecksum, type WompiEvent } from '../services/wompi.service.js';
import { applyWompiTransaction } from '../services/payment.service.js';
import { env } from '../config/env.js';
import { notificationStore } from '../notifications/index.js';
import { RESEND_STATUS, verifyResendSignature, type ResendWebhookEvent } from '../notifications/providers/resend.webhook.js';

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
