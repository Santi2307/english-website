import { lazy, Suspense } from 'react';
import { Seo } from '@/components/ui/Seo';
import { PageIntro } from '@/components/layout/PageIntro';
import { PAGES } from '@/data/pages';
import { useLocale } from '@/hooks/useLocale';
import { LearningPaths } from '@/components/home/LearningPaths';

const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const PlanCalculator = named(() => import('@/components/landing/PlanCalculator'), 'PlanCalculator');
const Faq = named(() => import('@/components/landing/Faq'), 'Faq');
const FinalCta = named(() => import('@/components/home/FinalCta'), 'FinalCta');

/** Rutas con su precio, la calculadora de plan y las preguntas frecuentes. */
export default function PricingPage() {
  const locale = useLocale();
  const p = PAGES.pricing;
  return (
    <>
      <Seo title={p.seo[locale]} description={p.lead[locale]} />
      <PageIntro eyebrow={p.eyebrow[locale]} title={p.title[locale]} lead={p.lead[locale]} />
      <LearningPaths header={false} />
      <Suspense fallback={<div style={{ minHeight: 800 }} />}>
        <PlanCalculator />
        <Faq />
        <FinalCta />
      </Suspense>
    </>
  );
}
