import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url(),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_DOMAIN: z.string().optional().transform((v) => v || undefined),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),

  WOMPI_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  WOMPI_PUBLIC_KEY: z.string().min(1),
  WOMPI_PRIVATE_KEY: z.string().optional().default(''),
  WOMPI_INTEGRITY_SECRET: z.string().min(1),
  WOMPI_EVENTS_SECRET: z.string().min(1),

  VIDEO_PROVIDER: z.enum(['bunny', 'mux', 'none']).default('none'),
  VIDEO_URL_TTL_SECONDS: z.coerce.number().default(3600),
  BUNNY_LIBRARY_ID: z.string().optional().default(''),
  BUNNY_TOKEN_KEY: z.string().optional().default(''),
  MUX_SIGNING_KEY_ID: z.string().optional().default(''),
  MUX_SIGNING_PRIVATE_KEY: z.string().optional().default(''),

  // ─── Email ───
  // preview: no envía nada, guarda cada email como archivo (por defecto en local)
  // sandbox: envía por el proveedor SOLO a EMAIL_SANDBOX_ALLOWLIST; el resto va a preview
  // live:    envía a todos. Solo permitido con NODE_ENV=production
  EMAIL_MODE: z.enum(['preview', 'sandbox', 'live']).default('preview'),
  EMAIL_PROVIDER: z.enum(['resend']).default('resend'),
  EMAIL_FROM: z.string().default('English Academy <onboarding@resend.dev>'),
  EMAIL_REPLY_TO: z.string().optional().transform((v) => v || undefined),
  EMAIL_SANDBOX_ALLOWLIST: z
    .string()
    .optional()
    .default('')
    .transform((v) => v.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)),
  EMAIL_PREVIEW_DIR: z.string().default('.email-previews'),
  RESEND_API_KEY: z.string().optional().default(''),
  // Secreto de firma del webhook de Resend (whsec_...) para estados delivered/bounced
  RESEND_WEBHOOK_SECRET: z.string().optional().default(''),
  SUPPORT_EMAIL: z.string().email().default('soporte@englishacademy.co'),
});

const parsed = schema
  .superRefine((e, ctx) => {
    // Un entorno local nunca debe poder enviar emails reales masivamente por error
    if (e.EMAIL_MODE === 'live' && e.NODE_ENV !== 'production') {
      ctx.addIssue({ code: 'custom', path: ['EMAIL_MODE'], message: 'EMAIL_MODE=live solo se permite con NODE_ENV=production' });
    }
    if (e.EMAIL_MODE !== 'preview' && !e.RESEND_API_KEY) {
      ctx.addIssue({ code: 'custom', path: ['RESEND_API_KEY'], message: `EMAIL_MODE=${e.EMAIL_MODE} requiere RESEND_API_KEY` });
    }
    if (e.EMAIL_MODE === 'sandbox' && e.EMAIL_SANDBOX_ALLOWLIST.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['EMAIL_SANDBOX_ALLOWLIST'], message: 'EMAIL_MODE=sandbox requiere al menos un email autorizado' });
    }
  })
  .safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
  wompiApiUrl:
    parsed.data.WOMPI_ENV === 'production'
      ? 'https://production.wompi.co/v1'
      : 'https://sandbox.wompi.co/v1',
};
