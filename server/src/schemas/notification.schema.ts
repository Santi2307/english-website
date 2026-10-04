import { z } from 'zod';

export const preferencesUpdateSchema = z
  .object({
    accountUpdates: z.boolean(),
    productUpdates: z.boolean(),
    tips: z.boolean(),
    marketing: z.boolean(),
  })
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0, 'Nada que actualizar');

export const unsubscribeQuery = z.object({ token: z.string().min(10).max(500) });
