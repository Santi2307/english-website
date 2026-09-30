import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { verifyEventChecksum, type WompiEvent } from '../services/wompi.service.js';
import { applyWompiTransaction } from '../services/payment.service.js';

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
  try {
    await prisma.paymentEvent.create({
      data: {
        eventKey: `${tx.id}:${tx.status}`,
        reference: tx.reference,
        transactionId: tx.id,
        status: tx.status,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
  }

  // applyWompiTransaction es idempotente por sí misma, así que reintentos son seguros
  const result = await applyWompiTransaction(tx);
  res.status(200).json({ received: true, ...result });
}
