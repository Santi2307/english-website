import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Mic, RotateCcw, User } from 'lucide-react';
import { COACH } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { Frame, LiveDot, Waveform } from '../ui/product';
import { LogoMark } from '../layout/Navbar';
import { cn } from '@/lib/format';

/**
 * Vista del futuro AI Speaking Coach (datos de ejemplo).
 * Secuencia: pregunta → el usuario habla → transcripción con el error → puntajes → sugerencia.
 */
const STEPS = { asking: 0, speaking: 1, transcript: 2, scores: 3, done: 4 } as const;
const TIMELINE = [700, 1900, 900, 900];

function Row({ who, children, me }: { who: string; children: React.ReactNode; me?: boolean }) {
  return (
    <div className="flex gap-3">
      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold', me ? 'bg-slate-100 text-slate-600' : '')}>
        {me ? <User size={14} aria-hidden /> : <LogoMark size={28} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{who}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function CoachMock({ className }: { className?: string }) {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [step, setStep] = useState<number>(reduce ? STEPS.done : STEPS.asking);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    setStep(STEPS.asking);
    const timers: number[] = [];
    let at = 0;
    TIMELINE.forEach((ms, i) => {
      at += ms;
      timers.push(window.setTimeout(() => setStep(i + 1), at));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, run, reduce]);

  const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <div ref={ref} className={className}>
      <Frame
        title={<><LiveDot /> {COACH.scenario[locale]}</>}
        meta={COACH.round[locale]}
        bodyClassName="p-0 sm:p-0"
      >
        <div className="space-y-5 p-4 sm:p-6">
          <Row who={COACH.coach[locale]}>
            <p className="text-lg font-medium tracking-[-0.01em] text-slate-900 sm:text-xl">{COACH.question}</p>
          </Row>

          <Row who={COACH.you[locale]} me>
            <AnimatePresence mode="wait" initial={false}>
              {step <= STEPS.speaking ? (
                <motion.div key="wave" {...fade} className="flex h-7 items-center gap-3">
                  {step === STEPS.speaking ? <Waveform bars={24} live /> : <span className="h-1 w-24 rounded-full bg-slate-100" />}
                </motion.div>
              ) : (
                <motion.p key="text" {...fade} className="text-[0.95rem] leading-relaxed text-slate-700">
                  {COACH.answer.before}
                  <span className="text-slate-900 underline decoration-brand-500 decoration-wavy decoration-[1.5px] underline-offset-4">{COACH.answer.error}</span>
                  {COACH.answer.after}
                </motion.p>
              )}
            </AnimatePresence>
          </Row>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/60 p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {COACH.scores.map((s, i) => (
              <div key={s.key}>
                <p className="text-xs text-slate-500">{s.label[locale]}</p>
                <p className="mt-1 font-mono text-2xl font-medium tabular-nums tracking-tight text-slate-900 sm:text-[1.75rem]">
                  {step >= STEPS.scores ? s.value : <span className="text-slate-300">––</span>}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-slate-900"
                    initial={false}
                    animate={{ width: step >= STEPS.scores ? `${s.value}%` : '0%' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 min-h-[6.5rem]">
            {step >= STEPS.done && (
              <motion.div {...fade} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="eyebrow text-brand-700">{COACH.sayItLikeThis[locale]}</p>
                <p className="mt-1.5 font-medium text-slate-900">
                  I have <span className="rounded bg-brand-50 px-1 text-brand-800">two years of experience</span> working with customers.
                </p>
                <p className="mt-1.5 text-sm text-slate-500">{COACH.why[locale]}</p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-6">
          <button
            onClick={() => setRun((r) => r + 1)}
            disabled={!!reduce}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 disabled:opacity-0"
          >
            <RotateCcw size={14} aria-hidden /> {COACH.tryAgain[locale]}
          </button>
          <span className="flex items-center gap-2.5 text-sm text-slate-600">
            <span className="hidden sm:inline">{COACH.tap[locale]}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-white shadow-xs" aria-hidden>
              <Mic size={18} />
            </span>
          </span>
        </div>
      </Frame>
    </div>
  );
}
