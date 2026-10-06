/**
 * Componentes de email. Cada función devuelve un fragmento HTML con estilos
 * inline y layout con tablas (lo único que Outlook de escritorio respeta).
 * Todo texto dinámico pasa por `esc()` y toda URL por `safeUrl()`.
 *
 * Anatomía de un email:
 *   cabecera (logo + tipo de mensaje)
 *   tarjeta: franja de marca → hero (ícono, título, entrada) → contenido
 *   bloque de ayuda
 *   pie (enlaces, motivo del envío, preferencias)
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
  hairline: '#efeeea',
  panel: '#fafaf8',
  text: '#191815',
  muted: '#56554f',
  subtle: '#73726c',
  faint: '#a2a19b',
  brand: '#d2361a',
  brandSoft: '#fff4f1',
  brandText: '#ffffff',
  link: '#ae2a14',
  ink: '#191815',
};
const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const MONO = `ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace`;

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

/** Solo la fecha, en la zona del destinatario: "5 de octubre de 2026". */
export function formatDate(date: Date | string, locale: Locale, timeZone?: string | null) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tz = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TZ;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', { dateStyle: 'long', timeZone: tz }).format(d);
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
    helpTitle: '¿Tienes alguna pregunta?',
    helpText: 'Escríbenos y te responde una persona del equipo, normalmente en menos de un día hábil.',
    tagline: 'Practica inglés hablando',
    nav: { account: 'Mi cuenta', paths: 'Rutas de aprendizaje', practice: 'Practicar' },
    kicker: { SECURITY: 'Seguridad', TRANSACTIONAL: 'Tu cuenta', ACCOUNT: 'Tu cuenta', MARKETING: 'Novedades', PRODUCT: 'Producto' } as Record<string, string>,
    rights: 'Todos los derechos reservados.',
  },
  en: {
    fallback: 'Button not working? Copy and paste this link into your browser:',
    reasonService: "This is a service message about your account. You'll receive it even if you turn off optional emails.",
    reasonOptional: 'You get these emails based on your preferences. You can turn them off anytime.',
    preferences: 'Email preferences',
    unsubscribe: 'Unsubscribe',
    help: 'Need help? Write to',
    helpTitle: 'Have a question?',
    helpText: 'Write to us and a real person on the team will reply, usually within one business day.',
    tagline: 'Practice English by speaking it',
    nav: { account: 'My account', paths: 'Learning paths', practice: 'Practice' },
    kicker: { SECURITY: 'Security', TRANSACTIONAL: 'Your account', ACCOUNT: 'Your account', MARKETING: 'News', PRODUCT: 'Product' } as Record<string, string>,
    rights: 'All rights reserved.',
  },
};

export const isServiceCategory = (c: NotificationCategory) => c === 'SECURITY' || c === 'TRANSACTIONAL';

// ─── Tonos ──────────────────────────────────────────────────────────────────
export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
const TONES: Record<Tone, { bg: string; fg: string; border: string; icon: string }> = {
  success: { bg: '#ecf8f0', fg: '#14532d', border: '#cdebd8', icon: '✓' },
  warning: { bg: '#fdf6e3', fg: '#78350f', border: '#f3e1b0', icon: '!' },
  danger: { bg: '#fdf0ef', fg: '#7f1d1d', border: '#f7d4d0', icon: '✕' },
  info: { bg: '#f3f3f0', fg: '#292824', border: '#e6e5e1', icon: 'i' },
  neutral: { bg: '#e6e5e1', fg: '#292824', border: '#d4d3ce', icon: '•' },
  brand: { bg: '#fff4f1', fg: '#8e2616', border: '#ffd9cc', icon: '•' },
};

// ─── Tipografía ─────────────────────────────────────────────────────────────
export function heading(text: string) {
  return `<h1 class="ea-text ea-h1" style="margin:0 0 12px;font-family:${FONT};font-size:28px;line-height:34px;font-weight:700;letter-spacing:-0.025em;color:${C.text};">${esc(text)}</h1>`;
}

