import { env } from '../config/env.js';
import { formatCOP } from '../utils/money.js';

type Mail = { to: string; subject: string; html: string };

export async function sendEmail(mail: Mail) {
  if (!env.RESEND_API_KEY) {
    console.info(`📧 [email simulado] Para: ${mail.to} | Asunto: ${mail.subject}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, ...mail }),
  });
  if (!res.ok) console.error('Error enviando email', res.status, await res.text());
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function purchaseConfirmationEmail(p: {
  name: string;
  courseTitle: string;
  courseSlug: string;
  totalCOP: number;
  reference: string;
}) {
  const url = `${env.CLIENT_URL}/aprender/${p.courseSlug}`;
  return {
    subject: `¡Tu inscripción a ${p.courseTitle} está lista! 🎉`,
    html: `
<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0f172a">
  <h1 style="color:#4f46e5">¡Hola ${escape(p.name)}!</h1>
  <p>Tu pago fue aprobado y ya tienes acceso a <strong>${escape(p.courseTitle)}</strong>.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:6px 0;color:#64748b">Referencia</td><td style="text-align:right">${escape(p.reference)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Total pagado</td><td style="text-align:right"><strong>${formatCOP(p.totalCOP)}</strong></td></tr>
  </table>
  <a href="${url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Empezar ahora</a>
  <p style="color:#64748b;font-size:13px;margin-top:24px">Tienes 7 días de garantía de devolución. Si necesitas ayuda, responde este correo.</p>
</div>`,
  };
}
