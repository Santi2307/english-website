import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, RefreshCcw, RotateCcw, Trophy, XCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/format';
import type { Exercise } from '@/lib/lessonContent';
import {
  ChoiceExercise, DictationExercise, FillExercise, FixExercise, ListenExercise, MatchExercise, OrderExercise, SpeakExercise, TrueFalseExercise,
} from './exercises/Exercises';

const PRAISE = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Así se hace!', '¡Genial!', '¡Imparable!', '¡Eso es!'];
const XP_CORRECT = 10;
/** Bono por racha: a partir de 3 seguidas, +5 por cada acierto */
const xpFor = (streak: number) => XP_CORRECT + (streak >= 3 ? 5 : 0);

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
    case 'dictation': return <DictationExercise ex={ex} done={done} onAnswer={onAnswer} />;
    case 'fix': return <FixExercise ex={ex} done={done} onAnswer={onAnswer} />;
  }
}

const TYPE_LABEL: Record<Exercise['type'], string> = {
  choice: 'Opción múltiple', listen: 'Escucha', truefalse: 'Verdadero o falso', fill: 'Completa', order: 'Ordena',
  match: 'Empareja', speak: 'Habla', dictation: 'Dictado', fix: 'Corrige',
};

/** Ráfaga de confeti hecha con framer-motion (sin librerías). */
function Burst() {
  const pieces = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ i, x: (Math.random() - 0.5) * 480, y: -Math.random() * 280 - 60, r: Math.random() * 540, c: ['#6366f1', '#f59e0b', '#10b981', '#f472b6', '#38bdf8'][i % 5] })),
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
          animate={{ x: p.x, y: [p.y, p.y + 340], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/** Número que sube contando (para el XP del resultado). */
function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.round(to * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}</>;
}

type Props = {
  exercises: Exercise[];
  bestScore: number | null;
  onFinish: (score: number) => void;
  finishing?: boolean;
};

type Mode = 'main' | 'review';

export function Practice({ exercises, bestScore, onFinish, finishing }: Props) {
  const [round, setRound] = useState(0); // fuerza remontar los ejercicios al repetir
  const [mode, setMode] = useState<Mode>('main');
  const [deck, setDeck] = useState<number[]>(() => exercises.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [gain, setGain] = useState<{ id: number; amount: number } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [mainResults, setMainResults] = useState<boolean[]>([]);

  const ex = exercises[deck[index]];
  const answered = results.length > index;
  const lastOk = answered ? results[index] : null;
  const correctCount = results.filter(Boolean).length;
  const score = Math.round((mainResults.filter(Boolean).length / exercises.length) * 100);
  const missed = mainResults.flatMap((ok, i) => (ok ? [] : [i]));
  const praise = useMemo(() => PRAISE[Math.floor(Math.random() * PRAISE.length)], [index, round]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAnswer = (ok: boolean) => {
    if (answered) return;
    setResults((r) => [...r, ok]);
    const s = ok ? streak + 1 : 0;
    setStreak(s);
    setBestStreak((b) => Math.max(b, s));
    if (ok) {
      const amount = mode === 'review' ? 5 : xpFor(s);
      setXp((x) => x + amount);
      setGain({ id: Date.now(), amount });
    }
  };

  const next = () => {
    if (index + 1 < deck.length) {
      setIndex(index + 1);
      return;
    }
    if (mode === 'main') {
      setMainResults(results);
      onFinish(Math.round((results.filter(Boolean).length / exercises.length) * 100));
    }
    setPhase('result');
  };

  const startRound = (nextMode: Mode, nextDeck: number[]) => {
    setRound((r) => r + 1);
    setMode(nextMode);
    setDeck(nextDeck);
    setIndex(0);
    setResults([]);
    setStreak(0);
    setPhase('playing');
  };

  const restart = () => {
    setXp(0);
    setBestStreak(0);
    setMainResults([]);
    startRound('main', exercises.map((_, i) => i));
  };

  if (phase === 'result') {
    if (mode === 'review') {
      const fixed = results.filter(Boolean).length;
      return (
        <div className="glass-strong rounded-2xl p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
            <RefreshCcw size={56} className="mx-auto text-brand-600" aria-hidden />
          </motion.div>
          <p className="mt-4 text-2xl font-semibold text-slate-900">Repaso completado</p>
          <p className="mt-2 text-slate-600">Corregiste {fixed} de {deck.length} ejercicios que habías fallado.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {results.some((ok) => !ok) && (
              <button onClick={() => startRound('review', deck.filter((_, i) => !results[i]))} className="btn-primary">
                <RefreshCcw size={18} aria-hidden /> Repasar los que faltan ({results.filter((ok) => !ok).length})
              </button>
            )}
            <button onClick={restart} disabled={finishing} className="btn-glass">
              <RotateCcw size={18} aria-hidden /> Practicar todo de nuevo
            </button>
          </div>
        </div>
      );
    }

    const great = score >= 80;
    return (
      <div className="glass-strong relative overflow-hidden rounded-2xl p-8 text-center">
        {great && <Burst />}
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}>
          <Trophy size={64} className={cn('mx-auto', great ? 'text-accent-500' : 'text-slate-400')} aria-hidden />
        </motion.div>
        <p className="mt-4 text-5xl font-semibold text-slate-900">{score}%</p>
        <p className="mt-2 text-lg font-semibold text-slate-700">
          {great ? '¡Lección dominada! 🎉' : score >= 50 ? '¡Buen trabajo! Un repaso más y la dominas.' : 'Vas bien. Repasa el vocabulario y vuelve a intentarlo.'}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {mainResults.filter(Boolean).length} de {exercises.length} correctas{bestScore !== null && ` · Tu mejor nota: ${Math.max(bestScore, score)}%`}
        </p>

        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="flex items-center justify-center gap-1 text-2xl font-semibold text-amber-500"><Zap size={20} className="fill-amber-400" aria-hidden /><CountUp to={xp} /></p>
            <p className="text-xs font-semibold text-slate-500">XP ganados</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="flex items-center justify-center gap-1 text-2xl font-semibold text-orange-500"><Flame size={20} className="fill-orange-400" aria-hidden />{bestStreak}</p>
            <p className="text-xs font-semibold text-slate-500">Mejor racha</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3">
            <p className="text-2xl font-semibold text-slate-900">{missed.length}</p>
            <p className="text-xs font-semibold text-slate-500">Por repasar</p>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-1" aria-hidden>
          {mainResults.map((ok, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
              className={cn('h-2 w-4 rounded-full', ok ? 'bg-emerald-500' : 'bg-rose-300')}
            />
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {missed.length > 0 && (
            <button onClick={() => startRound('review', missed)} className="btn-primary">
              <RefreshCcw size={18} aria-hidden /> Repasar mis fallos ({missed.length})
            </button>
          )}
          <button onClick={restart} disabled={finishing} className="btn-glass">
            <RotateCcw size={18} aria-hidden /> Practicar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong relative rounded-2xl p-5 sm:p-8">
      {mode === 'review' && (
        <p className="mb-4 flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
          <RefreshCcw size={16} aria-hidden /> Modo repaso: solo los ejercicios que fallaste
        </p>
      )}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/70" role="progressbar" aria-valuenow={index + (answered ? 1 : 0)} aria-valuemin={0} aria-valuemax={deck.length} aria-label="Progreso de la práctica">
          <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: `${((index + (answered ? 1 : 0)) / deck.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-slate-600">{index + 1}/{deck.length}</span>
        <span className="relative flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold tabular-nums text-amber-700" aria-label={`${xp} puntos de experiencia`}>
          <Zap size={14} className="fill-amber-400" aria-hidden /> {xp}
          <AnimatePresence>
            {gain && (
              <motion.span
                key={gain.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.9 }}
                onAnimationComplete={() => setGain(null)}
                className="pointer-events-none absolute -top-2 right-0 text-sm font-semibold text-amber-500"
                aria-hidden
              >
                +{gain.amount}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <AnimatePresence>
          {streak >= 2 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-sm font-bold text-orange-600">
              <Flame size={14} className="fill-orange-400" aria-hidden /> {streak}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{TYPE_LABEL[ex.type]}</p>

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
                <p className={cn('font-bold', lastOk ? 'text-emerald-800' : 'text-rose-800')}>
                  {lastOk ? (streak >= 3 ? `${praise} Racha de ${streak} 🔥 (+5 XP extra)` : praise) : 'Casi. ¡Así se aprende! Lo repasarás al final.'}
                </p>
                {explanationOf(ex) && <p className="text-sm text-slate-700">{explanationOf(ex)}</p>}
              </div>
            </div>
            <button onClick={next} autoFocus className={cn('btn shrink-0 text-white', lastOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800')}>
              {index + 1 < deck.length ? 'Continuar' : 'Ver resultado'} <ArrowRight size={18} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{correctCount} correctas</span>
    </div>
  );
}
