import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../utils/httpError.js';

export const AUTH_COOKIE = 'ea_session';

export type AuthUser = { id: string; role: Role };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function readUser(token: string | undefined): AuthUser | undefined {
  if (!token) return undefined;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: Role };
    return { id: payload.sub, role: payload.role };
  } catch {
    return undefined;
  }
}

/** Adjunta req.user si hay una sesión válida, sin exigirla. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  req.user = readUser(req.cookies?.[AUTH_COOKIE]);
  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  req.user = readUser(req.cookies?.[AUTH_COOKIE]);
  if (!req.user) throw unauthorized();
  next();
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== 'ADMIN') throw forbidden();
  next();
};

/**
 * Defensa CSRF: las peticiones que cambian estado deben incluir un header
 * personalizado. Un formulario de otro sitio no puede enviarlo y un fetch
 * cross-origin requiere preflight, que CORS bloquea.
 */
export const csrfGuard: RequestHandler = (req, _res, next) => {
  const safe = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (!safe && req.get('X-Requested-With') !== 'fetch') throw forbidden('Solicitud rechazada');
  next();
};
