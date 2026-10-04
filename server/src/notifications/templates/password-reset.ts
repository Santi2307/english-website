import { ctaButton, divider, emailLayout, fallbackLink, formatDateTime, greeting, heading, infoCard, paragraph, plainText, securityNote, textRows } from './components.js';
import { defineTemplate } from './types.js';

type Data = {
  resetUrl: string;
  expiresInMinutes: number;
  requestedAt: string;
  browser?: string | null;
  os?: string | null;
  ip?: string | null;
};

const copy = {
  es: {
    subject: 'Restablece tu contraseña',
    preheader: 'Recibimos una solicitud para cambiar tu contraseña.',
    title: 'Restablece tu contraseña',
    intro: 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el botón para crear una nueva.',
    cta: 'Crear nueva contraseña',
    expires: (m: number) => `El enlace vence en ${m} minutos y solo funciona una vez.`,
    card: 'Detalles de la solicitud',
    when: 'Fecha',
    device: 'Dispositivo',
    ip: 'Dirección IP',
    security: 'Si no pediste este cambio, ignora este email: tu contraseña actual sigue funcionando y nadie puede cambiarla sin este enlace.',
  },
  en: {
    subject: 'Reset your password',
    preheader: 'We received a request to change your password.',
    title: 'Reset your password',
    intro: 'We received a request to reset your account password. Use the button to create a new one.',
    cta: 'Create new password',
    expires: (m: number) => `This link expires in ${m} minutes and works only once.`,
    card: 'Request details',
    when: 'Date',
    device: 'Device',
    ip: 'IP address',
    security: "If you didn't request this, ignore this email: your current password still works and nobody can change it without this link.",
  },
};

export const passwordResetEmail = defineTemplate<Data>({
  id: 'password-reset',
  sample: {
    resetUrl: 'https://englishacademy.co/restablecer-contrasena?token=ejemplo',
    expiresInMinutes: 30,
    requestedAt: '2026-09-30T22:15:00.000Z',
    browser: 'Chrome',
    os: 'Android',
    ip: '181.49.12.34',
  },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const device = [data.browser, data.os].filter(Boolean).join(' · ') || null;
    const rows = [
      { label: t.when, value: formatDateTime(data.requestedAt, ctx.locale) },
      { label: t.device, value: device },
      { label: t.ip, value: data.ip },
    ];
    const html = emailLayout({
      ...foot,
      title: t.title,
      preheader: t.preheader,
      content: [
        heading(t.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.intro),
        ctaButton({ href: data.resetUrl, label: t.cta }),
        paragraph(t.expires(data.expiresInMinutes), { muted: true, small: true }),
        infoCard(rows, t.card),
        fallbackLink(data.resetUrl, ctx.locale),
        divider(),
        securityNote(t.security),
      ].join(''),
    });
    const text = plainText(
      [greeting(ctx.name, ctx.locale), t.intro, `${t.cta}: ${data.resetUrl}`, t.expires(data.expiresInMinutes), textRows(rows), t.security],
      foot,
    );
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
