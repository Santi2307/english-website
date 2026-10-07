import { useEffect, useState } from 'react';
import type { Locale } from './useLocale';
import { FIELD_ORDER, initialBilling, loadDraft, saveDraft, validateAll, validateField, type Billing, type Field } from '@/lib/checkoutForm';

/**
 * Estado del formulario de facturación: valores, campos tocados, errores
 * progresivos y borrador en sessionStorage (para no perder nada si el pago falla).
 */
export function useBillingForm({ userId, name, saved, locale }: { userId: string; name: string; saved: Partial<Billing> | null; locale: Locale }) {
  const [billing, setBilling] = useState<Billing>(() => initialBilling(name, saved, loadDraft(userId)));
  const [touched, setTouched] = useState<Set<Field>>(() => new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => saveDraft(userId, billing), [userId, billing]);

  const errorOf = (f: Field) => (touched.has(f) || showAll ? validateField(f, billing, locale) : null);
  const doneOf = (f: Field) => touched.has(f) && !!billing[f].trim() && !validateField(f, billing, locale);

  /** Props listas para un TextField: valor, cambio, blur, error y "completado". */
  const field = (f: Field) => ({
    name: f,
    value: billing[f],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBilling((b) => ({ ...b, [f]: e.target.value })),
    onBlur: () => setTouched((t) => (t.has(f) ? t : new Set(t).add(f))),
    error: errorOf(f),
    done: doneOf(f),
  });

  /** Al cambiar de país, región y código postal dejan de aplicar (otro formato). */
  const setCountry = (code: string) =>
    setBilling((b) => (b.country === code ? b : { ...b, country: code, region: '', postalCode: '' }));

  /** Valida todo y devuelve el primer campo con error (para darle foco), o null. */
  const validate = (): Field | null => {
    const errors = validateAll(billing, locale);
    const first = FIELD_ORDER.find((f) => errors[f]) ?? null;
    if (first) setShowAll(true);
    return first;
  };

  const hasErrors = showAll && Object.keys(validateAll(billing, locale)).length > 0;

  return { billing, field, setCountry, validate, hasErrors };
}

export type BillingForm = ReturnType<typeof useBillingForm>;
