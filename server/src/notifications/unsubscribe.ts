import crypto from 'node:crypto';
import { env } from '../config/env.js';
import type { NotificationCategory } from './types.js';
import { OPTIONAL_CATEGORIES } from './preferences.js';

/**
 * Tokens de "cancelar suscripción" firmados con HMAC. No expiran (un link de un
 * email viejo debe seguir funcionando) y solo permiten desactivar UNA categoría
 * opcional de UN usuario: no dan acceso a la cuenta.
 */
const key = () => crypto.createHmac('sha256', env.JWT_SECRET).update('notifications:unsubscribe:v1').digest();

const sign = (payload: string) => crypto.createHmac('sha256', key()).update(payload).digest('base64url');

export function createUnsubscribeToken(userId: string, category: NotificationCategory) {
  const payload = `${userId}.${category}`;
  return Buffer.from(`${payload}.${sign(payload)}`).toString('base64url');
}

export function verifyUnsubscribeToken(token: string): { userId: string; category: NotificationCategory } | null {
  let decoded: string;
  try {
    decoded = Buffer.from(token, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const [userId, category, sig] = decoded.split('.');
  if (!userId || !category || !sig) return null;
  const expected = sign(`${userId}.${category}`);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (!OPTIONAL_CATEGORIES.includes(category as NotificationCategory)) return null;
  return { userId, category: category as NotificationCategory };
}
