import type { EmailProvider, OutgoingEmail } from './types.js';

/**
 * Modo sandbox: solo los destinatarios autorizados reciben emails reales.
 * Todo lo demás se desvía al proveedor de preview. Evita que staging o
 * un entorno local escriban a usuarios reales.
 */
export class SandboxEmailProvider implements EmailProvider {
  readonly name: string;

  constructor(
    private readonly real: EmailProvider,
    private readonly fallback: EmailProvider,
    private readonly allowlist: string[],
  ) {
    this.name = `${real.name}+sandbox`;
  }

  isAllowed(to: string) {
    return this.allowlist.includes(to.trim().toLowerCase());
  }

  send(email: OutgoingEmail) {
    return this.isAllowed(email.to) ? this.real.send(email) : this.fallback.send(email);
  }
}
