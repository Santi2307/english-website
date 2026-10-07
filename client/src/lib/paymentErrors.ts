import type { Locale } from '@/hooks/useLocale';

/**
 * Capa de traducción de errores de pago: códigos técnicos del procesador
 * (card_declined, insufficient_funds, authentication_required…) → mensajes humanos.
 * El detalle técnico se queda en los logs del servidor y en el Dashboard de Stripe.
 */
type T = Record<Locale, string>;

const GENERIC: T = {
  es: 'No pudimos procesar esta tarjeta. Prueba con otra tarjeta o contacta a tu banco.',
  en: "We couldn't process this card. Try another card or contact your bank.",
};

const MESSAGES: Record<string, T> = {
  insufficient_funds: { es: 'Esta tarjeta no tiene fondos suficientes.', en: "This card doesn't have enough available funds." },
  expired_card: { es: 'Esta tarjeta está vencida. Usa otra tarjeta.', en: 'This card has expired. Please use another card.' },
  incorrect_cvc: { es: 'El código de seguridad (CVC) no es correcto.', en: "The card's security code (CVC) is incorrect." },
  invalid_cvc: { es: 'El código de seguridad (CVC) no es correcto.', en: "The card's security code (CVC) is incorrect." },
  incorrect_number: { es: 'El número de la tarjeta no es correcto.', en: 'The card number is incorrect.' },
  invalid_number: { es: 'El número de la tarjeta no es correcto.', en: 'The card number is incorrect.' },
  invalid_expiry_month: { es: 'La fecha de vencimiento no es válida.', en: "The card's expiration date isn't valid." },
  invalid_expiry_year: { es: 'La fecha de vencimiento no es válida.', en: "The card's expiration date isn't valid." },
  incorrect_zip: { es: 'El código postal no coincide con el de tu tarjeta.', en: "The postal code doesn't match your card." },
  authentication_required: { es: 'Tu banco necesita que verifiques este pago. Intenta de nuevo y sigue sus pasos.', en: 'Your bank needs you to verify this payment. Try again and follow its steps.' },
  payment_intent_authentication_failure: { es: 'No se pudo verificar el pago con tu banco. Intenta de nuevo.', en: "Your bank couldn't verify the payment. Please try again." },
  processing_error: { es: 'Hubo un problema al procesar la tarjeta. No se hizo ningún cobro; intenta de nuevo.', en: 'There was a problem processing the card. You were not charged; please try again.' },
  card_not_supported: { es: 'Esta tarjeta no acepta este tipo de compra. Usa otra tarjeta.', en: "This card doesn't support this type of purchase. Please use another card." },
  currency_not_supported: { es: 'Esta tarjeta no acepta pagos en esta moneda. Usa otra tarjeta.', en: "This card doesn't support this currency. Please use another card." },
  lost_card: GENERIC,
  stolen_card: GENERIC,
  fraudulent: GENERIC,
  do_not_honor: GENERIC,
  generic_decline: GENERIC,
  card_declined: GENERIC,
  card_velocity_exceeded: { es: 'Esta tarjeta alcanzó su límite. Prueba con otra o contacta a tu banco.', en: 'This card has reached its limit. Try another card or contact your bank.' },
  network: {
    es: 'Perdimos la conexión mientras se procesaba el pago. No se hizo ningún cobro; intenta de nuevo.',
    en: 'We lost connection while processing your payment. Your card has not been charged. Please try again.',
  },
  server: {
    es: 'No pudimos iniciar el pago. No se hizo ningún cobro; intenta de nuevo en un momento.',
    en: "We couldn't start the payment. You were not charged; please try again in a moment.",
  },
};

export function paymentErrorMessage(code: string | null | undefined, locale: Locale): string {
  return (code && MESSAGES[code]?.[locale]) || GENERIC[locale];
}

/** Error de Stripe.js (confirmPayment / elements.submit) → código que entiende la capa de arriba. */
export function stripeErrorCode(err: { type?: string; code?: string; decline_code?: string } | undefined): string {
  if (!err) return 'unknown';
  if (err.type === 'api_connection_error') return 'network';
  if (err.type === 'api_error' || err.type === 'rate_limit_error') return 'server';
  return err.decline_code ?? err.code ?? 'unknown';
}
