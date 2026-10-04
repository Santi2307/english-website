import { beforeEach, describe, expect, it } from 'vitest';
import { EventBus } from '../events.js';
import { NotificationEngine } from '../engine.js';
import { EmailChannel } from '../channels/email.channel.js';
import { notificationRules } from '../rules.js';
import { DeliveryError } from '../types.js';
import { Clock, FakeEmailProvider, MemoryNotificationStore, silentLogger, testUser } from './helpers.js';
import { DEFAULT_PREFERENCES } from '../preferences.js';

function setup() {
  const store = new MemoryNotificationStore();
  const provider = new FakeEmailProvider();
  const clock = new Clock();
  const engine = new NotificationEngine({
    store,
    channels: [new EmailChannel(provider, { from: 'Test <hola@app.test>' })],
    rules: notificationRules,
    backoffMs: [1000, 5000],
    retryTimers: false,
    now: clock.now,
    logger: silentLogger,
  });
  const bus = new EventBus();
  bus.subscribe(engine.handle);
  const emit: EventBus['emit'] = async (...args) => {
    await bus.emit(...args);
    await engine.idle();
  };
  return { store, provider, clock, engine, emit };
}

let t: ReturnType<typeof setup>;
beforeEach(() => {
  t = setup();
});

describe('flujo evento → notificación', () => {
  it('USER_REGISTERED envía el welcome email y registra el resultado', async () => {
    await t.emit('USER_REGISTERED', { user: testUser(), method: 'password', emailVerified: false }, { id: 'user_123' });
    expect(t.provider.sent).toHaveLength(1);
    const mail = t.provider.sent[0];
    expect(mail.to).toBe('santiago@example.com');
    expect(mail.subject).toBe('Bienvenido a English Academy');
    expect(mail.idempotencyKey).toBe('USER_REGISTERED:user_123:email');
    const [n] = t.store.all();
    expect(n).toMatchObject({ status: 'SENT', provider: 'fake', providerMessageId: 'msg_1', template: 'welcome', category: 'TRANSACTIONAL', attempts: 1 });
    expect(n.sentAt).toBeInstanceOf(Date);
  });

  it('respeta el idioma del usuario', async () => {
    await t.emit('USER_REGISTERED', { user: testUser({ locale: 'en' }), method: 'google', emailVerified: true }, { id: 'u_en' });
    expect(t.provider.sent[0].subject).toBe('Welcome to English Academy');
  });

  it('eventos sin reglas no hacen nada', async () => {
    await t.emit('EMAIL_VERIFIED', { user: testUser(), verifiedAt: new Date() }, { id: 'x' });
    expect(t.store.all()).toHaveLength(0);
  });
});

describe('protección contra duplicados', () => {
  it('el mismo evento procesado 5 veces envía 1 solo email', async () => {
    const payload = { user: testUser(), method: 'password' as const, emailVerified: false };
    await Promise.all(Array.from({ length: 5 }, () => t.emit('USER_REGISTERED', payload, { id: 'user_123' })));
    expect(t.provider.sent).toHaveLength(1);
    expect(t.store.all()).toHaveLength(1);
  });

  it('dispatch repetido sobre la misma notificación no reenvía', async () => {
    await t.emit('USER_REGISTERED', { user: testUser(), method: 'password', emailVerified: true }, { id: 'user_123' });
    const [n] = t.store.all();
    await Promise.all([t.engine.dispatch(n.id), t.engine.dispatch(n.id)]);
    expect(t.provider.sent).toHaveLength(1);
  });

  it('eventos distintos del mismo usuario sí se envían', async () => {
    const base = { user: testUser(), occurredAt: new Date(), via: 'settings' as const, context: {} };
    await t.emit('PASSWORD_CHANGED', base, { id: 'user_123:v1' });
    await t.emit('PASSWORD_CHANGED', base, { id: 'user_123:v2' });
    expect(t.provider.sent).toHaveLength(2);
  });
});

