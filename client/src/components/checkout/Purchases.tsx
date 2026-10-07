import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { Spinner } from '../ui/Spinner';
import type { OrderHistoryItem, OrderStatus } from '@/lib/types';

const STATUS: Record<OrderStatus, { label: Record<Locale, string>; cls: string }> = {
  APPROVED: { label: { es: 'Pagado', en: 'Paid' }, cls: 'bg-emerald-50 text-emerald-800' },
  PENDING: { label: { es: 'En proceso', en: 'Processing' }, cls: 'bg-amber-50 text-amber-800' },
  DECLINED: { label: { es: 'Rechazado', en: 'Declined' }, cls: 'bg-slate-100 text-slate-600' },
  ERROR: { label: { es: 'No completado', en: 'Not completed' }, cls: 'bg-slate-100 text-slate-600' },
  VOIDED: { label: { es: 'Reembolsado', en: 'Refunded' }, cls: 'bg-slate-100 text-slate-600' },
};

const C = {
  empty: { es: 'Todavía no tienes compras.', en: "You don't have any purchases yet." },
  paths: { es: 'Ver rutas de aprendizaje', en: 'See learning paths' },
  receipt: { es: 'Recibo', en: 'Receipt' },
  note: {
    es: 'Pagos únicos: no hay suscripción ni cobros automáticos. Nunca guardamos los datos de tu tarjeta.',
    en: 'One-time payments: no subscription and no automatic charges. We never store your card details.',
  },
};

/**
 * Historial de compras (Ajustes → Compras). Los cursos son pagos únicos, así que
 * no hay plan, renovación ni portal de facturación que administrar.
 */
export function Purchases() {
  const locale = useLocale();
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => api<OrderHistoryItem[]>('/orders') });
  const date = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', { dateStyle: 'medium' });

  if (isLoading) return <Spinner />;
  if (!data?.length) {
    return (
      <div className="text-sm text-slate-600">
        <p>{C.empty[locale]}</p>
        <Link to="/pricing" className="mt-3 inline-block font-medium text-slate-900 hover:text-brand-700">{C.paths[locale]} →</Link>
      </div>
    );
  }
  return (
    <>
      <ul className="divide-y divide-slate-100">
        {data.map((o) => (
          <li key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-4">
            <Link to={`/cursos/${o.course.slug}`} className="truncate font-medium text-slate-900 hover:text-brand-700">{o.course.title}</Link>
            <span className="text-right font-mono text-sm tabular-nums text-slate-900">{formatMoney(o.totalCOP, o.currency)}</span>
            <span className="truncate text-xs text-slate-500">
              {date.format(new Date(o.paidAt ?? o.createdAt))}
              {o.paymentDetail && <> · {o.paymentDetail}</>} · <span className="font-mono">{o.reference}</span>
              {o.receiptUrl && (
                <> · <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:text-slate-900">{C.receipt[locale]}</a></>
              )}
            </span>
            <span className={`justify-self-end rounded-md px-2 py-0.5 text-xs font-medium ${STATUS[o.status].cls}`}>{STATUS[o.status].label[locale]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">{C.note[locale]}</p>
    </>
  );
}
