import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { api, qs } from '@/lib/api';
import { formatCOP } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';
import { StatusBadge, STATUS_LABEL } from './StatusBadge';
import type { AdminOrder } from './types';
import type { OrderStatus } from '@/lib/types';

type Page = { items: AdminOrder[]; total: number; page: number; pageSize: number };
const dateFmt = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' });

export default function Orders() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ['admin', 'orders', status, search, page],
    queryFn: () => api<Page>(`/admin/orders${qs({ status, q: search, page })}`),
    placeholderData: (p) => p,
  });
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Órdenes</h1>
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(q.trim());
          }}
        >
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input className="input py-2.5 pl-9" placeholder="Buscar por referencia o email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar órdenes" />
        </form>
        <select
          className="input w-auto py-2.5"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as OrderStatus | '');
          }}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {isFetching && <Spinner className="self-center" />}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-slate-200 text-left text-slate-500">
            <tr><th className="p-4">Referencia</th><th>Cliente</th><th>Curso</th><th>Estado</th><th>Método</th><th className="text-right">Total</th><th className="pr-4 text-right">Fecha</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.items.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="p-4">
                  <p className="font-mono text-xs">{o.reference}</p>
                  {o.wompiTransactionId && <p className="font-mono text-[11px] text-slate-400">tx {o.wompiTransactionId}</p>}
                </td>
                <td className="py-4"><p className="font-medium">{o.user.name}</p><p className="text-xs text-slate-500">{o.user.email}</p></td>
                <td className="py-4">{o.course.title}{o.coupon && <p className="text-xs text-emerald-700">Cupón {o.coupon.code}</p>}</td>
                <td className="py-4"><StatusBadge status={o.status} />{o.statusMessage && <p className="mt-1 max-w-40 text-xs text-slate-500">{o.statusMessage}</p>}</td>
                <td className="py-4 text-slate-600">{o.paymentMethod ?? '—'}</td>
                <td className="py-4 text-right tabular-nums">
                  {formatCOP(o.amountInCents / 100)}
                  {o.discountCOP > 0 && <p className="text-xs text-slate-400">−{formatCOP(o.discountCOP)}</p>}
                </td>
                <td className="py-4 pr-4 text-right text-xs text-slate-500">{dateFmt.format(new Date(o.createdAt))}</td>
              </tr>
            ))}
            {data?.items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No hay órdenes</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-500">{data?.total ?? 0} órdenes</p>
        <div className="flex items-center gap-2">
          <button className="btn-ghost py-1.5 text-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
          <span>{page} / {pages}</span>
          <button className="btn-ghost py-1.5 text-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
