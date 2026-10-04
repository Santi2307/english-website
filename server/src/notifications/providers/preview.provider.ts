import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import type { EmailProvider, OutgoingEmail } from './types.js';

/**
 * Desarrollo: no envía nada. Guarda cada email como .html/.txt en disco para
 * abrirlo en el navegador, y lo anuncia en consola.
 */
export class PreviewEmailProvider implements EmailProvider {
  readonly name = 'preview';

  constructor(private readonly dir: string) {}

  async send(email: OutgoingEmail) {
    const messageId = `preview_${crypto.randomUUID()}`;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = `${stamp}_${email.tags?.template ?? 'email'}_${email.to.replace(/[^a-z0-9]/gi, '_')}`;
    await mkdir(this.dir, { recursive: true });
    const htmlPath = path.join(this.dir, `${slug}.html`);
    await Promise.all([
      writeFile(htmlPath, email.html, 'utf8'),
      writeFile(path.join(this.dir, `${slug}.txt`), `Subject: ${email.subject}\nTo: ${email.to}\n\n${email.text}`, 'utf8'),
    ]);
    console.info(`📧 [preview] "${email.subject}" → ${email.to}\n   ${path.resolve(htmlPath)}`);
    return { messageId };
  }
}
