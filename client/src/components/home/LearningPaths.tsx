import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { useCourses } from '@/hooks/useCourses';
import { SectionHeader } from '../ui/product';
import { formatCOP } from '@/lib/format';

/** Los cursos, presentados como rutas de apoyo con su precio (sección "Precios"). */
export function LearningPaths() {
  const locale = useLocale();
  const { data, isLoading, isError } = useCourses({ sort: 'popular' });

  return (
    <section id="precios" className="section border-t border-slate-200">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={PATHS.eyebrow[locale]} title={PATHS.title[locale]} body={PATHS.sub[locale]} />
          <Link to="/cursos" className="btn-secondary shrink-0 self-start md:self-auto">{PATHS.all[locale]}</Link>
        </div>

        <ul className="mt-12 border-t border-slate-900">
          {isLoading &&
            Array.from({ length: 4 }, (_, i) => <li key={i} className="h-[5.5rem] animate-pulse border-b border-slate-200 bg-slate-100/50" />)}
          {isError && <li className="border-b border-slate-200 py-8 text-sm text-slate-500">—</li>}
          {data?.slice(0, 4).map((c) => (
            <li key={c.id} className="border-b border-slate-200">
              <Link
                to={`/cursos/${c.slug}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 md:grid-cols-[4rem_minmax(0,1fr)_10rem_9rem_2rem]"
              >
                <span className="hidden font-mono text-sm text-slate-400 md:block">{c.level}</span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold tracking-[-0.015em] text-slate-900">{c.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-slate-500">{c.subtitle}</span>
                </span>
                <span className="hidden text-sm text-slate-500 md:block">{c.durationHours} {PATHS.lessons[locale]}</span>
                <span className="text-right md:text-left">
                  <span className="block font-mono font-medium tabular-nums text-slate-900">{formatCOP(c.priceCOP)}</span>
                  {c.compareAtCOP && <span className="block font-mono text-xs text-slate-400 line-through">{formatCOP(c.compareAtCOP)}</span>}
                </span>
                <ArrowRight size={18} className="hidden text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-900 md:block" aria-label={PATHS.view[locale]} />
                <span className="col-span-2 font-mono text-xs text-slate-400 md:hidden">{c.level} · {c.durationHours} {PATHS.lessons[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-500">{PATHS.guarantee[locale]}</p>
      </div>
    </section>
  );
}
