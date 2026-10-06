import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Mic } from 'lucide-react';
import { DEMO } from '@/data/home';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { useMedia, useScrollStep } from '@/hooks/useScrollStep';
import { swap, T } from '@/lib/motion';
import { cn } from '@/lib/format';
import { Frame, LiveDot, Waveform } from '../ui/product';
import { LogoMark } from '../layout/Navbar';
import { Reveal } from '../ui/Reveal';

/**
 * Hablar → ver qué falló → intentarlo otra vez, como una sola experiencia:
 * a la izquierda cambia el paso, a la derecha la MISMA interfaz cambia de estado.
 */
const SCORE = [null, 64, 91] as const;

export function PracticePanel({ state, locale }: { state: 0 | 1 | 2; locale: Locale }) {
  const p = DEMO.panel;
  const d = DEMO.sample;
  const score = SCORE[state];
  return (
    <Frame title={<><LiveDot /> {d.context[locale]}</>} meta={`${p.attempt[locale]} ${state === 2 ? 2 : 1}/2`} bodyClassName="p-0 sm:p-0">
      <div className="space-y-6 p-5 sm:p-7">
        <div className="flex gap-3">
          <LogoMark size={28} />
          <div>
            <p className="text-xs text-slate-500">{p.coach}</p>
            <p className="mt-1 text-lg font-medium tracking-[-0.01em] text-slate-900">{d.question}</p>
          </div>
        </div>

        <div className="min-h-[7.5rem] rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs text-slate-500">{p.you[locale]}</p>
          <AnimatePresence mode="wait">
            {state === 0 && (
              <motion.div key="listen" {...swap} className="mt-3 flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Mic size={16} aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-600">{p.listening[locale]}</p>
                  <Waveform bars={30} live className="mt-1.5" />
                </div>
              </motion.div>
            )}
            {state === 1 && (
              <motion.div key="said" {...swap} className="mt-2">
                <p className="text-[1.05rem] leading-relaxed text-slate-800">
                  {d.said.before}
                  <span className="rounded bg-brand-50 px-1 text-brand-800 line-through decoration-brand-400">{d.said.error}</span>{' '}
                  <span className="rounded bg-emerald-50 px-1 font-medium text-emerald-800">{d.fix}</span>
                  {d.said.after}
                </p>
                <p className="mt-3 border-l-2 border-brand-500 pl-3 text-sm text-slate-600">{d.note[locale]}</p>
              </motion.div>
            )}
            {state === 2 && (
              <motion.div key="retry" {...swap} className="mt-2">
                <p className="text-[1.05rem] leading-relaxed text-slate-800">
                  {d.said.before}<span className="font-medium text-slate-900">{d.fix}</span>{d.said.after}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-700"><Check size={15} strokeWidth={2.5} aria-hidden /> {d.natural[locale]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7">
        <span className="text-sm text-slate-500">{p.score[locale]}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full origin-left rounded-full bg-slate-900" initial={false} animate={{ scaleX: (score ?? 0) / 100 }} transition={T.scroll} />
        </div>
        <span className="w-16 text-right font-mono text-sm tabular-nums text-slate-900">
          {score ?? '––'}
          {state === 2 && <span className="ml-1 text-emerald-700">+27</span>}
        </span>
      </div>
    </Frame>
  );
}

function StepText({ i, active, locale }: { i: number; active: boolean; locale: Locale }) {
  const s = DEMO.steps[i];
  return (
    <div className={cn('transition-opacity duration-300', active ? 'opacity-100' : 'opacity-35')}>
      <p className="font-mono text-sm text-brand-600">0{i + 1}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-[2rem]">{s.title[locale]}</h3>
      <p className="mt-3 max-w-sm leading-relaxed text-slate-600">{s.body[locale]}</p>
    </div>
  );
}

export function InteractiveDemo() {
  const locale = useLocale();
  const desktop = useMedia('(min-width: 1024px)');
  const ref = useRef<HTMLElement>(null);
  const { step } = useScrollStep(ref, 3);

  const more = (
    <Link to="/how-it-works" className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-brand-700">
      {DEMO.more[locale]} <ArrowRight size={15} aria-hidden />
    </Link>
  );

  if (!desktop) {
    return (
      <section className="section border-t border-slate-200">
        <div className="container-page">
          <p className="eyebrow">{DEMO.eyebrow[locale]}</p>
          <div className="mt-10 space-y-16">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} className="space-y-6">
                <StepText i={i} active locale={locale} />
                <PracticePanel state={i as 0 | 1 | 2} locale={locale} />
              </Reveal>
            ))}
          </div>
          {more}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative border-t border-slate-200" style={{ height: '300vh' }}>
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="container-page grid w-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-20">
          <div>
            <p className="eyebrow">{DEMO.eyebrow[locale]}</p>
            <div className="relative mt-8 min-h-[12rem]">
              <AnimatePresence mode="wait">
                <motion.div key={step} {...swap}>
                  <StepText i={step} active locale={locale} />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Pasos: dónde estás en el ciclo */}
            <div className="mt-6 flex gap-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={cn('h-1 rounded-full transition-all duration-300', i === step ? 'w-10 bg-slate-900' : 'w-4 bg-slate-300')} />
              ))}
            </div>
            {more}
          </div>
          <PracticePanel state={step as 0 | 1 | 2} locale={locale} />
        </div>
      </div>
    </section>
  );
}
