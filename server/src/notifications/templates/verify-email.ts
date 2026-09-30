import { ctaButton, divider, emailLayout, fallbackLink, greeting, heading, paragraph, plainText, securityNote } from './components.js';
import { defineTemplate } from './types.js';

type Data = { verifyUrl: string; expiresInHours: number };

const copy = {
  es: {
    subject: 'Confirma tu email',
    preheader: 'Un clic para confirmar que este correo es tuyo.',
    title: 'Confirma tu email',
    why: 'Confirmar tu correo nos permite enviarte recibos, certificados y avisos importantes, y protege tu cuenta si algún día necesitas recuperarla.',
    cta: 'Verificar email',
    expires: (h: number) => `Este enlace vence en ${h} ${h === 1 ? 'hora' : 'horas'} y solo funciona una vez.`,
    security: 'Si no creaste una cuenta en English Academy, ignora este mensaje: nadie podrá usar tu correo sin este enlace.',
  },
  en: {
    subject: 'Confirm your email',
    preheader: 'One click to confirm this address is yours.',
    title: 'Confirm your email',
    why: 'Confirming your email lets us send you receipts, certificates and important notices, and protects your account if you ever need to recover it.',
    cta: 'Verify email',
    expires: (h: number) => `This link expires in ${h} ${h === 1 ? 'hour' : 'hours'} and works only once.`,
    security: "If you didn't create an English Academy account, ignore this email: nobody can use your address without this link.",
  },
};

export const verifyEmail = defineTemplate<Data>({
  id: 'verify-email',
  sample: { verifyUrl: 'https://englishacademy.co/verificar-email?token=ejemplo', expiresInHours: 24 },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const html = emailLayout({
      ...foot,
      title: t.title,
      preheader: t.preheader,
      content: [
        heading(t.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.why),
        ctaButton({ href: data.verifyUrl, label: t.cta }),
        paragraph(t.expires(data.expiresInHours), { muted: true, small: true }),
        fallbackLink(data.verifyUrl, ctx.locale),
        divider(),
        securityNote(t.security),
      ].join(''),
    });
    const text = plainText([greeting(ctx.name, ctx.locale), t.why, `${t.cta}: ${data.verifyUrl}`, t.expires(data.expiresInHours), t.security], foot);
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
