import crypto from 'node:crypto';

const TOLERANCE_S = 5 * 60;

/**
 * Verifica la firma de un webhook de Resend (formato Svix):
 * base64(HMAC-SHA256(secreto, "<svix-id>.<svix-timestamp>.<body crudo>")).
 */
export function verifyResendSignature(
  rawBody: string,
  headers: { id?: string; timestamp?: string; signature?: string },
  secret: string,
  nowS = Math.floor(Date.now() / 1000),
) {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature || !secret) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(nowS - ts) > TOLERANCE_S) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = crypto.createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest('base64');
  // El header puede traer varias firmas: "v1,abc v1,def"
  return signature.split(' ').some((part) => {
    const sig = part.split(',')[1];
    return !!sig && sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  });
}

export type ResendWebhookEvent = { type: string; created_at: string; data: { email_id?: string } };

export const RESEND_STATUS: Record<string, 'DELIVERED' | 'BOUNCED' | undefined> = {
  'email.delivered': 'DELIVERED',
  'email.bounced': 'BOUNCED',
  // Una queja de spam se trata como rebote: dejamos de escribirle a esa dirección
  'email.complained': 'BOUNCED',
};