/** Subtítulo de sección dentro del email. */
export function subheading(text: string) {
  return `<h2 class="ea-text" style="margin:8px 0 12px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:700;letter-spacing:-0.01em;color:${C.text};">${esc(text)}</h2>`;
}

/** Etiqueta pequeña en mayúsculas (estilo "eyebrow" de la web). */
export function eyebrow(text: string, color = C.subtle) {
  return `<p class="ea-muted" style="margin:0 0 10px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:${color};">${esc(text)}</p>`;
}

/** Párrafo con texto plano (se escapa). */
export function paragraph(text: string, opts: { muted?: boolean; small?: boolean; lead?: boolean } = {}) {
  return paragraphHtml(esc(text), opts);
}

/** Párrafo con HTML ya compuesto por componentes/`strong()`. No pasar input de usuario sin escapar. */
export function paragraphHtml(html: string, { muted = false, small = false, lead = false } = {}) {
  const color = muted || lead ? C.muted : C.text;
  const size = small ? '14px' : lead ? '17px' : '16px';
  const lh = small ? '22px' : lead ? '28px' : '26px';
  return `<p class="${muted || lead ? 'ea-muted' : 'ea-text'}" style="margin:0 0 16px;font-family:${FONT};font-size:${size};line-height:${lh};color:${color};">${html}</p>`;
}

export const strong = (text: string) => `<strong style="font-weight:600;">${esc(text)}</strong>`;

// ─── Hero ───────────────────────────────────────────────────────────────────
/** Íconos generados en client/public/email (PNG 3x con su propio fondo: se ven igual en modo oscuro). */
export type HeroIcon =
  | 'key-round-brand' | 'mail-check-brand' | 'audio-lines-brand' | 'award-brand'
  | 'shield-check-success' | 'receipt-success' | 'user-round-check-success'
  | 'monitor-smartphone-neutral' | 'mail-check-neutral'
  | 'lock-keyhole-danger' | 'circle-alert-danger';

/** Apertura del email: ícono, título y una entrada que resume el mensaje en una frase. */
export function hero({ icon, title, lead }: { icon: HeroIcon; title: string; lead?: string }) {
  const src = esc(appUrl(`/email/${icon}.png`));
  return `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 22px;"><tr>
  <td><img src="${src}" width="56" height="56" alt="" style="display:block;border:0;width:56px;height:56px;"></td>
</tr></table>
${heading(title)}
${lead ? paragraph(lead, { lead: true }) : ''}`;
}

