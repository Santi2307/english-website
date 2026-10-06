import { lazy, Suspense } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
import { PageIntro } from '@/components/layout/PageIntro';
import { WhenVisible } from '@/components/ui/WhenVisible';
import { PAGES } from '@/data/pages';
import { PRACTICE_CATEGORIES, SCENARIOS, type PracticeCategory } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { Scenarios } from '@/components/home/Scenarios';
import { cn } from '@/lib/format';
import NotFound from './NotFound';

const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const DemoLesson = named(() => import('@/components/landing/DemoLesson'), 'DemoLesson');
const LevelTest = named(() => import('@/components/landing/LevelTest'), 'LevelTest');
const FinalCta = named(() => import('@/components/home/FinalCta'), 'FinalCta');

/** /practice y /practice/:category: escenarios por categoría, una mini clase y el test de nivel. */
export default function PracticePage() {
  const locale = useLocale();
  const { category } = useParams<{ category?: PracticeCategory }>();
  const p = PAGES.practice;
  const current = PRACTICE_CATEGORIES.find((c) => c.id === category);
  if (category && !current) return <NotFound />;

  const items = current ? SCENARIOS.items.filter((s) => s.category === current.id) : SCENARIOS.items;
  const tabs = [{ to: '/practice', label: p.all[locale] }, ...PRACTICE_CATEGORIES.map((c) => ({ to: `/practice/${c.id}`, label: c.name[locale] }))];

  return (
    <>
      <Seo title={current ? `${current.name[locale]} · ${p.seo[locale]}` : p.seo[locale]} description={p.lead[locale]} />
      <PageIntro eyebrow={p.eyebrow[locale]} title={p.title[locale]} lead={p.lead[locale]}>
        <nav aria-label={p.eyebrow[locale]} className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end
              className={({ isActive }) =>
                cn('shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200', isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900')
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </PageIntro>
      <Scenarios key={category ?? 'all'} items={items} header={false} />
      <WhenVisible minHeight={800}>
        <Suspense fallback={<div style={{ minHeight: 800 }} />}>
          <DemoLesson />
          <LevelTest />
          <FinalCta />
        </Suspense>
      </WhenVisible>
    </>
  );
}
