import type { RequestHandler } from 'express';

const TAG_RE = /<\/?[a-z][^>]*>/gi;

function clean(value: unknown): unknown {
  if (typeof value === 'string') return value.replace(TAG_RE, '').trim();
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)]));
  }
  return value;
}

/** Elimina etiquetas HTML y espacios sobrantes de todos los strings del body. */
export const sanitizeBody: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') req.body = clean(req.body);
  next();
};
