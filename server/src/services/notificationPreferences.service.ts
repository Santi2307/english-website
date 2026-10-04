import type { NotificationCategory } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { CATEGORY_PREFERENCE, DEFAULT_PREFERENCES, type PreferenceKey } from '../notifications/preferences.js';
import { verifyUnsubscribeToken } from '../notifications/unsubscribe.js';
import { badRequest } from '../utils/httpError.js';

export type PreferencesUpdate = Partial<Record<PreferenceKey, boolean>>;

/** Vista para la UI: incluye las categorías bloqueadas para que el usuario entienda por qué siempre llegan. */
export async function getPreferences(userId: string) {
  const p = (await prisma.notificationPreference.findUnique({ where: { userId } })) ?? DEFAULT_PREFERENCES;
  return {
    security: { enabled: true, locked: true },
    transactional: { enabled: true, locked: true },
    accountUpdates: { enabled: p.accountUpdates, locked: false },
    productUpdates: { enabled: p.productUpdates, locked: false },
    tips: { enabled: p.tips, locked: false },
    marketing: { enabled: p.marketing && !!p.marketingConsentAt, locked: false, consentAt: p.marketingConsentAt },
  };
}

function toData(update: PreferencesUpdate) {
  return {
    ...update,
    // Activar marketing registra el consentimiento con fecha; desactivarlo lo revoca
    ...(update.marketing === true && { marketingConsentAt: new Date() }),
    ...(update.marketing === false && { marketingConsentAt: null }),
  };
}

export async function updatePreferences(userId: string, update: PreferencesUpdate) {
  const data = toData(update);
  await prisma.notificationPreference.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  return getPreferences(userId);
}

/** Baja de una categoría desde el link del email (sin sesión). */
export async function unsubscribe(token: string) {
  const parsed = verifyUnsubscribeToken(token);
  if (!parsed) throw badRequest('El enlace para cancelar la suscripción no es válido');
  const key = CATEGORY_PREFERENCE[parsed.category as NotificationCategory]!;
  const exists = await prisma.user.findUnique({ where: { id: parsed.userId }, select: { id: true } });
  if (!exists) throw badRequest('El enlace para cancelar la suscripción no es válido');
  await updatePreferences(parsed.userId, { [key]: false });
  return { category: parsed.category, preference: key };
}
