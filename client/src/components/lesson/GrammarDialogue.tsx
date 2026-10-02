import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages, Lightbulb, Pause, Play, Volume2 } from 'lucide-react';
import { useSpeak } from '@/hooks/useSpeech';
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

/** Diálogo tipo chat. "Reproducir" lee cada línea en orden y resalta quién habla. */
export function DialogueReader({ dialogue }: { dialogue: Dialogue }) {
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