// ─── Botones ────────────────────────────────────────────────────────────────
/** Botón "a prueba de balas": tabla + VML para Outlook de escritorio. Área clicable ≥ 48px de alto. */
export function ctaButton({ href, label, variant = 'primary' }: { href: string; label: string; variant?: 'primary' | 'secondary' }) {
  const url = esc(safeUrl(href));
  const text = esc(label);
  const primary = variant === 'primary';
  const bg = primary ? C.brand : C.card;
  const fg = primary ? C.brandText : C.text;
  const border = primary ? C.brand : '#d4d3ce';
  return `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="ea-btn" style="margin:8px 0 24px;">
  <tr>
    <td align="center" bgcolor="${bg}" class="${primary ? '' : 'ea-btn-secondary'}" style="border-radius:10px;background:${bg};border:1px solid ${border};">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${url}" style="height:50px;v-text-anchor:middle;width:300px;" arcsize="20%" strokecolor="${border}" fillcolor="${bg}">
        <center style="color:${fg};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${url}" target="_blank" class="${primary ? '' : 'ea-text'}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:600;color:${fg};text-decoration:none;border-radius:10px;background:${bg};mso-hide:all;">${text}&nbsp;&nbsp;&rarr;</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

/** Enlace de texto con flecha, para acciones secundarias. */
export function textLink(href: string, label: string) {
  return `<a href="${esc(safeUrl(href))}" target="_blank" class="ea-link" style="color:${C.link};font-weight:600;text-decoration:none;">${esc(label)}&nbsp;&rarr;</a>`;
}

export function fallbackLink(href: string, locale: Locale) {
  const url = esc(safeUrl(href));
  return `<p class="ea-muted" style="margin:0 0 16px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};">${esc(SHARED[locale].fallback)}<br><a href="${url}" class="ea-link" style="color:${C.link};word-break:break-all;">${url}</a></p>`;
}

// ─── Datos ──────────────────────────────────────────────────────────────────
export type InfoRow = { label: string; value: string | null | undefined; mono?: boolean };

const hasValue = (r: InfoRow) => r.value !== null && r.value !== undefined && String(r.value).trim() !== '';

/** Tarjeta de datos clave-valor. Las filas sin valor se omiten ("cuando esté disponible"). */
export function infoCard(rows: InfoRow[], title?: string) {
  const visible = rows.filter(hasValue);
  if (!visible.length) return '';
  const body = visible
    .map((r, i) => {
      const top = i ? `border-top:1px solid ${C.hairline};` : '';
      const valueFont = r.mono ? `font-family:${MONO};font-size:13px;letter-spacing:.01em;` : `font-family:${FONT};font-size:14px;`;
      return `
      <tr>
        <td class="ea-muted ea-col ea-divider" style="padding:12px 0;${top}font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};vertical-align:top;width:36%;">${esc(r.label)}</td>
        <td class="ea-text ea-col ea-divider ea-val" style="padding:12px 0 12px 16px;${top}${valueFont}line-height:20px;color:${C.text};font-weight:600;vertical-align:top;word-break:break-word;">${esc(r.value)}</td>
      </tr>`;
    })
    .join('');
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-panel" style="margin:0 0 24px;background:${C.panel};border:1px solid ${C.border};border-radius:12px;">
  <tr><td style="padding:8px 20px;">
    ${title ? `<p class="ea-muted" style="margin:12px 0 4px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:${C.subtle};">${esc(title)}</p>` : ''}
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">${body}</table>
  </td></tr>
</table>`;
}

/** Estado con ícono + texto: nunca depende solo del color. */
export function statusBadge(label: string, tone: Tone) {
  const t = TONES[tone];
  return `<span style="display:inline-block;padding:4px 11px;border-radius:999px;background:${t.bg};border:1px solid ${t.border};color:${t.fg};font-family:${FONT};font-size:13px;line-height:18px;font-weight:700;white-space:nowrap;">${t.icon}&nbsp;${esc(label)}</span>`;
}

/** Fila de "chips" informativos (vencimiento, uso único…). */
export function pills(items: { label: string; tone?: Tone }[]) {
  const cells = items
    .map((p) => {
      const t = TONES[p.tone ?? 'info'];
      return `<td style="padding:0 8px 8px 0;"><span style="display:inline-block;padding:5px 11px;border-radius:999px;background:${t.bg};border:1px solid ${t.border};color:${t.fg};font-family:${FONT};font-size:13px;line-height:18px;font-weight:600;white-space:nowrap;">${esc(p.label)}</span></td>`;
    })
    .join('');
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:-8px 0 20px;"><tr>${cells}</tr></table>`;
}

