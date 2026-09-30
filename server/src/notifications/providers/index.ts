import { env } from '../../config/env.js';
import type { EmailProvider } from './types.js';
import { ResendEmailProvider } from './resend.provider.js';
import { PreviewEmailProvider } from './preview.provider.js';
import { SandboxEmailProvider } from './sandbox.provider.js';

export type { EmailProvider, OutgoingEmail } from './types.js';

/** Selecciona el proveedor según EMAIL_MODE. La validación de env impide `live` fuera de producción. */
export function createEmailProvider(): EmailProvider {
  const preview = new PreviewEmailProvider(env.EMAIL_PREVIEW_DIR);
  if (env.EMAIL_MODE === 'preview') return preview;

  const real = new ResendEmailProvider(env.RESEND_API_KEY);
  if (env.EMAIL_MODE === 'sandbox') return new SandboxEmailProvider(real, preview, env.EMAIL_SANDBOX_ALLOWLIST);
  return real;
}
