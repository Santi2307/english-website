import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCOP } from '@/lib/format';
import { PageLoader } from '@/components/ui/Spinner';
import { ErrorState, errorKind } from '@/components/ui/ErrorState';
import type { AdminCourse } from './types';

export default function Courses() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['admin', 'courses'], queryFn: () => api<AdminCourse[]>('/admin/courses') });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  if (error) return <ErrorState kind={errorKind(error)} onRetry={() => refetch()} />;
  if (isLoading || !data) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursos</h1>
        <Link to="/admin/cursos/nuevo" className="btn-primary py-2.5 text-sm"><Plus size={16} aria-hidden /> Nuevo curso</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-slate-200 text-left text-slate-500">
            <tr><th className="p-4">Curso</th><th>Nivel</th><th className="text-right">Precio</th><th className="text-right">Inscritos</th><th>Estado</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((c) => (
              <tr key={c.id}>
                <td className="p-4">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-slate-500">/{c.slug} · {c._count?.modules ?? 0} módulos</p>
                </td>
                <td>{c.level}</td>
                <td className="text-right tabular-nums">{formatCOP(c.priceCOP)}</td>
                <td className="text-right tabular-nums">{c._count?.enrollments ?? 0}</td>
                <td>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.published ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {c.published ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="pr-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Link to={`/admin/cursos/${c.id}`} className="rounded-lg p-2 hover:bg-slate-100" aria-label={`Editar ${c.title}`}><Pencil size={16} aria-hidden /></Link>
                    <button
                      onClick={() => confirm(`¿Eliminar "${c.title}"? Si tiene ventas, se despublicará en lugar de borrarse.`) && remove.mutate(c.id)}
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      aria-label={`Eliminar ${c.title}`}
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
