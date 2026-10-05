import rateLimit from 'express-rate-limit';
import type { Request } from 'express';
import { localize } from '../utils/errorMessages.js';

/** Mensaje del límite en el idioma del usuario */
const limited = (msg: string) => (req: Request) => ({ error: localize(req, msg) });

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limited('Demasiados intentos. Intenta de nuevo en unos minutos.'),
});

export const orderLimiter = rateLimit({
  windowMs: 60_000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limited('Demasiadas solicitudes de pago. Espera un momento.'),
});

/** Endpoints que disparan emails (reset, reenvío de verificación): evita usarlos para spamear buzones. */
export const emailActionLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: limited('Demasiadas solicitudes. Intenta de nuevo en una hora.'),
});
