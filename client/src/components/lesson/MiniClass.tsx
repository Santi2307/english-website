import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { useSpeak } from '@/hooks/useSpeech';
import { cn } from '@/lib/format';
import type { Slide } from '@/lib/lessonContent';

const PAUSE_BETWEEN_SLIDES = 1400;

/**
 * Mini-clase animada y narrada: reemplaza al video mientras no haya uno grabado.
 * Cada diapositiva aparece palabra por palabra y la voz en inglés la lee.
 */
export function MiniClass({ slides, title }: { slides: Slide[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [slow, setSlow] = useState(false);
  const { speak, stop, speaking, supported } = useSpeak();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const slide = slides[index];
  const finished = started && !playing && index === slides.length - 1 && !speaking;

  const narrate = useCallback(
    (i: number) => {
      clearTimeout(timer.current);
      const next = () => {
        timer.current = setTimeout(() => {
          if (i < slides.length - 1) setIndex(i + 1);
          else setPlaying(false);
        }, PAUSE_BETWEEN_SLIDES);
      };
      if (supported) speak(slides[i].en, { rate: slow ? 0.7 : 0.9, onEnd: next });
      else timer.current = setTimeout(next, 3500); // sin voz: avanza por tiempo
    },
    [slides, speak, supported, slow],
  );

  useEffect(() => {
    if (playing) narrate(index);
    return () => clearTimeout(timer.current);
  }, [index, playing, narrate]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const play = () => {
    setStarted(true);
    if (index === slides.length - 1 && !playing && started) setIndex(0);
    setPlaying(true);
  };
  const pause = () => {
    setPlaying(false);
    stop();
    clearTimeout(timer.current);
  };
  const go = (i: number) => {
    stop();
    clearTimeout(timer.current);
    setIndex(Math.max(0, Math.min(slides.length - 1, i)));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
      {/* Fondo animado sutil */}
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-peach-200/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
        aria-hidden
      />
      <div className="relative flex aspect-video flex-col justify-center px-6 py-8 sm:px-14">
        {!started ? (
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">Mini-clase</p>
            <h3 className="mx-auto mt-2 max-w-xl text-2xl font-semibold sm:text-3xl">{title}</h3>
            <motion.button
              onClick={play}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full bg-white text-brand-800 shadow-xl"
              aria-label="Reproducir mini-clase"
            >
              <Play size={28} className="ml-1 fill-current" aria-hidden />
            </motion.button>
            <p className="mt-3 text-sm text-white/60">{slides.length} diapositivas · con audio en inglés</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              aria-live="polite"
            >
              <p className="text-2xl font-semibold leading-snug sm:text-4xl">
                {slide.en.split(' ').map((w, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="mr-[0.28em] inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + slide.en.split(' ').length * 0.07 }}
                className="mt-4 text-lg text-white/75"
              >
                {slide.es}
              </motion.p>
              {slide.note && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + slide.en.split(' ').length * 0.07 }}
                  className="mt-4 inline-block rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/90 ring-1 ring-white/15"
                >
                  💡 {slide.note}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {started && (
        <div className="relative flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-3 sm:px-6">
          <button onClick={() => go(index - 1)} disabled={index === 0} className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30" aria-label="Anterior">
            <ChevronLeft size={20} aria-hidden />
          </button>
          {playing ? (
            <button onClick={pause} className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-800" aria-label="Pausar">
              <Pause size={18} className="fill-current" aria-hidden />
            </button>
          ) : (
            <button onClick={play} className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-800" aria-label={finished ? 'Repetir' : 'Reproducir'}>
              {finished ? <RotateCcw size={18} aria-hidden /> : <Play size={18} className="ml-0.5 fill-current" aria-hidden />}
            </button>
          )}
          <button onClick={() => go(index + 1)} disabled={index === slides.length - 1} className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30" aria-label="Siguiente">
            <ChevronRight size={20} aria-hidden />
          </button>
          <button onClick={() => speak(slide.en, { rate: slow ? 0.7 : 0.9 })} className="rounded-full p-2 hover:bg-white/10" aria-label="Escuchar de nuevo">
            <Volume2 size={18} aria-hidden />
          </button>
          <div className="flex flex-1 gap-1.5" aria-label={`Diapositiva ${index + 1} de ${slides.length}`}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={cn('h-1.5 flex-1 rounded-full transition', i < index ? 'bg-white/80' : i === index ? 'bg-white' : 'bg-white/20')}
              />
            ))}
          </div>
          <button
            onClick={() => setSlow((s) => !s)}
            aria-pressed={slow}
            className={cn('rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/30', slow ? 'bg-white text-brand-800' : 'text-white/80')}
          >
            🐢 Lento
          </button>
        </div>
      )}
    </div>
  );
}
