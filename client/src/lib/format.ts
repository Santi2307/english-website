const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const formatCOP = (n: number) => cop.format(n);

/**
 * Precio con la moneda explícita, sin ambigüedad: "COP $249.000", "USD $29.99", "EUR €29.99".
 * Cada moneda con sus decimales y separadores habituales.
 */
export function formatMoney(n: number, currency = 'COP') {
  const lang = currency === 'COP' ? 'es-CO' : currency === 'EUR' ? 'de-DE' : 'en-US';
  const amount = new Intl.NumberFormat(lang, { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: currency === 'COP' ? 0 : 2 }).format(n);
  return `${currency} ${amount.replace(/\s/g, '')}`;
}

export const discountPct = (price: number, compareAt: number | null) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
