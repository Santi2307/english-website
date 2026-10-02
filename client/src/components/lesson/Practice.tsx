import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { cn } from '@/lib/format';
import type { Exercise } from '@/lib/lessonContent';
import {
  ChoiceExercise, FillExercise, ListenExercise, MatchExercise, OrderExercise, SpeakExercise, TrueFalseExercise,
} from './exercises/Exercises';

const PRAISE = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Así se hace!', '¡Genial!'];

function explanationOf(ex: Exercise) {
  return 'explanation' in ex ? ex.explanation : undefined;
}

function ExerciseView({ ex, done, onAnswer }: { ex: Exercise; done: boolean; onAnswer: (ok: boolean) => void }) {
  switch (ex.type) {
    case 'choice': return <ChoiceExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'listen': return <ListenExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'truefalse': return <TrueFalseExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'fill': return <FillExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'order': return <OrderExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'match': return <MatchExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'speak': return <SpeakExercise ex={ex} done={done} onAnswer={onAnswer} />;
  }
}

/** Ráfaga de confeti hecha con framer-motion (sin librerías). */
function Burst() {
  const pieces = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ i, x: (Math.random() - 0.5) * 420, y: -Math.random() * 260 - 60, r: Math.random() * 360, c: ['#6366f1', '#f59e0b', '#10b981', '#f472b6', '#38bdf8'][i % 5] })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className="absolute h-2.5 w-1.5 rounded-sm"
          style={{ background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [p.y, p.y + 320], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

type Props = {
  exercises: Exercise[];
  bestScore: number | null;
  onFinish: (score: number) => void;
  finishing?: boolean;
};

export function Practice({ exercises, bestScore, onFinish, finishing }: Props) {
  const [round, setRound] = useState(0); // fuerza remontar los ejercicios al repetir
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  const ex = exercises[index];
  const answered = results.length > index;
  const lastOk = answered ? results[index] : null;
  const correctCount = results.filter(Boolean).length;
  const score = Math.round((correctCount / exercises.length) * 100);
  const praise = useMemo(() => PRAISE[Math.floor(Math.random() * PRAISE.length)], [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAnswer = (ok: boolean) => {
    if (answered) return;
    setResults((r) => [...r, ok]);
    setStreak((s) => (ok ? s + 1 : 0));
  };

  const next = () => {
    if (index + 1 < exercises.length) setIndex(index + 1);
    else {
      setPhase('result');
      onFinish(Math.round((results.filter(Boolean).length / exercises.length) * 100));
    }
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setResults([]);
    setStreak(0);
    setPhase('playing');
  };

  if (phase === 'result') {
    const great = score >= 80;
    return (
      <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 text-center">
        {great && <Burst />}
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}>
          <Trophy size={64} className={cn('mx-auto', great ? 'text-accent-500' : 'text-slate-400')} aria-hidden />
        </motion.div>
        <p className="mt-4 text-5xl font-black text-slate-900">{score}%</p>
        <p className="mt-2 text-lg font-semibold text-slate-700">
          {great ? '¡Lección dominada! 🎉' : score >= 50 ? '¡Buen trabajo! Un repaso más y la dominas.' : 'Vas bien. Repasa el vocabulario y vuelve a intentarlo.'}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {correctCount} de {exercises.length} correctas{bestScore !== null && ` · Tu mejor nota: ${Math.max(bestScore, score)}%`}
        </p>
        <div className="mx-auto mt-6 flex max-w-sm justify-center gap-1.5" aria-hidden>
          {results.map((ok, i) => (
            <span key={i} className={cn('h-2 flex-1 rounded-full', ok ? 'bg-emerald-500' : 'bg-rose-300')} />
          ))}
        </div>
        <button onClick={restart} disabled={finishing} className="btn-glass mt-7">
          <RotateCcw size={18} aria-hidden /> Practicar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-[2rem] p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/70" role="progressbar" aria-valuenow={index + (answered ? 1 : 0)} aria-valuemin={0} aria-valuemax={exercises.length} aria-label="Progreso de la práctica">
          <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: `${((index + (answered ? 1 : 0)) / exercises.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-slate-600">{index + 1}/{exercises.length}</span>
        <AnimatePresence>
          {streak >= 2 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-sm font-bold text-orange-600">
              <Flame size={14} className="fill-orange-400" aria-hidden /> {streak}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Solo animación de entrada: un exit con mode="wait" se cuelga cuando el ejercicio
          saliente tiene animaciones de layout (ordenar, emparejar) y el siguiente nunca aparece */}
      <motion.div key={`${round}-${index}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        <ExerciseView ex={ex} done={answered} onAnswer={onAnswer} />
      </motion.div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('mt-6 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between', lastOk ? 'bg-emerald-50' : 'bg-rose-50')}
            role="status"
          >
            <div className="flex items-start gap-2">
              {lastOk ? <CheckCircle2 className="shrink-0 text-emerald-600" aria-hidden /> : <XCircle className="shrink-0 text-rose-500" aria-hidden />}
              <div>
                <p className={cn('font-bold', lastOk ? 'text-emerald-800' : 'text-rose-800')}>{lastOk ? praise : 'Casi. ¡Así se aprende!'}</p>
                {explanationOf(ex) && <p className="text-sm text-slate-700">{explanationOf(ex)}</p>}
              </div>
            </div>
            <button onClick={next} autoFocus className={cn('btn shrink-0 text-white', lastOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800')}>
              {index + 1 < exercises.length ? 'Continuar' : 'Ver resultado'} <ArrowRight size={18} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
