import { describe, expect, it } from 'vitest';
import { emailTemplates, getEmailTemplate } from '../templates/index.js';
import { safeUrl } from '../templates/components.js';
import type { TemplateContext } from '../templates/types.js';
import type { Locale, NotificationCategory } from '../types.js';

const ctx = (over: Partial<TemplateContext> = {}): TemplateContext => ({
  locale: 'es',
  name: 'Santiago Delgado',
  category: 'TRANSACTIONAL',
  preferencesUrl: 'https://app.test/mi-cuenta/ajustes#notificaciones',
  ...over,
});

describe('plantillas de email', () => {
  const ids = Object.keys(emailTemplates);

  it.each(ids.flatMap((id) => (['es', 'en'] as Locale[]).map((l) => [id, l] as const)))(
    '%s (%s) renderiza subject, preheader, HTML y texto',
    (id, locale) => {
      const t = getEmailTemplate(id);
      const r = t.render(t.sample, ctx({ locale }));
      expect(r.subject.length).toBeGreaterThan(5);
      expect(r.preheader.length).toBeGreaterThan(5);
      expect(r.html).toMatch(/^<!DOCTYPE html>/);
      expect(r.html).toContain(`lang="${locale}"`);
      expect(r.html).toContain(r.preheader.replace(/'/g, '&#39;'));
      expect(r.text).not.toMatch(/<[a-z][^>]*>/i);
      expect(r.html).not.toContain('undefined');
      expect(r.text).not.toContain('undefined');
      expect(r.html).not.toContain('[object Object]');
    },
  );

  it('usa el primer nombre en el saludo', () => {
    const r = getEmailTemplate('welcome').render({ emailVerified: true }, ctx());
    expect(r.text).toContain('Hola, Santiago:');
    expect(getEmailTemplate('welcome').render({ emailVerified: true }, ctx({ locale: 'en' })).text).toContain('Hi Santiago,');
  });

  it('funciona sin nombre (saludo genérico, sin "null")', () => {
    for (const name of [null, undefined, '', '   ']) {
      const r = getEmailTemplate('welcome').render({ emailVerified: true }, ctx({ name }));
      expect(r.text).toContain('Hola:');
      expect(r.html).not.toMatch(/null|undefined/);
    }
  });

  it('escapa HTML del nombre y de datos dinámicos (no hay XSS)', () => {
    const evil = '<script>alert(1)</script>';
    const r = getEmailTemplate('action-completed').render(
      { kind: 'order_approved', completedAt: new Date().toISOString(), reference: 'R-1', courseTitle: evil, courseSlug: 'x', totalCOP: 1000 },
      ctx({ name: `<img src=x onerror=alert(1)>` }),
    );
    expect(r.html).not.toContain('<script>');
    expect(r.html).not.toContain('<img src=x');
    expect(r.html).toContain('&lt;script&gt;');
  });

  it('omite filas sin datos en la alerta de seguridad', () => {
    const r = getEmailTemplate('security-alert').render(
      { kind: 'password_changed', occurredAt: '2026-09-30T22:15:00Z' },
      ctx({ category: 'SECURITY' }),
    );
    expect(r.text).toContain('Fecha y hora:');
    expect(r.text).not.toContain('Dirección IP');
    expect(r.text).not.toContain('Ubicación');
  });

  it('incluye IP, dispositivo y ubicación cuando existen', () => {
    const t = getEmailTemplate('security-alert');
    const r = t.render(t.sample, ctx({ category: 'SECURITY' }));
    expect(r.text).toContain('181.49.12.34');
    expect(r.text).toContain('Celular · Safari en iOS');
    expect(r.text).toContain('Medellín, CO');
    expect(r.html).toContain('Proteger mi cuenta');
  });

  it('genera links absolutos dentro de CLIENT_URL', () => {
    const r = getEmailTemplate('action-completed').render(getEmailTemplate('action-completed').sample, ctx());
    expect(r.html).toContain('href="https://app.test/aprender/conversacion-fluida"');
    expect(r.text).toContain('https://app.test/aprender/conversacion-fluida');
  });

  it('verificación: botón, link alternativo y expiración', () => {
    const url = 'https://app.test/verificar-email?token=abc123';
    const r = getEmailTemplate('verify-email').render({ verifyUrl: url, expiresInHours: 24 }, ctx());
    expect(r.html.match(/verificar-email\?token=abc123/g)?.length).toBeGreaterThanOrEqual(2); // botón + fallback
    expect(r.html).toContain('¿El botón no funciona?');
    expect(r.text).toContain('vence en 24 horas');
  });

  it('rechaza URLs peligrosas', () => {
    expect(() => safeUrl('javascript:alert(1)')).toThrow();
    expect(() =>
      getEmailTemplate('verify-email').render({ verifyUrl: 'javascript:alert(1)', expiresInHours: 1 }, ctx()),
    ).toThrow();
  });

  it('muestra "cancelar suscripción" solo en categorías opcionales', () => {
    const unsub = 'https://app.test/preferencias/baja?token=t';
    const render = (category: NotificationCategory) =>
      getEmailTemplate('account-update').render(getEmailTemplate('account-update').sample, ctx({ category, unsubscribeUrl: unsub }));
    expect(render('ACCOUNT').html).toContain('Cancelar suscripción');
    expect(render('SECURITY').html).not.toContain('Cancelar suscripción');
    expect(render('TRANSACTIONAL').html).not.toContain('Cancelar suscripción');
    expect(render('SECURITY').html).toContain('Preferencias de email');
  });

  it('el estado no depende solo del color (ícono + texto)', () => {
    const r = getEmailTemplate('account-update').render(getEmailTemplate('account-update').sample, ctx());
    expect(r.html).toMatch(/✕&nbsp;Rechazado/);
  });

  it('incluye soporte de modo oscuro y ancho máximo de 600px', () => {
    const r = getEmailTemplate('welcome').render({ emailVerified: true }, ctx());
    expect(r.html).toContain('prefers-color-scheme: dark');
    expect(r.html).toContain('<meta name="color-scheme" content="light dark">');
    expect(r.html).toContain('max-width:600px');
    expect(r.html).toContain('alt=""'); // logo decorativo; el nombre va en texto
  });
});
