import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { QUESTIONS, LEVELS, computeLevel, recommendCourse, saveLevel } from '@/data/levelTest';
import { useCourses } from '@/hooks/useCourses';
import { track } from '@/lib/analytics';
import { cn, formatCOP } from '@/lib/format';
import type { Level } from '@/lib/types';

type Phase = 'intro' | 'quiz' | 'result';

function LevelMeter({ level }: { level: Level }) {
  const idx = LEVELS.indexOf(level);
  return (
    <div className="mt-6 flex items-end justify-center gap-2" aria-hidden>
      {LEVELS.map((l, i) => (
        <div key={l} className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 24 + i * 16 }}
            transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 120 }}
            className={cn('w-9 rounded-t-lg sm:w-11', i <= idx ? 'bg-brand-600' : 'bg-white/70')}
          />
          <span className={cn('text-xs font-bold', i === idx ? 'text-slate-900' : 'text-slate-400')}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export function LevelTest() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const { data: courses } = useCourses();

  const result = useMemo(() => (phase === 'result' ? computeLevel(answers) : null), [phase, answers]);
  const recommended = result && courses?.length ? recommendCourse(result.level, courses) : undefined;

  const start = () => {
    track.levelTestStarted();
    setAnswers([]);
    setCurrent(0);
    setPicked(null);
    setPhase('quiz');
  };

  const answer = (choice: number | null) => {
    setPicked(choice);
    // Pequeña pausa para que se vea la selección antes de avanzar
    setTimeout(() => {
      const next = [...answers, choice];
      setAnswers(next);
      setPicked(null);
      if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
      else {
        const { level } = computeLevel(next);
        saveLevel(level);
        track.levelTestCompleted(level);
        setPhase('result');
      }
    }, 280);
  };

  const q = QUESTIONS[current];
  const progress = ((phase === 'result' ? QUESTIONS.length : current) / QUESTIONS.length) * 100;

  return (
    <section id="test-de-nivel" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{t('levelTest.title')}</h2>
          <p className="mt-3 text-slate-600">{t('levelTest.subtitle')}</p>
        </div>

        <div className="glass-strong relative mx-auto mt-10 max-w-2xl overflow-hidden rounded-[2rem] p-6 sm:p-10">
          {phase !== 'intro' && (
            <div className="absolute inset-x-0 top-0 h-1.5 bg-white/60">
              <motion.div className="h-full bg-brand-600" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="glass mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl text-3xl" aria-hidden>🎯</div>
                <div className="mb-6 flex justify-center gap-2">
                  {LEVELS.map((l) => (
                    <span key={l} className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-600">{l}</span>
                  ))}
                </div>
                <button onClick={start} className="btn-primary px-8 py-4 text-base">{t('levelTest.start')}</button>
              </motion.div>
            )}

            {phase === 'quiz' && (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-sm font-medium text-slate-500" aria-live="polite">
                  {t('levelTest.question', { current: current + 1, total: QUESTIONS.length })}
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl" id="lt-q">{q.prompt}</h3>
                <div role="radiogroup" aria-labelledby="lt-q" className="mt-6 grid gap-3 sm:grid-cols-2">
                  {q.options.map((opt, i) => (
                    <motion.button
                      key={opt}
                      role="radio"
                      aria-checked={picked === i}
                      whileTap={{ scale: 0.97 }}
                      disabled={picked !== null}
                      onClick={() => answer(i)}
                      className={cn(
                        'rounded-2xl border-2 px-4 py-4 text-left font-semibold transition',
                        picked === i ? 'border-brand-600 bg-white text-slate-900 shadow-sm' : 'border-white/80 bg-white/55 hover:border-brand-300 hover:bg-white/90',
                      )}
                    >
                      <span className="mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </motion.button>
                  ))}
                </div>
                <button onClick={() => answer(null)} disabled={picked !== null} className="mt-4 text-sm text-slate-500 underline-offset-2 hover:underline">
                  {t('levelTest.skip')}
                </button>
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <p className="text-slate-600">{t('levelTest.resultTitle')}</p>
                <motion.p
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
                  className="mt-2 text-7xl font-black tracking-tight text-slate-900"
                  aria-live="polite"
                >
                  {result.level}
                </motion.p>
                <p className="mx-auto mt-2 max-w-md text-slate-700">{t(`levelTest.levels.${result.level}`)}</p>
                <p className="mt-1 text-sm text-slate-500">{t('levelTest.resultScore', { score: result.score, total: QUESTIONS.length })}</p>
                <LevelMeter level={result.level} />

                {recommended && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="glass mt-8 rounded-3xl p-5 text-left"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                      <Sparkles size={14} aria-hidden /> {t('levelTest.recommended')}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{recommended.title}</p>
                    <p className="text-sm text-slate-600">{recommended.subtitle}</p>
                    <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xl font-extrabold text-slate-900">
                        {formatCOP(recommended.priceCOP)}
                        {recommended.compareAtCOP && (
                          <span className="ml-2 text-sm font-medium text-slate-400 line-through">{formatCOP(recommended.compareAtCOP)}</span>
                        )}
                      </p>
                      <Link to={`/cursos/${recommended.slug}`} className="btn-primary w-full sm:w-auto">{t('levelTest.recommendedCta')} →</Link>
                    </div>
                  </motion.div>
                )}
                <button onClick={start} className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
                  <RotateCcw size={14} aria-hidden /> {t('levelTest.retake')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
