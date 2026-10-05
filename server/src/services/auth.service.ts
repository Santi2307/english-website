import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import type { AuthTokenPurpose, User } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { badRequest, conflict, unauthorized } from '../utils/httpError.js';
import { parseUserAgent } from '../utils/userAgent.js';
import { events, type EventUser, type RequestContext } from '../notifications/index.js';
import { toLocale } from '../notifications/types.js';

const googleClient = new OAuth2Client();

const VERIFY_TTL_MS = 24 * 3_600_000;
const RESET_TTL_MS = 30 * 60_000;
// Hash constante para comparar aunque el email no exista (no filtra por tiempo si la cuenta existe)
const DUMMY_HASH = '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'avatarUrl' | 'streakCount' | 'locale'> & {
  emailVerified: boolean;
  hasPassword: boolean;
};

export const toPublicUser = (u: User): PublicUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  avatarUrl: u.avatarUrl,
  streakCount: u.streakCount,
  locale: u.locale,
  emailVerified: !!u.emailVerifiedAt,
  hasPassword: !!u.passwordHash,
});

const eventUser = (u: User): EventUser => ({ id: u.id, email: u.email, name: u.name, locale: toLocale(u.locale), timeZone: u.timeZone });

/**
 * Guarda el idioma y la zona horaria con que el usuario usa la web, para que
 * los emails sin petición asociada (pagos, certificados) también salgan bien.
 */
async function rememberClient(user: User, ctx: RequestContext) {
  const data = {
    ...(ctx.locale && ctx.locale !== user.locale && { locale: ctx.locale }),
    ...(ctx.timeZone && ctx.timeZone !== user.timeZone && { timeZone: ctx.timeZone }),
  };
  return Object.keys(data).length ? prisma.user.update({ where: { id: user.id }, data }) : user;
}

export const signToken = (user: Pick<User, 'id' | 'role' | 'sessionVersion'>) =>
  jwt.sign({ role: user.role, sv: user.sessionVersion }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

// ─── Tokens de un solo uso ─────────────────────────────────────────────────
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

/** Genera un token aleatorio (256 bits). En BD solo queda su hash; emitir uno nuevo invalida los anteriores. */
async function issueToken(userId: string, purpose: AuthTokenPurpose, ttlMs: number) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + ttlMs);
  const [, record] = await prisma.$transaction([
    prisma.authToken.deleteMany({ where: { userId, purpose, usedAt: null } }),
    prisma.authToken.create({ data: { userId, purpose, tokenHash: hashToken(token), expiresAt } }),
  ]);
  return { token, record };
}

/** Consume un token de forma atómica: solo una petición puede usarlo, y solo si no expiró. */
async function consumeToken(token: string, purpose: AuthTokenPurpose) {
  const tokenHash = hashToken(token);
  const res = await prisma.authToken.updateMany({
    where: { tokenHash, purpose, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });
  if (res.count !== 1) throw badRequest('El enlace no es válido o ya expiró. Solicita uno nuevo.');
  return prisma.authToken.findUniqueOrThrow({ where: { tokenHash }, include: { user: true } });
}

const appLink = (path: string, token: string) => `${new URL(path, env.CLIENT_URL).toString()}?token=${token}`;

async function requestVerification(user: User) {
  const { token, record } = await issueToken(user.id, 'VERIFY_EMAIL', VERIFY_TTL_MS);
  void events.emit(
    'EMAIL_VERIFICATION_REQUESTED',
    { user: eventUser(user), verifyUrl: appLink('/verificar-email', token), expiresAt: record.expiresAt },
    { id: record.id },
  );
}

// ─── Dispositivos conocidos ────────────────────────────────────────────────
/**
 * Registra el dispositivo (navegador + SO + tipo) y dice si es nuevo. Solo se guarda
 * un hash y una etiqueta legible, nunca el user-agent completo ni la IP.
 */
async function trackDevice(userId: string, ctx: RequestContext) {
  const ua = parseUserAgent(ctx.userAgent);
  const label = [ua.browser, ua.os, ua.deviceType].filter(Boolean).join(' · ') || 'Desconocido';
  const fingerprint = crypto.createHash('sha256').update(`${ua.browser}|${ua.os}|${ua.deviceType}`).digest('hex');
  const known = await prisma.knownDevice.count({ where: { userId } });
  const existing = await prisma.knownDevice.findUnique({ where: { userId_fingerprint: { userId, fingerprint } } });
  if (existing) {
    await prisma.knownDevice.update({ where: { id: existing.id }, data: { lastSeenAt: new Date() } });
    return { device: existing, isNew: false, hadDevices: true };
  }
  const device = await prisma.knownDevice.create({ data: { userId, fingerprint, label } });
  return { device, isNew: true, hadDevices: known > 0 };
}

/** Alerta solo si ya conocíamos otros dispositivos (el primer acceso no es "nuevo" para nadie). */
async function signInFrom(user: User, ctx: RequestContext, method: 'password' | 'google') {
  const { device, isNew, hadDevices } = await trackDevice(user.id, ctx);
  if (isNew && hadDevices) {
    void events.emit('NEW_SIGN_IN', { user: eventUser(user), occurredAt: new Date(), method, context: ctx }, { id: device.id });
  }
}

// ─── Registro e inicio de sesión ───────────────────────────────────────────
export async function register(
  input: { name: string; email: string; password: string; locale?: 'es' | 'en'; marketingConsent?: boolean },
  ctx: RequestContext,
) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw conflict('Ya existe una cuenta con este email');
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      locale: ctx.locale ?? input.locale ?? 'es',
      timeZone: ctx.timeZone ?? null,
      // El consentimiento de marketing se registra con fecha, nunca se asume
      ...(input.marketingConsent && { preferences: { create: { marketing: true, marketingConsentAt: new Date() } } }),
    },
  });
  await trackDevice(user.id, ctx);

  void events.emit('USER_REGISTERED', { user: eventUser(user), method: 'password', emailVerified: false }, { id: user.id });
  await requestVerification(user);
  return user;
}

