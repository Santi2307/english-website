import type { AppEvent, AppEventMap, AppEventType, EventUser, RequestContext } from './events.js';
import type { ChannelName, NotificationCategory, Recipient, SensitiveData } from './types.js';
import { parseUserAgent } from '../utils/userAgent.js';

/** Lo que una regla produce para un evento concreto. */
export type RuleOutput = {
  recipient: Recipient;
  /** Datos persistidos (seguros para guardar y re-renderizar en reintentos) */
  data: Record<string, unknown>;
  /** Datos que SOLO viven en memoria: links con tokens, IP, ubicación */
  sensitive?: SensitiveData;
};

export type NotificationRule<K extends AppEventType = AppEventType> = {
  event: K;
  channel: ChannelName;
  template: string;
  category: NotificationCategory;
  /** Devuelve null para no notificar en este caso concreto */
  build(payload: AppEventMap[K], event: AppEvent<K>): RuleOutput | null;
};

/**
 * Idioma y zona horaria: los de la petición que originó el evento (lo que el
 * usuario usa en ese momento) y, si no hay petición, los guardados en su cuenta.
 */
const toRecipient = (u: EventUser, ctx?: RequestContext): Recipient => ({
  userId: u.id,
  email: u.email,
  name: u.name,
  locale: ctx?.locale ?? u.locale,
  timeZone: ctx?.timeZone ?? u.timeZone ?? null,
});

/** Device info no identificable (se persiste) + IP/ubicación (solo en memoria). */
function splitContext(ctx: RequestContext) {
  const ua = parseUserAgent(ctx.userAgent);
  return {
    data: { browser: ua.browser, os: ua.os, deviceType: ua.deviceType },
    sensitive: { ip: ctx.ip ?? null, location: ctx.location ?? null },
  };
}

const HOUR = 3_600_000;
const MINUTE = 60_000;
const iso = (d: Date) => d.toISOString();

const rule = <K extends AppEventType>(r: NotificationRule<K>) => r as unknown as NotificationRule;

/**
 * Catálogo evento → notificación. Para un canal nuevo (SMS, push) basta con
 * agregar otra regla para el mismo evento con `channel: 'sms'`.
 */
export const notificationRules: NotificationRule[] = [
  rule({
    event: 'USER_REGISTERED',
    channel: 'email',
    template: 'welcome',
    category: 'TRANSACTIONAL',
    build: (p) => ({ recipient: toRecipient(p.user), data: { emailVerified: p.emailVerified } }),
  }),
  rule({
    event: 'EMAIL_VERIFICATION_REQUESTED',
    channel: 'email',
    template: 'verify-email',
    category: 'TRANSACTIONAL',
    build: (p, e) => ({
      recipient: toRecipient(p.user),
      data: { expiresInHours: Math.max(1, Math.round((p.expiresAt.getTime() - e.occurredAt.getTime()) / HOUR)) },
      sensitive: { verifyUrl: p.verifyUrl },
    }),
  }),
  rule({
    event: 'PASSWORD_RESET_REQUESTED',
    channel: 'email',
    template: 'password-reset',
    category: 'SECURITY',
    build: (p, e) => {
      const ctx = splitContext(p.context);
      return {
        recipient: toRecipient(p.user, p.context),
        data: {
          ...ctx.data,
          requestedAt: iso(e.occurredAt),
          expiresInMinutes: Math.max(1, Math.round((p.expiresAt.getTime() - e.occurredAt.getTime()) / MINUTE)),
        },
        sensitive: { ...ctx.sensitive, resetUrl: p.resetUrl },
      };
    },
  }),
  rule({
    event: 'PASSWORD_CHANGED',
    channel: 'email',
    template: 'security-alert',
    category: 'SECURITY',
    build: (p) => {
      const ctx = splitContext(p.context);
      return { recipient: toRecipient(p.user, p.context), data: { kind: 'password_changed', occurredAt: iso(p.occurredAt), ...ctx.data }, sensitive: ctx.sensitive };
    },
  }),
  rule({
    event: 'NEW_SIGN_IN',
    channel: 'email',
    template: 'security-alert',
    category: 'SECURITY',
    build: (p) => {
      const ctx = splitContext(p.context);
      return { recipient: toRecipient(p.user, p.context), data: { kind: 'new_sign_in', occurredAt: iso(p.occurredAt), ...ctx.data }, sensitive: ctx.sensitive };
    },
  }),
  rule({
    event: 'ACCOUNT_UPDATED',
    channel: 'email',
    template: 'account-update',
    category: 'ACCOUNT',
    build: (p) =>
      p.changes.length
        ? { recipient: toRecipient(p.user), data: { kind: 'profile_updated', occurredAt: iso(p.occurredAt), changes: p.changes } }
        : null,
  }),
  rule({
    event: 'ORDER_APPROVED',
    channel: 'email',
    template: 'action-completed',
    // Es el comprobante de compra: no depende de preferencias
    category: 'TRANSACTIONAL',
    build: (p) => ({
      recipient: toRecipient(p.user),
      data: {
        kind: 'order_approved',
        completedAt: iso(p.paidAt),
        reference: p.reference,
        courseTitle: p.courseTitle,
        courseSlug: p.courseSlug,
        totalCOP: p.totalCOP,
        paymentMethod: p.paymentMethod,
      },
    }),
  }),
  rule({
    event: 'ORDER_FAILED',
    channel: 'email',
    template: 'account-update',
    category: 'TRANSACTIONAL',
    build: (p) => ({
      recipient: toRecipient(p.user),
      data: {
        kind: 'payment_failed',
        occurredAt: iso(p.occurredAt),
        reference: p.reference,
        courseTitle: p.courseTitle,
        courseSlug: p.courseSlug,
        paymentStatus: p.status,
      },
    }),
  }),
  rule({
    event: 'COURSE_COMPLETED',
    channel: 'email',
    template: 'action-completed',
    category: 'ACCOUNT',
    build: (p) => ({
      recipient: toRecipient(p.user),
      data: {
        kind: 'course_completed',
        completedAt: iso(p.completedAt),
        courseTitle: p.courseTitle,
        courseId: p.courseId,
        certificateCode: p.certificateCode,
      },
    }),
  }),
];
