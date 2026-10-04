import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/ui/Seo';
import { WhenVisible } from '@/components/ui/WhenVisible';
import { Hero } from '@/components/home/Hero';
import { Problem } from '@/components/home/Problem';
import { HowItWorks } from '@/components/home/HowItWorks';

// Secciones bajo el pliegue: chunks separados que se descargan al acercarse a ellas
const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const ErrorBank = named(() => import('@/components/home/ErrorBank'), 'ErrorBank');
const Scenarios = named(() => import('@/components/home/Scenarios'), 'Scenarios');
const Progress = named(() => import('@/components/home/Progress'), 'Progress');
const LevelTest = named(() => import('@/components/landing/LevelTest'), 'LevelTest');
const DemoLesson = named(() => import('@/components/landing/DemoLesson'), 'DemoLesson');
const PlanCalculator = named(() => import('@/components/landing/PlanCalculator'), 'PlanCalculator');
const LearningPaths = named(() => import('@/components/home/LearningPaths'), 'LearningPaths');
const Faq = named(() => import('@/components/landing/Faq'), 'Faq');
const FinalCta = named(() => import('@/components/home/FinalCta'), 'FinalCta');

/** Sección diferida: reserva su altura aproximada para que la página no salte al cargar. */
function Deferred({ children, height }: { children: React.ReactNode; height: number }) {
  return (
    <WhenVisible minHeight={height}>
      <Suspense fallback={<div style={{ minHeight: height }} />}>{children}</Suspense>
    </WhenVisible>
  );
}

/**
 * Narrativa: la promesa (hablar) → el problema → cómo funciona → lo que lo hace
 * distinto (memoria de errores, escenarios, progreso) → pruébalo ya → precios.
 */
export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('seo.homeTitle')} description={t('seo.homeDescription')} />
      <Hero />
      <Problem />
      <HowItWorks />
      <Deferred height={700}><ErrorBank /></Deferred>
      <Deferred height={800}><Scenarios /></Deferred>
      <Deferred height={700}><Progress /></Deferred>
      <Deferred height={800}><LevelTest /></Deferred>
      <Deferred height={800}><DemoLesson /></Deferred>
      <Deferred height={800}><PlanCalculator /></Deferred>
      <Deferred height={700}><LearningPaths /></Deferred>
      <Deferred height={700}><Faq /></Deferred>
      <Deferred height={500}><FinalCta /></Deferred>
    </>
  );
}