describe('preferencias', () => {
  const allOff = { ...DEFAULT_PREFERENCES, accountUpdates: false, productUpdates: false, tips: false, marketing: false };

  it('categoría opcional desactivada → SKIPPED y sin envío', async () => {
    t.store.preferences.set('user_123', allOff);
    await t.emit('ACCOUNT_UPDATED', { user: testUser(), occurredAt: new Date(), changes: ['name'] }, { id: 'a1' });
    expect(t.provider.sent).toHaveLength(0);
    expect(t.store.all()[0]).toMatchObject({ status: 'SKIPPED', errorMessage: expect.stringContaining('preferencias') });
  });

  it('seguridad y transaccionales se envían aunque todo esté desactivado', async () => {
    t.store.preferences.set('user_123', allOff);
    await t.emit('NEW_SIGN_IN', { user: testUser(), occurredAt: new Date(), method: 'password', context: {} }, { id: 'd1' });
    await t.emit(
      'ORDER_APPROVED',
      { user: testUser(), orderId: 'o1', reference: 'R', courseTitle: 'C', courseSlug: 'c', totalCOP: 1000, paymentMethod: 'CARD', paidAt: new Date() },
      { id: 'o1' },
    );
    expect(t.provider.sent.map((m) => m.tags?.category)).toEqual(['SECURITY', 'TRANSACTIONAL']);
  });

  it('categorías opcionales llevan List-Unsubscribe de un clic; las críticas no', async () => {
    await t.emit('ACCOUNT_UPDATED', { user: testUser(), occurredAt: new Date(), changes: ['name'] }, { id: 'a2' });
    await t.emit('NEW_SIGN_IN', { user: testUser(), occurredAt: new Date(), method: 'password', context: {} }, { id: 'd2' });
    const [optional, security] = t.provider.sent;
    expect(optional.headers?.['List-Unsubscribe']).toMatch(/^<https:\/\/app\.test\/api\/notifications\/unsubscribe\?token=/);
    expect(optional.headers?.['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    expect(security.headers?.['List-Unsubscribe']).toBeUndefined();
  });
});

describe('datos sensibles', () => {
  it('el link con token se envía pero NO se guarda en el log', async () => {
    const verifyUrl = 'https://app.test/verificar-email?token=SECRET_TOKEN_abcdefghijklmnop';
    await t.emit('EMAIL_VERIFICATION_REQUESTED', { user: testUser(), verifyUrl, expiresAt: new Date(Date.now() + 86_400_000) }, { id: 'tok1' });
    expect(t.provider.sent[0].html).toContain('SECRET_TOKEN_abcdefghijklmnop');
    const stored = JSON.stringify(t.store.all()[0]);
    expect(stored).not.toContain('SECRET_TOKEN');
    expect(t.store.all()[0].payload.sensitiveKeys).toEqual(['verifyUrl']);
  });

  it('la IP y la ubicación no se persisten; navegador y SO sí', async () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    await t.emit('NEW_SIGN_IN', { user: testUser(), occurredAt: new Date(), method: 'password', context: { ip: '181.49.12.34', userAgent: ua, location: 'Medellín, CO' } }, { id: 'd3' });
    expect(t.provider.sent[0].text).toContain('181.49.12.34');
    const stored = JSON.stringify(t.store.all()[0]);
    expect(stored).not.toContain('181.49.12.34');
    expect(stored).not.toContain('Medellín');
    expect(t.store.all()[0].payload.data).toMatchObject({ browser: 'Safari', os: 'iOS', deviceType: 'mobile' });
  });

  it('si el dato sensible se perdió (reinicio), falla de forma segura sin enviar un link roto', async () => {
    t.provider.failNext(new DeliveryError('timeout', true));
    await t.emit('EMAIL_VERIFICATION_REQUESTED', { user: testUser(), verifyUrl: 'https://app.test/v?token=abcdefghijklmnopqrstu', expiresAt: new Date(Date.now() + 86_400_000) }, { id: 'tok2' });
    // Simula un reinicio: motor nuevo con el mismo store (sin memoria)
    const fresh = new NotificationEngine({ store: t.store, channels: [new EmailChannel(t.provider, { from: 'x@app.test' })], rules: notificationRules, retryTimers: false, now: t.clock.now, logger: silentLogger });
    t.clock.advance(60_000);
    await fresh.processDue();
    expect(t.provider.sent).toHaveLength(0);
    expect(t.store.all()[0]).toMatchObject({ status: 'FAILED', errorMessage: expect.stringContaining('sensibles') });
  });
});

describe('reintentos y errores', () => {
  const register = () => t.emit('USER_REGISTERED', { user: testUser(), method: 'password', emailVerified: true }, { id: 'user_123' });

  it('error temporal → reintento programado y luego éxito', async () => {
    t.provider.failNext(new DeliveryError('Resend 503', true, 'resend'));
    await register();
    let [n] = t.store.all();
    expect(n).toMatchObject({ status: 'QUEUED', attempts: 1, errorMessage: 'Resend 503' });

    await t.engine.processDue(); // aún no vence el backoff
    expect(t.provider.sent).toHaveLength(0);

    t.clock.advance(1000);
    await t.engine.processDue();
    [n] = t.store.all();
    expect(n).toMatchObject({ status: 'SENT', attempts: 2, errorMessage: null });
    expect(t.provider.sent).toHaveLength(1);
  });

  it('error permanente → FAILED sin reintentos', async () => {
    t.provider.failNext(new DeliveryError('Resend 422 validation_error', false, 'resend'));
    await register();
    t.clock.advance(60_000);
    await t.engine.processDue();
    expect(t.store.all()[0]).toMatchObject({ status: 'FAILED', attempts: 1 });
    expect(t.store.all()[0].failedAt).toBeInstanceOf(Date);
  });

  it('agota los intentos (1 + backoff) y marca FAILED', async () => {
    t.provider.failNext(...Array.from({ length: 5 }, () => new DeliveryError('timeout', true)));
    await register();
    for (let i = 0; i < 5; i++) {
      t.clock.advance(10_000);
      await t.engine.processDue();
    }
    expect(t.store.all()[0]).toMatchObject({ status: 'FAILED', attempts: 3 });
    expect(t.provider.sent).toHaveLength(0);
  });

  it('un error no controlado del proveedor no rompe al emisor', async () => {
    t.provider.send = async () => {
      throw new Error('boom');
    };
    await expect(register()).resolves.toBeUndefined();
    expect(t.store.all()[0].status).toBe('FAILED');
  });

  it('recupera notificaciones atascadas en PROCESSING (lease vencido)', async () => {
    const { record } = await t.store.create({
      userId: 'user_123', channel: 'email', recipient: 'santiago@example.com', eventType: 'USER_REGISTERED', eventId: 'x',
      template: 'welcome', category: 'TRANSACTIONAL', idempotencyKey: 'k', payload: { locale: 'es', name: 'S', data: { emailVerified: true } },
    });
    await t.store.claim(record.id, t.clock.now(), new Date(t.clock.now().getTime() + 1000)); // "crash" en pleno envío
    t.clock.advance(2000);
    await t.engine.processDue();
    expect(t.store.all()[0].status).toBe('SENT');
  });

  it('no envía a direcciones con rebote reciente', async () => {
    await register();
    await t.store.updateDeliveryStatus('msg_1', 'BOUNCED', t.clock.now());
    await t.emit('NEW_SIGN_IN', { user: testUser(), occurredAt: new Date(), method: 'password', context: {} }, { id: 'd9' });
    expect(t.provider.sent).toHaveLength(1);
    expect(t.store.all().at(-1)).toMatchObject({ status: 'SKIPPED', errorMessage: expect.stringContaining('rebote') });
  });
});

describe('reintentos con temporizador (sin sondear la BD)', () => {
  it('un error temporal se reintenta solo, sin processDue', async () => {
    const store = new MemoryNotificationStore();
    const provider = new FakeEmailProvider();
    const engine = new NotificationEngine({
      store,
      channels: [new EmailChannel(provider, { from: 'x@app.test' })],
      rules: notificationRules,
      backoffMs: [20],
      logger: silentLogger,
    });
    provider.failNext(new DeliveryError('timeout', true));
    await engine.handle({ type: 'USER_REGISTERED', id: 'u1', occurredAt: new Date(), payload: { user: testUser(), method: 'password', emailVerified: true } });
    await engine.idle();
    expect(store.all()[0].status).toBe('QUEUED');
    await new Promise((r) => setTimeout(r, 60));
    await engine.idle();
    expect(store.all()[0].status).toBe('SENT');
    expect(provider.sent).toHaveLength(1);
    await engine.stop();
  });
});
