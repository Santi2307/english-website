import type { NotificationCategory } from './types.js';

export type Preferences = {
  accountUpdates: boolean;
  productUpdates: boolean;
  tips: boolean;
  marketing: boolean;
  marketingConsentAt: Date | null;
};

export type PreferenceKey = 'accountUpdates' | 'productUpdates' | 'tips' | 'marketing';

export const DEFAULT_PREFERENCES: Preferences = {
  accountUpdates: true,
  productUpdates: true,
  tips: true,
  marketing: false,
  marketingConsentAt: null,
};

/**
 * Qué preferencia controla cada categoría. `null` = no se puede desactivar:
 * seguridad y transaccionales (verificación, recibos) protegen la cuenta.
 */
export const CATEGORY_PREFERENCE: Record<NotificationCategory, PreferenceKey | null> = {
  SECURITY: null,
  TRANSACTIONAL: null,
  ACCOUNT: 'accountUpdates',
  PRODUCT_UPDATES: 'productUpdates',
  TIPS: 'tips',
  MARKETING: 'marketing',
};

export const OPTIONAL_CATEGORIES = (Object.keys(CATEGORY_PREFERENCE) as NotificationCategory[]).filter(
  (c) => CATEGORY_PREFERENCE[c] !== null,
);

export function isCategoryAllowed(category: NotificationCategory, prefs: Preferences) {
  const key = CATEGORY_PREFERENCE[category];
  if (key === null) return true;
  // Marketing exige consentimiento explícito registrado, además del switch
  if (category === 'MARKETING') return prefs.marketing && prefs.marketingConsentAt !== null;
  return prefs[key];
}
