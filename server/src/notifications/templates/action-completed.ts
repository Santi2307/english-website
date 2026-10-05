import {
  appUrl, ctaButton, esc, strong, divider, emailLayout, formatCOP, formatDateTime, greeting, heading, infoCard, paragraph, paragraphHtml,
  plainText, securityNote, statusBadge, textRows,
} from './components.js';
import { defineTemplate } from './types.js';
import type { Locale } from '../types.js';

/** Confirmación de una acción importante: referencia, fecha, estado, siguiente paso y link al detalle. */
type Data =
  | {
      kind: 'order_approved';
      completedAt: string;
      reference: string;
      courseTitle: string;
      courseSlug: string;
      totalCOP: number;
      paymentMethod?: string | null;
    }
  | { kind: 'course_completed'; completedAt: string; courseTitle: string; courseId: string; certificateCode: string };

const L = {
  es: { card: 'Detalles', ref: 'Referencia', date: 'Fecha', status: 'Estado actual', next: 'Siguiente paso', course: 'Curso', total: 'Total pagado', method: 'Medio de pago', code: 'Código de certificado' },
  en: { card: 'Details', ref: 'Reference ID', date: 'Date', status: 'Current status', next: 'Next step', course: 'Course', total: 'Total paid', method: 'Payment method', code: 'Certificate code' },
};

const METHODS: Record<string, string> = { CARD: 'Tarjeta', PSE: 'PSE', NEQUI: 'Nequi', BANCOLOMBIA_TRANSFER: 'Bancolombia', COUPON: 'Cupón' };

function resolve(data: Data, locale: Locale) {
  const es = locale === 'es';
  const l = L[locale];
  if (data.kind === 'order_approved') {
    return {
      subject: es ? `Tu inscripción a ${data.courseTitle} está lista` : `You're enrolled in ${data.courseTitle}`,
      preheader: es ? 'Pago aprobado. Ya puedes empezar tu primera lección.' : 'Payment approved. You can start your first lesson now.',
      title: es ? 'Todo listo para empezar' : 'Everything is ready to go',
      intro: es ? `Tu pago fue aprobado y ya tienes acceso a ${data.courseTitle}.` : `Your payment was approved and you now have access to ${data.courseTitle}.`,
      status: { label: es ? 'Pago aprobado' : 'Payment approved', tone: 'success' as const },
      next: es ? 'Empieza con la primera lección: dura menos de 15 minutos.' : 'Start with the first lesson: it takes under 15 minutes.',
      cta: { label: es ? 'Empezar el curso' : 'Start the course', path: `/aprender/${data.courseSlug}` },
      reference: data.reference,
      rows: [
        { label: l.course, value: data.courseTitle },
        { label: l.total, value: formatCOP(data.totalCOP) },
        { label: l.method, value: data.paymentMethod ? METHODS[data.paymentMethod] ?? data.paymentMethod : null },
      ],
      note: es
        ? 'Tienes 7 días de garantía. Guarda este email como comprobante de tu compra.'
        : 'You have a 7-day guarantee. Keep this email as your receipt.',
    };
  }
  return {
    subject: es ? `¡Terminaste ${data.courseTitle}! Tu certificado está listo` : `You finished ${data.courseTitle}! Your certificate is ready`,
    preheader: es ? 'Completaste todas las lecciones. Descarga tu certificado.' : 'You completed every lesson. Download your certificate.',
    title: es ? 'Completaste el curso' : 'You completed the course',
    intro: es ? `Terminaste todas las lecciones de ${data.courseTitle}. ¡Excelente trabajo!` : `You finished every lesson in ${data.courseTitle}. Great work!`,
    status: { label: es ? 'Completado' : 'Completed', tone: 'success' as const },
    next: es ? 'Descarga tu certificado y compártelo en LinkedIn.' : 'Download your certificate and share it on LinkedIn.',
    cta: { label: es ? 'Ver mi certificado' : 'View my certificate', path: '/mi-cuenta' },
    reference: data.certificateCode,
    rows: [{ label: l.course, value: data.courseTitle }],
    note: null,
  };
}

export const actionCompletedEmail = defineTemplate<Data>({
  id: 'action-completed',
  sample: {
    kind: 'order_approved',
    completedAt: '2026-09-30T22:15:00.000Z',
    reference: 'EA-MUOKHRET-044A0B963B',
    courseTitle: 'Conversación Fluida',
    courseSlug: 'conversacion-fluida',
    totalCOP: 199_200,
    paymentMethod: 'NEQUI',
  },
  render(data, ctx) {
    const l = L[ctx.locale];
    const r = resolve(data, ctx.locale);
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const url = appUrl(r.cta.path);
    const rows = [
      { label: data.kind === 'course_completed' ? l.code : l.ref, value: r.reference },
      { label: l.date, value: formatDateTime(data.completedAt, ctx.locale) },
      ...r.rows,
    ];
    const html = emailLayout({
      ...foot,
      title: r.title,
      preheader: r.preheader,
      content: [
        heading(r.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(r.intro),
        paragraphHtml(`${l.status}: ${statusBadge(r.status.label, r.status.tone)}`),
        infoCard(rows, l.card),
        paragraphHtml(`${strong(`${l.next}:`)} ${esc(r.next)}`),
        ctaButton({ href: url, label: r.cta.label }),
        r.note ? divider() + securityNote(r.note) : '',
      ].join(''),
    });
    const text = plainText(
      [greeting(ctx.name, ctx.locale), r.intro, `${l.status}: ${r.status.label}`, textRows(rows), `${l.next}: ${r.next}`, `${r.cta.label}: ${url}`, r.note],
      foot,
    );
    return { subject: r.subject, preheader: r.preheader, html, text };
  },
});
