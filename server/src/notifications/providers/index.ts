import { env } from '../../config/env.js';
import type { EmailProvider } from './types.js';
import { ResendEmailProvider } from './resend.provider.js';
import { BrevoEmailProvider } from './brevo.provider.js';
import { PreviewEmailProvider } from './preview.provider.js';
import { SandboxEmailProvider } from './sandbox.provider.js';

export type { EmailProvider, OutgoingEmail } from './types.js';

function realProvider(): EmailProvider {
  return env.EMAIL_PROVIDER === 'brevo' ? new BrevoEmailProvider(env.BREVO_API_KEY) : new ResendEmailProvider(env.RESEND_API_KEY);
}

/** Selecciona el proveedor según EMAIL_MODE y EMAIL_PROVIDER. La validación de env impide `live` fuera de producción. */
export function createEmailProvider(): EmailProvider {
  const preview = new PreviewEmailProvider(env.EMAIL_PREVIEW_DIR);
  if (env.EMAIL_MODE === 'preview') return preview;
  if (env.EMAIL_MODE === 'sandbox') return new SandboxEmailProvider(realProvider(), preview, env.EMAIL_SANDBOX_ALLOWLIST);
  return realProvider();
}
