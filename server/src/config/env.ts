import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  // Proxies delante de la app. Render = 1. Vercel (rewrite) → Render = 2. Determina la IP real del usuario.
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),
  CLIENT_URL: z.string().url(),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_DOMAIN: z.string().optional().transform((v) => v || undefined),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),

  // ─── Pagos: Stripe (proveedor actual) ───
  // Llaves de prueba (sk_test_/pk_test_) en desarrollo; de producción solo en Render.
  // Sin STRIPE_SECRET_KEY el checkout se muestra como "no disponible" (no se simula nada).
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(''),
  // whsec_… del endpoint /api/webhooks/stripe (Dashboard o `stripe listen`)
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),

  // ─── Pagos: Wompi (anterior). Solo para conciliar órdenes antiguas; ya no se usa en el checkout ───
  WOMPI_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  WOMPI_PUBLIC_KEY: z.string().optional().default(''),
  WOMPI_PRIVATE_KEY: z.string().optional().default(''),
  WOMPI_INTEGRITY_SECRET: z.string().optional().default(''),
  WOMPI_EVENTS_SECRET: z.string().optional().default(''),

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
  // brevo: plan gratis permite enviar a cualquiera sin dominio propio (300/día)
  // resend: requiere dominio verificado para enviar a terceros
  EMAIL_PROVIDER: z.enum(['brevo', 'resend']).default('brevo'),
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
  BREVO_API_KEY: z.string().optional().default(''),
  // Token secreto que va en la URL del webhook de Brevo (?token=...)
  BREVO_WEBHOOK_TOKEN: z.string().optional().default(''),
  // Revisión periódica de reintentos pendientes. Alto en producción para que Neon pueda dormir.
  NOTIFICATIONS_SWEEP_MINUTES: z.coerce.number().min(1).max(1440).default(60),
  SUPPORT_EMAIL: z.string().email().default('soporte@englishacademy.co'),
});

const parsed = schema
  .superRefine((e, ctx) => {
    // Un entorno local nunca debe poder enviar emails reales masivamente por error
    if (e.EMAIL_MODE === 'live' && e.NODE_ENV !== 'production') {
      ctx.addIssue({ code: 'custom', path: ['EMAIL_MODE'], message: 'EMAIL_MODE=live solo se permite con NODE_ENV=production' });
    }
    const keyVar = e.EMAIL_PROVIDER === 'brevo' ? 'BREVO_API_KEY' : 'RESEND_API_KEY';
    if (e.EMAIL_MODE !== 'preview' && !e[keyVar]) {
      ctx.addIssue({ code: 'custom', path: [keyVar], message: `EMAIL_MODE=${e.EMAIL_MODE} con EMAIL_PROVIDER=${e.EMAIL_PROVIDER} requiere ${keyVar}` });
    }
    // Llaves de Stripe del mismo modo: una de prueba con otra de producción no funciona
    const mode = (k: string) => (k.includes('_test_') ? 'test' : k.includes('_live_') ? 'live' : null);
    if (e.STRIPE_SECRET_KEY && !e.STRIPE_PUBLISHABLE_KEY) {
      ctx.addIssue({ code: 'custom', path: ['STRIPE_PUBLISHABLE_KEY'], message: 'STRIPE_SECRET_KEY requiere STRIPE_PUBLISHABLE_KEY' });
    }
    if (e.STRIPE_SECRET_KEY && e.STRIPE_PUBLISHABLE_KEY && mode(e.STRIPE_SECRET_KEY) !== mode(e.STRIPE_PUBLISHABLE_KEY)) {
      ctx.addIssue({ code: 'custom', path: ['STRIPE_PUBLISHABLE_KEY'], message: 'Las llaves de Stripe deben ser ambas de prueba o ambas de producción' });
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
