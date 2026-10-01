import { DeliveryError } from '../types.js';
import type { EmailProvider, OutgoingEmail } from './types.js';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const TIMEOUT_MS = 10_000;

/** "English Academy <hola@x.com>" → { name, email } */
export function parseAddress(value: string) {
  const m = value.match(/^\s*"?([^"<]*?)"?\s*<\s*([^>]+)\s*>\s*$/);
  return m ? { name: m[1].trim() || undefined, email: m[2].trim() } : { email: value.trim() };
}

/** Brevo devuelve "<id@smtp-relay.mailin.fr>" y sus webhooks "id@smtp-relay.mailin.fr": se normaliza sin <>. */
export const normalizeMessageId = (id: string) => id.trim().replace(/^<|>$/g, '');

/**
 * API transaccional de Brevo por HTTPS. Se usa en lugar de SMTP porque
 * hostings gratuitos como Render bloquean los puertos 25/465/587.
 */
export class BrevoEmailProvider implements EmailProvider {
  readonly name = 'brevo';

  constructor(
    private readonly apiKey: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(email: OutgoingEmail) {
    let res: Response;
    try {
      res = await this.fetchImpl(BREVO_URL, {
        method: 'POST',
        headers: { 'api-key': this.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          sender: parseAddress(email.from),
          to: [{ email: email.to }],
          replyTo: email.replyTo ? parseAddress(email.replyTo) : undefined,
          subject: email.subject,
          htmlContent: email.html,
          textContent: email.text,
          headers: email.headers && Object.keys(email.headers).length ? email.headers : undefined,
          tags: email.tags ? Object.values(email.tags) : undefined,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      throw new DeliveryError(`Brevo no disponible: ${(err as Error).message}`, true, this.name);
    }

    const body = (await res.json().catch(() => ({}))) as { messageId?: string; code?: string; message?: string };
    if (res.ok && body.messageId) return { messageId: normalizeMessageId(body.messageId) };

    const detail = `Brevo ${res.status}${body.code ? ` ${body.code}` : ''}: ${body.message ?? 'sin detalle'}`;
    // 429 y 5xx se reintentan. 400/401/402 (créditos agotados)/403 requieren intervención: no se reintentan.
    throw new DeliveryError(detail, res.status === 429 || res.status >= 500, this.name);
  }
}
