import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Drama, EyeOff, Languages, Lightbulb, Mic, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { pronunciationScore, useListen, useSpeak } from '@/hooks/useSpeech';
import { cn } from '@/lib/format';
import type { Dialogue, Grammar } from '@/lib/lessonContent';

export function GrammarCard({ grammar }: { grammar: Grammar }) {
  const { speak } = useSpeak();
  return (
    <section className="glass-strong rounded-[2rem] p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">{grammar.title}</h3>
      <p className="mt-3 leading-relaxed text-slate-700">{grammar.explanation}</p>
      <ul className="mt-5 space-y-2">
        {grammar.examples.map((ex, i) => (
          <motion.li
            key={ex.en}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-2xl bg-white/70 p-3"
          >
            <button onClick={() => speak(ex.en)} className="mt-0.5 shrink-0 rounded-full bg-brand-600 p-1.5 text-white" aria-label={`Escuchar: ${ex.en}`}>
              <Volume2 size={14} aria-hidden />
            </button>
            <div>
              <p className="font-semibold text-slate-900">{ex.en}</p>
              <p className="text-sm text-slate-500">{ex.es}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      {grammar.tip && (
        <p className="mt-5 flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <Lightbulb size={18} className="shrink-0" aria-hidden /> {grammar.tip}
        </p>
      )}
    </section>
  );
}

/**
 * Juego de roles: el estudiante escoge un personaje; las líneas del otro las lee la voz
 * y las suyas las dice él con el micrófono (o en voz alta si el navegador no reconoce voz).
 */
function RolePlay({ dialogue, role, onExit }: { dialogue: Dialogue; role: string; onExit: () => void }) {
  const { speak } = useSpeak();
  const { start, listening, transcript, supported, reset } = useListen();
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [challenge, setChallenge] = useState(false);
  const alive = useRef(true);
  const line = dialogue.lines[i];
  const mine = line?.speaker === role;
  const finished = i >= dialogue.lines.length;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (!line) return;
    reset();
    if (mine) return;
    // Avanza una sola vez: al terminar la voz o, si el navegador nunca avisa, por tiempo
    let moved = false;
    const advance = () => {
      if (moved || !alive.current) return;
      moved = true;
      setI((n) => (n === i ? n + 1 : n));
    };
    speak(line.en, { onEnd: () => setTimeout(advance, 350) });
    const fallback = setTimeout(advance, 1500 + line.en.split(' ').length * 450);
    return () => clearTimeout(fallback);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mine && transcript) {
      const pct = pronunciationScore(line.en, transcript).pct;
      setScores((s) => ({ ...s, [i]: Math.max(pct, s[i] ?? 0) }));
    }
  }, [transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  const myScores = Object.values(scores);
  const avg = myScores.length ? Math.round(myScores.reduce((a, b) => a + b, 0) / myScores.length) : null;
  const restart = () => {
    setScores({});
    setI(0);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">Tú eres: {role}</p>
        <div className="flex gap-2">
          <button onClick={() => setChallenge((c) => !c)} aria-pressed={challenge} className={cn('btn px-3 py-1.5 text-sm', challenge ? 'bg-amber-500 text-white' : 'btn-glass')}>
            <EyeOff size={15} aria-hidden /> Modo reto
          </button>
          <button onClick={onExit} className="btn-glass px-3 py-1.5 text-sm">Salir</button>
        </div>
      </div>
      {challenge && <p className="mt-2 text-xs text-slate-500">En modo reto ves tu línea en español y la dices en inglés de memoria.</p>}

      <ol className="mt-5 space-y-3">
        {dialogue.lines.slice(0, Math.min(i + 1, dialogue.lines.length)).map((l, n) => {
          const isMine = l.speaker === role;
          const isCurrent = n === i;
          const hidden = isMine && isCurrent && challenge && scores[n] === undefined;
          return (
            <motion.li key={n} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] rounded-3xl px-4 py-3 sm:max-w-[75%]', isMine ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-white text-slate-900 shadow-sm', isCurrent && 'ring-4 ring-accent-300')}>
                <span className={cn('block text-xs font-bold', isMine ? 'text-white/70' : 'text-slate-500')}>{isMine ? `${l.speaker} (tú)` : l.speaker}</span>
                <span className="mt-0.5 block font-medium">{hidden ? `🇪🇸 ${l.es}` : l.en}</span>
                {isMine && scores[n] !== undefined && (
                  <span className="mt-1 flex items-center gap-1 text-xs font-bold text-white/90">
                    <Check size={12} aria-hidden /> {scores[n]}% de precisión
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {!finished && mine && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap items-center justify-end gap-2" aria-live="polite">
          <p className="mr-auto text-sm font-semibold text-slate-700">🎙️ Tu turno</p>
          <button onClick={() => speak(line.en, { rate: 0.85 })} className="btn-glass px-4 py-2 text-sm"><Volume2 size={16} aria-hidden /> Pista</button>
          {supported && (
            <button onClick={start} disabled={listening} className={cn('btn-primary px-4 py-2 text-sm', listening && 'animate-pulse')}>
              <Mic size={16} aria-hidden /> {listening ? 'Te escucho…' : transcript ? 'Otra vez' : 'Decir mi línea'}
            </button>
          )}
          {(!supported || transcript) && (
            <button onClick={() => setI((n) => n + 1)} className="btn bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
              {supported ? 'Continuar' : 'Ya lo dije'} →
            </button>
          )}
        </motion.div>
      )}

      {finished && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 rounded-3xl bg-emerald-50 p-5 text-center" role="status">
          <p className="text-lg font-black text-emerald-800">🎭 ¡Escena completa!</p>
          {avg !== null && <p className="mt-1 text-emerald-900">Precisión promedio: <strong>{avg}%</strong></p>}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={restart} className="btn-glass"><RotateCcw size={16} aria-hidden /> Repetir</button>
            <button onClick={onExit} className="btn-primary">Cambiar de rol</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** Diálogo tipo chat. "Reproducir" lee cada línea en orden y resalta quién habla. */
export function DialogueReader({ dialogue }: { dialogue: Dialogue }) {
  const [role, setRole] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const speakers = [...new Set(dialogue.lines.map((l) => l.speaker))];

  if (role) {
    return (
      <section className="glass-strong rounded-[2rem] p-6 sm:p-8">
        <h3 className="mb-4 text-xl font-bold text-slate-900">🎭 {dialogue.title}</h3>
        <RolePlay key={role} dialogue={dialogue} role={role} onExit={() => setRole(null)} />
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <ChatDialogue dialogue={dialogue} />
      <div className="glass-strong flex flex-col gap-3 rounded-[2rem] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Drama size={28} className="shrink-0 text-brand-600" aria-hidden />
          <div>
            <p className="font-bold text-slate-900">Actúa el diálogo</p>
            <p className="text-sm text-slate-600">Escoge un personaje: la otra parte la dice la voz y tú respondes con tu micrófono.</p>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {picking ? (
            <motion.div key="pick" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-2">
              {speakers.map((s) => (
                <button key={s} onClick={() => setRole(s)} className="btn-primary px-4 py-2 text-sm">Ser {s}</button>
              ))}
            </motion.div>
          ) : (
            <motion.button key="start" onClick={() => setPicking(true)} className="btn bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
              <Drama size={16} aria-hidden /> Empezar juego de roles
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChatDialogue({ dialogue }: { dialogue: Dialogue }) {
  const { speak, stop } = useSpeak();
  const [active, setActive] = useState<number | null>(null);
  const [showEs, setShowEs] = useState(false);
  const playing = useRef(false);
  const speakers = [...new Set(dialogue.lines.map((l) => l.speaker))];

  const playFrom = (i: number) => {
    if (i >= dialogue.lines.length || !playing.current) {
      playing.current = false;
      setActive(null);
      return;
    }
    setActive(i);
    speak(dialogue.lines[i].en, { onEnd: () => setTimeout(() => playFrom(i + 1), 450) });
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
    <section className="glass-strong rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-900">💬 {dialogue.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowEs((s) => !s)} aria-pressed={showEs} className={cn('btn px-4 py-2 text-sm', showEs ? 'bg-slate-900 text-white' : 'btn-glass')}>
            <Languages size={16} aria-hidden /> Traducción
          </button>
          <button onClick={toggle} className="btn-primary px-4 py-2 text-sm">
            {active !== null ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />} {active !== null ? 'Detener' : 'Escuchar diálogo'}
          </button>
        </div>
      </div>
      <ol className="mt-6 space-y-3">
        {dialogue.lines.map((line, i) => {
          const right = speakers.indexOf(line.speaker) % 2 === 1;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, scale: active === i ? 1.02 : 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn('flex', right ? 'justify-end' : 'justify-start')}
            >
              <button
                onClick={() => speak(line.en)}
                className={cn(
                  'max-w-[85%] rounded-3xl px-4 py-3 text-left transition sm:max-w-[75%]',
                  right ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md bg-white text-slate-900 shadow-sm',
                  active === i && 'ring-4 ring-accent-300',
                )}
              >
                <span className={cn('block text-xs font-bold', right ? 'text-white/70' : 'text-slate-500')}>{line.speaker}</span>
                <span className="mt-0.5 block font-medium">{line.en}</span>
                <AnimatePresence>
                  {showEs && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={cn('block overflow-hidden text-sm', right ? 'text-white/75' : 'text-slate-500')}
                    >
                      {line.es}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ol>
      <p className="mt-4 flex items-center gap-1 text-xs text-slate-500"><Volume2 size={12} aria-hidden /> Toca cualquier mensaje para escucharlo.</p>
    </section>
  );
}
