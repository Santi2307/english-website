import { describe, expect, it, vi } from 'vitest';
import { ResendEmailProvider } from '../providers/resend.provider.js';
import { SandboxEmailProvider } from '../providers/sandbox.provider.js';
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
