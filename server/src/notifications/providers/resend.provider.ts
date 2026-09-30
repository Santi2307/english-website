import { DeliveryError } from '../types.js';
import type { EmailProvider, OutgoingEmail } from './types.js';

const RESEND_URL = 'https://api.resend.com/emails';
const TIMEOUT_MS = 10_000;

/** Integración con la API REST de Resend, sin SDK (misma técnica que ya usaba el proyecto). */
export class ResendEmailProvider implements EmailProvider {
  readonly name = 'resend';

  constructor(
    private readonly apiKey: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(email: OutgoingEmail) {
    let res: Response;
    try {
      res = await this.fetchImpl(RESEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...(email.idempotencyKey && { 'Idempotency-Key': email.idempotencyKey }),
        },
        body: JSON.stringify({
          from: email.from,
          to: [email.to],
          reply_to: email.replyTo,
          subject: email.subject,
          html: email.html,
          text: email.text,
          headers: email.headers,
          tags: email.tags && Object.entries(email.tags).map(([name, value]) => ({ name, value })),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      // Timeout / DNS / conexión: temporal
      throw new DeliveryError(`Resend no disponible: ${(err as Error).message}`, true, this.name);
    }

    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (res.ok && body.id) return { messageId: body.id };

    const detail = `Resend ${res.status}${body.name ? ` ${body.name}` : ''}: ${body.message ?? 'sin detalle'}`;
    // 429 (rate limit) y 5xx se reintentan; 4xx restantes (validación, dominio no verificado, API key) no
    const retryable = res.status === 429 || res.status >= 500;
    throw new DeliveryError(detail, retryable, this.name);
  }
}
