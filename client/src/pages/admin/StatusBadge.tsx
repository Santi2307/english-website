import { AlertTriangle, CheckCircle2, Clock, Ban, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';

// Colores de estado reservados, siempre con ícono + texto (nunca solo color)
const MAP: Record<OrderStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  APPROVED: { label: 'Aprobada', cls: 'bg-emerald-50 text-emerald-800', Icon: CheckCircle2 },
  PENDING: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-800', Icon: Clock },
  DECLINED: { label: 'Rechazada', cls: 'bg-rose-50 text-rose-800', Icon: XCircle },
  VOIDED: { label: 'Anulada', cls: 'bg-slate-100 text-slate-700', Icon: Ban },
  ERROR: { label: 'Error', cls: 'bg-rose-50 text-rose-800', Icon: AlertTriangle },
};

export const STATUS_LABEL = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [k, v.label])) as Record<OrderStatus, string>;

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, cls, Icon } = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      <Icon size={12} aria-hidden /> {label}
    </span>
  );
}
