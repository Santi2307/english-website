import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SAMPLE, STORY } from '@/data/home';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { useMedia, useScrollStep } from '@/hooks/useScrollStep';
import { swap, T } from '@/lib/motion';
import { cn } from '@/lib/format';
import { Reveal } from '../ui/Reveal';

/**
 * Una sola frase explica el producto. Mientras la sección queda fija, el scroll
 * la lleva por cuatro estados: lo que dijiste → el error marcado → la versión
 * natural → "tus errores se vuelven tu próxima lección".
 * En móvil los cuatro estados se apilan (sin sección fija).
 */
const STEPS = 4;

function Said({ marked }: { marked: boolean }) {
  return (
    <>
      “{SAMPLE.said.before}
      <span
        className={cn(
          'underline decoration-[3px] underline-offset-[10px] transition-[text-decoration-color,color] duration-500',
          marked ? 'text-slate-900 decoration-brand-500 decoration-wavy' : 'decoration-transparent',
        )}
      >
        {SAMPLE.said.error}
      </span>
      {SAMPLE.said.after}”
    </>
  );
}

function Fixed() {
  return (
    <>
      “{SAMPLE.fixed.before}
      <motion.span
        initial={{ backgroundSize: '0% 100%' }}
        animate={{ backgroundSize: '100% 100%' }}
        transition={{ ...T.scroll, delay: 0.2 }}
        className="bg-gradient-to-r from-emerald-100 to-emerald-100 bg-no-repeat px-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      >
        {SAMPLE.fixed.fix}
      </motion.span>
      {SAMPLE.fixed.after}”
    </>
  );
}

function Lesson({ locale }: { locale: Locale }) {
  const [a, b] = STORY.lesson[locale];
  return (
    <div>
      <p className="statement">
        <span className="block text-slate-400">{a}</span>
        <span className="block">{b}</span>
      </p>
      <p className="lead mt-6 max-w-lg">{STORY.lessonSub[locale]}</p>
    </div>
  );
}

function StepContent({ step, locale }: { step: number; locale: Locale }) {
  const group = step < 2 ? 'said' : step === 2 ? 'fixed' : 'lesson';
  return (
    <AnimatePresence mode="wait">
      <motion.div key={group} {...swap}>
        {group === 'said' && (
          <>
            <p className="statement text-slate-500"><Said marked={step === 1} /></p>
            <div className="mt-8 min-h-[3.5rem]">
              <AnimatePresence>
                {step === 1 && (
                  <motion.p {...swap} className="max-w-lg border-l-2 border-brand-500 pl-4 text-slate-600">{SAMPLE.why[locale]}</motion.p>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
        {group === 'fixed' && <p className="statement"><Fixed /></p>}
        {group === 'lesson' && <Lesson locale={locale} />}
      </motion.div>
    </AnimatePresence>
  );
}

export function CorrectionStory() {
  const locale = useLocale();
  const desktop = useMedia();
  const ref = useRef<HTMLElement>(null);
  const { step, progress } = useScrollStep(ref, STEPS);

  if (!desktop) {
    return (
      <section className="section border-t border-slate-200">
        <div className="container-page space-y-14">
          {[0, 1, 2, 3].map((i) => (
            <Reveal key={i}>
              <p className="eyebrow mb-4">0{i + 1} · {STORY.steps[i][locale]}</p>
              {i === 0 && <p className="statement text-slate-500"><Said marked={false} /></p>}
              {i === 1 && (
                <>
                  <p className="statement text-slate-500"><Said marked /></p>
                  <p className="mt-6 border-l-2 border-brand-500 pl-4 text-slate-600">{SAMPLE.why[locale]}</p>
                </>
              )}
              {i === 2 && <p className="statement"><Fixed /></p>}
              {i === 3 && <Lesson locale={locale} />}
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative border-t border-slate-200" style={{ height: `${STEPS * 80 + 40}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="container-page grid w-full grid-cols-[13rem_minmax(0,1fr)] gap-16">
          {/* Indicador de progreso: los cuatro momentos de la historia */}
          <ol className="relative self-center pl-5">
            <span className="absolute inset-y-1 left-0 w-px bg-slate-200" aria-hidden />
            <motion.span className="absolute left-0 top-1 w-px origin-top bg-slate-900" style={{ scaleY: progress, height: 'calc(100% - 0.5rem)' }} aria-hidden />
            {STORY.steps.map((l, i) => (
              <li key={i} className={cn('py-2.5 text-sm transition-colors duration-300', i === step ? 'font-medium text-slate-900' : i < step ? 'text-slate-500' : 'text-slate-400')}>
                <span className="mr-2 font-mono text-xs">0{i + 1}</span>
                {l[locale]}
              </li>
            ))}
          </ol>
          <div className="min-h-[18rem]" aria-live="polite">
            <StepContent step={step} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
