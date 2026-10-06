import {
  bulletList, callout, ctaButton, divider, emailLayout, fallbackLink, formatDateTime, greeting, hero, infoCard, paragraph, pills, plainText,
  securityNote, subheading, textRows,
} from './components.js';
import { defineTemplate } from './types.js';

type Data = {
  resetUrl: string;
  expiresInMinutes: number;
  requestedAt: string;
  browser?: string | null;
  os?: string | null;
  ip?: string | null;
  location?: string | null;
};

const copy = {
  es: {
    subject: 'Restablece tu contraseña',
    preheader: 'Recibimos una solicitud para cambiar tu contraseña. El enlace vence pronto.',
    kicker: 'Seguridad',
    title: 'Restablece tu contraseña',
    lead: 'Recibimos una solicitud para cambiar la contraseña de tu cuenta. Crea una nueva con el botón de abajo.',
    cta: 'Crear nueva contraseña',
    expires: (m: number) => `Vence en ${m} min`,
    once: 'Un solo uso',
    expiresText: (m: number) => `El enlace vence en ${m} minutos y solo funciona una vez.`,
    card: 'Detalles de la solicitud',
    when: 'Fecha y hora',
    device: 'Dispositivo',
    location: 'Ubicación aproximada',
    ip: 'Dirección IP',
    notYouTitle: '¿No fuiste tú?',
    notYou: 'Ignora este email. Tu contraseña actual sigue funcionando y nadie puede cambiarla sin este enlace.',
    tipsTitle: 'Consejos para una contraseña segura',
    tips: [
      'Usa una frase de 12 caracteres o más: es más fácil de recordar y más difícil de adivinar.',
      'No la reutilices en otras páginas ni servicios.',
      'Guárdala en un gestor de contraseñas, como el de tu navegador o tu celular.',
    ],
    footnote: 'Nunca te pediremos tu contraseña por email, WhatsApp ni teléfono.',
  },
  en: {
    subject: 'Reset your password',
    preheader: 'We received a request to change your password. The link expires soon.',
    kicker: 'Security',
    title: 'Reset your password',
    lead: 'We received a request to change your account password. Create a new one with the button below.',
    cta: 'Create new password',
    expires: (m: number) => `Expires in ${m} min`,
    once: 'Single use',
    expiresText: (m: number) => `This link expires in ${m} minutes and works only once.`,
    card: 'Request details',
    when: 'Date and time',
    device: 'Device',
    location: 'Approximate location',
    ip: 'IP address',
    notYouTitle: "Didn't request this?",
    notYou: 'Ignore this email. Your current password still works and nobody can change it without this link.',
    tipsTitle: 'Tips for a strong password',
    tips: [
      'Use a phrase of 12 or more characters: easier to remember, harder to guess.',
      "Don't reuse it on other sites or services.",
      'Store it in a password manager, like the one in your browser or phone.',
    ],
    footnote: "We'll never ask for your password by email, WhatsApp or phone.",
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
    location: 'Bogotá, CO',
  },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const device = [data.browser, data.os].filter(Boolean).join(ctx.locale === 'en' ? ' on ' : ' en ') || null;
    const rows = [
      { label: t.when, value: formatDateTime(data.requestedAt, ctx.locale, ctx.timeZone) },
      { label: t.device, value: device },
      { label: t.location, value: data.location },
      { label: t.ip, value: data.ip, mono: true },
    ];
    const html = emailLayout({
      ...foot,
      kicker: t.kicker,
      title: t.title,
      preheader: t.preheader,
      content: [
        hero({ icon: 'key-round-brand', title: t.title }),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.lead),
        ctaButton({ href: data.resetUrl, label: t.cta }),
        pills([{ label: t.expires(data.expiresInMinutes), tone: 'brand' }, { label: t.once }]),
        infoCard(rows, t.card),
        callout({ title: t.notYouTitle, text: t.notYou }),
        subheading(t.tipsTitle),
        bulletList(t.tips, 'check'),
        fallbackLink(data.resetUrl, ctx.locale),
        divider(),
        securityNote(t.footnote),
      ].join(''),
    });
    const text = plainText(
      [
        greeting(ctx.name, ctx.locale),
        t.lead,
        `${t.cta}: ${data.resetUrl}`,
        t.expiresText(data.expiresInMinutes),
        `${t.card}\n${textRows(rows)}`,
        `${t.notYouTitle} ${t.notYou}`,
        `${t.tipsTitle}\n${t.tips.map((s) => `- ${s}`).join('\n')}`,
        t.footnote,
      ],
      foot,
    );
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
