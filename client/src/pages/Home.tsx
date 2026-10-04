import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/ui/Seo';
import { WhenVisible } from '@/components/ui/WhenVisible';
import { Hero } from '@/components/landing/Hero';
import { LevelTest } from '@/components/landing/LevelTest';
import { CoursesShowcase } from '@/components/landing/CoursesShowcase';

// Secciones bajo el pliegue: chunks separados que se descargan al acercarse a ellas
const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const FeaturesBento = named(() => import('@/components/landing/FeaturesBento'), 'FeaturesBento');
const PlanCalculator = named(() => import('@/components/landing/PlanCalculator'), 'PlanCalculator');
const TeachersSection = named(() => import('@/components/landing/TeachersSection'), 'TeachersSection');
const DemoLesson = named(() => import('@/components/landing/DemoLesson'), 'DemoLesson');
const Testimonials = named(() => import('@/components/landing/Testimonials'), 'Testimonials');
const Faq = named(() => import('@/components/landing/Faq'), 'Faq');
const FinalCta = named(() => import('@/components/landing/FinalCta'), 'FinalCta');

/** Sección diferida: reserva su altura aproximada para que la página no salte al cargar. */
function Deferred({ children, height }: { children: React.ReactNode; height: number }) {
  return (
    <WhenVisible minHeight={height}>
      <Suspense fallback={<div style={{ minHeight: height }} />}>{children}</Suspense>
    </WhenVisible>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('seo.homeTitle')} description={t('seo.homeDescription')} />
      <Hero />
      <LevelTest />
      <Deferred height={1100}><FeaturesBento /></Deferred>
      <CoursesShowcase />
      <Deferred height={800}><PlanCalculator /></Deferred>
      <Deferred height={800}><TeachersSection /></Deferred>
      <Deferred height={700}><DemoLesson /></Deferred>
      <Deferred height={500}><Testimonials /></Deferred>
      <Deferred height={700}><Faq /></Deferred>
      <Deferred height={600}><FinalCta /></Deferred>
    </>
  );
}