/** Aviso destacado con borde lateral de color. */
export function callout({ title, text, tone = 'info', html }: { title?: string; text?: string; tone?: Tone; html?: string }) {
  const t = TONES[tone];
  const accent = tone === 'info' || tone === 'neutral' ? '#a2a19b' : tone === 'brand' ? C.brand : t.fg;
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-panel" style="margin:0 0 24px;background:${t.bg};border-radius:10px;">
  <tr>
    <td width="4" style="width:4px;background:${accent};border-radius:10px 0 0 10px;font-size:0;line-height:0;">&nbsp;</td>
    <td style="padding:16px 18px;">
      ${title ? `<p class="ea-text" style="margin:0 0 4px;font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.text};">${esc(title)}</p>` : ''}
      ${text ? `<p class="ea-muted" style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">${esc(text)}</p>` : ''}
      ${html ?? ''}
    </td>
  </tr>
</table>`;
}

/** Pasos numerados con título y descripción. */
export function steps(items: { title: string; text: string }[]) {
  const rows = items
    .map(
      (s, i) => `
  <tr>
    <td width="40" style="width:40px;padding:0 14px 18px 0;vertical-align:top;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
        <td align="center" width="28" height="28" class="ea-num" style="width:28px;height:28px;border-radius:999px;background:${C.ink};color:#ffffff;font-family:${MONO};font-size:13px;line-height:28px;font-weight:700;">${i + 1}</td>
      </tr></table>
    </td>
    <td style="padding:2px 0 18px;vertical-align:top;">
      <p class="ea-text" style="margin:0 0 2px;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${C.text};">${esc(s.title)}</p>
      <p class="ea-muted" style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">${esc(s.text)}</p>
    </td>
  </tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:4px 0 12px;">${rows}</table>`;
}

