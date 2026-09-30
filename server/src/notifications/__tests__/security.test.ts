import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createUnsubscribeToken, verifyUnsubscribeToken } from '../unsubscribe.js';
import { isCategoryAllowed, DEFAULT_PREFERENCES } from '../preferences.js';
import { verifyResendSignature } from '../providers/resend.webhook.js';
import { parseUserAgent } from '../../utils/userAgent.js';

describe('tokens de baja', () => {
  it('ida y vuelta para una categoría opcional', () => {
    const token = createUnsubscribeToken('user_1', 'MARKETING');
    expect(verifyUnsubscribeToken(token)).toEqual({ userId: 'user_1', category: 'MARKETING' });
  });

  it('rechaza tokens alterados', () => {
    const token = createUnsubscribeToken('user_1', 'TIPS');
    const decoded = Buffer.from(token, 'base64url').toString();
    const forged = Buffer.from(decoded.replace('user_1', 'user_2')).toString('base64url');
    expect(verifyUnsubscribeToken(forged)).toBeNull();
    expect(verifyUnsubscribeToken('basura')).toBeNull();
  });

  it('nunca permite darse de baja de seguridad o transaccionales', () => {
    expect(verifyUnsubscribeToken(createUnsubscribeToken('user_1', 'SECURITY'))).toBeNull();
    expect(verifyUnsubscribeToken(createUnsubscribeToken('user_1', 'TRANSACTIONAL'))).toBeNull();
  });
});

describe('política de preferencias', () => {
  it('marketing exige switch activo y consentimiento registrado', () => {
    expect(isCategoryAllowed('MARKETING', DEFAULT_PREFERENCES)).toBe(false);
    expect(isCategoryAllowed('MARKETING', { ...DEFAULT_PREFERENCES, marketing: true })).toBe(false);
    expect(isCategoryAllowed('MARKETING', { ...DEFAULT_PREFERENCES, marketing: true, marketingConsentAt: new Date() })).toBe(true);
  });

  it('seguridad y transaccionales no se pueden bloquear', () => {
    const off = { accountUpdates: false, productUpdates: false, tips: false, marketing: false, marketingConsentAt: null };
    expect(isCategoryAllowed('SECURITY', off)).toBe(true);
    expect(isCategoryAllowed('TRANSACTIONAL', off)).toBe(true);
    expect(isCategoryAllowed('ACCOUNT', off)).toBe(false);
  });
});

describe('firma del webhook de Resend (Svix)', () => {
  const secret = `whsec_${Buffer.from('super-secret-key').toString('base64')}`;
  const body = '{"type":"email.delivered","data":{"email_id":"abc"}}';
  const sign = (id: string, ts: number, b: string) =>
    crypto.createHmac('sha256', Buffer.from('super-secret-key')).update(`${id}.${ts}.${b}`).digest('base64');

  it('acepta una firma válida', () => {
    const ts = 1_790_000_000;
    expect(verifyResendSignature(body, { id: 'msg_1', timestamp: String(ts), signature: `v1,${sign('msg_1', ts, body)}` }, secret, ts)).toBe(true);
  });

  it('rechaza cuerpo alterado, firma falsa o timestamp viejo', () => {
    const ts = 1_790_000_000;
    const sig = `v1,${sign('msg_1', ts, body)}`;
    expect(verifyResendSignature(body.replace('abc', 'xyz'), { id: 'msg_1', timestamp: String(ts), signature: sig }, secret, ts)).toBe(false);
    expect(verifyResendSignature(body, { id: 'msg_1', timestamp: String(ts), signature: 'v1,AAAA' }, secret, ts)).toBe(false);
    expect(verifyResendSignature(body, { id: 'msg_1', timestamp: String(ts), signature: sig }, secret, ts + 3600)).toBe(false);
    expect(verifyResendSignature(body, { id: 'msg_1', timestamp: String(ts), signature: sig }, '', ts)).toBe(false);
  });
});

describe('parseUserAgent', () => {
  it.each([
    ['Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36', 'Chrome', 'Android', 'mobile'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 Edg/128.0', 'Edge', 'Windows', 'desktop'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15', 'Safari', 'macOS', 'desktop'],
    ['Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0 Mobile/15E148 Safari/604.1', 'Chrome', 'iOS', 'tablet'],
  ])('%#', (ua, browser, os, deviceType) => {
    expect(parseUserAgent(ua)).toEqual({ browser, os, deviceType });
  });

  it('sin user-agent devuelve nulos', () => {
    expect(parseUserAgent(undefined)).toEqual({ browser: null, os: null, deviceType: null });
  });
});
