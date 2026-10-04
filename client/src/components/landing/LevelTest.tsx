import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCircle2, ChevronDown, RotateCcw, Shuffle, Sparkles, X } from 'lucide-react';
import { LEVELS, TOTAL_QUESTIONS, buildTest, computeLevel, recommendCourse, sampleQuestion, saveLevel, type Question } from '@/data/levelTest';
import { useCourses } from '@/hooks/useCourses';
import { track } from '@/lib/analytics';
import { cn, formatCOP } from '@/lib/format';
import type { Level } from '@/lib/types';

type Phase = 'intro' | 'quiz' | 'result';
const LETTERS = ['A', 'B', 'C', 'D'];

function LevelMeter({ level, byLevel }: { level: Level; byLevel: Partial<Record<Level, { correct: number; total: number }>> }) {
  const idx = LEVELS.indexOf(level);
  return (
    <div className="mt-6 flex items-end justify-center gap-2 sm:gap-3">
      {LEVELS.map((l, i) => {
        const r = byLevel[l];
        return (
          <div key={l} className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold tabular-nums text-slate-500">{r ? `${r.correct}/${r.total}` : ''}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 24 + i * 16 }}
              transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 120 }}
              className={cn('w-9 rounded-t-lg sm:w-11', i <= idx ? 'bg-slate-900' : 'bg-slate-100')}
              aria-hidden
            />
            <span className={cn('text-xs font-bold', i === idx ? 'text-slate-900' : 'text-slate-400')}>{l}</span>
          </div>
        );
      })}
    </div>
  );
}

