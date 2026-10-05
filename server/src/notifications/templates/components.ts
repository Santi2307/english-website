/**
 * Componentes de email. Cada función devuelve un fragmento HTML con estilos
 * inline y layout con tablas (lo único que Outlook de escritorio respeta).
 * Todo texto dinámico pasa por `esc()` y toda URL por `safeUrl()`.
 */
import { env } from '../../config/env.js';
import type { Locale, NotificationCategory } from '../types.js';

// ─── Tema ────────────────────────────────────────────────────────────────────
export const BRAND = { name: 'English Academy' };

// Misma paleta que la web: un color de marca (bermellón) sobre neutros cálidos
const C = {
  bg: '#f3f3f0',
  card: '#ffffff',
  border: '#e6e5e1',
  panel: '#fafaf8',
  text: '#191815',
  muted: '#56554f',
  subtle: '#73726c',
  brand: '#d2361a',
  brandText: '#ffffff',
  link: '#ae2a14',
};
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

// ─── Utilidades seguras ─────────────────────────────────────────────────────
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** Solo URLs http(s) absolutas. Bloquea javascript:, data:, etc. */
export function safeUrl(url: string) {
  const u = new URL(url);
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error(`URL no permitida en email: ${u.protocol}`);
  return u.toString();
}

/** URL absoluta dentro de la app (CLIENT_URL). */
export const appUrl = (path: string) => safeUrl(new URL(path, env.CLIENT_URL).toString());

const DEFAULT_TZ = 'America/Bogota';

const isValidTimeZone = (tz?: string | null): tz is string => {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/**
 * Fecha en la hora local del destinatario, con el nombre de su zona y el
 * desfase: "5 de octubre de 2026, 6:01 p. m. · hora de Afganistán (GMT+4:30)".
 * Sin zona conocida se usa la hora de Colombia (mercado principal).
 */
export function formatDateTime(date: Date | string, locale: Locale, timeZone?: string | null) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tz = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TZ;
  const lang = locale === 'en' ? 'en-US' : 'es-CO';
  const when = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeStyle: 'short', timeZone: tz }).format(d);
  const part = (style: 'long' | 'shortOffset') =>
    new Intl.DateTimeFormat(lang, { timeZone: tz, timeZoneName: style }).formatToParts(d).find((p) => p.type === 'timeZoneName')?.value ?? '';
  const name = part('long');
  const offset = part('shortOffset');
  // Algunas zonas solo tienen nombre tipo "GMT+4:30": en ese caso no se repite
  const label = name && name !== offset ? `${name} (${offset})` : offset;
  return label ? `${when} · ${label}` : when;
}

export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export function firstName(name?: string | null) {
  const n = name?.trim().split(/\s+/)[0];
  return n || null;
}

export function greeting(name: string | null | undefined, locale: Locale) {
  const n = firstName(name);
  if (locale === 'en') return n ? `Hi ${n},` : 'Hi there,';
  return n ? `Hola, ${n}:` : 'Hola:';
}

// ─── Textos compartidos ─────────────────────────────────────────────────────
const SHARED = {
  es: {
    fallback: '¿El botón no funciona? Copia y pega este enlace en tu navegador:',
    reasonService: 'Este es un mensaje de servicio sobre tu cuenta. Lo recibirás aunque desactives las comunicaciones opcionales.',
    reasonOptional: 'Recibes este tipo de emails según tus preferencias. Puedes desactivarlos cuando quieras.',
    preferences: 'Preferencias de email',
    unsubscribe: 'Cancelar suscripción',
    help: '¿Necesitas ayuda? Escríbenos a',
    tagline: 'Practica inglés hablando',
  },
  en: {
    fallback: "Button not working? Copy and paste this link into your browser:",
    reasonService: "This is a service message about your account. You'll receive it even if you turn off optional emails.",
    reasonOptional: 'You get these emails based on your preferences. You can turn them off anytime.',
    preferences: 'Email preferences',
    unsubscribe: 'Unsubscribe',
    help: 'Need help? Write to',
    tagline: 'Practice English by speaking it',
  },
};

export const isServiceCategory = (c: NotificationCategory) => c === 'SECURITY' || c === 'TRANSACTIONAL';

// ─── Componentes ────────────────────────────────────────────────────────────
export function heading(text: string) {
  return `<h1 class="ea-text ea-h1" style="margin:0 0 16px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:600;letter-spacing:-0.02em;color:${C.text};">${esc(text)}</h1>`;
}

/** Párrafo con texto plano (se escapa). */
export function paragraph(text: string, opts: { muted?: boolean; small?: boolean } = {}) {
  return paragraphHtml(esc(text), opts);
}

