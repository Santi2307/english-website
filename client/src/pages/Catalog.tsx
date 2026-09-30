import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { CourseCard } from '@/components/course/CourseCard';
import { useCourses, type CourseFilters } from '@/hooks/useCourses';
import { LEVELS, savedLevel } from '@/data/levelTest';
import { cn, formatCOP } from '@/lib/format';
import type { Goal, Level } from '@/lib/types';

const GOALS: Goal[] = ['CONVERSATION', 'BUSINESS', 'EXAM', 'KIDS'];
const PRICES = [200_000, 300_000, 400_000, 500_000];
const SORTS = ['popular', 'price_asc', 'price_desc', 'newest'] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
        active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300',
      )}
    >
      {children}
    </button>
  );
}

export default function Catalog() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const myLevel = savedLevel();

  // Los filtros viven en la URL: se pueden compartir y sobreviven al "atrás"
  const filters: CourseFilters = useMemo(
    () => ({
      level: (params.get('nivel') as Level) || undefined,
      goal: (params.get('objetivo') as Goal) || undefined,
      maxPrice: params.get('max') ? Number(params.get('max')) : undefined,
      sort: (params.get('orden') as CourseFilters['sort']) || 'popular',
    }),
    [params],
  );

  const set = (key: string, value?: string | number) => {
    const next = new URLSearchParams(params);
    if (value === undefined || next.get(key) === String(value)) next.delete(key);
    else next.set(key, String(value));
    setParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch } = useCourses(filters);
  const activeCount = [filters.level, filters.goal, filters.maxPrice].filter(Boolean).length;

  const filterPanel = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">{t('catalog.level')}</legend>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Chip key={l} active={filters.level === l} onClick={() => set('nivel', l)}>
              {l}{myLevel === l ? ' ★' : ''}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">{t('catalog.goal')}</legend>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <Chip key={g} active={filters.goal === g} onClick={() => set('objetivo', g)}>{t(`goals.${g}`)}</Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900">{t('catalog.price')}</legend>
        <div className="flex flex-wrap gap-2">
          {PRICES.map((p) => (
            <Chip key={p} active={filters.maxPrice === p} onClick={() => set('max', p)}>≤ {formatCOP(p)}</Chip>
          ))}
        </div>
      </fieldset>
      {activeCount > 0 && (
        <button onClick={() => setParams({}, { replace: true })} className="text-sm font-semibold text-brand-700 hover:underline">
          {t('catalog.clear')}
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-10">
      <Seo title={t('seo.catalogTitle')} description={t('seo.catalogDescription')} />
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('catalog.title')}</h1>
          <p className="mt-2 text-slate-600">{t('catalog.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)} className="btn-ghost py-2 lg:hidden">
            <SlidersHorizontal size={16} aria-hidden /> {t('catalog.filters')}{activeCount > 0 && ` (${activeCount})`}
          </button>
          <label className="sr-only" htmlFor="sort">{t('catalog.sort')}</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => set('orden', e.target.value === 'popular' ? undefined : e.target.value)}
            className="input w-auto py-2"
          >
            {SORTS.map((s) => <option key={s} value={s}>{t(`catalog.sorts.${s}`)}</option>)}
          </select>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <section aria-live="polite" aria-busy={isLoading}>
          <p className="mb-4 text-sm text-slate-500">{data && t('catalog.results', { count: data.length })}</p>
          {isError && (
            <div className="card p-8 text-center">
              <p>{t('common.error')}</p>
              <button onClick={() => refetch()} className="btn-primary mt-4">{t('common.retry')}</button>
            </div>
          )}
          {data?.length === 0 && (
            <div className="card p-10 text-center text-slate-600">
              <p>{t('catalog.empty')}</p>
              <button onClick={() => setParams({})} className="btn-ghost mt-4">{t('catalog.clear')}</button>
            </div>
          )}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {isLoading
                ? Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[440px] animate-pulse rounded-2xl bg-slate-100" />)
                : data?.map((c) => (
                    <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                      <CourseCard course={c} highlight={myLevel === c.level ? t('catalog.recommendedForYou', { level: myLevel }) : undefined} />
                    </motion.div>
                  ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>

      {/* Hoja de filtros en móvil */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-slate-900/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t('catalog.filters')}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold">{t('catalog.filters')}</h2>
                <button onClick={() => setShowFilters(false)} aria-label="Cerrar" className="rounded-full p-2 hover:bg-slate-100"><X aria-hidden /></button>
              </div>
              {filterPanel}
              <button onClick={() => setShowFilters(false)} className="btn-primary mt-8 w-full">
                {data ? t('catalog.results', { count: data.length }) : t('common.continue')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
