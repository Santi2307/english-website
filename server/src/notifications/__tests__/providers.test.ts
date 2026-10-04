import { describe, expect, it, vi } from 'vitest';
import { ResendEmailProvider } from '../providers/resend.provider.js';
import { SandboxEmailProvider } from '../providers/sandbox.provider.js';
import { BrevoEmailProvider, parseAddress } from '../providers/brevo.provider.js';
import { parseBrevoEvent, verifyBrevoToken } from '../providers/brevo.webhook.js';
import { DeliveryError } from '../types.js';
import { FakeEmailProvider } from './helpers.js';

const email = { to: 'a@b.co', from: 'x@app.test', subject: 's', html: '<p>h</p>', text: 'h', idempotencyKey: 'K1' };
const response = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

describe('ResendEmailProvider', () => {
  it('envía y devuelve el id del mensaje, con clave de idempotencia', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200, { id: 're_123' }));
    const p = new ResendEmailProvider('re_key', fetchMock);
    await expect(p.send(email)).resolves.toEqual({ messageId: 're_123' });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['Idempotency-Key']).toBe('K1');
    expect(init.headers.Authorization).toBe('Bearer re_key');
    expect(JSON.parse(init.body).to).toEqual(['a@b.co']);
  });

  it.each([
    [429, true],
    [500, true],
    [503, true],
    [422, false],
    [403, false],
    [401, false],
  ])('HTTP %i → retryable=%s', async (status, retryable) => {
    const p = new ResendEmailProvider('k', vi.fn().mockResolvedValue(response(status, { name: 'err', message: 'x' })));
    const err = await p.send(email).catch((e) => e);
    expect(err).toBeInstanceOf(DeliveryError);
    expect(err.retryable).toBe(retryable);
  });

  it('error de red / timeout es temporal', async () => {
    const p = new ResendEmailProvider('k', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const err = await p.send(email).catch((e) => e);
    expect(err.retryable).toBe(true);
  });
});

describe('SandboxEmailProvider', () => {
  it('solo los destinatarios autorizados llegan al proveedor real', async () => {
    const real = new FakeEmailProvider();
    const preview = new FakeEmailProvider();
    const p = new SandboxEmailProvider(real, preview, ['yo@gmail.com']);
    await p.send({ ...email, to: 'YO@gmail.com' });
    await p.send({ ...email, to: 'cliente-real@empresa.co' });
    expect(real.sent.map((m) => m.to)).toEqual(['YO@gmail.com']);
    expect(preview.sent.map((m) => m.to)).toEqual(['cliente-real@empresa.co']);
  });
});

describe('BrevoEmailProvider', () => {
  it('envía con el formato de la API de Brevo y normaliza el message-id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(201, { messageId: '<20261001.123@smtp-relay.mailin.fr>' }));
    const p = new BrevoEmailProvider('xkeysib-test', fetchMock);
    const res = await p.send({ ...email, from: 'English Academy <hola@gmail.com>', replyTo: 'soporte@gmail.com', tags: { template: 'welcome', category: 'TRANSACTIONAL' } });
    expect(res).toEqual({ messageId: '20261001.123@smtp-relay.mailin.fr' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(init.headers['api-key']).toBe('xkeysib-test');
    const body = JSON.parse(init.body);
    expect(body.sender).toEqual({ name: 'English Academy', email: 'hola@gmail.com' });
    expect(body.to).toEqual([{ email: 'a@b.co' }]);
    expect(body.replyTo).toEqual({ email: 'soporte@gmail.com' });
    expect(body).toMatchObject({ subject: 's', htmlContent: '<p>h</p>', textContent: 'h', tags: ['welcome', 'TRANSACTIONAL'] });
  });

  it.each([
    [429, true],
    [502, true],
    [400, false],
    [401, false],
    [402, false],
  ])('HTTP %i → retryable=%s', async (status, retryable) => {
    const p = new BrevoEmailProvider('k', vi.fn().mockResolvedValue(response(status, { code: 'x', message: 'y' })));
    const err = await p.send(email).catch((e) => e);
    expect(err).toBeInstanceOf(DeliveryError);
    expect(err.retryable).toBe(retryable);
  });

  it('parsea direcciones con y sin nombre', () => {
    expect(parseAddress('English Academy <hola@x.co>')).toEqual({ name: 'English Academy', email: 'hola@x.co' });
    expect(parseAddress('"Equipo" <a@x.co>')).toEqual({ name: 'Equipo', email: 'a@x.co' });
    expect(parseAddress('a@x.co')).toEqual({ email: 'a@x.co' });
  });
});

describe('webhook de Brevo', () => {
  it('mapea eventos a estados y normaliza el message-id', () => {
    expect(parseBrevoEvent({ event: 'delivered', 'message-id': '<1.2@relay>', ts_epoch: 1_790_000_000_000 })).toEqual({
      status: 'DELIVERED',
      messageId: '1.2@relay',
      at: new Date(1_790_000_000_000),
    });
    expect(parseBrevoEvent({ event: 'hard_bounce', 'message-id': '1.2@relay' })?.status).toBe('BOUNCED');
    expect(parseBrevoEvent({ event: 'opened', 'message-id': '1.2@relay' })).toBeNull();
  });

  it('exige el token secreto', () => {
    expect(verifyBrevoToken('secreto-largo', 'secreto-largo')).toBe(true);
    expect(verifyBrevoToken('otro-secreto!', 'secreto-largo')).toBe(false);
    expect(verifyBrevoToken(undefined, 'secreto-largo')).toBe(false);
    expect(verifyBrevoToken('', '')).toBe(false);
  });
});
