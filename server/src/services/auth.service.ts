import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import type { User } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { badRequest, conflict, unauthorized } from '../utils/httpError.js';

const googleClient = new OAuth2Client();

export type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'role' | 'avatarUrl' | 'streakCount'>;

export const toPublicUser = (u: User): PublicUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  avatarUrl: u.avatarUrl,
  streakCount: u.streakCount,
});

export const signToken = (user: Pick<User, 'id' | 'role'>) =>
  jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

export async function register(input: { name: string; email: string; password: string }) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw conflict('Ya existe una cuenta con este email');
  const passwordHash = await bcrypt.hash(input.password, 12);
  return prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Compara siempre contra un hash para no filtrar por tiempo si el email existe
  const hash = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
  const ok = await bcrypt.compare(input.password, hash);
  if (!user || !user.passwordHash || !ok) throw unauthorized('Email o contraseña incorrectos');
  return user;
}

export async function loginWithGoogle(credential: string) {
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
    return prisma.user.update({
      where: { id: existing.id },
      data: { googleId: p.sub, avatarUrl: existing.avatarUrl ?? p.picture },
    });
  }
  return prisma.user.create({
    data: { email, name: p.name ?? email.split('@')[0], googleId: p.sub, avatarUrl: p.picture },
  });
}
