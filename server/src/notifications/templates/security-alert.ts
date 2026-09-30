import { appUrl, ctaButton, divider, emailLayout, formatDateTime, greeting, heading, infoCard, paragraph, plainText, securityNote, textRows } from './components.js';
import { defineTemplate } from './types.js';
import type { Locale } from '../types.js';

export type SecurityAlertKind = 'password_changed' | 'new_sign_in' | 'email_changed' | 'suspicious_attempt';

type Data = {
  kind: SecurityAlertKind;
  occurredAt: string;
  browser?: string | null;
  os?: string | null;
  deviceType?: 'mobile' | 'desktop' | 'tablet' | null;
  ip?: string | null;
  location?: string | null;
};

type KindCopy = { subject: string; preheader: string; title: string; intro: string };

const kinds: Record<Locale, Record<SecurityAlertKind, KindCopy>> = {
  es: {
    password_changed: {
      subject: 'Tu contraseña fue cambiada',
      preheader: 'Si fuiste tú, no tienes que hacer nada.',
      title: 'Tu contraseña fue cambiada',
      intro: 'La contraseña de tu cuenta se cambió correctamente. Por seguridad, cerramos las sesiones abiertas en otros dispositivos.',
    },
    new_sign_in: {
      subject: 'Nuevo inicio de sesión en tu cuenta',
      preheader: 'Detectamos un acceso desde un dispositivo nuevo.',
      title: 'Nuevo inicio de sesión',
      intro: 'Alguien inició sesión en tu cuenta desde un dispositivo que no habíamos visto antes.',
    },
    email_changed: {
      subject: 'El email de tu cuenta cambió',
      preheader: 'Tu cuenta ahora usa otra dirección de correo.',
      title: 'Tu email fue actualizado',
      intro: 'La dirección de correo asociada a tu cuenta cambió.',
    },
    suspicious_attempt: {
      subject: 'Intento de acceso bloqueado',
      preheader: 'Bloqueamos un intento sospechoso de entrar a tu cuenta.',
      title: 'Bloqueamos un intento de acceso',
      intro: 'Detectamos varios intentos fallidos de iniciar sesión en tu cuenta y los bloqueamos temporalmente.',
    },
  },
  en: {
    password_changed: {
      subject: 'Your password was changed',
      preheader: "If this was you, there's nothing else to do.",
      title: 'Your password was changed',
      intro: 'Your account password was changed successfully. For your safety, we signed out your other devices.',
    },
    new_sign_in: {
      subject: 'New sign-in to your account',
      preheader: 'We noticed a sign-in from a new device.',
      title: 'New sign-in',
      intro: "Someone signed in to your account from a device we haven't seen before.",
    },
    email_changed: {
      subject: 'Your account email changed',
      preheader: 'Your account now uses a different email address.',
      title: 'Your email was updated',
      intro: 'The email address on your account was changed.',
    },
    suspicious_attempt: {
      subject: 'Sign-in attempt blocked',
      preheader: 'We blocked a suspicious attempt to access your account.',
      title: 'We blocked a sign-in attempt',
      intro: 'We detected several failed sign-in attempts on your account and temporarily blocked them.',
    },
  },
};

const copy = {
  es: {
    card: 'Detalles',
    when: 'Fecha y hora',
    device: 'Dispositivo',
    ip: 'Dirección IP',
    location: 'Ubicación aproximada',
    deviceType: { mobile: 'Celular', desktop: 'Computador', tablet: 'Tablet' },
    wasYou: '¿Fuiste tú? Entonces todo está bien y no tienes que hacer nada.',
    notYou: '¿No fuiste tú? Cambia tu contraseña ahora mismo. Eso cierra todas las sesiones abiertas.',
    cta: 'Proteger mi cuenta',
    footnote: 'Nunca te pediremos tu contraseña por email, WhatsApp ni teléfono.',
  },
  en: {
    card: 'Details',
    when: 'Date and time',
    device: 'Device',
    ip: 'IP address',
    location: 'Approximate location',
    deviceType: { mobile: 'Phone', desktop: 'Computer', tablet: 'Tablet' },
    wasYou: "Was this you? Then everything's fine and you don't need to do anything.",
    notYou: "Wasn't you? Change your password right away. That signs out every open session.",
    cta: 'Secure my account',
    footnote: "We'll never ask for your password by email, WhatsApp or phone.",
  },
};

export const securityAlertEmail = defineTemplate<Data>({
  id: 'security-alert',
  sample: {
    kind: 'new_sign_in',
    occurredAt: '2026-09-30T22:15:00.000Z',
    browser: 'Safari',
    os: 'iOS',
    deviceType: 'mobile',
    ip: '181.49.12.34',
    location: 'Medellín, CO',
  },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const k = kinds[ctx.locale][data.kind];
    const url = appUrl('/olvide-contrasena');
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    // "Celular · Safari en iOS" / "Phone · Safari on iOS"
    const browserOs = [data.browser, data.os].filter(Boolean).join(ctx.locale === 'en' ? ' on ' : ' en ');
    const device = [data.deviceType ? t.deviceType[data.deviceType] : null, browserOs].filter(Boolean).join(' · ') || null;
    const rows = [
      { label: t.when, value: formatDateTime(data.occurredAt, ctx.locale) },
      { label: t.device, value: device },
      { label: t.ip, value: data.ip },
      { label: t.location, value: data.location },
    ];
    const html = emailLayout({
      ...foot,
      title: k.title,
      preheader: k.preheader,
      content: [
        heading(k.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(k.intro),
        infoCard(rows, t.card),
        paragraph(t.wasYou),
        paragraph(t.notYou),
        ctaButton({ href: url, label: t.cta }),
        divider(),
        securityNote(t.footnote),
      ].join(''),
    });
    const text = plainText([greeting(ctx.name, ctx.locale), k.intro, textRows(rows), t.wasYou, t.notYou, `${t.cta}: ${url}`, t.footnote], foot);
    return { subject: k.subject, preheader: k.preheader, html, text };
  },
});