function Review({ questions, answers }: { questions: Question[]; answers: (number | null)[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const misses = questions.map((q, i) => ({ q, a: answers[i] })).filter(({ q, a }) => a !== q.answer);

  if (!misses.length) return <p className="mt-6 font-semibold text-emerald-700">{t('levelTest.allCorrect')}</p>;
  return (
    <div className="mt-6 text-left">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
        {t(open ? 'levelTest.reviewHide' : 'levelTest.review', { count: misses.length })}
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-2 overflow-hidden">
            {misses.map(({ q, a }) => (
              <li key={q.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p className="flex items-start justify-between gap-3 font-semibold text-slate-900">
                  <span>{q.prompt.replace('___', '_____')}</span>
                  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-500">{q.level}</span>
                </p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1 text-rose-600">
                    <X size={14} aria-hidden /> {a === null ? t('levelTest.skipped') : `${t('levelTest.yourAnswer')}: ${q.options[a]}`}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Check size={14} aria-hidden /> {t('levelTest.correctAnswer')}: {q.options[q.answer]}
                  </span>
                </p>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Enunciado con el hueco resaltado. */
function Prompt({ text }: { text: string }) {
  const [before, after] = text.split('___');
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <span className="mx-1 inline-block min-w-16 border-b-[3px] border-brand-400 align-baseline" aria-label="espacio en blanco">&nbsp;</span>
      {after}
    </>
  );
}

export function LevelTest() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [sample] = useState(sampleQuestion);
  const { data: courses } = useCourses();

  const result = useMemo(() => (phase === 'result' ? computeLevel(questions, answers) : null), [phase, questions, answers]);
  const recommended = result && courses?.length ? recommendCourse(result.level, courses) : undefined;

  const start = () => {
    track.levelTestStarted();
    setQuestions(buildTest());
    setAnswers([]);
    setCurrent(0);
    setPicked(null);
    setPhase('quiz');
  };

  const answer = (choice: number | null) => {
    if (picked !== null) return;
    setPicked(choice ?? -1);
    // Pequeña pausa para que se vea la selección antes de avanzar
    setTimeout(() => {
      const next = [...answers, choice];
      setAnswers(next);
      setPicked(null);
      if (current + 1 < questions.length) setCurrent(current + 1);
      else {
        const { level } = computeLevel(questions, next);
        saveLevel(level);
        track.levelTestCompleted(level);
        setPhase('result');
      }
    }, 280);
  };

  // Atajos: A–D o 1–4 para responder
  useEffect(() => {
    if (phase !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement)?.closest('input, textarea, select')) return;
      const k = e.key.toUpperCase();
      const i = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ['1', '2', '3', '4'].indexOf(k);
      if (i >= 0 && i < (questions[current]?.options.length ?? 0)) answer(i);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const q = questions[current];
  const total = questions.length || TOTAL_QUESTIONS;
  const progress = ((phase === 'result' ? total : current) / total) * 100;

  return (
    <section id="test-de-nivel" className="section border-t border-slate-200">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">{t('nav.levelTest')}</p>
          <h2 className="section-title mt-4">{t('levelTest.title')}</h2>
          <p className="mt-3 text-slate-600">{t('levelTest.subtitle')}</p>
        </div>

        <div className={cn('card relative mt-12 overflow-hidden p-6 sm:p-10', phase === 'intro' ? '' : 'max-w-3xl')}>
          {phase !== 'intro' && (
            <div className="absolute inset-x-0 top-0 h-1 bg-slate-100">
              <motion.div className="h-full bg-slate-900" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid items-center gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                  <ul className="space-y-3">
                    {(['perk1', 'perk2', 'perk3', 'perk4'] as const).map((k, i) => (
                      <motion.li
                        key={k}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2.5 font-semibold text-slate-800"
                      >
                        <CheckCircle2 size={20} className="shrink-0 text-emerald-600" aria-hidden /> {t(`levelTest.${k}`)}
                      </motion.li>
                    ))}
                  </ul>
                  <button onClick={start} className="btn-primary btn-lg mt-8 w-full sm:w-auto">{t('levelTest.start')} →</button>
                </div>

                {/* Vista previa de una pregunta: muestra que el test es corto y concreto */}
                <div className="relative" aria-hidden>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('levelTest.sample')}</p>
                    <p className="mt-2 text-lg font-bold text-slate-900"><Prompt text={sample.prompt} /></p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {sample.options.map((o, i) => (
                        <motion.span
                          key={o}
                          animate={i === sample.answer ? { backgroundColor: ['#ffffff', '#ecfdf5', '#ecfdf5', '#ffffff'] } : {}}
                          transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.8, 1], delay: 1 }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                        >
                          {LETTERS[i]}. {o}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600">
                    <Shuffle size={14} aria-hidden /> {t('levelTest.freshBadge')}
                  </p>
                </div>
              </motion.div>
            )}

            {phase === 'quiz' && q && (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500" aria-live="polite">
                    {t('levelTest.question', { current: current + 1, total })}
                  </p>
                  <div className="flex gap-1" aria-hidden>
                    {LEVELS.map((l) => (
                      <span key={l} className={cn('h-1.5 w-6 rounded-full transition-colors', LEVELS.indexOf(l) < LEVELS.indexOf(q.level) ? 'bg-slate-900' : l === q.level ? 'bg-brand-500' : 'bg-slate-200')} />
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl" id="lt-q"><Prompt text={q.prompt} /></h3>
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
                        'group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left font-medium transition-colors',
                        picked === i ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 bg-white hover:border-slate-400',
                      )}
                    >
                      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-semibold transition', picked === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900')}>
                        {LETTERS[i]}
                      </span>
                      {opt}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button onClick={() => answer(null)} disabled={picked !== null} className="text-sm text-slate-500 underline-offset-2 hover:underline">
                    {t('levelTest.skip')}
                  </button>
                  <span className="hidden text-xs text-slate-400 [@media(hover:hover)]:inline">{t('levelTest.keyboardHint')}</span>
                </div>
              </motion.div>
            )}

            {phase === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <p className="text-slate-600">{t('levelTest.resultTitle')}</p>
                <motion.p
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
                  className="mt-2 text-7xl font-semibold tracking-tight text-slate-900"
                  aria-live="polite"
                >
                  {result.level}
                </motion.p>
                <p className="mx-auto mt-2 max-w-md text-slate-700">{t(`levelTest.levels.${result.level}`)}</p>
                <p className="mt-1 text-sm text-slate-500">{t('levelTest.resultScore', { score: result.score, total })}</p>
                <LevelMeter level={result.level} byLevel={result.byLevel} />
                <Review questions={questions} answers={answers} />

                {recommended && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                      <Sparkles size={14} aria-hidden /> {t('levelTest.recommended')}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{recommended.title}</p>
                    <p className="text-sm text-slate-600">{recommended.subtitle}</p>
                    <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xl font-semibold text-slate-900">
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
