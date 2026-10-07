import type { Locale } from '@/hooks/useLocale';
import { CK } from '@/data/checkout';
import { POSTAL, REGION_REQUIRED, guessCountry } from './countries';

/**
 * Datos de facturación del checkout. Solo información no sensible: la tarjeta la
 * captura el Payment Element de Stripe. El mismo formato valida el servidor.
 * No pedimos teléfono: ningún paso del pago ni del producto lo necesita.
 */
export type Billing = {
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
};

export type Field = keyof Billing;

/** Orden de los campos en pantalla: el primero con error recibe el foco. */
export const FIELD_ORDER: Field[] = ['firstName', 'lastName', 'country', 'address1', 'address2', 'city', 'region', 'postalCode'];

const blank = (s: string) => !s.trim();

const EMPTY: Billing = { firstName: '', lastName: '', country: 'US', region: '', city: '', address1: '', address2: '', postalCode: '' };

/** Solo los campos conocidos y como texto (los borradores viejos podían traer otros). */
function pick(o: Partial<Record<string, unknown>>): Partial<Billing> {
  const out: Partial<Billing> = {};
  for (const k of Object.keys(EMPTY) as Field[]) if (typeof o[k] === 'string') out[k] = o[k] as string;
  return out;
}

export function validateField(f: Field, b: Billing, locale: Locale): string | null {
  const e = CK.err;
  switch (f) {
    case 'firstName':
      return blank(b.firstName) ? e.firstName[locale] : null;
    case 'lastName':
      return blank(b.lastName) ? e.lastName[locale] : null;
    case 'address1':
      return blank(b.address1) ? e.address1[locale] : null;
    case 'city':
      return blank(b.city) ? e.city[locale] : null;
    case 'region':
      return REGION_REQUIRED.has(b.country) && blank(b.region) ? e.region[locale] : null;
    case 'postalCode': {
      const rule = POSTAL[b.country];
      const v = b.postalCode.trim();
      if (rule?.required && !v) return e.postal[locale];
      if (rule && v && !rule.pattern.test(v)) return e.postal[locale];
      return v.length > 12 ? e.postal[locale] : null;
    }
    default:
      return null;
  }
}

export function validateAll(b: Billing, locale: Locale) {
  const errors: Partial<Record<Field, string>> = {};
  for (const f of FIELD_ORDER) {
    const err = validateField(f, b, locale);
    if (err) errors[f] = err;
  }
  return errors;
}

/** Lo que se envía al servidor: sin espacios sobrantes y sin campos vacíos opcionales. */
export function toPayload(b: Billing) {
  const t = (s: string) => s.trim();
  return {
    firstName: t(b.firstName),
    lastName: t(b.lastName),
    country: b.country,
    region: t(b.region) || undefined,
    city: t(b.city),
    address1: t(b.address1),
    address2: t(b.address2) || undefined,
    postalCode: t(b.postalCode).toUpperCase() || undefined,
  };
}

// ─── Borrador ────────────────────────────────────────────────────────────────
// Si el pago falla o se cierra la ventana, el formulario vuelve lleno. Se guarda
// en sessionStorage (solo esta pestaña) y solo con datos no sensibles.
const key = (userId: string) => `ea_checkout_${userId}`;

export function loadDraft(userId: string): Billing | null {
  try {
    const raw = sessionStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as Billing) : null;
  } catch {
    return null;
  }
}

export function saveDraft(userId: string, b: Billing) {
  try {
    sessionStorage.setItem(key(userId), JSON.stringify(b));
  } catch {
    /* sin storage: el formulario funciona igual */
  }
}

export function clearDraft(userId: string) {
  try {
    sessionStorage.removeItem(key(userId));
  } catch {
    /* sin storage */
  }
}

/** Valores iniciales: borrador > última compra > nombre de la cuenta. Nunca se pide dos veces. */
export function initialBilling(name: string, saved?: Partial<Billing> | null, draft?: Partial<Billing> | null): Billing {
  if (draft?.country) return { ...EMPTY, ...pick(draft) };
  const [first, ...rest] = name.trim().split(/\s+/);
  saved = saved ? pick(saved) : null;
  const country = saved?.country ?? guessCountry();
  return {
    firstName: saved?.firstName ?? first ?? '',
    lastName: saved?.lastName ?? rest.join(' '),
    country,
    region: saved?.region ?? '',
    city: saved?.city ?? '',
    address1: saved?.address1 ?? '',
    address2: saved?.address2 ?? '',
    postalCode: saved?.postalCode ?? '',
  };
}
