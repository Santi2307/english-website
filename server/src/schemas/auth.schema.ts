import { z } from 'zod';

const password = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .max(100)
  .regex(/[A-Za-z]/, 'Debe incluir letras')
  .regex(/\d/, 'Debe incluir números');

const locale = z.enum(['es', 'en']).optional();
const email = z.string().email().max(254).toLowerCase();
// Tokens de un solo uso: base64url de 32 bytes
const token = z.string().regex(/^[A-Za-z0-9_-]{20,100}$/, 'Token inválido');

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email,
  password,
  locale,
  marketingConsent: z.boolean().optional(),
});

export const loginSchema = z.object({ email, password: z.string().min(1).max(100) });

export const googleSchema = z.object({ credential: z.string().min(10), locale });

export const tokenSchema = z.object({ token });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({ token, password });

export const changePasswordSchema = z.object({
  currentPassword: z.string().max(100).optional(),
  newPassword: password,
});

export const profileSchema = z
  .object({ name: z.string().min(2).max(80).optional(), locale })
  .refine((v) => v.name !== undefined || v.locale !== undefined, 'Nada que actualizar');
