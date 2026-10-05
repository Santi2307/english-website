import type { NotificationCategory, NotificationStatus } from '@prisma/client';

export type { NotificationCategory, NotificationStatus };
export type Locale = 'es' | 'en';
export type ChannelName = 'email';

export const toLocale = (v: string | null | undefined): Locale => (v === 'en' ? 'en' : 'es');

/** Destinatario resuelto para una notificación. */
export type Recipient = {
  userId?: string;
  email: string;
  name?: string | null;
  locale: Locale;
  /** Zona horaria IANA para mostrar fechas en la hora local del usuario */
  timeZone?: string | null;
};

/** Registro persistido (tabla Notification). */
export type NotificationRecord = {
  id: string;
  userId: string | null;
  channel: ChannelName;
  recipient: string;
  eventType: string;
  eventId: string;
  template: string;
  category: NotificationCategory;
  idempotencyKey: string;
  status: NotificationStatus;
  provider: string | null;
  providerMessageId: string | null;
  payload: NotificationPayload;
  attempts: number;
  nextAttemptAt: Date;
  errorMessage: string | null;
  createdAt: Date;
  sentAt: Date | null;
  failedAt: Date | null;
};

/** Lo que se guarda para poder re-renderizar en un reintento. Nunca incluye datos sensibles. */
export type NotificationPayload = {
  locale: Locale;
  timeZone?: string | null;
  name?: string | null;
  data: Record<string, unknown>;
  /** Nombres de los datos sensibles que la plantilla necesita (sus valores NO se guardan) */
  sensitiveKeys?: string[];
};

/** Datos que solo viven en memoria (links con tokens, IP...). */
export type SensitiveData = Record<string, unknown>;

export type SendResult = { provider: string; providerMessageId: string };

/**
 * Error de un proveedor/canal. `retryable` distingue fallos temporales
 * (timeouts, 429, 5xx) de permanentes (dirección inválida, 4xx de validación).
 */
export class DeliveryError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean,
    public readonly provider?: string,
  ) {
    super(message);
    this.name = 'DeliveryError';
  }
}

/** Contrato de un canal (email hoy; SMS, push o in-app mañana). */
export interface Channel {
  readonly name: ChannelName;
  send(notification: NotificationRecord, sensitive: SensitiveData | undefined): Promise<SendResult>;
}
