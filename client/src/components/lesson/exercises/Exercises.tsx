import { useMemo, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Check, Mic, PenLine, Volume2, X } from 'lucide-react';
import { pronunciationScore, useListen, useSpeak } from '@/hooks/useSpeech';
import { cn } from '@/lib/format';
import { isFixCorrect, isUnchanged, normalizeAnswer, shuffle, wordAccuracy, type Exercise } from '@/lib/lessonContent';

/** Contrato común: cada ejercicio informa una sola vez si fue correcto. */
export type ExerciseProps<T extends Exercise['type']> = {
  ex: Extract<Exercise, { type: T }>;
  done: boolean;
  onAnswer: (correct: boolean) => void;
};

const optionClass = (state: 'idle' | 'right' | 'wrong' | 'dim') =>
  cn(
    'w-full rounded-2xl border-2 px-4 py-3.5 text-left font-semibold transition',
    state === 'idle' && 'border-white/80 bg-white/70 hover:border-brand-300 hover:bg-white',
    state === 'right' && 'border-emerald-500 bg-emerald-50 text-emerald-900',
    state === 'wrong' && 'border-rose-400 bg-rose-50 text-rose-900',
    state === 'dim' && 'border-transparent bg-white/40 text-slate-400',
  );

export function Options({ options, answer, done, onPick }: { options: string[]; answer: number; done: boolean; onPick: (i: number) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="grid gap-2.5" role="radiogroup">
      {options.map((opt, i) => {
        const state = !done ? 'idle' : i === answer ? 'right' : i === picked ? 'wrong' : 'dim';
        return (
          <motion.button
            key={opt}
            role="radio"
            aria-checked={picked === i}
            disabled={done}
            whileTap={{ scale: 0.98 }}
            animate={done && i === picked && i !== answer ? { x: [0, -8, 8, -4, 0] } : {}}
            onClick={() => {
              setPicked(i);
              onPick(i);
            }}
            className={optionClass(state)}
          >
            <span className="flex items-center justify-between gap-3">
              {opt}
              {state === 'right' && <Check size={18} aria-label="Correcta" />}
              {state === 'wrong' && <X size={18} aria-label="Incorrecta" />}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function ChoiceExercise({ ex, done, onAnswer }: ExerciseProps<'choice'>) {
  return (
    <div>
      <p className="mb-4 text-lg font-bold text-slate-900">{ex.prompt}</p>
      <Options options={ex.options} answer={ex.answer} done={done} onPick={(i) => onAnswer(i === ex.answer)} />
    </div>
  );
}

export function ListenExercise({ ex, done, onAnswer }: ExerciseProps<'listen'>) {
  const { speak, speaking } = useSpeak();
  return (
    <div>
      <p className="mb-4 text-lg font-bold text-slate-900">Escucha y elige el significado</p>
      <div className="mb-5 flex gap-3">
        <motion.button
          onClick={() => speak(ex.audio)}
          animate={speaking ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: speaking ? Infinity : 0, duration: 0.8 }}
          className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-lg"
          aria-label="Reproducir audio"
        >
          <Volume2 size={28} aria-hidden />
        </motion.button>
        <button onClick={() => speak(ex.audio, { rate: 0.65 })} className="btn-glass self-center px-4 py-2 text-sm" aria-label="Reproducir lento">
          🐢 Lento
        </button>
      </div>
      <Options options={ex.options} answer={ex.answer} done={done} onPick={(i) => onAnswer(i === ex.answer)} />
      {done && <p className="mt-3 text-sm text-slate-500">Audio: “{ex.audio}”</p>}
    </div>
  );
}

export function TrueFalseExercise({ ex, done, onAnswer }: ExerciseProps<'truefalse'>) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">¿Verdadero o falso?</p>
      <p className="mb-4 text-lg font-bold text-slate-900">{ex.statement}</p>
      <Options options={['Verdadero', 'Falso']} answer={ex.answer ? 0 : 1} done={done} onPick={(i) => onAnswer((i === 0) === ex.answer)} />
    </div>
  );
}

export function FillExercise({ ex, done, onAnswer }: ExerciseProps<'fill'>) {
  const [value, setValue] = useState('');
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [before, after] = ex.sentence.split('___');
  const check = () => {
    if (!value.trim() || done) return;
    const ok = ex.answers.some((a) => normalizeAnswer(a) === normalizeAnswer(value));
    setCorrect(ok);
    onAnswer(ok);
  };
  return (
    <div>
      <p className="mb-4 text-lg font-bold text-slate-900">Completa la frase</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
        className="flex flex-wrap items-center gap-2 text-xl font-semibold text-slate-900"
      >
        <span>{before}</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={done}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Respuesta"
          size={Math.max(6, value.length + 1)}
          className={cn(
            'rounded-xl border-b-4 bg-white/80 px-3 py-1.5 text-center outline-none transition',
            correct === null ? 'border-brand-400 focus:border-brand-600' : correct ? 'border-emerald-500 text-emerald-700' : 'border-rose-400 text-rose-700',
          )}
        />
        <span>{after}</span>
        {!done && (
          <button type="submit" disabled={!value.trim()} className="btn-primary ml-auto mt-2 w-full sm:w-auto">Comprobar</button>
        )}
      </form>
      {ex.hint && !done && <p className="mt-3 text-sm text-slate-500">💡 Pista: {ex.hint}</p>}
      {done && !correct && <p className="mt-3 text-sm text-slate-600">Respuesta correcta: <strong>{ex.answers[0]}</strong></p>}
    </div>
  );
}

export function OrderExercise({ ex, done, onAnswer }: ExerciseProps<'order'>) {
  // Cada palabra con id propio: puede haber palabras repetidas ("the", "to")
  const bank = useMemo(() => shuffle(ex.words.map((w, i) => ({ id: `${i}-${w}`, w }))), [ex.words]);
  const [answer, setAnswer] = useState<typeof bank>([]);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const available = bank.filter((b) => !answer.some((a) => a.id === b.id));

  const check = () => {
    const ok = answer.map((a) => a.w).join(' ') === ex.words.join(' ');
    setCorrect(ok);
    onAnswer(ok);
  };

  return (
    <div>
      <p className="mb-1 text-lg font-bold text-slate-900">Ordena la frase</p>
      <p className="mb-4 text-slate-600">“{ex.translation}”</p>
      <Reorder.Group
        axis="x"
        values={answer}
        onReorder={done ? () => undefined : setAnswer}
        className={cn(
          'flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3',
          correct === null ? 'border-slate-300 bg-white/50' : correct ? 'border-emerald-400 bg-emerald-50' : 'border-rose-300 bg-rose-50',
        )}
        aria-label="Tu respuesta"
      >
        {answer.map((a) => (
          <Reorder.Item key={a.id} value={a} className="touch-none list-none" dragListener={!done}>
            <button
              disabled={done}
              onClick={() => setAnswer((s) => s.filter((x) => x.id !== a.id))}
              className="rounded-full bg-brand-600 px-4 py-2 font-semibold text-white shadow"
            >
              {a.w}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Palabras disponibles">
        {available.map((b) => (
          <motion.button
            key={b.id}
            layout
            disabled={done}
            whileTap={{ scale: 0.92 }}
            onClick={() => setAnswer((s) => [...s, b])}
            className="rounded-full border border-white/80 bg-white/80 px-4 py-2 font-semibold text-slate-800 shadow-sm hover:border-brand-300"
          >
            {b.w}
          </motion.button>
        ))}
      </div>
      {!done && (
        <button onClick={check} disabled={answer.length !== ex.words.length} className="btn-primary mt-5 w-full sm:w-auto">Comprobar</button>
      )}
      {done && !correct && <p className="mt-3 text-sm text-slate-600">Orden correcto: <strong>{ex.words.join(' ')}</strong></p>}
    </div>
  );
}

export function MatchExercise({ ex, done, onAnswer }: ExerciseProps<'match'>) {
  const left = useMemo(() => shuffle(ex.pairs.map(([l]) => l)), [ex.pairs]);
  const right = useMemo(() => shuffle(ex.pairs.map(([, r]) => r)), [ex.pairs]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const correctFor = (l: string) => ex.pairs.find(([a]) => a === l)?.[1];

  const pickRight = (r: string) => {
    if (!selected || done) return;
    if (correctFor(selected) === r) {
      const next = new Set(matched).add(selected);
      setMatched(next);
      setSelected(null);
      // Correcto si terminó con como máximo un error
      if (next.size === ex.pairs.length) onAnswer(mistakes <= 1);
    } else {
      setMistakes((m) => m + 1);
      setWrong(r);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const isRightMatched = (r: string) => [...matched].some((l) => correctFor(l) === r);

  return (
    <div>
      <p className="mb-4 text-lg font-bold text-slate-900">{ex.prompt ?? 'Une las parejas'}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">
          {left.map((l) => (
            <motion.button
              key={l}
              layout
              disabled={matched.has(l) || done}
              onClick={() => setSelected(l)}
              aria-pressed={selected === l}
              className={cn(
                optionClass(matched.has(l) ? 'right' : 'idle'),
                selected === l && 'border-brand-600 bg-white ring-4 ring-brand-100',
              )}
            >
              {l}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2.5">
          {right.map((r) => (
            <motion.button
              key={r}
              disabled={isRightMatched(r) || done}
              onClick={() => pickRight(r)}
              animate={wrong === r ? { x: [0, -8, 8, -4, 0] } : {}}
              className={optionClass(isRightMatched(r) ? 'right' : wrong === r ? 'wrong' : 'idle')}
            >
              {r}
            </motion.button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">Toca una palabra a la izquierda y luego su pareja.</p>
    </div>
  );
}

export function SpeakExercise({ ex, done, onAnswer }: ExerciseProps<'speak'>) {
  const { speak } = useSpeak();
  const { start, listening, transcript, supported } = useListen();
  const result = transcript ? pronunciationScore(ex.phrase, transcript) : null;

  return (
    <div>
      <p className="mb-1 text-lg font-bold text-slate-900">Dilo en voz alta</p>
      <p className="mb-4 text-slate-600">{ex.translation}</p>
      <p className="rounded-2xl bg-white/70 p-4 text-center text-xl font-bold leading-relaxed sm:text-2xl">
        {result
          ? result.words.map((w, i) => (
              <span key={i} className={cn('mr-1.5 rounded-md px-1', w.ok ? 'text-emerald-700' : 'bg-rose-100 text-rose-700')}>{w.word}</span>
            ))
          : ex.phrase}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={() => speak(ex.phrase, { rate: 0.85 })} className="btn-glass"><Volume2 size={18} aria-hidden /> Escuchar</button>
        {supported ? (
          <button onClick={start} disabled={listening || done} className={cn('btn-primary', listening && 'animate-pulse')}>
            <Mic size={18} aria-hidden /> {listening ? 'Te escucho…' : transcript ? 'Intentar de nuevo' : 'Hablar'}
          </button>
        ) : (
          !done && (
            <button onClick={() => onAnswer(true)} className="btn-primary">
              <Check size={18} aria-hidden /> Ya lo dije en voz alta
            </button>
          )
        )}
      </div>
      <div aria-live="polite" className="mt-4 text-center">
        {!supported && <p className="text-sm text-slate-500">Tu navegador no reconoce voz (prueba Chrome). Escucha, repite en voz alta y continúa.</p>}
        {result && (
          <>
            <p className="text-sm text-slate-500">Escuché: “{transcript}”</p>
            <p className={cn('mt-1 text-lg font-bold', result.pct >= 70 ? 'text-emerald-600' : 'text-amber-600')}>Precisión: {result.pct}%</p>
            {!done && (
              <button onClick={() => onAnswer(result.pct >= 70)} className="btn-primary mt-3">
                {result.pct >= 70 ? '¡Bien! Continuar' : 'Continuar así'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Botón grande de audio con modo lento; se reutiliza en dictado. */
function AudioButtons({ text }: { text: string }) {
  const { speak, speaking } = useSpeak();
  return (
    <div className="mb-5 flex gap-3">
      <motion.button
        onClick={() => speak(text)}
        animate={speaking ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: speaking ? Infinity : 0, duration: 0.8 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-brand-600 text-white shadow-lg"
        aria-label="Reproducir audio"
      >
        <Volume2 size={28} aria-hidden />
      </motion.button>
      <button onClick={() => speak(text, { rate: 0.6 })} className="btn-glass self-center px-4 py-2 text-sm" aria-label="Reproducir lento">
        🐢 Lento
      </button>
    </div>
  );
}

/** Palabras coloreadas según si el estudiante las escribió (dictado). */
function WordDiff({ words }: { words: { word: string; ok: boolean }[] }) {
  return (
    <p className="mt-4 flex flex-wrap gap-1.5 text-lg font-semibold">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={cn('rounded-lg px-2 py-0.5', w.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700')}
        >
          {w.word}
        </motion.span>
      ))}
    </p>
  );
}

export function DictationExercise({ ex, done, onAnswer }: ExerciseProps<'dictation'>) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<ReturnType<typeof wordAccuracy> | null>(null);
  const check = () => {
    if (!value.trim() || done) return;
    const r = wordAccuracy(ex.audio, value);
    setResult(r);
    // Tolera un error menor (una tilde, una palabra corta) en frases largas
    onAnswer(r.pct >= 85);
  };
  return (
    <div>
      <p className="mb-1 text-lg font-bold text-slate-900">Dictado: escucha y escribe</p>
      <p className="mb-4 text-sm text-slate-500">Escucha cuantas veces quieras. Usa el modo lento si lo necesitas.</p>
      <AudioButtons text={ex.audio} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={done}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Escribe lo que escuchas…"
          aria-label="Lo que escuchaste"
          className={cn(
            'w-full rounded-2xl border-2 bg-white/80 px-4 py-3.5 text-lg font-semibold outline-none transition',
            !result ? 'border-white focus:border-brand-500' : result.pct >= 85 ? 'border-emerald-500' : 'border-rose-400',
          )}
        />
        {!done && <button type="submit" disabled={!value.trim()} className="btn-primary mt-4 w-full sm:w-auto">Comprobar</button>}
      </form>
      {result && (
        <div aria-live="polite">
          <WordDiff words={result.words} />
          <p className="mt-2 text-sm text-slate-600">
            Precisión: <strong>{result.pct}%</strong> · Frase: “{ex.audio}”{ex.translation && <> · <em>{ex.translation}</em></>}
          </p>
        </div>
      )}
    </div>
  );
}

export function FixExercise({ ex, done, onAnswer }: ExerciseProps<'fix'>) {
  const [value, setValue] = useState(ex.sentence);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const check = () => {
    if (done || isUnchanged(ex.sentence, value)) return;
    const ok = isFixCorrect(ex.sentence, ex.answers, value);
    setCorrect(ok);
    onAnswer(ok);
  };
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900"><PenLine size={20} className="text-brand-600" aria-hidden /> Corrige el error</p>
      <p className="mb-4 text-sm text-slate-500">Esta frase tiene un error típico de hispanohablantes. Edítala y comprueba.</p>
      <motion.p
        initial={{ rotate: -1, scale: 0.97 }}
        animate={{ rotate: 0, scale: 1 }}
        className="mb-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/70 p-4 text-lg font-semibold text-rose-900"
      >
        <X size={18} className="mr-1.5 inline -translate-y-0.5" aria-hidden />
        {ex.sentence}
      </motion.p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={done}
          rows={2}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Frase corregida"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              check();
            }
          }}
          className={cn(
            'w-full resize-none rounded-2xl border-2 bg-white/80 px-4 py-3 text-lg font-semibold outline-none transition',
            correct === null ? 'border-white focus:border-brand-500' : correct ? 'border-emerald-500 text-emerald-800' : 'border-rose-400',
          )}
        />
        {!done && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="submit" disabled={isUnchanged(ex.sentence, value)} className="btn-primary">Comprobar</button>
            <button type="button" onClick={() => setValue(ex.sentence)} className="btn-glass">Restaurar</button>
          </div>
        )}
      </form>
      {done && !correct && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-emerald-900">
          <Check size={18} className="mt-1 shrink-0" aria-hidden /> <span><strong>Versión correcta:</strong> {ex.answers[0]}</span>
        </p>
      )}
    </div>
  );
}
