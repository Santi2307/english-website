import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { HERO, SAMPLE } from '@/data/home';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { EASE, T } from '@/lib/motion';
import { cn } from '@/lib/format';
import { LiveDot, Waveform } from '../ui/product';
import { HeroVideo } from './HeroVideo';

/**
 * Fases del ciclo que muestra el hero, en orden:
 * la reclutadora pregunta → hablas → aparece el error → feedback → repites → mejora.
 */
const PHASES = ['ask', 'speak', 'mistake', 'feedback', 'retry', 'improved'] as const;
type Phase = (typeof PHASES)[number];
const DURATIONS: Record<Phase, number> = { ask: 1800, speak: 2600, mistake: 1400, feedback: 3200, retry: 2400, improved: 2800 };
/** Qué paso del ciclo (Speak · Listen · Correct · Retry · Improve) ilumina cada fase. */
const LOOP_INDEX: Record<Phase, number> = { ask: 0, speak: 0, mistake: 1, feedback: 2, retry: 3, improved: 4 };

function useLoop(active: boolean, reduce: boolean | null) {
  const [i, setI] = useState(reduce ? PHASES.indexOf('feedback') : 0);
  useEffect(() => {
    if (reduce || !active) return;
    const id = window.setTimeout(() => setI((n) => (n + 1) % PHASES.length), DURATIONS[PHASES[i]]);
    return () => clearTimeout(id);
  }, [i, active, reduce]);
  return PHASES[i];
}

/** Palabras que aparecen una a una, como subtítulos en vivo. */
function Words({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} className="inline-block whitespace-pre" variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0, transition: T.micro } }}>
          {w}{' '}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * Escena de respaldo mientras no hay video: una videollamada de entrevista.
 * Interfaz, no ilustración: se lee como "esto es una conversación real".
 */
function InterviewScene({ locale, talking }: { locale: Locale; talking: boolean }) {
  const s = HERO.scene;
  return (
    <div className="relative h-full w-full bg-[radial-gradient(120%_90%_at_50%_35%,#3f3e39_0%,#191815_60%)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-16 sm:pb-10">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-slate-700 text-2xl font-semibold text-white/90 ring-1 ring-white/10 sm:h-28 sm:w-28 sm:text-3xl">SK</span>
        <p className="text-sm font-medium text-white/90">{s.interviewer}</p>
        <p className="-mt-2 text-xs text-white/50">{s.role[locale]}</p>
      </div>
      {/* Tu cámara */}
      <div className="absolute bottom-4 right-4 hidden h-24 w-36 flex-col justify-between rounded-xl bg-slate-800 p-3 ring-1 ring-white/10 sm:flex lg:h-28 lg:w-44">
        <span className="text-xs text-white/70">{s.you[locale]}</span>
        <Waveform bars={14} live={talking} tone={talking ? 'brand' : 'muted'} className={cn('h-5', !talking && '[&>span]:bg-white/20')} />
      </div>
    </div>
  );
}

function Sentence({ phase }: { phase: Phase }) {
  const marked = phase === 'mistake' || phase === 'feedback';
  if (phase === 'retry' || phase === 'improved') {
    return (
      <span>
        {SAMPLE.fixed.before}
        <span className={cn('rounded px-0.5 transition-colors duration-300', phase === 'improved' ? 'bg-emerald-400/20 text-emerald-200' : '')}>{SAMPLE.fixed.fix}</span>
        {SAMPLE.fixed.after}
      </span>
    );
  }
  return (
    <span>
      {SAMPLE.said.before}
      <span className={cn('transition-colors duration-300', marked && 'text-white underline decoration-brand-400 decoration-wavy decoration-[1.5px] underline-offset-[5px]')}>{SAMPLE.said.error}</span>
      {SAMPLE.said.after}
    </span>
  );
}

function FeedbackCard({ locale, phase }: { locale: Locale; phase: Phase }) {
  const s = HERO.scene;
  const improved = phase === 'improved';
  return (
    <motion.div
      key="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: T.ui }}
      exit={{ opacity: 0, y: 8, transition: T.micro }}
      className="w-full rounded-xl bg-white p-4 text-left shadow-xl sm:p-5"
    >
      {improved ? (
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check size={16} strokeWidth={2.5} aria-hidden /></span>
          <div>
            <p className="font-medium text-slate-900">{s.better[locale]}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />{s.saved[locale]}</p>
          </div>
        </div>
      ) : (
        <>
          <p className="eyebrow text-brand-700">{s.feedback[locale]}</p>
          <p className="mt-2 text-[0.95rem] text-slate-400 line-through decoration-slate-300">{SAMPLE.said.error}</p>
          <p className="mt-0.5 text-[0.95rem] font-medium text-slate-900">
            <span className="text-slate-500">{s.sayIt[locale]}: </span>{SAMPLE.fixed.before}<span className="rounded bg-brand-50 px-1 text-brand-800">{SAMPLE.fixed.fix}</span>{SAMPLE.fixed.after}
          </p>
          <p className="mt-2 hidden text-sm leading-relaxed text-slate-500 sm:block">{SAMPLE.why[locale]}</p>
        </>
      )}
    </motion.div>
  );
}

