import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { formatCOP } from '@/lib/format';
import { PageLoader } from '@/components/ui/Spinner';
import type { AdminCoupon, AdminCourse } from './types';

const schema = z
  .object({
    code: z.string().trim().min(3, 'Mínimo 3 caracteres').regex(/^[A-Za-z0-9_-]+$/, 'Solo letras, números y guiones'),
    type: z.enum(['PERCENT', 'FIXED']),
    value: z.coerce.number().int().positive('Debe ser mayor a 0'),
    courseId: z.string(),
    maxRedemptions: z.string(),
    expiresAt: z.string(),
  })
  .refine((v) => v.type !== 'PERCENT' || v.value <= 100, { message: 'Máximo 100%', path: ['value'] });
type FormValues = z.infer<typeof schema>;

export default function Coupons() {
  const qc = useQueryClient();
  const { data: coupons, isLoading } = useQuery({ queryKey: ['admin', 'coupons'], queryFn: () => api<AdminCoupon[]>('/admin/coupons') });
  const { data: courses } = useQuery({ queryKey: ['admin', 'courses'], queryFn: () => api<AdminCourse[]>('/admin/courses') });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', type: 'PERCENT', value: 10, courseId: '', maxRedemptions: '', expiresAt: '' },
  });

  const create = useMutation({
    mutationFn: (v: FormValues) =>
      api('/admin/coupons', {
        method: 'POST',
        body: {
          code: v.code.toUpperCase(),
          type: v.type,
          value: v.value,
          courseId: v.courseId || null,
          maxRedemptions: v.maxRedemptions ? Number(v.maxRedemptions) : null,
          // Fin del día en hora de Colombia
          expiresAt: v.expiresAt ? new Date(`${v.expiresAt}T23:59:59-05:00`).toISOString() : null,
          active: true,
        },
      }),
    onSuccess: () => {
      reset();
      invalidate();
    },
  });

  const toggle = useMutation({
    mutationFn: (c: AdminCoupon) =>
      api(`/admin/coupons/${c.id}`, {
        method: 'PUT',
        body: { code: c.code, type: c.type, value: c.value, courseId: c.courseId, maxRedemptions: c.maxRedemptions, expiresAt: c.expiresAt, active: !c.active },
      }),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: (id: string) => api(`/admin/coupons/${id}`, { method: 'DELETE' }), onSuccess: invalidate });

  if (isLoading || !coupons) return <PageLoader />;
  const err = (k: keyof FormValues) => errors[k] && <span className="mt-1 block text-xs text-rose-600">{errors[k]!.message}</span>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Cupones de descuento</h1>

      <form onSubmit={handleSubmit((v) => create.mutate(v))} className="card grid gap-3 p-5 sm:grid-cols-3 lg:grid-cols-6" noValidate>
        <label className="block"><span className="label">Código</span><input className="input py-2 uppercase" {...register('code')} />{err('code')}</label>
        <label className="block">
          <span className="label">Tipo</span>
          <select className="input py-2" {...register('type')}><option value="PERCENT">Porcentaje</option><option value="FIXED">Valor fijo</option></select>
        </label>
        <label className="block"><span className="label">{watch('type') === 'PERCENT' ? 'Valor (%)' : 'Valor (COP)'}</span><input type="number" className="input py-2" {...register('value')} />{err('value')}</label>
        <label className="block">
          <span className="label">Curso</span>
          <select className="input py-2" {...register('courseId')}>
            <option value="">Todos</option>
            {courses?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <label className="block"><span className="label">Usos máx.</span><input type="number" min={1} className="input py-2" placeholder="∞" {...register('maxRedemptions')} /></label>
        <label className="block"><span className="label">Expira</span><input type="date" className="input py-2" {...register('expiresAt')} /></label>
        <div className="flex items-center justify-end gap-3 sm:col-span-3 lg:col-span-6">
          {create.error instanceof ApiError && <p className="text-sm text-rose-600">{create.error.message}</p>}
          <button type="submit" disabled={create.isPending} className="btn-primary py-2.5 text-sm"><Plus size={16} aria-hidden /> Crear cupón</button>
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-200 text-left text-slate-500">
            <tr><th className="p-4">Código</th><th>Descuento</th><th>Curso</th><th>Usos</th><th>Expira</th><th>Activo</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="p-4 font-mono font-semibold">{c.code}</td>
                <td>{c.type === 'PERCENT' ? `${c.value}%` : formatCOP(c.value)}</td>
                <td>{c.course?.title ?? 'Todos'}</td>
                <td className="tabular-nums">{c.redemptions}{c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}</td>
                <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-CO') : '—'}</td>
                <td>
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={c.active} onChange={() => toggle.mutate(c)} className="h-4 w-4" aria-label={`Activar ${c.code}`} />
                    <span className="text-xs text-slate-500">{c.active ? 'Sí' : 'No'}</span>
                  </label>
                </td>
                <td className="pr-4 text-right">
                  <button
                    onClick={() => confirm(`¿Eliminar ${c.code}? Si ya se usó, solo se desactivará.`) && remove.mutate(c.id)}
                    className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                    aria-label={`Eliminar ${c.code}`}
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
