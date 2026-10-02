import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Volume2 } from 'lucide-react';
import { useSpeak } from '@/hooks/useSpeech';
import type { VocabItem } from '@/lib/lessonContent';

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

export function Vocabulary({ items }: { items: VocabItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item, i) => <VocabCard key={item.en} item={item} index={i} />)}
    </ul>
  );
}
