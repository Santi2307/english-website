import { z } from 'zod';

const couponCode = z
  .string()
  .max(40)
  .transform((v) => v.trim().toUpperCase())
  .optional()
  .transform((v) => v || undefined);

export const createOrderSchema = z.object({
  courseId: z.string().min(1).max(40),
  couponCode,
});

export const validateCouponSchema = z.object({
  courseId: z.string().min(1).max(40),
  code: z.string().min(1).max(40).transform((v) => v.trim().toUpperCase()),
});

export const orderStatusQuery = z.object({
  // Id de transacción que Wompi agrega al redirect. Solo se usa como pista:
  // el backend lo verifica contra la API de Wompi antes de usarlo.
  tx: z.string().max(80).optional(),
});
