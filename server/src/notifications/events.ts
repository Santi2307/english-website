import type { Locale } from './types.js';

/** Contexto técnico de la petición que originó un evento de seguridad. */
export type RequestContext = {
  ip?: string;
  userAgent?: string;
  /** Ubicación aproximada si el proxy/CDN la entrega (p. ej. "Medellín, CO") */
  location?: string;
  /** Idioma con el que el usuario usa la web en este momento */
  locale?: Locale;
  /** Zona horaria IANA del navegador (p. ej. "Asia/Kabul") */
  timeZone?: string;
};

export type EventUser = { id: string; email: string; name: string; locale: Locale; timeZone?: string | null };

/**
 * Catálogo de eventos de la aplicación y su payload.
 * Agregar un evento = añadirlo aquí + una regla en rules.ts.
 */
export type AppEventMap = {
  USER_REGISTERED: { user: EventUser; method: 'password' | 'google'; emailVerified: boolean };
  EMAIL_VERIFICATION_REQUESTED: { user: EventUser; verifyUrl: string; expiresAt: Date };
  EMAIL_VERIFIED: { user: EventUser; verifiedAt: Date };
  PASSWORD_RESET_REQUESTED: { user: EventUser; resetUrl: string; expiresAt: Date; context: RequestContext };
  PASSWORD_CHANGED: { user: EventUser; occurredAt: Date; via: 'settings' | 'reset'; context: RequestContext };
  NEW_SIGN_IN: { user: EventUser; occurredAt: Date; method: 'password' | 'google'; context: RequestContext };
  ACCOUNT_UPDATED: { user: EventUser; occurredAt: Date; changes: ('name' | 'password_set')[] };
  ORDER_APPROVED: {
    user: EventUser;
    orderId: string;
    reference: string;
    courseTitle: string;
    courseSlug: string;
    totalCOP: number;
    paymentMethod: string | null;
    paidAt: Date;
  };
  ORDER_FAILED: {
    user: EventUser;
    orderId: string;
    reference: string;
    courseTitle: string;
    courseSlug: string;
    status: 'DECLINED' | 'VOIDED' | 'ERROR';
    occurredAt: Date;
  };
  COURSE_COMPLETED: {
    user: EventUser;
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    certificateCode: string;
    completedAt: Date;
  };
};

export type AppEventType = keyof AppEventMap;

export type AppEvent<K extends AppEventType = AppEventType> = {
  type: K;
  /** Identificador estable del hecho de negocio (p. ej. el id del usuario u orden). Base de la idempotencia. */
  id: string;
  payload: AppEventMap[K];
  occurredAt: Date;
};

type Handler = (event: AppEvent) => Promise<void>;

/**
 * Bus de eventos en proceso. Los servicios de dominio solo conocen `emit`;
 * no saben qué canales ni plantillas existen.
 */
export class EventBus {
  private handlers: Handler[] = [];

  subscribe(handler: Handler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  /**
   * Publica un evento. Nunca lanza: un fallo en notificaciones no debe
   * romper el registro, un pago o cualquier flujo de negocio.
   */
  async emit<K extends AppEventType>(type: K, payload: AppEventMap[K], opts: { id: string }): Promise<void> {
    const event: AppEvent<K> = { type, id: opts.id, payload, occurredAt: new Date() };
    await Promise.all(
      this.handlers.map((h) =>
        h(event as unknown as AppEvent).catch((err) => console.error(`[events] handler falló para ${type}:${opts.id}`, err)),
      ),
    );
  }
}
