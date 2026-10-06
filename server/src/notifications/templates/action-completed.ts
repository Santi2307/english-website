import {
  appUrl, bulletList, callout, certificate, ctaButton, divider, emailLayout, formatCOP, formatDate, formatDateTime, greeting, hero, paragraph,
  paragraphHtml, plainText, receipt, statusBadge, steps, subheading, textLink, textRows,
} from './components.js';
import { defineTemplate } from './types.js';

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

const METHODS: Record<string, { es: string; en: string }> = {
  CARD: { es: 'Tarjeta', en: 'Card' },
  PSE: { es: 'PSE', en: 'PSE' },
  NEQUI: { es: 'Nequi', en: 'Nequi' },
  BANCOLOMBIA_TRANSFER: { es: 'Bancolombia', en: 'Bancolombia' },
  COUPON: { es: 'Cupón', en: 'Coupon' },
};

const copy = {
  es: {
    order: {
      subject: (c: string) => `Tu inscripción a ${c} está lista`,
      preheader: 'Pago aprobado. Ya puedes empezar tu primera lección.',
      kicker: 'Comprobante de pago',
      title: 'Todo listo para empezar',
      intro: (c: string) => `Tu pago fue aprobado y ya tienes acceso completo a ${c}. Este email es tu comprobante.`,
      status: 'Pago aprobado',
      receipt: 'Resumen de tu compra',
      total: 'Total pagado',
      method: 'Medio de pago',
      date: 'Fecha',
      ref: 'Referencia',
      nextTitle: 'Cómo sacarle el máximo',
      next: [
        { title: 'Empieza hoy', text: 'La primera lección dura menos de 15 minutos. Empezar el mismo día duplica las probabilidades de terminar.' },
        { title: 'Habla en voz alta', text: 'Cada lección tiene práctica oral. Respóndela aunque te equivoques: así se construye la fluidez.' },
        { title: 'Repasa tus errores', text: 'Lo que falles vuelve en el repaso espaciado hasta que lo domines.' },
      ],
      cta: 'Empezar el curso',
      guaranteeTitle: 'Garantía de 7 días',
      guarantee: 'Si el curso no es para ti, escríbenos dentro de los primeros 7 días. Guarda este email como comprobante de tu compra.',
    },
    done: {
      subject: (c: string) => `¡Terminaste ${c}! Tu certificado está listo`,
      preheader: 'Completaste todas las lecciones. Tu certificado ya está disponible.',
      kicker: 'Logro desbloqueado',
      title: 'Completaste el curso',
      intro: (c: string) => `Terminaste todas las lecciones de ${c}. Es un logro real: la mayoría de las personas que empiezan un curso en línea no lo terminan.`,
      status: 'Completado',
      certLabel: 'Certificado de finalización',
      code: 'Código',
      cta: 'Ver mi certificado',
      shareTitle: 'Compártelo',
      share: [
        'Agrégalo a tu perfil de LinkedIn en "Licencias y certificaciones".',
        'Inclúyelo en tu hoja de vida, junto al nivel de inglés.',
        'Cualquiera puede verificarlo con el código del certificado.',
      ],
      more: 'Sigue con la siguiente ruta',
    },
  },
  en: {
    order: {
      subject: (c: string) => `You're enrolled in ${c}`,
      preheader: 'Payment approved. You can start your first lesson now.',
      kicker: 'Payment receipt',
      title: 'Everything is ready to go',
      intro: (c: string) => `Your payment was approved and you now have full access to ${c}. This email is your receipt.`,
      status: 'Payment approved',
      receipt: 'Order summary',
      total: 'Total paid',
      method: 'Payment method',
      date: 'Date',
      ref: 'Reference',
      nextTitle: 'How to get the most out of it',
      next: [
        { title: 'Start today', text: 'The first lesson takes under 15 minutes. Starting on day one doubles your chances of finishing.' },
        { title: 'Speak out loud', text: "Every lesson has speaking practice. Answer it even if you make mistakes: that's how fluency is built." },
        { title: 'Review your mistakes', text: 'Whatever you miss comes back in spaced review until you master it.' },
      ],
      cta: 'Start the course',
      guaranteeTitle: '7-day guarantee',
      guarantee: "If the course isn't for you, write to us within the first 7 days. Keep this email as your receipt.",
    },
    done: {
      subject: (c: string) => `You finished ${c}! Your certificate is ready`,
      preheader: 'You completed every lesson. Your certificate is now available.',
      kicker: 'Achievement unlocked',
      title: 'You completed the course',
      intro: (c: string) => `You finished every lesson in ${c}. That's a real achievement: most people who start an online course never finish it.`,
      status: 'Completed',
      certLabel: 'Certificate of completion',
      code: 'Code',
      cta: 'View my certificate',
      shareTitle: 'Share it',
      share: [
        'Add it to your LinkedIn profile under "Licenses & certifications".',
        'Include it in your resume, next to your English level.',
        'Anyone can verify it with the certificate code.',
      ],
      more: 'Continue with your next path',
    },
  },
};

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
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const when = formatDateTime(data.completedAt, ctx.locale, ctx.timeZone);

    if (data.kind === 'order_approved') {
      const t = copy[ctx.locale].order;
      const url = appUrl(`/aprender/${data.courseSlug}`);
      const amount = formatCOP(data.totalCOP);
      const method = data.paymentMethod ? METHODS[data.paymentMethod]?.[ctx.locale] ?? data.paymentMethod : null;
      const rows = [
        { label: t.method, value: method },
        { label: t.date, value: when },
        { label: t.ref, value: data.reference, mono: true },
      ];
      const html = emailLayout({
        ...foot,
        kicker: t.kicker,
        title: t.title,
        preheader: t.preheader,
        content: [
          hero({ icon: 'receipt-success', title: t.title }),
          paragraph(greeting(ctx.name, ctx.locale)),
          paragraph(t.intro(data.courseTitle)),
          paragraphHtml(statusBadge(t.status, 'success')),
          receipt({ title: t.receipt, item: data.courseTitle, amount, totalLabel: t.total, rows }),
          ctaButton({ href: url, label: t.cta }),
          subheading(t.nextTitle),
          steps(t.next),
          callout({ title: t.guaranteeTitle, text: t.guarantee }),
        ].join(''),
      });
      const text = plainText(
        [
          greeting(ctx.name, ctx.locale),
          t.intro(data.courseTitle),
          `${t.status}`,
          `${t.receipt}\n${data.courseTitle}: ${amount}\n${t.total}: ${amount}\n${textRows(rows)}`,
          `${t.cta}: ${url}`,
          `${t.nextTitle}:\n${t.next.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}`,
          `${t.guaranteeTitle}: ${t.guarantee}`,
        ],
        foot,
      );
      return { subject: t.subject(data.courseTitle), preheader: t.preheader, html, text };
    }

    const t = copy[ctx.locale].done;
    const url = appUrl('/mi-cuenta');
    const pathsUrl = appUrl('/cursos');
    const html = emailLayout({
      ...foot,
      kicker: t.kicker,
      title: t.title,
      preheader: t.preheader,
      content: [
        hero({ icon: 'award-brand', title: t.title }),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.intro(data.courseTitle)),
        certificate({
          label: t.certLabel,
          course: data.courseTitle,
          name: ctx.name?.trim() || null,
          date: formatDate(data.completedAt, ctx.locale, ctx.timeZone),
          codeLabel: t.code,
          code: data.certificateCode,
        }),
        ctaButton({ href: url, label: t.cta }),
        subheading(t.shareTitle),
        bulletList(t.share, 'check'),
        divider(),
        paragraphHtml(textLink(pathsUrl, t.more), { small: true }),
      ].join(''),
    });
    const text = plainText(
      [
        greeting(ctx.name, ctx.locale),
        t.intro(data.courseTitle),
        `${t.certLabel}\n${data.courseTitle}\n${t.code}: ${data.certificateCode}\n${when}`,
        `${t.cta}: ${url}`,
        `${t.shareTitle}:\n${t.share.map((s) => `- ${s}`).join('\n')}`,
        `${t.more}: ${pathsUrl}`,
      ],
      foot,
    );
    return { subject: t.subject(data.courseTitle), preheader: t.preheader, html, text };
  },
});
