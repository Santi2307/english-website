import type { CookieOptions, Request, Response } from 'express';
import type { User } from '@prisma/client';
import { env } from '../config/env.js';
import { AUTH_COOKIE } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { requestContext } from '../utils/requestContext.js';
import * as auth from '../services/auth.service.js';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProd || env.COOKIE_SAMESITE === 'none',
  sameSite: env.COOKIE_SAMESITE,
  domain: env.COOKIE_DOMAIN,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function startSession(res: Response, user: User) {
  res.cookie(AUTH_COOKIE, auth.signToken(user), cookieOptions);
  res.json({ user: auth.toPublicUser(user) });
}

export async function register(req: Request, res: Response) {
  const user = await auth.register(req.body, requestContext(req));
  res.status(201);
  startSession(res, user);
}

export async function login(req: Request, res: Response) {
  startSession(res, await auth.login(req.body, requestContext(req)));
}

export async function google(req: Request, res: Response) {
  startSession(res, await auth.loginWithGoogle(req.body.credential, requestContext(req), req.body.locale));
}

export function logout(_req: Request, res: Response) {
  const { maxAge: _m, ...opts } = cookieOptions;
  res.clearCookie(AUTH_COOKIE, opts);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  const user = req.user ? await prisma.user.findUnique({ where: { id: req.user.id } }) : null;
  res.json({ user: user ? auth.toPublicUser(user) : null });
}

export async function verifyEmail(req: Request, res: Response) {
  const user = await auth.verifyEmail(req.body.token);
  res.json({ user: auth.toPublicUser(user) });
}

export async function resendVerification(req: Request, res: Response) {
  await auth.resendVerification(req.user!.id);
  res.status(204).end();
}

export async function forgotPassword(req: Request, res: Response) {
  await auth.forgotPassword(req.body.email, requestContext(req));
  // Misma respuesta exista o no la cuenta
  res.status(204).end();
}

export async function resetPassword(req: Request, res: Response) {
  await auth.resetPassword(req.body.token, req.body.password, requestContext(req));
  res.status(204).end();
}

export async function changePassword(req: Request, res: Response) {
  const user = await auth.changePassword(req.user!.id, req.body, requestContext(req));
  // Las demás sesiones quedan invalidadas; esta recibe una cookie nueva
  startSession(res, user);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await auth.updateProfile(req.user!.id, req.body);
  res.json({ user: auth.toPublicUser(user) });
}
