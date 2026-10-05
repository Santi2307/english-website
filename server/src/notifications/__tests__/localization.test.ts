import { describe, expect, it } from 'vitest';
import type { Request } from 'express';
import { formatDateTime } from '../templates/components.js';
import { notificationRules } from '../rules.js';
import { requestContext } from '../../utils/requestContext.js';
import type { AppEvent } from '../events.js';

const AT = '2026-10-05T19:31:00.000Z';

describe('fechas en la hora local del destinatario', () => {
  it('usa la zona del usuario, con su nombre y desfase (incluye medias horas)', () => {
    const s = formatDateTime(AT, 'es', 'Asia/Kabul');
    expect(s).toContain('6 de octubre de 2026'); // 19:31 UTC = 00:01 del día siguiente en Kabul
    expect(s).toContain('12:01');
    expect(s).toContain('GMT+4:30');
    expect(s).toMatch(/Afganist[aá]n/);
  });

  it('formatea en inglés cuando el usuario usa la web en inglés', () => {
    const s = formatDateTime(AT, 'en', 'America/New_York');
    expect(s).toContain('October 5, 2026');
    expect(s).toContain('3:31');
    expect(s).toContain('GMT-4');
  });

  it('sin zona válida, cae a la hora de Colombia', () => {
    for (const tz of [undefined, null, 'Not/AZone']) {
      const s = formatDateTime(AT, 'es', tz);
      expect(s).toContain('2:31');
      expect(s).toContain('GMT-5');
    }
  });
});

describe('idioma y zona de los emails', () => {
  const reset = notificationRules.find((r) => r.event === 'PASSWORD_RESET_REQUESTED')!;
  const event = (context: object) =>
    ({
      type: 'PASSWORD_RESET_REQUESTED',
      id: 't1',
      occurredAt: new Date(AT),
      payload: {
        user: { id: 'u1', email: 'a@b.co', name: 'Ana', locale: 'es', timeZone: 'America/Bogota' },
        resetUrl: 'https://x.co/r?token=1',
        expiresAt: new Date(Date.parse(AT) + 30 * 60_000),
        context,
      },
    }) as unknown as AppEvent;

  it('prefiere el idioma y la zona de la petición sobre los guardados en la cuenta', () => {
    const e = event({ locale: 'en', timeZone: 'Asia/Kabul' });
    const out = reset.build(e.payload as never, e as never)!;
    expect(out.recipient.locale).toBe('en');
    expect(out.recipient.timeZone).toBe('Asia/Kabul');
  });

  it('sin datos de la petición, usa los de la cuenta', () => {
    const e = event({});
    const out = reset.build(e.payload as never, e as never)!;
    expect(out.recipient.locale).toBe('es');
    expect(out.recipient.timeZone).toBe('America/Bogota');
  });
});

describe('requestContext', () => {
  const req = (headers: Record<string, string>, accepts: string | false = false) =>
    ({
      ip: '203.0.113.7',
      get: (h: string) => headers[h.toLowerCase()],
      acceptsLanguages: () => accepts,
    }) as unknown as Request;

  it('lee idioma y zona enviados por la web', () => {
    const ctx = requestContext(req({ 'x-client-locale': 'en', 'x-client-timezone': 'Asia/Kabul' }));
    expect(ctx).toMatchObject({ ip: '203.0.113.7', locale: 'en', timeZone: 'Asia/Kabul' });
  });

  it('ignora valores inválidos y usa Accept-Language como respaldo', () => {
    const ctx = requestContext(req({ 'x-client-locale': 'fr', 'x-client-timezone': '<script>' }, 'en'));
    expect(ctx.locale).toBe('en');
    expect(ctx.timeZone).toBeUndefined();
  });
});
