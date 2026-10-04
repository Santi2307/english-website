import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { HOW, SCENARIOS } from '@/data/landing';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { Frame, LiveDot, ScoreBar, SectionHeader, Waveform } from '../ui/product';
import { cn } from '@/lib/format';

const AUTO_MS = 6000;

function SpeakScreen({ locale }: { locale: Locale }) {
  const items = SCENARIOS.items.filter((s) => ['interview', 'meeting', 'small-talk'].includes(s.id));
  return (
    <Frame title={HOW.screens.choose[locale]}>
      <ul className="space-y-1.5">
        {items.map((s, i) => (
          <li key={s.id} className={cn('flex items-center justify-between rounded-lg px-3 py-2.5 text-sm', i === 0 ? 'bg-slate-900 text-white' : 'text-slate-700')}>
            <span className="font-medium">{s.name[locale]}</span>
            <span className={cn('font-mono text-xs', i === 0 ? 'text-white/60' : 'text-slate-400')}>{s.level} · {s.minutes} min</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600"><LiveDot light /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">{HOW.screens.listening[locale]}</p>
          <Waveform bars={28} live className="mt-1.5" />
        </div>
        <span className="font-mono text-xs text-slate-400">0:12</span>
      </div>
    </Frame>
  );
}

function FeedbackScreen({ locale }: { locale: Locale }) {
  return (
    <Frame title={HOW.screens.transcript[locale]} meta="0:41">
      <p className="text-[0.95rem] leading-loose text-slate-700">
        In my last job I was responsible{' '}
        <span className="rounded bg-brand-50 px-1 text-brand-800 line-through decoration-brand-400">of</span>{' '}
        <span className="rounded bg-emerald-50 px-1 font-medium text-emerald-800">for</span> the customer team. We{' '}
        <span className="rounded bg-brand-50 px-1 text-brand-800 line-through decoration-brand-400">grow</span>{' '}
        <span className="rounded bg-emerald-50 px-1 font-medium text-emerald-800">grew</span> from five to twelve people in one year.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4">
        <ScoreBar compact label={locale === 'es' ? 'Fluidez' : 'Fluency'} value={76} />
        <ScoreBar compact label={locale === 'es' ? 'Gramática' : 'Grammar'} value={71} />
        <ScoreBar compact label={locale === 'es' ? 'Pronunc.' : 'Pronunc.'} value={83} />
      </div>
    </Frame>
  );
}

function ImproveScreen({ locale }: { locale: Locale }) {
  const plan = [
    { title: 'responsible for · depends on', kind: `4 ${HOW.screens.drills[locale]}`, done: true },
    { title: locale === 'es' ? 'Pasado simple: grow → grew' : 'Past simple: grow → grew', kind: `3 ${HOW.screens.drills[locale]}`, done: false },
    { title: locale === 'es' ? 'Entrevista: tus fortalezas' : 'Interview: your strengths', kind: HOW.screens.roleplay[locale], done: false },
  ];
  return (
    <Frame title={HOW.screens.next[locale]}>
      <p className="text-sm text-slate-500">{HOW.screens.nextSub[locale]}</p>
      <ul className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
        {plan.map((p) => (
          <li key={p.title} className="flex items-center gap-3 py-3">
            <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border', p.done ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300')}>
              {p.done && <Check size={12} strokeWidth={3} aria-hidden />}
            </span>
            <span className={cn('flex-1 text-sm', p.done ? 'text-slate-400 line-through' : 'font-medium text-slate-900')}>{p.title}</span>
            <span className="font-mono text-xs text-slate-400">{p.kind}</span>
          </li>
        ))}
      </ul>
      <span className="btn-primary btn-sm mt-4 w-full">{HOW.screens.start[locale]} <ArrowRight size={14} aria-hidden /></span>
    </Frame>
  );
}

/** Tres pasos a la izquierda; a la derecha, la pantalla real de cada paso. Avanza solo mientras está en pantalla. */
export function HowItWorks() {
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-120px' });

  useEffect(() => {
    if (!inView || paused) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % HOW.steps.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, inView, paused]);

  const screens = [<SpeakScreen key="s" locale={locale} />, <FeedbackScreen key="f" locale={locale} />, <ImproveScreen key="i" locale={locale} />];

  return (
    <section id="como-funciona" className="section border-t border-slate-200">
      <div ref={ref} className="container-page">
        <SectionHeader eyebrow={HOW.eyebrow[locale]} title={HOW.title[locale]} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <ol role="tablist" aria-label={HOW.eyebrow[locale]} className="flex flex-col">
            {HOW.steps.map((s, i) => {
              const on = active === i;
              return (
                <li key={i} className="border-t border-slate-200 last:border-b">
                  <button
                    role="tab"
                    aria-selected={on}
                    aria-controls="how-screen"
                    onClick={() => { setActive(i); setPaused(true); }}
                    className="group relative grid w-full grid-cols-[2.5rem_1fr] gap-x-2 py-6 text-left"
                  >
                    <span className={cn('font-mono text-sm transition-colors', on ? 'text-brand-600' : 'text-slate-400')}>0{i + 1}</span>
                    <span>
                      <span className={cn('block text-xl font-semibold tracking-[-0.02em] transition-colors sm:text-2xl', on ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600')}>{s.title[locale]}</span>
                      <span className={cn('mt-1.5 block leading-relaxed transition-colors', on ? 'text-slate-600' : 'text-slate-400')}>{s.body[locale]}</span>
                    </span>
                    {/* Progreso del autoavance */}
                    <span className="absolute inset-x-0 -top-px h-px overflow-hidden" aria-hidden>
                      {on && (
                        <motion.span
                          key={`${active}-${paused}`}
                          className="block h-full bg-slate-900"
                          initial={{ width: paused ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: paused ? 0 : AUTO_MS / 1000, ease: 'linear' }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div id="how-screen" role="tabpanel" className="relative min-h-[22rem] lg:pt-2">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                {screens[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
