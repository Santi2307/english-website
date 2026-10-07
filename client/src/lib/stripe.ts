import { loadStripe, type Appearance, type Stripe, type StripeElementsOptions } from '@stripe/stripe-js';

/**
 * Stripe.js se carga solo en el checkout (no en el resto del sitio) y una sola vez.
 * La llave pública llega del backend (/orders/checkout-config): no hay que
 * configurarla en el frontend ni en Vercel.
 */
const cache = new Map<string, Promise<Stripe | null>>();
export const getStripe = (publishableKey: string) => {
  let p = cache.get(publishableKey);
  if (!p) {
    p = loadStripe(publishableKey);
    cache.set(publishableKey, p);
  }
  return p;
};

/** Los campos de Stripe con el mismo lenguaje visual que el resto del checkout. */
export const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSizeBase: '16px',
    colorPrimary: '#191815',
    colorText: '#191815',
    colorTextSecondary: '#56554f',
    colorTextPlaceholder: '#a2a19b',
    colorBackground: '#ffffff',
    colorDanger: '#be123c',
    borderRadius: '10px',
    spacingUnit: '4px',
    focusBoxShadow: '0 0 0 4px rgba(25, 24, 21, 0.06)',
  },
  rules: {
    '.Label': { fontSize: '14px', fontWeight: '500', color: '#292824', marginBottom: '6px' },
    '.Input': { border: '1px solid #d4d3ce', boxShadow: 'none', padding: '13px 14px' },
    '.Input:hover': { borderColor: '#a2a19b' },
    '.Input:focus': { borderColor: '#191815', boxShadow: '0 0 0 4px rgba(25, 24, 21, 0.06)' },
    '.Input--invalid': { borderColor: '#f43f5e', boxShadow: 'none' },
    '.Error': { fontSize: '14px', color: '#be123c' },
    '.Tab': { border: '1px solid #e6e5e1', boxShadow: 'none' },
    '.Tab--selected': { borderColor: '#191815', boxShadow: 'none' },
  },
};

export const FONTS: StripeElementsOptions['fonts'] = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap' },
];
