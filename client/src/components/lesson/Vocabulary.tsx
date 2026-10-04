import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Brain, Check, LayoutGrid, RotateCcw, RotateCw, Undo2, Volume2 } from 'lucide-react';
import { useSpeak } from '@/hooks/useSpeech';
import { cn } from '@/lib/format';
import { shuffle, type VocabItem } from '@/lib/lessonContent';

function VocabCard({ item, index }: { item: VocabItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const { speak } = useSpeak();
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-44 [perspective:1000px]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        <button
          onClick={() => setFlipped(true)}
          tabIndex={flipped ? -1 : 0}
          aria-label={`${item.en}: ver traducción`}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/80 p-4 text-center shadow-sm [backface-visibility:hidden]"
        >
          <span className="text-4xl" aria-hidden>{item.emoji ?? '📘'}</span>
          <span className="mt-2 text-lg font-bold text-slate-900">{item.en}</span>
          <span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><RotateCw size={12} aria-hidden /> Toca para ver</span>
        </button>
        <div aria-hidden={!flipped} className="absolute inset-0 flex flex-col justify-center rounded-3xl bg-brand-900 p-4 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-lg font-bold">{item.es}</p>
          <p className="mt-2 text-sm italic text-white/80">“{item.example}”</p>
          <div className="mt-3 flex gap-2">
            <button tabIndex={flipped ? 0 : -1} onClick={() => speak(item.example)} className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25">
              <Volume2 size={14} aria-hidden /> Escuchar
            </button>
            <button tabIndex={flipped ? 0 : -1} onClick={() => setFlipped(false)} className="rounded-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/10">Volver</button>
          </div>
        </div>
      </motion.div>
      <button onClick={() => speak(item.en)} className="sr-only">Escuchar {item.en}</button>
    </motion.li>
  );
}

/**
 * Repaso tipo flashcards con repetición dentro de la sesión: "Lo sé" saca la tarjeta,
 * "Otra vez" la manda unas posiciones atrás. Se puede deslizar a la derecha / izquierda.
 */
function Flashcards({ items }: { items: VocabItem[] }) {
  const { speak } = useSpeak();
  const [queue, setQueue] = useState(() => shuffle(items));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [reviews, setReviews] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const knowOpacity = useTransform(x, [20, 120], [0, 1]);
  const againOpacity = useTransform(x, [-120, -20], [1, 0]);
  const card = queue[0];

  const answer = (knew: boolean) => {
    setFlipped(false);
    x.set(0);
    if (knew) {
      setKnown((k) => k + 1);
      setQueue((q) => q.slice(1));
    } else {
      setReviews((r) => r + 1);
      // Vuelve a salir pronto (3 tarjetas después), no al final
      setQueue((q) => {
        const [first, ...rest] = q;
        const at = Math.min(3, rest.length);
        return [...rest.slice(0, at), first, ...rest.slice(at)];
      });
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 110) answer(true);
    else if (info.offset.x < -110) answer(false);
  };

  const restart = () => {
    setQueue(shuffle(items));
    setKnown(0);
    setReviews(0);
    setFlipped(false);
  };

  if (!card) {
    return (
      <div className="glass-strong rounded-[2rem] p-8 text-center">
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-6xl" aria-hidden>🧠</motion.p>
        <p className="mt-4 text-2xl font-black text-slate-900">¡Vocabulario dominado!</p>
        <p className="mt-1 text-slate-600">{items.length} palabras · {reviews} repasos extra</p>
        <button onClick={restart} className="btn-glass mt-6"><RotateCcw size={18} aria-hidden /> Repasar otra vez</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/70" aria-hidden>
          <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: `${(known / items.length) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-slate-600">{known}/{items.length}</span>
      </div>

      <div className="relative h-72 [perspective:1000px]">
        {queue[1] && <div className="absolute inset-x-4 top-3 h-full rounded-[2rem] bg-white/50 shadow-sm" aria-hidden />}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={card.en + reviews + known}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={onDragEnd}
            style={{ x, rotate }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <motion.div
              className="relative h-full w-full [transform-style:preserve-3d]"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16 }}
            >
              <button
                onClick={() => {
                  setFlipped(true);
                  speak(card.en);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-white p-6 text-center shadow-xl [backface-visibility:hidden]"
                aria-label={`${card.en}: ver traducción`}
              >
                <span className="text-6xl" aria-hidden>{card.emoji ?? '📘'}</span>
                <span className="mt-4 text-3xl font-black text-slate-900">{card.en}</span>
                <span className="mt-3 flex items-center gap-1 text-sm text-slate-500"><RotateCw size={14} aria-hidden /> ¿Sabes qué significa? Toca para ver</span>
              </button>
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-brand-900 p-6 text-center text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-2xl font-black">{card.es}</p>
                <p className="mt-3 italic text-white/80">“{card.example}”</p>
                <button onClick={() => speak(card.example)} className="mt-4 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold hover:bg-white/25">
                  <Volume2 size={14} aria-hidden /> Escuchar ejemplo
                </button>
              </div>
            </motion.div>
            <motion.span style={{ opacity: knowOpacity }} className="pointer-events-none absolute left-5 top-5 rounded-xl border-2 border-emerald-500 bg-white px-3 py-1 font-black text-emerald-600" aria-hidden>LO SÉ</motion.span>
            <motion.span style={{ opacity: againOpacity }} className="pointer-events-none absolute right-5 top-5 rounded-xl border-2 border-rose-400 bg-white px-3 py-1 font-black text-rose-500" aria-hidden>OTRA VEZ</motion.span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => answer(false)} className="btn-glass justify-center"><Undo2 size={18} aria-hidden /> Otra vez</button>
        <button onClick={() => answer(true)} className="btn justify-center bg-emerald-600 text-white hover:bg-emerald-700"><Check size={18} aria-hidden /> Lo sé</button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">También puedes deslizar la tarjeta: derecha = lo sé, izquierda = otra vez.</p>
    </div>
  );
}

export function Vocabulary({ items }: { items: VocabItem[] }) {
  const [mode, setMode] = useState<'cards' | 'review'>('cards');
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{items.length} palabras y expresiones de esta lección</p>
        <div className="glass flex rounded-full p-1" role="tablist" aria-label="Modo de vocabulario">
          {([['cards', 'Explorar', LayoutGrid], ['review', 'Repasar', Brain]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={cn('flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition', mode === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900')}
            >
              <Icon size={15} aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>
      {mode === 'cards' ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => <VocabCard key={item.en} item={item} index={i} />)}
        </ul>
      ) : (
        <Flashcards items={items} />
      )}
    </div>
  );
}