export async function login(input: { email: string; password: string }, ctx: RequestContext) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const ok = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) throw unauthorized('Email o contraseña incorrectos');
  const current = await rememberClient(user, ctx);
  await signInFrom(current, ctx, 'password');
  return current;
}

export async function loginWithGoogle(credential: string, ctx: RequestContext, locale?: 'es' | 'en') {
  if (!env.GOOGLE_CLIENT_ID) throw badRequest('Google login no está configurado');
  const ticket = await googleClient
    .verifyIdToken({ idToken: credential, audience: env.GOOGLE_CLIENT_ID })
    .catch(() => {
      throw unauthorized('Token de Google inválido');
    });
  const p = ticket.getPayload();
  if (!p?.email || !p.email_verified) throw unauthorized('Email de Google no verificado');

  const email = p.email.toLowerCase();
  const existing = await prisma.user.findFirst({ where: { OR: [{ googleId: p.sub }, { email }] } });
  if (existing) {
    const user = await prisma.user.update({
      where: { id: existing.id },
      // Google ya verificó la dirección
      data: { googleId: p.sub, avatarUrl: existing.avatarUrl ?? p.picture, emailVerifiedAt: existing.emailVerifiedAt ?? new Date() },
    });
    const current = await rememberClient(user, ctx);
    await signInFrom(current, ctx, 'google');
    return current;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: p.name ?? email.split('@')[0],
      googleId: p.sub,
      avatarUrl: p.picture,
      locale: ctx.locale ?? locale ?? 'es',
      timeZone: ctx.timeZone ?? null,
      emailVerifiedAt: new Date(),
    },
  });
  await trackDevice(user.id, ctx);
  void events.emit('USER_REGISTERED', { user: eventUser(user), method: 'google', emailVerified: true }, { id: user.id });
  return user;
}

// ─── Verificación de email ─────────────────────────────────────────────────
export async function verifyEmail(token: string) {
  const record = await consumeToken(token, 'VERIFY_EMAIL');
  if (record.user.emailVerifiedAt) return record.user;
  const user = await prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } });
  void events.emit('EMAIL_VERIFIED', { user: eventUser(user), verifiedAt: user.emailVerifiedAt! }, { id: user.id });
  return user;
}

export async function resendVerification(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.emailVerifiedAt) throw badRequest('Tu email ya está verificado');
  await requestVerification(user);
}

// ─── Contraseñas ───────────────────────────────────────────────────────────
/** Siempre responde igual, exista o no la cuenta (no permite descubrir qué emails están registrados). */
export async function forgotPassword(email: string, ctx: RequestContext) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;
  const { token, record } = await issueToken(user.id, 'RESET_PASSWORD', RESET_TTL_MS);
  void events.emit(
    'PASSWORD_RESET_REQUESTED',
    { user: eventUser(user), resetUrl: appLink('/restablecer-contrasena', token), expiresAt: record.expiresAt, context: ctx },
    { id: record.id },
  );
}

export async function resetPassword(token: string, password: string, ctx: RequestContext) {
  const record = await consumeToken(token, 'RESET_PASSWORD');
  const user = await prisma.user.update({
    where: { id: record.userId },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      sessionVersion: { increment: 1 },
      // Quien abrió el link demostró que controla el buzón
      emailVerifiedAt: record.user.emailVerifiedAt ?? new Date(),
    },
  });
  await prisma.authToken.deleteMany({ where: { userId: user.id, purpose: 'RESET_PASSWORD', usedAt: null } });
  void events.emit(
    'PASSWORD_CHANGED',
    { user: eventUser(user), occurredAt: new Date(), via: 'reset', context: ctx },
    { id: `${user.id}:v${user.sessionVersion}` },
  );
  return user;
}

export async function changePassword(userId: string, input: { currentPassword?: string; newPassword: string }, ctx: RequestContext) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.passwordHash) {
    const ok = await bcrypt.compare(input.currentPassword ?? '', user.passwordHash);
    if (!ok) throw badRequest('La contraseña actual no es correcta');
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(input.newPassword, 12), sessionVersion: { increment: 1 } },
  });
  void events.emit(
    'PASSWORD_CHANGED',
    { user: eventUser(updated), occurredAt: new Date(), via: 'settings', context: ctx },
    { id: `${updated.id}:v${updated.sessionVersion}` },
  );
  return updated;
}

// ─── Perfil ────────────────────────────────────────────────────────────────
export async function updateProfile(userId: string, input: { name?: string; locale?: 'es' | 'en' }) {
  const before = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const user = await prisma.user.update({ where: { id: userId }, data: input });
  const changes = input.name !== undefined && input.name !== before.name ? (['name'] as const) : ([] as const);
  if (changes.length) {
    void events.emit(
      'ACCOUNT_UPDATED',
      { user: eventUser(user), occurredAt: user.updatedAt, changes: [...changes] },
      { id: `${user.id}:${user.updatedAt.getTime()}` },
    );
  }
  return user;
}