/** Párrafo con HTML ya compuesto por componentes/`strong()`. No pasar input de usuario sin escapar. */
export function paragraphHtml(html: string, { muted = false, small = false } = {}) {
  const color = muted ? C.muted : C.text;
  const size = small ? '14px' : '16px';
  const lh = small ? '22px' : '26px';
  return `<p class="${muted ? 'ea-muted' : 'ea-text'}" style="margin:0 0 16px;font-family:${FONT};font-size:${size};line-height:${lh};color:${color};">${html}</p>`;
}

export const strong = (text: string) => `<strong style="font-weight:600;">${esc(text)}</strong>`;

/** Botón "a prueba de balas": tabla + VML para Outlook de escritorio. Área clicable ≥ 48px de alto. */
export function ctaButton({ href, label }: { href: string; label: string }) {
  const url = esc(safeUrl(href));
  const text = esc(label);
  return `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
  <tr>
    <td align="center" bgcolor="${C.brand}" style="border-radius:10px;background:${C.brand};">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${url}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="${C.brand}">
        <center style="color:${C.brandText};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:${C.brandText};text-decoration:none;border-radius:10px;background:${C.brand};mso-hide:all;">${text}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

export function fallbackLink(href: string, locale: Locale) {
  const url = esc(safeUrl(href));
  return `<p class="ea-muted" style="margin:0 0 16px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};">${esc(SHARED[locale].fallback)}<br><a href="${url}" class="ea-link" style="color:${C.link};word-break:break-all;">${url}</a></p>`;
}

export type InfoRow = { label: string; value: string | null | undefined };

/** Tarjeta de datos clave-valor. Las filas sin valor se omiten ("cuando esté disponible"). */
export function infoCard(rows: InfoRow[], title?: string) {
  const visible = rows.filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '');
  if (!visible.length) return '';
  const body = visible
    .map(
      (r, i) => `
      <tr>
        <td class="ea-muted" style="padding:${i ? '10px' : '0'} 0 0;font-family:${FONT};font-size:13px;line-height:18px;color:${C.subtle};vertical-align:top;width:38%;">${esc(r.label)}</td>
        <td class="ea-text" style="padding:${i ? '10px' : '0'} 0 0 12px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.text};font-weight:600;vertical-align:top;word-break:break-word;">${esc(r.value)}</td>
      </tr>`,
    )
    .join('');
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-panel" style="margin:0 0 24px;background:${C.panel};border:1px solid ${C.border};border-radius:12px;">
  <tr><td style="padding:18px 20px;">
    ${title ? `<p class="ea-muted" style="margin:0 0 12px;font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:${C.subtle};">${esc(title)}</p>` : ''}
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">${body}</table>
  </td></tr>
</table>`;
}

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
const TONES: Record<Tone, { bg: string; fg: string; icon: string }> = {
  success: { bg: '#dcfce7', fg: '#14532d', icon: '✓' },
  warning: { bg: '#fef3c7', fg: '#78350f', icon: '!' },
  danger: { bg: '#fee2e2', fg: '#7f1d1d', icon: '✕' },
  info: { bg: '#f3f3f0', fg: '#292824', icon: 'i' },
  neutral: { bg: '#e6e5e1', fg: '#292824', icon: '•' },
};

/** Estado con ícono + texto: nunca depende solo del color. */
export function statusBadge(label: string, tone: Tone) {
  const t = TONES[tone];
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${t.bg};color:${t.fg};font-family:${FONT};font-size:13px;line-height:18px;font-weight:700;">${t.icon}&nbsp;${esc(label)}</span>`;
}

