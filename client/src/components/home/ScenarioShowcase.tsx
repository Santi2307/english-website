import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Square, Volume2 } from 'lucide-react';
import { SCENES, type SceneId } from '@/data/home';
import { useLocale } from '@/hooks/useLocale';
import { useSpeak } from '@/hooks/useSpeech';
import { swap } from '@/lib/motion';
import { cn } from '@/lib/format';
import { Reveal } from '../ui/Reveal';

/**
 * Cuatro contextos, una escena. Al pasar el mouse (o tocar) cambia la frase que
 * te dicen y el tono que pide: el idioma cambia según dónde estás.
 */
export function ScenarioShowcase() {
  const locale = useLocale();
  const [id, setId] = useState<SceneId>('interview');
  const { speak, stop, speaking, supported } = useSpeak();
  const s = SCENES.items.find((x) => x.id === id)!;

  const choose = (next: SceneId) => {
    if (next === id) return;
    stop();
    setId(next);
  };

  return (
    <section className="section border-t border-slate-200">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{SCENES.eyebrow[locale]}</p>
          <h2 className="section-title mt-4">{SCENES.title[locale]}</h2>
          <p className="lead mt-4">{SCENES.sub[locale]}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <div role="tablist" aria-label={SCENES.eyebrow[locale]} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
            {SCENES.items.map((x) => {
              const on = x.id === id;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="scene"
                  onClick={() => choose(x.id)}
                  onMouseEnter={() => choose(x.id)}
                  onFocus={() => choose(x.id)}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
                    'lg:flex lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:border-t lg:border-slate-200 lg:px-0 lg:py-5 lg:text-left lg:text-xl lg:tracking-[-0.02em] lg:last:border-b',
                    on ? 'border-slate-900 bg-slate-900 text-white lg:bg-transparent lg:text-slate-900' : 'border-slate-200 bg-white text-slate-600 lg:bg-transparent lg:text-slate-400 lg:hover:text-slate-700',
                  )}
                >
                  <span className={cn('hidden h-2 w-2 rounded-full transition-colors duration-200 lg:block', on ? 'bg-brand-500' : 'bg-slate-200')} aria-hidden />
                  {x.name[locale]}
                </button>
              );
            })}
          </div>

          <div id="scene" role="tabpanel" aria-live="polite" className="relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} {...swap} className="flex flex-1 flex-col">
                <p className="text-sm text-white/50">{s.setting[locale]}</p>

                <p className="mt-10 font-mono text-xs uppercase tracking-[0.12em] text-white/40">{SCENES.theySay[locale]}</p>
                <div className="mt-3 flex items-start gap-4">
                  <p className="flex-1 text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-[2.1rem]">“{s.line}”</p>
                  {supported && (
                    <button
                      onClick={() => (speaking ? stop() : speak(s.line))}
                      aria-label={speaking ? 'Stop' : SCENES.listen[locale]}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10"
                    >
                      {speaking ? <Square size={14} aria-hidden /> : <Volume2 size={17} aria-hidden />}
                    </button>
                  )}
                </div>

                <div className="mt-auto grid gap-6 pt-12 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/40">{SCENES.tone[locale]}</p>
                    <p className="mt-2 font-medium">{s.tone[locale]}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/40">{SCENES.youCould[locale]}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {s.starts.map((p) => (
                        <li key={p} className="rounded-lg bg-white/[0.07] px-3 py-1.5 text-sm text-white/85">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Link to="/practice" className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-brand-700">
            {SCENES.all[locale]} <ArrowRight size={15} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
