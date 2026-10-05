import type { Request } from 'express';
import type { RequestContext } from '../notifications/index.js';
import type { Locale } from '../notifications/types.js';

/**
 * Contexto técnico de una petición para alertas de seguridad. La ubicación
 * solo existe si el proxy/CDN la agrega (Vercel: x-vercel-ip-*, Cloudflare: cf-ipcountry).
 */
export function requestContext(req: Request): RequestContext {
  const decode = (v: string | undefined) => {
    if (!v) return undefined;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const city = decode(req.get('x-vercel-ip-city'));
  const country = req.get('x-vercel-ip-country') ?? req.get('cf-ipcountry');
  const location = [city, country].filter(Boolean).join(', ') || undefined;
  return { ip: req.ip, userAgent: req.get('user-agent')?.slice(0, 400), location, locale: clientLocale(req), timeZone: clientTimeZone(req) };
}

/**
 * Idioma con el que el usuario ve la web. La SPA lo envía en X-Client-Locale
 * (en la primera visita sale del idioma del sistema); si falta, Accept-Language.
 */
export function clientLocale(req: Request): Locale | undefined {
  const explicit = req.get('x-client-locale')?.toLowerCase();
  if (explicit === 'es' || explicit === 'en') return explicit;
  const accepted = req.acceptsLanguages('es', 'en');
  return accepted === 'es' || accepted === 'en' ? accepted : undefined;
}

/** Zona horaria IANA del navegador (X-Client-Timezone). Se ignora si no es válida. */
function clientTimeZone(req: Request): string | undefined {
  const tz = req.get('x-client-timezone')?.trim();
  if (!tz || tz.length > 64 || !/^[A-Za-z0-9_+\-/]+$/.test(tz)) return undefined;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return undefined;
  }
}
