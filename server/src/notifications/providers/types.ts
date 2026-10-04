export type OutgoingEmail = {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  /** Etiquetas para filtrar en el panel del proveedor (sin datos personales) */
  tags?: Record<string, string>;
  /** Clave de idempotencia del lado del proveedor (evita duplicados en reintentos de red) */
  idempotencyKey?: string;
};

/** Contrato de un proveedor de email. Cambiar de Resend a Postmark/SES = otra implementación. */
export interface EmailProvider {
  readonly name: string;
  send(email: OutgoingEmail): Promise<{ messageId: string }>;
}
