import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/ui/Seo';
import { Hero } from '@/components/landing/Hero';
import { StatsBar } from '@/components/landing/StatsBar';
import { LevelTest } from '@/components/landing/LevelTest';
import { CoursesShowcase } from '@/components/landing/CoursesShowcase';

// Secciones bajo el pliegue: chunks separados
const DemoLesson = lazy(() => import('@/components/landing/DemoLesson').then((m) => ({ default: m.DemoLesson })));
const Testimonials = lazy(() => import('@/components/landing/Testimonials').then((m) => ({ default: m.Testimonials })));
const Faq = lazy(() => import('@/components/landing/Faq').then((m) => ({ default: m.Faq })));
const FinalCta = lazy(() => import('@/components/landing/FinalCta').then((m) => ({ default: m.FinalCta })));

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('seo.homeTitle')} description={t('seo.homeDescription')} />
      <Hero />
      <StatsBar />
      <LevelTest />
      <CoursesShowcase />
      <Suspense fallback={<div className="min-h-[600px]" />}>
        <DemoLesson />
        <Testimonials />
        <Faq />
        <FinalCta />
      </Suspense>
    </>
  );
}
