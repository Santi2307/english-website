import { z } from 'zod';
import { goalEnum, levelEnum } from './course.schema.js';

const optionalUrl = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => v || null)
  .refine((v) => v === null || /^https?:\/\//.test(v), 'Debe ser una URL http(s)');

export const courseInput = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  title: z.string().min(3).max(120),
  subtitle: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  level: levelEnum,
  goal: goalEnum,
  priceCOP: z.coerce.number().int().min(0).max(50_000_000),
  compareAtCOP: z.coerce.number().int().min(0).optional().nullable(),
  badge: z.enum(['BESTSELLER', 'NEW']).optional().nullable(),
  coverImage: optionalUrl,
  coverColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#4f46e5'),
  previewVideoUrl: optionalUrl,
  durationHours: z.coerce.number().int().min(0).max(1000).default(0),
  instructorName: z.string().min(2).max(100),
  instructorBio: z.string().max(1000).default(''),
  instructorAvatar: optionalUrl,
  whatYouLearn: z.array(z.string().min(1).max(200)).max(20).default([]),
  published: z.boolean().default(true),
});

export const moduleInput = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2).max(150),
  position: z.coerce.number().int().min(0),
});
export const moduleUpdate = moduleInput.omit({ courseId: true }).partial();

export const lessonInput = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(2).max(150),
  description: z.string().max(2000).default(''),
  position: z.coerce.number().int().min(0),
  durationMinutes: z.coerce.number().int().min(1).max(600).default(5),
  videoId: z.string().max(200).optional().nullable().transform((v) => v || null),
  isFreePreview: z.boolean().default(false),
});
export const lessonUpdate = lessonInput.omit({ moduleId: true }).partial();

export const couponInput = z.object({
  code: z
    .string()
    .min(3)
    .max(40)
    .transform((v) => v.trim().toUpperCase())
    .pipe(z.string().regex(/^[A-Z0-9_-]+$/, 'Solo letras, números, guiones')),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.coerce.number().int().positive(),
  courseId: z.string().optional().nullable().transform((v) => v || null),
  maxRedemptions: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  active: z.boolean().default(true),
}).refine((c) => c.type !== 'PERCENT' || c.value <= 100, {
  message: 'El porcentaje no puede superar 100',
  path: ['value'],
});

export const ordersQuery = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR']).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
