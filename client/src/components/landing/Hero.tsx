import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Award, BadgeCheck, ShieldCheck } from 'lucide-react';
import { useCanRender3D } from '@/hooks/useDeviceCapability';
import { track } from '@/lib/analytics';

const Hero3D = lazy(() => import('./Hero3D'));

function StaticArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden>
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-brand-400 via-brand-600 to-brand-900 shadow-2xl shadow-brand-600/40" />
      <div className="absolute right-[6%] top-[14%] h-14 w-14 rounded-full border-[10px] border-accent-400" />
      <div className="absolute bottom-[16%] left-[4%] h-12 w-12 rotate-45 rounded-lg bg-sky-400" />
      <div className="absolute bottom-[4%] right-[30%] h-9 w-9 rounded-full bg-pink-400" />
    </div>
  );
}

function Bubble({ text, className, delay }: { text: string; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 16 }}
      className={`absolute rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xl ${className}`}
      aria-hidden
    >
      {text}
    </motion.div>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const can3D = useCanRender3D();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [idle, setIdle] = useState(false);

  // El 3D se descarga cuando el navegador está libre, para no competir con el LCP
  useEffect(() => {
    if (!can3D) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setIdle(true));
    else setTimeout(() => setIdle(true), 1200);
  }, [can3D]);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl" aria-hidden />
      <div className="container-page grid items-center gap-8 pb-16 pt-8 md:grid-cols-2 md:pb-24 md:pt-16">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.p variants={item} className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-brand-100">
            {t('hero.eyebrow')}
          </motion.p>
          <motion.h1 variants={item} className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t('hero.title1')}{' '}
            <span className="bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">{t('hero.title2')}</span>
            <br />
            <span className="text-slate-700">{t('hero.title3')}</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg text-slate-600">{t('hero.subtitle')}</motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#test-de-nivel" onClick={() => track.levelTestStarted()} className="btn-primary px-6 py-4 text-base">
              {t('hero.ctaTest')} →
            </a>
            <Link to="/cursos" className="btn-ghost px-6 py-4 text-base">{t('hero.ctaCourses')}</Link>
          </motion.div>
          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-600" aria-hidden />{t('hero.trust1')}</li>
            <li className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-emerald-600" aria-hidden />{t('hero.trust2')}</li>
            <li className="flex items-center gap-1.5"><Award size={16} className="text-emerald-600" aria-hidden />{t('hero.trust3')}</li>
          </motion.ul>
        </motion.div>

        <div ref={ref} className="relative h-72 sm:h-96 md:h-[480px]">
          {can3D && idle ? (
            <Suspense fallback={<StaticArt />}>
              <Hero3D active={inView} />
            </Suspense>
          ) : (
            <StaticArt />
          )}
          <Bubble text="Hello! 👋" className="left-2 top-6 sm:left-6" delay={0.6} />
          <Bubble text="How are you? 🇺🇸" className="bottom-10 right-2 sm:right-8" delay={0.9} />
          <Bubble text="¡Lo logré! 🎉" className="bottom-24 left-0 hidden sm:block" delay={1.2} />
        </div>
      </div>
    </section>
  );
}
