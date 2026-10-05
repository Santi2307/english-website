import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError.js';
import { env } from '../config/env.js';
import { localize, localizeDetails } from '../utils/errorMessages.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: localize(req, 'Ruta no encontrada') });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: localize(req, err.message), details: localizeDetails(req, err.details) });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: localize(req, 'Datos inválidos'), details: localizeDetails(req, err.flatten().fieldErrors) });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: localize(req, 'El registro ya existe') });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: localize(req, 'No encontrado') });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ error: env.isProd ? localize(req, 'Error interno') : String(err?.message ?? err) });
};
