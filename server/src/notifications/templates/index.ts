import type { EmailTemplate } from './types.js';
import { welcomeEmail } from './welcome.js';
import { verifyEmail } from './verify-email.js';
import { passwordResetEmail } from './password-reset.js';
import { securityAlertEmail } from './security-alert.js';
import { accountUpdateEmail } from './account-update.js';
import { actionCompletedEmail } from './action-completed.js';

export type { EmailTemplate, RenderedEmail, TemplateContext } from './types.js';

/** Registro de plantillas por id. Agregar un email = crear el archivo y registrarlo aquí. */
export const emailTemplates = {
  [welcomeEmail.id]: welcomeEmail,
  [verifyEmail.id]: verifyEmail,
  [passwordResetEmail.id]: passwordResetEmail,
  [securityAlertEmail.id]: securityAlertEmail,
  [accountUpdateEmail.id]: accountUpdateEmail,
  [actionCompletedEmail.id]: actionCompletedEmail,
} as Record<string, EmailTemplate<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type EmailTemplateId = keyof typeof emailTemplates;

export function getEmailTemplate(id: string) {
  const t = emailTemplates[id];
  if (!t) throw new Error(`Plantilla de email desconocida: ${id}`);
  return t;
}
