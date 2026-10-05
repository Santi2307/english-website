import {
  appUrl, ctaButton, divider, emailLayout, formatDateTime, greeting, heading, infoCard, paragraph, paragraphHtml,
  plainText, securityNote, statusBadge, textRows, type Tone,
} from './components.js';
import { defineTemplate } from './types.js';
import type { Locale } from '../types.js';

/**
 * Eventos importantes de la cuenta: qué pasó, cuándo, estado actual y qué hacer.
 * Agregar un caso = un `kind` nuevo en `Data` y su texto en `kinds`.
 */
type Data =
  | { kind: 'profile_updated'; occurredAt: string; changes: ('name' | 'password_set')[] }
  | {
      kind: 'payment_failed';
      occurredAt: string;
      reference: string;
      courseTitle: string;
      courseSlug: string;
      paymentStatus: 'DECLINED' | 'VOIDED' | 'ERROR';
    };

type Resolved = {
  subject: string;
  preheader: string;
  title: string;
  what: string;
  status: { label: string; tone: Tone };
  next?: string;
  cta?: { label: string; path: string };
  rows: { label: string; value: string | null }[];
};

const L = {
  es: { card: 'Resumen', what: 'Qué pasó', when: 'Cuándo', status: 'Estado actual', next: 'Qué sigue', ref: 'Referencia', course: 'Curso' },
  en: { card: 'Summary', what: 'What happened', when: 'When', status: 'Current status', next: "What's next", ref: 'Reference', course: 'Course' },
};

const CHANGE_LABELS = {
  es: { name: 'tu nombre', password_set: 'una contraseña para entrar con email' },
  en: { name: 'your name', password_set: 'a password to sign in with email' },
};

function resolve(data: Data, locale: Locale): Resolved {
  const es = locale === 'es';
  switch (data.kind) {
    case 'profile_updated': {
      const list = data.changes.map((c) => CHANGE_LABELS[locale][c]).join(es ? ' y ' : ' and ');
      return {
        subject: es ? 'Actualizamos tu perfil' : 'Your profile was updated',
        preheader: es ? 'Guardamos los cambios de tu cuenta.' : 'We saved the changes to your account.',
        title: es ? 'Tu perfil fue actualizado' : 'Your profile was updated',
        what: es ? `Actualizaste ${list}.` : `You updated ${list}.`,
        status: { label: es ? 'Guardado' : 'Saved', tone: 'success' },
        next: es ? 'No tienes que hacer nada. Si no reconoces este cambio, protege tu cuenta.' : "Nothing to do. If you don't recognize this change, secure your account.",
        cta: { label: es ? 'Revisar mi cuenta' : 'Review my account', path: '/mi-cuenta/ajustes' },
        rows: [],
      };
    }
    case 'payment_failed': {
      const statusLabel = {
        DECLINED: es ? 'Rechazado' : 'Declined',
        VOIDED: es ? 'Anulado' : 'Voided',
        ERROR: es ? 'Error en el pago' : 'Payment error',
      }[data.paymentStatus];
      return {
        subject: es ? `Tu pago de ${data.courseTitle} no se completó` : `Your payment for ${data.courseTitle} didn't go through`,
        preheader: es ? 'No se realizó ningún cobro. Puedes intentarlo de nuevo.' : "You weren't charged. You can try again.",
        title: es ? 'Tu pago no se completó' : "Your payment didn't go through",
        what: es
          ? `El pago de ${data.courseTitle} no fue aprobado. No se realizó ningún cobro.`
          : `The payment for ${data.courseTitle} wasn't approved. You weren't charged.`,
        status: { label: statusLabel, tone: 'danger' },
        next: es
          ? 'Intenta con otro medio de pago (tarjeta, PSE o Nequi). Si el problema sigue, escríbenos.'
          : 'Try another payment method (card, PSE or Nequi). If it keeps happening, contact us.',
        cta: { label: es ? 'Intentar de nuevo' : 'Try again', path: `/checkout/${data.courseSlug}` },
        rows: [
          { label: L[locale].course, value: data.courseTitle },
          { label: L[locale].ref, value: data.reference },
        ],
      };
    }
  }
}

export const accountUpdateEmail = defineTemplate<Data>({
  id: 'account-update',
  sample: {
    kind: 'payment_failed',
    occurredAt: '2026-09-30T22:15:00.000Z',
    reference: 'EA-MUOLRLDK-ACF9BF08F9',
    courseTitle: 'Conversación Fluida',
    courseSlug: 'conversacion-fluida',
    paymentStatus: 'DECLINED',
  },
  render(data, ctx) {
    const l = L[ctx.locale];
    const r = resolve(data, ctx.locale);
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const rows = [{ label: l.what, value: r.what }, { label: l.when, value: formatDateTime(data.occurredAt, ctx.locale, ctx.timeZone) }, ...r.rows];
    const ctaUrl = r.cta && appUrl(r.cta.path);
    const html = emailLayout({
      ...foot,
      title: r.title,
      preheader: r.preheader,
      content: [
        heading(r.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraphHtml(`${l.status}: ${statusBadge(r.status.label, r.status.tone)}`),
        infoCard(rows, l.card),
        r.next ? paragraph(r.next) : '',
        r.cta && ctaUrl ? ctaButton({ href: ctaUrl, label: r.cta.label }) : '',
        divider(),
        securityNote(
          ctx.locale === 'es'
            ? 'Si no reconoces esta actividad, cambia tu contraseña y escríbenos.'
            : "If you don't recognize this activity, change your password and contact us.",
        ),
      ].join(''),
    });
    const text = plainText(
      [greeting(ctx.name, ctx.locale), `${l.status}: ${r.status.label}`, textRows(rows), r.next, r.cta && `${r.cta.label}: ${ctaUrl}`],
      foot,
    );
    return { subject: r.subject, preheader: r.preheader, html, text };
  },
});
