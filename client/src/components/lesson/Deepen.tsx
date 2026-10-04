import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Check, CheckCircle2, Eye, Globe2, Lightbulb, Mic, Pause, Play, Rocket, Volume2, X } from 'lucide-react';
import { pronunciationScore, useListen, useSpeak } from '@/hooks/useSpeech';
import { cn } from '@/lib/format';
import type { Culture, Mission, Mistake, Pronunciation, Reading } from '@/lib/lessonContent';
import { Options } from './exercises/Exercises';

/* ───────────────────────────── Lectura ───────────────────────────── */

export function ReadingView({ reading }: { reading: Reading }) {
  const { speak, stop } = useSpeak();
  const [active, setActive] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [showGlossary, setShowGlossary] = useState(true);
  const playing = useRef(false);
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;

  const playFrom = (i: number) => {
    if (i >= reading.paragraphs.length || !playing.current) {
      playing.current = false;
      setActive(null);
      return;
    }
    setActive(i);
    speak(reading.paragraphs[i], { rate: 0.88, onEnd: () => setTimeout(() => playFrom(i + 1), 500) });
  };
  const toggle = () => {
    if (playing.current) {
      playing.current = false;
      stop();
      setActive(null);
    } else {
      playing.current = true;
      playFrom(0);
    }
  };
  useEffect(() => () => {
    playing.current = false;
  }, []);

  return (
    <section className="space-y-5">
      <article className="glass-strong rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <BookOpenText size={22} className="text-brand-600" aria-hidden /> {reading.title}
          </h3>
          <button onClick={toggle} className="btn-primary px-4 py-2 text-sm">
            {active !== null ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />} {active !== null ? 'Detener' : 'Escuchar lectura'}
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {reading.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              onClick={() => speak(p, { rate: 0.88 })}
              className={cn(
                'cursor-pointer rounded-2xl p-3 text-[1.05rem] leading-relaxed text-slate-800 transition hover:bg-white/60',
                active === i && 'bg-white/90 shadow-sm ring-2 ring-accent-300',
              )}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1 text-xs text-slate-500"><Volume2 size={12} aria-hidden /> Toca un párrafo para escucharlo.</p>

        {reading.glossary.length > 0 && (
          <div className="mt-5">
            <button onClick={() => setShowGlossary((s) => !s)} className="text-sm font-semibold text-slate-600 hover:text-slate-900" aria-expanded={showGlossary}>
              {showGlossary ? 'Ocultar' : 'Mostrar'} glosario ({reading.glossary.length})
            </button>
            <AnimatePresence>
              {showGlossary && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 flex flex-wrap gap-2 overflow-hidden">
                  {reading.glossary.map((g) => (
                    <li key={g.en}>
                      <button onClick={() => speak(g.en)} className="rounded-full bg-white/80 px-3 py-1.5 text-sm shadow-sm hover:bg-white">
                        <strong className="text-slate-900">{g.en}</strong> <span className="text-slate-500">· {g.es}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </article>

      <div className="glass-strong rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-bold text-slate-900">Comprensión de lectura</h4>
          <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold tabular-nums text-slate-700">
            {correct}/{reading.questions.length}
          </span>
        </div>
        <ol className="mt-5 space-y-6">
          {reading.questions.map((q, i) => (
            <li key={i}>
              <p className="mb-3 font-semibold text-slate-900">{i + 1}. {q.q}</p>
              <Options options={q.options} answer={q.answer} done={i in answers} onPick={(pick) => setAnswers((a) => ({ ...a, [i]: pick === q.answer }))} />
              {i in answers && q.explanation && <p className="mt-2 text-sm text-slate-600">💡 {q.explanation}</p>}
            </li>
          ))}
        </ol>
        <AnimatePresence>
          {answered === reading.questions.length && (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn('mt-6 rounded-2xl p-4 text-center font-bold', correct === answered ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900')}
              role="status"
            >
              {correct === answered ? '🎯 ¡Comprensión perfecta!' : `Entendiste ${correct} de ${answered}. Relee los párrafos y vuelve a intentarlo cuando quieras.`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────── Errores típicos ─────────────────────── */

function MistakeCard({ m, index }: { m: Mistake; index: number }) {
  const [open, setOpen] = useState(false);
  const { speak } = useSpeak();
  return (
    <motion.li initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="glass-strong rounded-3xl p-5">
      <p className="flex items-start gap-2 font-semibold text-rose-800">
        <X size={18} className="mt-0.5 shrink-0" aria-hidden />
        <span className={cn('transition', open && 'line-through decoration-rose-300 opacity-60')}>{m.wrong}</span>
      </p>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="fix" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
            <p className="mt-3 flex items-start gap-2 text-lg font-bold text-emerald-800">
              <Check size={20} className="mt-1 shrink-0" aria-hidden />
              <span>{m.right}</span>
              <button onClick={() => speak(m.right)} className="ml-auto shrink-0 rounded-full bg-emerald-600 p-1.5 text-white" aria-label={`Escuchar: ${m.right}`}>
                <Volume2 size={14} aria-hidden />
              </button>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.why}</p>
          </motion.div>
        ) : (
          <motion.button key="btn" onClick={() => setOpen(true)} whileTap={{ scale: 0.97 }} className="btn-glass mt-3 px-4 py-2 text-sm">
            <Eye size={16} aria-hidden /> ¿Cómo se dice bien?
          </motion.button>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function MistakesView({ mistakes }: { mistakes: Mistake[] }) {
  return (
    <section>
      <p className="mb-4 text-slate-600">
        Los errores que más cometemos los hispanohablantes en este tema. Antes de ver la corrección, intenta descubrir el error tú.
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {mistakes.map((m, i) => <MistakeCard key={m.wrong} m={m} index={i} />)}
      </ul>
    </section>
  );
}

/* ───────────────────── Laboratorio de pronunciación ───────────────────── */

export function PronunciationLab({ pronunciation }: { pronunciation: Pronunciation }) {
  const { speak } = useSpeak();
  const { start, listening, transcript, supported, reset } = useListen();
  const [current, setCurrent] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});

  // Cuando llega lo que dijo el estudiante, se califica la palabra activa
  useEffect(() => {
    if (current === null || !transcript) return;
    const pct = pronunciationScore(pronunciation.words[current].word, transcript).pct;
    setScores((s) => ({ ...s, [current]: Math.max(pct, s[current] ?? 0) }));
  }, [transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  const record = (i: number) => {
    reset();
    setCurrent(i);
    start();
  };
  const mastered = Object.values(scores).filter((s) => s >= 70).length;

  return (
    <section className="glass-strong rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Laboratorio de pronunciación</p>
          <h3 className="text-xl font-bold text-slate-900">{pronunciation.focus}</h3>
        </div>
        {supported && (
          <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold tabular-nums text-slate-700">
            {mastered}/{pronunciation.words.length} dominadas
          </span>
        )}
      </div>
      <p className="mt-4 flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <Lightbulb size={18} className="shrink-0" aria-hidden /> {pronunciation.tip}
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {pronunciation.words.map((w, i) => {
          const score = scores[i];
          const isActive = current === i && listening;
          return (
            <motion.li
              key={w.word}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={cn('relative overflow-hidden rounded-3xl bg-white/80 p-4 shadow-sm', score !== undefined && score >= 70 && 'ring-2 ring-emerald-400')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">{w.word}</p>
                  <p className="text-sm text-slate-500">{w.sounds}</p>
                  {w.es && <p className="text-xs text-slate-400">{w.es}</p>}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => speak(w.word, { rate: 0.75 })} className="rounded-full bg-brand-600 p-2 text-white" aria-label={`Escuchar ${w.word}`}>
                    <Volume2 size={16} aria-hidden />
                  </button>
                  {supported && (
                    <motion.button
                      onClick={() => record(i)}
                      disabled={listening}
                      animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: isActive ? Infinity : 0, duration: 0.9 }}
                      className={cn('rounded-full p-2 text-white', isActive ? 'bg-rose-500' : 'bg-slate-900')}
                      aria-label={`Grabarte diciendo ${w.word}`}
                    >
                      <Mic size={16} aria-hidden />
                    </motion.button>
                  )}
                </div>
              </div>
              {score !== undefined && (
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div className={cn('h-full rounded-full', score >= 70 ? 'bg-emerald-500' : 'bg-amber-400')} initial={{ width: 0 }} animate={{ width: `${score}%` }} />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {score >= 70 ? '¡Muy bien!' : 'Casi: escucha otra vez y repite'} · {score}%
                  </p>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
      {!supported && <p className="mt-4 text-sm text-slate-500">Tu navegador no reconoce voz (prueba Chrome). Escucha cada palabra y repítela en voz alta.</p>}
    </section>
  );
}

/* ───────────────────────────── Cultura ───────────────────────────── */

export function CultureCard({ culture }: { culture: Culture }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 p-6 text-white shadow-xl sm:p-8"
    >
      <motion.div
        className="pointer-events-none absolute -bottom-16 -right-10 text-[10rem] leading-none opacity-10"
        animate={{ rotate: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      >
        <Globe2 size={200} />
      </motion.div>
      <p className="relative text-sm font-semibold uppercase tracking-widest text-white/60">Dato cultural</p>
      <h3 className="relative mt-1 text-xl font-bold">{culture.title}</h3>
      <p className="relative mt-3 max-w-2xl leading-relaxed text-white/85">{culture.body}</p>
    </motion.aside>
  );
}

/* ───────────────────────────── Misión ───────────────────────────── */

const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* modo privado: el borrador solo vive en memoria */
    }
  },
};

export function MissionCard({ mission, storageKey }: { mission: Mission; storageKey: string }) {
  const { speak } = useSpeak();
  const [draft, setDraft] = useState(() => storage.get(`${storageKey}:draft`) ?? '');
  const [checked, setChecked] = useState<boolean[]>(() => mission.steps.map(() => false));
  const [showModel, setShowModel] = useState(false);
  const [done, setDone] = useState(() => storage.get(`${storageKey}:done`) === '1');

  useEffect(() => storage.set(`${storageKey}:draft`, draft), [draft, storageKey]);
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const complete = () => {
    setDone(true);
    storage.set(`${storageKey}:done`, '1');
  };

  return (
    <section className="glass-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <motion.span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          aria-hidden
        >
          <Rocket size={22} />
        </motion.span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Misión para la vida real</p>
          <h3 className="text-xl font-bold text-slate-900">{mission.title}</h3>
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-slate-700">{mission.task}</p>

      {mission.steps.length > 0 && (
        <ul className="mt-5 space-y-2">
          {mission.steps.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                aria-pressed={checked[i]}
                className={cn('flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition', checked[i] ? 'bg-emerald-50 text-emerald-900' : 'bg-white/70 text-slate-800 hover:bg-white')}
              >
                <motion.span
                  animate={checked[i] ? { scale: [1, 1.3, 1] } : {}}
                  className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2', checked[i] ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300')}
                >
                  {checked[i] && <Check size={14} aria-hidden />}
                </motion.span>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-700">Tu borrador (se guarda en este dispositivo)</span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Escribe aquí tu versión en inglés…"
          className="mt-2 w-full rounded-2xl border-2 border-white bg-white/80 p-4 leading-relaxed outline-none focus:border-brand-500"
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span className="tabular-nums">{words} palabras</span>
        {draft.trim() && (
          <button onClick={() => speak(draft, { rate: 0.9 })} className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900">
            <Volume2 size={14} aria-hidden /> Escuchar mi texto
          </button>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {mission.model && (
          <button onClick={() => setShowModel((s) => !s)} className="btn-glass" aria-expanded={showModel}>
            <Eye size={18} aria-hidden /> {showModel ? 'Ocultar' : 'Ver'} respuesta modelo
          </button>
        )}
        <button onClick={complete} disabled={done} className={cn('btn text-white', done ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800')}>
          <CheckCircle2 size={18} aria-hidden /> {done ? 'Misión cumplida' : 'Marcar como cumplida'}
        </button>
      </div>

      <AnimatePresence>
        {showModel && mission.model && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 rounded-2xl bg-white/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Respuesta modelo</p>
                <button onClick={() => speak(mission.model!, { rate: 0.9 })} className="rounded-full bg-brand-600 p-1.5 text-white" aria-label="Escuchar respuesta modelo">
                  <Volume2 size={14} aria-hidden />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-800">{mission.model}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {done && (
          <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center font-bold text-emerald-800" role="status">
            🚀 ¡Eso es aprender de verdad! Usar el inglés fuera de la plataforma es lo que más acelera tu progreso.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
