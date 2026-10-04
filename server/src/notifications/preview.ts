import { Router } from 'express';
import { emailChannel } from './index.js';
import { emailTemplates } from './templates/index.js';
import type { Locale, NotificationCategory } from './types.js';
import { esc } from './templates/components.js';

type Preview = { id: string; template: string; category: NotificationCategory; label: string; data: Record<string, unknown> };

const sample = (id: string) => emailTemplates[id].sample as Record<string, unknown>;

/** Todas las variantes que vale la pena revisar visualmente. */
export const PREVIEWS: Preview[] = [
  { id: 'welcome', template: 'welcome', category: 'TRANSACTIONAL', label: 'Bienvenida', data: sample('welcome') },
  { id: 'verify-email', template: 'verify-email', category: 'TRANSACTIONAL', label: 'Verificar email', data: sample('verify-email') },
  { id: 'password-reset', template: 'password-reset', category: 'SECURITY', label: 'Restablecer contraseña', data: sample('password-reset') },
  { id: 'security-new-sign-in', template: 'security-alert', category: 'SECURITY', label: 'Alerta: nuevo inicio de sesión', data: sample('security-alert') },
  {
    id: 'security-password-changed',
    template: 'security-alert',
    category: 'SECURITY',
    label: 'Alerta: contraseña cambiada (sin IP ni ubicación)',
    data: { kind: 'password_changed', occurredAt: '2026-09-30T22:15:00.000Z', browser: 'Chrome', os: 'Windows', deviceType: 'desktop' },
  },
  { id: 'payment-failed', template: 'account-update', category: 'TRANSACTIONAL', label: 'Pago no completado', data: sample('account-update') },
  {
    id: 'profile-updated',
    template: 'account-update',
    category: 'ACCOUNT',
    label: 'Perfil actualizado (categoría opcional: con "cancelar suscripción")',
    data: { kind: 'profile_updated', occurredAt: '2026-09-30T22:15:00.000Z', changes: ['name'] },
  },
  { id: 'order-approved', template: 'action-completed', category: 'TRANSACTIONAL', label: 'Compra aprobada (recibo)', data: sample('action-completed') },
  {
    id: 'course-completed',
    template: 'action-completed',
    category: 'ACCOUNT',
    label: 'Curso completado',
    data: { kind: 'course_completed', completedAt: '2026-09-30T22:15:00.000Z', courseTitle: 'Inglés desde Cero', courseId: 'c1', certificateCode: 'A1B2C3D4E5F6' },
  },
];

export function renderPreview(id: string, locale: Locale, name: string | null = 'Santiago Delgado') {
  const p = PREVIEWS.find((x) => x.id === id);
  if (!p) return null;
  return emailChannel.render({ template: p.template, category: p.category, userId: 'preview-user', payload: { locale, name, data: p.data } });
}

/** Solo desarrollo: /api/dev/emails lista todas las plantillas; /api/dev/emails/:id las renderiza. */
export const emailPreviewRoutes = Router()
  .use((_req, res, next) => {
    // El HTML del email usa estilos inline e imágenes del frontend
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");
    next();
  })
  .get('/', (_req, res) => {
    const rows = PREVIEWS.map(
      (p) =>
        `<tr><td style="padding:8px 16px 8px 0">${esc(p.label)}<br><small style="color:#64748b">${esc(p.template)} · ${p.category}</small></td>` +
        `<td><a href="emails/${p.id}?locale=es">ES</a> · <a href="emails/${p.id}?locale=en">EN</a> · <a href="emails/${p.id}?locale=es&format=text">texto</a> · <a href="emails/${p.id}?locale=es&name=">sin nombre</a></td></tr>`,
    ).join('');
    res.type('html').send(
      `<!doctype html><meta charset="utf-8"><title>Emails</title><body style="font-family:system-ui;padding:32px;max-width:900px"><h1>Vista previa de emails</h1><table>${rows}</table></body>`,
    );
  })
  .get('/:id', (req, res) => {
    const locale: Locale = req.query.locale === 'en' ? 'en' : 'es';
    const name = typeof req.query.name === 'string' ? req.query.name || null : 'Santiago Delgado';
    const email = renderPreview(req.params.id, locale, name);
    if (!email) {
      res.status(404).send('No existe');
      return;
    }
    if (req.query.format === 'text') {
      res.type('text/plain').send(`Subject: ${email.subject}\nPreheader: ${email.preheader}\n\n${email.text}`);
      return;
    }
    res.type('html').send(email.html);
  });