export function Hero() {
  const locale = useLocale();
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { margin: '-15% 0px' });
  const phase = useLoop(inView, reduce);
  const [line1, line2] = HERO.title[locale];
  const s = HERO.scene;

  // Al empezar a bajar, la escena se aleja un poco: da paso a la historia de abajo
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.93]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  const talking = phase === 'speak' || phase === 'retry';
  const showCaption = phase !== 'ask';
  const showCard = phase === 'feedback' || phase === 'improved';

  return (
    <section ref={section} className="relative pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pt-20">
      <div className="container-page">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T.scroll} className="eyebrow flex items-center gap-2.5 text-slate-600">
          <LiveDot /> {HERO.label[locale]}
        </motion.p>
        <h1 className="hero-display mt-6">
          <motion.span className="block text-slate-400" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...T.scroll, delay: 0.05 }}>{line1}</motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...T.scroll, delay: 0.15 }}>{line2}</motion.span>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...T.scroll, delay: 0.25 }}
          className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <p className="lead max-w-xl">{HERO.sub[locale]}</p>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={user ? '/mi-cuenta' : '/registro'} className="btn-primary btn-lg">{HERO.cta[locale]}</Link>
              <Link to="/how-it-works" className="btn-secondary btn-lg">{HERO.secondary[locale]} <ArrowRight size={16} aria-hidden /></Link>
            </div>
            <p className="mt-3 text-sm text-slate-500 lg:text-right">{HERO.note[locale]}</p>
          </div>
        </motion.div>
      </div>

      <div className="container-page mt-12 sm:mt-16">
        <motion.div
          ref={stage}
          style={{ scale, y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE.out, delay: 0.3 }}
          className="origin-top"
        >
          <HeroVideo className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2/1]" fallback={<InterviewScene locale={locale} talking={talking} />}>
            {/* Escenario y estado */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/90 sm:left-5 sm:top-5">
              <LiveDot light /> {s.live[locale]} · {s.tag[locale]}
            </div>

            {/* Pregunta de la reclutadora */}
            <AnimatePresence>
              {(phase === 'ask' || phase === 'speak') && (
                <motion.p
                  key="q"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, transition: T.ui }}
                  exit={{ opacity: 0, transition: T.micro }}
                  className="absolute inset-x-4 top-16 text-center text-lg font-medium text-white sm:top-20 sm:text-2xl"
                >
                  “{SAMPLE.question}”
                </motion.p>
              )}
            </AnimatePresence>

            {/* Lo que dices: subtítulos en vivo */}
            <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-3 sm:inset-x-6 sm:bottom-6 lg:right-[22rem] lg:items-start">
              <AnimatePresence mode="wait">
                {showCaption && (
                  <motion.p
                    key={phase === 'retry' || phase === 'improved' ? 'second' : 'first'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: T.micro }}
                    exit={{ opacity: 0, transition: T.micro }}
                    className="max-w-xl rounded-lg bg-black/60 px-3.5 py-2.5 text-[0.95rem] leading-relaxed text-white/90 sm:text-lg"
                  >
                    <span className="mr-2 font-mono text-xs uppercase tracking-wider text-white/50">{s.you[locale]}</span>
                    {talking ? <Words text={phase === 'speak' ? `${SAMPLE.said.before}${SAMPLE.said.error}${SAMPLE.said.after}` : `${SAMPLE.fixed.before}${SAMPLE.fixed.fix}${SAMPLE.fixed.after}`} /> : <Sentence phase={phase} />}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Feedback: panel a la derecha en escritorio, hoja inferior en móvil */}
            <div className="pointer-events-none absolute inset-x-3 top-14 sm:inset-x-auto sm:right-5 sm:top-auto sm:bottom-24 sm:w-80 lg:bottom-auto lg:top-1/2 lg:w-[20rem] lg:-translate-y-1/2">
              <AnimatePresence mode="wait">{showCard && <FeedbackCard key={phase} locale={locale} phase={phase} />}</AnimatePresence>
            </div>
          </HeroVideo>

          {/* El ciclo, siempre visible: así se entiende el producto sin leer */}
          <ol className="mt-5 flex items-center justify-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm" aria-label="Loop">
            {HERO.loop.map((l, i) => {
              const on = LOOP_INDEX[phase] === i;
              const done = LOOP_INDEX[phase] > i;
              return (
                <li key={i} className="flex items-center gap-2 sm:gap-3">
                  {i > 0 && <span className={cn('h-px w-3 transition-colors duration-300 sm:w-8', done || on ? 'bg-slate-900' : 'bg-slate-300')} aria-hidden />}
                  <span className={cn('transition-colors duration-300', on ? 'text-slate-900' : done ? 'text-slate-500' : 'text-slate-400')}>
                    {on && <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-brand-500 align-middle" aria-hidden />}
                    {l[locale]}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
