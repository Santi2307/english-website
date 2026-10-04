import type { Request } from 'express';
import type { RequestContext } from '../notifications/index.js';

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
  return { ip: req.ip, userAgent: req.get('user-agent')?.slice(0, 400), location };
}
