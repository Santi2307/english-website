import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100)
    .regex(/[A-Za-z]/, 'Debe incluir letras')
    .regex(/\d/, 'Debe incluir números'),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1).max(100),
});

export const googleSchema = z.object({ credential: z.string().min(10) });
