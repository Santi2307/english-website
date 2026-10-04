import { appUrl } from '../templates/components.js';
import { getEmailTemplate, type TemplateContext } from '../templates/index.js';
import { createUnsubscribeToken } from '../unsubscribe.js';
import { CATEGORY_PREFERENCE } from '../preferences.js';
import { DeliveryError, type Channel, type NotificationRecord, type SensitiveData } from '../types.js';
import type { EmailProvider } from '../providers/types.js';

export type EmailChannelOptions = { from: string; replyTo?: string };

/** Canal email: renderiza la plantilla y entrega al proveedor configurado. */
export class EmailChannel implements Channel {
  readonly name = 'email' as const;

  constructor(
    private readonly provider: EmailProvider,
    private readonly opts: EmailChannelOptions,
  ) {}

  /** Render sin enviar (vista previa y tests). */
  render(n: Pick<NotificationRecord, 'template' | 'category' | 'userId' | 'payload'>, sensitive?: SensitiveData) {
    const template = getEmailTemplate(n.template);
    const optional = CATEGORY_PREFERENCE[n.category] !== null;
    const token = optional && n.userId ? createUnsubscribeToken(n.userId, n.category) : null;
    const ctx: TemplateContext = {
      locale: n.payload.locale,
      name: n.payload.name,
      category: n.category,
      preferencesUrl: appUrl('/mi-cuenta/ajustes#notificaciones'),
      unsubscribeUrl: token ? appUrl(`/preferencias/baja?token=${token}`) : undefined,
    };
    const rendered = template.render({ ...n.payload.data, ...sensitive }, ctx);
    // RFC 8058: "cancelar suscripción" con un clic desde Gmail/Apple Mail (solo categorías opcionales)
    const headers: Record<string, string> = token
      ? {
          'List-Unsubscribe': `<${appUrl(`/api/notifications/unsubscribe?token=${token}`)}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : {};
    return { ...rendered, headers };
  }

  async send(n: NotificationRecord, sensitive: SensitiveData | undefined) {
    let email: ReturnType<EmailChannel['render']>;
    try {
      email = this.render(n, sensitive);
    } catch (err) {
      // Un error de render (datos faltantes, URL inválida) no se arregla reintentando
      throw new DeliveryError(`Render de ${n.template} falló: ${(err as Error).message}`, false);
    }
    const res = await this.provider.send({
      to: n.recipient,
      from: this.opts.from,
      replyTo: this.opts.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: email.headers,
      tags: { template: n.template, category: n.category },
      idempotencyKey: n.idempotencyKey,
    });
    return { provider: this.provider.name, providerMessageId: res.messageId };
  }
}
