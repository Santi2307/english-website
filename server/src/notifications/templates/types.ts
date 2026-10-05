import type { Locale, NotificationCategory } from '../types.js';

export type TemplateContext = {
  locale: Locale;
  /** Zona horaria IANA del destinatario; sin ella se usa la hora de Colombia */
  timeZone?: string | null;
  name?: string | null;
  category: NotificationCategory;
  preferencesUrl: string;
  /** Solo para categorías opcionales */
  unsubscribeUrl?: string;
};

export type RenderedEmail = { subject: string; preheader: string; html: string; text: string };

export type EmailTemplate<D> = {
  id: string;
  render(data: D, ctx: TemplateContext): RenderedEmail;
  /** Datos de ejemplo para la vista previa de desarrollo y los tests */
  sample: D;
};

/** Helper para declarar plantillas con inferencia de tipos. */
export const defineTemplate = <D>(t: EmailTemplate<D>) => t;
