import { lazy, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seo } from '@/components/ui/Seo';
import { WhenVisible } from '@/components/ui/WhenVisible';
import { Hero } from '@/components/home/Hero';
import { CorrectionStory } from '@/components/home/CorrectionStory';

// Bajo el pliegue: chunks separados que se descargan al acercarse a ellos
const named = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const WhyThisExists = named(() => import('@/components/home/WhyThisExists'), 'WhyThisExists');
const InteractiveDemo = named(() => import('@/components/home/InteractiveDemo'), 'InteractiveDemo');
const ScenarioShowcase = named(() => import('@/components/home/ScenarioShowcase'), 'ScenarioShowcase');
const ErrorMemory = named(() => import('@/components/home/ErrorMemory'), 'ErrorMemory');
const ProgressPreview = named(() => import('@/components/home/ProgressPreview'), 'ProgressPreview');
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
 * Antes todo vivía en el home (/#precios, /#test-de-nivel…). Esos enlaces siguen
 * circulando en emails y marcadores: se mandan a su página nueva.
 */
const LEGACY_HASHES: Record<string, string> = {
  '#como-funciona': '/how-it-works',
  '#practicar': '/practice',
  '#test-de-nivel': '/practice#test-de-nivel',
  '#clase-demo': '/practice#clase-demo',
  '#precios': '/pricing',
  '#plan': '/pricing#plan',
  '#faq': '/pricing#faq',
};

/**
 * El home cuenta una historia y deja el detalle a cada página:
 * qué es (Hero) → cómo se siente (CorrectionStory) → por qué importa (WhyThisExists)
 * → cómo mejoras (InteractiveDemo) → qué practicas (ScenarioShowcase)
 * → qué lo hace distinto (ErrorMemory) → que se nota (ProgressPreview) → pruébalo (FinalCta).
 */
export default function Home() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const to = LEGACY_HASHES[hash];
    if (to) navigate(to, { replace: true });
  }, [hash, navigate]);

  return (
    <>
      <Seo title={t('seo.homeTitle')} description={t('seo.homeDescription')} />
      <Hero />
      <CorrectionStory />
      <Deferred height={700}><WhyThisExists /></Deferred>
      <Deferred height={900}><InteractiveDemo /></Deferred>
      <Deferred height={800}><ScenarioShowcase /></Deferred>
      <Deferred height={800}><ErrorMemory /></Deferred>
      <Deferred height={600}><ProgressPreview /></Deferred>
      <Deferred height={500}><FinalCta /></Deferred>
    </>
  );
}
