import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatCOP } from '@/lib/format';
import { PageLoader } from '@/components/ui/Spinner';
import { StatusBadge } from './StatusBadge';
import type { Metrics as MetricsData } from './types';
import type { OrderStatus } from '@/lib/types';

const compact = new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 });
const shortDate = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Eje con valores "limpios" (1, 2, 5 × 10^n). */
function niceMax(v: number) {
  if (v <= 0) return 100_000;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

/** Columnas de ingresos diarios: una serie, sin leyenda (el título la nombra), tooltip al hover y vista de tabla. */
function RevenueChart({ data }: { data: MetricsData['daily'] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const W = 720, H = 220, L = 48, B = 24, T = 8;
  const max = useMemo(() => niceMax(Math.max(...data.map((d) => d.revenueCOP))), [data]);
  const band = (W - L) / data.length;
  const barW = Math.min(18, band - 2);
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, max / 2, max];

  // Columna con 4px redondeados arriba y base recta
  const colPath = (x: number, top: number, bottom: number, w: number) => {
    const r = Math.min(4, (bottom - top) / 2, w / 2);
    if (bottom - top < 1) return '';
    return `M${x},${bottom} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${bottom} Z`;
  };

  const h = hover !== null ? data[hover] : null;

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Ingresos diarios (COP)</h2>
          <p className="text-sm text-slate-500">Últimos 30 días · órdenes aprobadas</p>
        </div>
        <button onClick={() => setAsTable((v) => !v)} className="text-sm font-semibold text-brand-700 hover:underline">
          {asTable ? 'Ver gráfico' : 'Ver tabla'}
        </button>
      </div>

      {asTable ? (
        <div className="mt-4 max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white text-left text-slate-500">
              <tr><th className="py-2">Fecha</th><th className="text-right">Órdenes</th><th className="text-right">Ingresos</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {data.map((d) => (
                <tr key={d.date}><td className="py-1.5">{shortDate(d.date)}</td><td className="text-right">{d.orders}</td><td className="text-right">{formatCOP(d.revenueCOP)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative mt-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Ingresos diarios de los últimos 30 días" onMouseLeave={() => setHover(null)}>
            {ticks.map((tk) => (
              <g key={tk}>
                <line x1={L} x2={W} y1={y(tk)} y2={y(tk)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={L - 8} y={y(tk)} dy="0.32em" textAnchor="end" className="fill-slate-500 text-[11px] tabular-nums">{compact.format(tk)}</text>
              </g>
            ))}
            {data.map((d, i) => {
              const x = L + i * band + (band - barW) / 2;
              return (
                <g key={d.date}>
                  <path d={colPath(x, y(d.revenueCOP), y(0), barW)} fill="#4f46e5" opacity={hover === null || hover === i ? 1 : 0.45} />
                  {/* Área de hover más grande que la columna */}
                  <rect x={L + i * band} y={T} width={band} height={H - T - B} fill="transparent" onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)} />
                </g>
              );
            })}
            {[0, Math.floor(data.length / 2), data.length - 1].map((i, k) => (
              <text
                key={i}
                x={k === 0 ? L : k === 2 ? W : L + i * band + band / 2}
                y={H - 6}
                textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'}
                className="fill-slate-500 text-[11px]"
              >
                {shortDate(data[i].date)}
              </text>
            ))}
          </svg>
          {h && hover !== null && (
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
              style={{ left: `${((L + hover * band + band / 2) / W) * 100}%` }}
            >
              <p className="font-semibold">{shortDate(h.date)}</p>
              <p className="tabular-nums">{formatCOP(h.revenueCOP)} · {h.orders} órdenes</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default function Metrics() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'metrics'], queryFn: () => api<MetricsData>('/admin/metrics') });
  if (isLoading || !data) return <PageLoader />;

  const statuses: OrderStatus[] = ['APPROVED', 'PENDING', 'DECLINED', 'VOIDED', 'ERROR'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Métricas de ventas</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Ingresos totales" value={formatCOP(data.totalRevenueCOP)} />
        <Kpi label="Últimos 30 días" value={formatCOP(data.revenueLast30COP)} />
        <Kpi label="Ventas aprobadas" value={String(data.approvedOrders)} hint={`Ticket promedio ${formatCOP(data.averageOrderCOP)}`} />
        <Kpi label="Tasa de aprobación" value={`${Math.round(data.conversionRate * 100)}%`} hint={`${data.students} estudiantes registrados`} />
      </div>

      <RevenueChart data={data.daily} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold">Cursos más vendidos</h2>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-slate-500"><tr><th className="py-2">Curso</th><th className="text-right">Ventas</th><th className="text-right">Ingresos</th></tr></thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {data.topCourses.map((c) => (
                <tr key={c.courseId}><td className="py-2">{c.title}</td><td className="text-right">{c.sales}</td><td className="text-right">{formatCOP(c.revenueCOP)}</td></tr>
              ))}
              {data.topCourses.length === 0 && <tr><td colSpan={3} className="py-4 text-center text-slate-500">Sin ventas aún</td></tr>}
            </tbody>
          </table>
        </section>
        <section className="card p-5">
          <h2 className="font-bold">Órdenes por estado</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {statuses.map((s) => (
              <li key={s} className="flex items-center justify-between py-2 text-sm">
                <StatusBadge status={s} />
                <span className="font-semibold tabular-nums">{data.ordersByStatus[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
