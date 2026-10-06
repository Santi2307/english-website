import { lazy, Suspense } from 'react';
import { Seo } from '@/components/ui/Seo';
import { PageIntro } from '@/components/layout/PageIntro';
import { PAGES } from '@/data/pages';
import { useLocale } from '@/hooks/useLocale';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ErrorBank } from '@/components/home/ErrorBank';
import { Progress } from '@/components/home/Progress';

const FinalCta = lazy(() => import('@/components/home/FinalCta').then((m) => ({ default: m.FinalCta })));

/** El ciclo completo: practicar, Error Bank y progreso, con el detalle que el home no muestra. */
export default function HowItWorksPage() {
  const locale = useLocale();
  const p = PAGES.how;
  return (
    <>
      <Seo title={p.seo[locale]} description={p.lead[locale]} />
      <PageIntro eyebrow={p.eyebrow[locale]} title={p.title[locale]} lead={p.lead[locale]} />
      <HowItWorks />
      <div id="error-bank" className="scroll-mt-16"><ErrorBank /></div>
      <Progress />
      <Suspense fallback={null}><FinalCta /></Suspense>
    </>
  );
}