/** Lista con marcas: ✓ en verde o → en color de marca. */
export function bulletList(items: string[], mark: 'arrow' | 'check' = 'arrow') {
  const sym = mark === 'check' ? '✓' : '→';
  const color = mark === 'check' ? '#17803d' : C.brand;
  const li = items
    .map(
      (i) =>
        `<tr><td style="padding:0 12px 10px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${color};vertical-align:top;font-weight:700;">${sym}</td><td class="ea-text" style="padding:0 0 10px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">${esc(i)}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${li}</table>`;
}

/**
 * Dos opciones lado a lado (en móvil, una debajo de la otra):
 * "¿Fuiste tú? / ¿No fuiste tú?". La segunda lleva la acción.
 */
export function decision({ yes, no }: { yes: { title: string; text: string }; no: { title: string; text: string; href: string; label: string } }) {
  const cell = (inner: string, pad: string) =>
    `<td class="ea-col" width="50%" style="width:50%;padding:${pad};vertical-align:top;">${inner}</td>`;
  const box = (title: string, text: string, extra = '', danger = false) => `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-panel" style="background:${danger ? TONES.danger.bg : C.panel};border:1px solid ${danger ? TONES.danger.border : C.border};border-radius:12px;">
      <tr><td style="padding:18px;">
        <p class="ea-text" style="margin:0 0 6px;font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.text};">${esc(title)}</p>
        <p class="ea-muted" style="margin:0;font-family:${FONT};font-size:14px;line-height:21px;color:${C.muted};">${esc(text)}</p>
        ${extra}
      </td></tr>
    </table>`;
  const action = `<p style="margin:12px 0 0;font-family:${FONT};font-size:14px;line-height:20px;">${textLink(no.href, no.label)}</p>`;
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr>
  ${cell(box(yes.title, yes.text), '0 6px 0 0')}
  ${cell(box(no.title, no.text, action, true), '0 0 0 6px')}
</tr></table>`;
}

/** Recibo: concepto, total destacado y datos del pago. */
export function receipt({ title, item, amount, totalLabel, rows }: { title: string; item: string; amount: string; totalLabel: string; rows: InfoRow[] }) {
  const extra = rows
    .filter(hasValue)
    .map(
      (r) => `
      <tr>
        <td class="ea-muted ea-divider" width="30%" style="width:30%;padding:10px 0;border-top:1px solid ${C.hairline};font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};vertical-align:top;">${esc(r.label)}</td>
        <td class="ea-text ea-divider" align="right" style="padding:10px 0 10px 12px;border-top:1px solid ${C.hairline};${r.mono ? `font-family:${MONO};font-size:12px;word-break:break-all;` : `font-family:${FONT};font-size:13px;word-break:normal;`}line-height:20px;color:${C.text};font-weight:600;text-align:right;vertical-align:top;">${esc(r.value)}</td>
      </tr>`,
    )
    .join('');
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-panel" style="margin:0 0 24px;background:${C.panel};border:1px solid ${C.border};border-radius:12px;">
  <tr><td style="padding:20px 22px 10px;">
    <p class="ea-muted" style="margin:0 0 14px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:${C.subtle};">${esc(title)}</p>
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td class="ea-text" width="70%" style="width:70%;padding:0 0 14px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};font-weight:600;">${esc(item)}</td>
        <td class="ea-text" align="right" style="padding:0 0 14px 12px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};text-align:right;white-space:nowrap;">${esc(amount)}</td>
      </tr>
      <tr>
        <td class="ea-text ea-divider" style="padding:14px 0;border-top:1px solid ${C.border};font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};font-weight:700;">${esc(totalLabel)}</td>
        <td class="ea-text ea-divider" align="right" style="padding:14px 0;border-top:1px solid ${C.border};font-family:${FONT};font-size:22px;line-height:28px;color:${C.text};font-weight:700;letter-spacing:-0.02em;text-align:right;white-space:nowrap;">${esc(amount)}</td>
      </tr>
    </table>
    ${extra ? `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">${extra}</table>` : ''}
  </td></tr>
</table>`;
}

/** Vista previa del certificado: tarjeta oscura con el curso, el nombre y el código. */
export function certificate({ label, course, name, date, codeLabel, code }: { label: string; course: string; name?: string | null; date: string; codeLabel: string; code: string }) {
  return `
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${C.ink}" style="margin:0 0 24px;background:${C.ink};border-radius:14px;">
  <tr><td height="4" style="height:4px;background:${C.brand};border-radius:14px 14px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr><td style="padding:28px 28px 26px;">
    <p style="margin:0 0 18px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:#a2a19b;">${esc(label)}</p>
    <p style="margin:0 0 6px;font-family:${FONT};font-size:24px;line-height:30px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">${esc(course)}</p>
    ${name ? `<p style="margin:0 0 22px;font-family:${FONT};font-size:15px;line-height:22px;color:#d4d3ce;">${esc(name)}</p>` : '<p style="margin:0 0 22px;"></p>'}
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-top:16px;border-top:1px solid #3f3e39;font-family:${FONT};font-size:13px;line-height:20px;color:#d4d3ce;">${esc(date)}</td>
      <td align="right" style="padding-top:16px;border-top:1px solid #3f3e39;font-family:${MONO};font-size:12px;line-height:20px;color:#ffffff;text-align:right;">${esc(codeLabel)} ${esc(code)}</td>
    </tr></table>
  </td></tr>
</table>`;
}

export function divider() {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td class="ea-divider" style="border-top:1px solid ${C.border};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

/** Aviso de seguridad discreto al final del contenido. */
export function securityNote(text: string) {
  return `<p class="ea-muted" style="margin:0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.subtle};">${esc(text)}</p>`;
}

// ─── Estructura ─────────────────────────────────────────────────────────────
function header(kicker: string) {
  const logo = esc(appUrl('/email-logo.png'));
  const home = esc(appUrl('/'));
  return `
<tr><td style="padding:0 4px 20px;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;">
      <a href="${home}" target="_blank" style="text-decoration:none;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:10px;"><img src="${logo}" width="30" height="30" alt="" style="display:block;border:0;border-radius:8px;"></td>
          <td class="ea-text" style="vertical-align:middle;font-family:${FONT};font-size:16px;line-height:24px;font-weight:700;letter-spacing:-0.01em;color:${C.text};">${esc(BRAND.name)}</td>
        </tr></table>
      </a>
    </td>
    <td align="right" class="ea-muted" style="vertical-align:middle;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:${C.subtle};">${esc(kicker)}</td>
  </tr></table>
</td></tr>`;
}

function helpBlock(locale: Locale) {
  const s = SHARED[locale];
  const mail = esc(env.SUPPORT_EMAIL);
  return `
<tr><td style="padding:16px 0 0;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-card" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.border};border-radius:14px;">
    <tr><td style="padding:20px 24px;">
      <p class="ea-text" style="margin:0 0 4px;font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.text};">${esc(s.helpTitle)}</p>
      <p class="ea-muted" style="margin:0;font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">${esc(s.helpText)} <a href="mailto:${mail}" class="ea-link" style="color:${C.link};font-weight:600;text-decoration:none;">${mail}</a></p>
    </td></tr>
  </table>
</td></tr>`;
}

export type FooterOptions = { locale: Locale; category: NotificationCategory; unsubscribeUrl?: string; preferencesUrl: string };

function footer({ locale, category, unsubscribeUrl, preferencesUrl }: FooterOptions) {
  const s = SHARED[locale];
  const service = isServiceCategory(category);
  const linkStyle = `color:${C.subtle};text-decoration:underline;`;
  const nav = [
    [s.nav.account, '/mi-cuenta'],
    [s.nav.paths, '/cursos'],
    [s.nav.practice, '/#practicar'],
  ]
    .map(([l, p]) => `<a href="${esc(appUrl(p))}" target="_blank" class="ea-text" style="color:${C.text};font-weight:600;text-decoration:none;">${esc(l)}</a>`)
    .join(`<span style="color:${C.faint};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);
  const links = [
    `<a href="${esc(safeUrl(preferencesUrl))}" class="ea-muted" style="${linkStyle}">${esc(s.preferences)}</a>`,
    !service && unsubscribeUrl ? `<a href="${esc(safeUrl(unsubscribeUrl))}" class="ea-muted" style="${linkStyle}">${esc(s.unsubscribe)}</a>` : '',
  ]
    .filter(Boolean)
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');
  const p = (html: string, mb = 8) =>
    `<p class="ea-muted" style="margin:0 0 ${mb}px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.subtle};">${html}</p>`;
  return `
<tr><td style="padding:28px 8px 0;text-align:center;">
  <p style="margin:0 0 16px;font-family:${FONT};font-size:13px;line-height:20px;">${nav}</p>
  ${p(`<strong class="ea-text" style="color:${C.text};">${esc(BRAND.name)}</strong> · ${esc(s.tagline)}`)}
  ${p(esc(service ? s.reasonService : s.reasonOptional))}
  ${p(links, 16)}
  ${p(`© ${new Date().getFullYear()} ${esc(BRAND.name)}. ${esc(s.rights)}`, 0)}
</td></tr>`;
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export type LayoutOptions = FooterOptions & { title: string; preheader: string; content: string; kicker?: string };

export function emailLayout({ title, preheader, content, kicker, ...foot }: LayoutOptions) {
  // Relleno tras el preheader para que los clientes no muestren texto del cuerpo en la vista previa
  const filler = '&#847;&zwnj;&nbsp;'.repeat(60);
  const label = kicker ?? SHARED[foot.locale].kicker[foot.category] ?? '';
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
    .ea-outer{padding:20px 10px!important;}
    .ea-body{padding:30px 22px 26px!important;}
    .ea-h1{font-size:24px!important;line-height:30px!important;}
    .ea-col{display:block!important;width:100%!important;padding:0 0 10px 0!important;}
    .ea-val{padding-top:0!important;border-top:0!important;}
    .ea-btn{width:100%!important;}
    .ea-btn a{display:block!important;}
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
    .ea-btn-secondary{background:#191815!important;border-color:#3f3e39!important;}
    .ea-num{background:#f3f3f0!important;color:#191815!important;}
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
  <tr><td align="center" class="ea-outer" style="padding:36px 12px 40px;">
    <!--[if mso]><table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;">
      ${header(label)}
      <tr><td>
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="ea-card" bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.border};border-radius:16px;">
          <tr><td height="4" style="height:4px;background:${C.brand};border-radius:16px 16px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td class="ea-body" style="padding:40px 44px 36px;">
            ${content}
          </td></tr>
        </table>
      </td></tr>
      ${helpBlock(foot.locale)}
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

export const textRows = (rows: InfoRow[]) => rows.filter(hasValue).map((r) => `${r.label}: ${r.value}`).join('\n');