export function divider() {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td class="ea-divider" style="border-top:1px solid ${C.border};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

/** Aviso de seguridad discreto al final del contenido. */
export function securityNote(text: string) {
  return `<p class="ea-muted" style="margin:0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};">${esc(text)}</p>`;
}

/** Lista de pasos o beneficios. */
export function bulletList(items: string[]) {
  const li = items
    .map(
      (i) =>
        `<tr><td class="ea-text" style="padding:0 10px 10px 0;font-family:${FONT};font-size:16px;line-height:24px;color:${C.brand};vertical-align:top;font-weight:700;">→</td><td class="ea-text" style="padding:0 0 10px;font-family:${FONT};font-size:16px;line-height:24px;color:${C.text};">${esc(i)}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${li}</table>`;
}

function header() {
  const logo = esc(appUrl('/email-logo.png'));
  return `
<tr><td style="padding:0 4px 24px;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;padding-right:10px;"><img src="${logo}" width="28" height="28" alt="" style="display:block;border:0;border-radius:7px;"></td>
    <td class="ea-text" style="vertical-align:middle;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${C.text};">${esc(BRAND.name)}</td>
  </tr></table>
</td></tr>`;
}

export type FooterOptions = { locale: Locale; category: NotificationCategory; unsubscribeUrl?: string; preferencesUrl: string };

function footer({ locale, category, unsubscribeUrl, preferencesUrl }: FooterOptions) {
  const s = SHARED[locale];
  const service = isServiceCategory(category);
  const linkStyle = `color:${C.subtle};text-decoration:underline;`;
  const links = [
    `<a href="${esc(safeUrl(preferencesUrl))}" class="ea-muted" style="${linkStyle}">${esc(s.preferences)}</a>`,
    !service && unsubscribeUrl ? `<a href="${esc(safeUrl(unsubscribeUrl))}" class="ea-muted" style="${linkStyle}">${esc(s.unsubscribe)}</a>` : '',
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');
  const p = (html: string) =>
    `<p class="ea-muted" style="margin:0 0 8px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.subtle};">${html}</p>`;
  return `
<tr><td style="padding:24px 8px 0;text-align:center;">
  ${p(`<strong>${esc(BRAND.name)}</strong> · ${esc(s.tagline)}`)}
  ${p(esc(service ? s.reasonService : s.reasonOptional))}
  ${p(`${esc(s.help)} <a href="mailto:${esc(env.SUPPORT_EMAIL)}" class="ea-muted" style="${linkStyle}">${esc(env.SUPPORT_EMAIL)}</a>`)}
  ${p(links)}
</td></tr>`;
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export type LayoutOptions = FooterOptions & { title: string; preheader: string; content: string };

export function emailLayout({ title, preheader, content, ...foot }: LayoutOptions) {
  // Relleno tras el preheader para que los clientes no muestren texto del cuerpo en la vista previa
  const filler = '&#847;&zwnj;&nbsp;'.repeat(60);
  return `<!DOCTYPE html>
<html lang="${foot.locale}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;}
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
  @media (max-width:620px){
    .ea-card{padding:28px 20px!important;}
    .ea-h1{font-size:22px!important;line-height:30px!important;}
  }
  /* Modo oscuro: Apple Mail, iOS, Outlook (macOS/iOS). Gmail aplica su propia inversión. */
  @media (prefers-color-scheme: dark){
    .ea-bg{background:#0e0e0c!important;}
    .ea-card{background:#191815!important;border-color:#292824!important;}
    .ea-panel{background:#0e0e0c!important;border-color:#292824!important;}
    .ea-text{color:#f3f3f0!important;}
    .ea-muted{color:#a2a19b!important;}
    .ea-link{color:#ffa28c!important;}
    .ea-divider{border-color:#292824!important;}
  }
  /* Outlook.com / Outlook app en modo oscuro */
  [data-ogsc] .ea-text{color:#f3f3f0!important;}
  [data-ogsc] .ea-muted{color:#a2a19b!important;}
  [data-ogsc] .ea-link{color:#ffa28c!important;}
</style>
</head>
<body class="ea-bg" style="margin:0;padding:0;width:100%;background:${C.bg};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};">${esc(preheader)}${filler}</div>
<div role="article" aria-roledescription="email" aria-label="${esc(title)}" lang="${foot.locale}">
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-bg" bgcolor="${C.bg}" style="background:${C.bg};">
  <tr><td align="center" style="padding:32px 12px;">
    <!--[if mso]><table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;">
      ${header()}
      <tr><td class="ea-card" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:40px;">
        ${content}
      </td></tr>
      ${footer(foot)}
    </table>
    <!--[if mso]></td></tr></table><![endif]-->
  </td></tr>
</table>
</div>
</body>
</html>`;
}

// ─── Texto plano ────────────────────────────────────────────────────────────
/** Versión texto (mejora entregabilidad y accesibilidad). `null`/'' se omiten. */
export function plainText(parts: (string | null | undefined | false)[], foot: FooterOptions) {
  const s = SHARED[foot.locale];
  const service = isServiceCategory(foot.category);
  const tail = [
    '—',
    `${BRAND.name} · ${s.tagline}`,
    service ? s.reasonService : s.reasonOptional,
    `${s.preferences}: ${foot.preferencesUrl}`,
    !service && foot.unsubscribeUrl ? `${s.unsubscribe}: ${foot.unsubscribeUrl}` : '',
    `${s.help} ${env.SUPPORT_EMAIL}`,
  ];
  return [...parts, ...tail].filter((p) => p !== null && p !== undefined && p !== false && p !== '').join('\n\n');
}

export const textRows = (rows: InfoRow[]) =>
  rows.filter((r) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '').map((r) => `${r.label}: ${r.value}`).join('\n');
