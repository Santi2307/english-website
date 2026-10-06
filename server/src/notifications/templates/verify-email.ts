import { bulletList, ctaButton, divider, emailLayout, fallbackLink, greeting, hero, paragraph, pills, plainText, securityNote, subheading } from './components.js';
import { defineTemplate } from './types.js';

type Data = { verifyUrl: string; expiresInHours: number };

const copy = {
  es: {
    subject: 'Confirma tu email',
    preheader: 'Un clic para confirmar que este correo es tuyo.',
    kicker: 'Verificación',
    title: 'Confirma tu email',
    why: 'Solo falta un paso: confirma que este correo es tuyo para proteger tu cuenta.',
    cta: 'Verificar email',
    expiresPill: (h: number) => `Vence en ${h} ${h === 1 ? 'hora' : 'horas'}`,
    once: 'Un solo uso',
    expires: (h: number) => `Este enlace vence en ${h} ${h === 1 ? 'hora' : 'horas'} y solo funciona una vez.`,
    unlockTitle: 'Al verificarlo',
    unlock: [
      'Recibes tus recibos de pago y certificados en este correo.',
      'Puedes recuperar tu cuenta si olvidas la contraseña.',
      'Te avisamos de cualquier actividad importante en tu cuenta.',
    ],
    security: 'Si no creaste una cuenta en English Academy, ignora este mensaje: nadie podrá usar tu correo sin este enlace.',
  },
  en: {
    subject: 'Confirm your email',
    preheader: 'One click to confirm this address is yours.',
    kicker: 'Verification',
    title: 'Confirm your email',
    why: 'Just one more step: confirm this address is yours to protect your account.',
    cta: 'Verify email',
    expiresPill: (h: number) => `Expires in ${h} ${h === 1 ? 'hour' : 'hours'}`,
    once: 'Single use',
    expires: (h: number) => `This link expires in ${h} ${h === 1 ? 'hour' : 'hours'} and works only once.`,
    unlockTitle: 'Once verified',
    unlock: [
      'You get your payment receipts and certificates at this address.',
      'You can recover your account if you forget your password.',
      "We'll let you know about any important activity on your account.",
    ],
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
      kicker: t.kicker,
      title: t.title,
      preheader: t.preheader,
      content: [
        hero({ icon: 'mail-check-brand', title: t.title }),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.why),
        ctaButton({ href: data.verifyUrl, label: t.cta }),
        pills([{ label: t.expiresPill(data.expiresInHours), tone: 'brand' }, { label: t.once }]),
        subheading(t.unlockTitle),
        bulletList(t.unlock, 'check'),
        fallbackLink(data.verifyUrl, ctx.locale),
        divider(),
        securityNote(t.security),
      ].join(''),
    });
    const text = plainText(
      [greeting(ctx.name, ctx.locale), t.why, `${t.cta}: ${data.verifyUrl}`, t.expires(data.expiresInHours), `${t.unlockTitle}:\n${t.unlock.map((s) => `- ${s}`).join('\n')}`, t.security],
      foot,
    );
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
