import { z } from 'zod';

const couponCode = z
  .string()
  .max(40)
  .transform((v) => v.trim().toUpperCase())
  .optional()
  .transform((v) => v || undefined);

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

/** Códigos postales con formato conocido. En el resto de países se acepta texto libre corto. */
export const POSTAL_RULES: Record<string, { pattern: RegExp; required: boolean }> = {
  US: { pattern: /^\d{5}(-\d{4})?$/, required: true },
  CA: { pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, required: true },
  CO: { pattern: /^\d{6}$/, required: false },
  MX: { pattern: /^\d{5}$/, required: false },
  ES: { pattern: /^\d{5}$/, required: false },
  GB: { pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, required: true },
};

/** Países donde el estado/provincia/departamento es parte obligatoria de la dirección. */
export const REGION_REQUIRED = new Set(['US', 'CA', 'CO', 'MX', 'AU', 'BR']);

/**
 * Datos de facturación. Solo información no sensible: los datos de la tarjeta
 * los captura el Payment Element de Stripe y nunca llegan a este servidor.
 */
export const billingSchema = z
  .object({
    firstName: text(60),
    lastName: text(60),
    country: z.string().regex(/^[A-Z]{2}$/),
    region: optionalText(80),
    city: text(80),
    address1: text(120),
    address2: optionalText(120),
    postalCode: optionalText(12),
  })
  .superRefine((b, ctx) => {
    if (REGION_REQUIRED.has(b.country) && !b.region) ctx.addIssue({ code: 'custom', path: ['region'], message: 'Datos inválidos' });
    const rule = POSTAL_RULES[b.country];
    if (rule?.required && !b.postalCode) ctx.addIssue({ code: 'custom', path: ['postalCode'], message: 'Código postal inválido' });
    if (rule && b.postalCode && !rule.pattern.test(b.postalCode)) ctx.addIssue({ code: 'custom', path: ['postalCode'], message: 'Código postal inválido' });
  });

export type Billing = z.infer<typeof billingSchema>;

export const createOrderSchema = z.object({
  courseId: z.string().min(1).max(40),
  couponCode,
  billing: billingSchema,
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

export const checkoutConfigQuery = z.object({
  courseId: z.string().min(1).max(40),
});
