export const toCents = (cop: number) => Math.round(cop * 100);

export const formatCOP = (cop: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cop);
