import crypto from 'node:crypto';
import { normalizeMessageId } from './brevo.provider.js';

export type BrevoWebhookEvent = { event?: string; 'message-id'?: string; date?: string; ts_epoch?: number };

/** Eventos transaccionales de Brevo → estado en el log de notificaciones. */
export const BREVO_STATUS: Record<string, 'DELIVERED' | 'BOUNCED' | undefined> = {
  delivered: 'DELIVERED',
  hard_bounce: 'BOUNCED',
  invalid_email: 'BOUNCED',
  blocked: 'BOUNCED',
  // Queja de spam: se deja de escribir a esa dirección
  spam: 'BOUNCED',
};

/**
 * Brevo no firma sus webhooks: se configura la URL con un token secreto
 * (?token=...) y aquí se compara en tiempo constante.
 */
export function verifyBrevoToken(received: string | undefined, expected: string) {
  if (!received || !expected || received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export function parseBrevoEvent(e: BrevoWebhookEvent) {
  const status = e.event ? BREVO_STATUS[e.event] : undefined;
  const messageId = e['message-id'] ? normalizeMessageId(e['message-id']) : undefined;
  const at = e.ts_epoch ? new Date(e.ts_epoch) : e.date ? new Date(e.date) : new Date();
  return status && messageId ? { status, messageId, at: Number.isNaN(at.getTime()) ? new Date() : at } : null;
}
