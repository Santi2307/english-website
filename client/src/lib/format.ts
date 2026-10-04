const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const formatCOP = (n: number) => cop.format(n);

export const discountPct = (price: number, compareAt: number | null) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
