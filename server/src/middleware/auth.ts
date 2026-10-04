import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
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

/**
 * Valida el JWT y que su versión de sesión siga vigente. Cambiar la contraseña
 * incrementa `sessionVersion` y cierra todas las sesiones anteriores.
 * Leer el rol desde la BD también refleja al instante cambios de permisos.
 */
async function readUser(token: string | undefined): Promise<AuthUser | undefined> {
  if (!token) return undefined;
  let payload: { sub: string; sv?: number };
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; sv?: number };
  } catch {
    return undefined;
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { role: true, sessionVersion: true } });
  if (!user || user.sessionVersion !== (payload.sv ?? 0)) return undefined;
  return { id: payload.sub, role: user.role };
}

/** Adjunta req.user si hay una sesión válida, sin exigirla. */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  req.user = await readUser(req.cookies?.[AUTH_COOKIE]);
  next();
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  req.user = await readUser(req.cookies?.[AUTH_COOKIE]);
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
