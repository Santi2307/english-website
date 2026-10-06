import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Square, Volume2 } from 'lucide-react';
import { SCENARIOS, type Scenario } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { useSpeak } from '@/hooks/useSpeech';
import { Frame, SectionHeader } from '../ui/product';
import { cn } from '@/lib/format';

/**
 * Escenarios: lista a la izquierda (chips deslizables en móvil) y la vista previa
 * de la conversación a la derecha. La frase de apertura se puede escuchar de verdad.
 */
export function Scenarios({ items = SCENARIOS.items, header = true }: { items?: Scenario[]; header?: boolean }) {
  const locale = useLocale();
  const { user } = useAuth();
  const [id, setId] = useState(items[0].id);
  const { speak, stop, speaking, supported } = useSpeak();
  const s = items.find((x) => x.id === id) ?? items[0];

  const choose = (next: string) => {
    stop();
    setId(next);
  };

  return (
    <section id="escenarios" className={header ? 'section border-t border-slate-200' : 'pb-20 sm:pb-28'}>
      <div className="container-page">
        {header && <SectionHeader eyebrow={SCENARIOS.eyebrow[locale]} title={SCENARIOS.title[locale]} body={SCENARIOS.sub[locale]} />}

        <div className={cn('grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12', header && 'mt-12')}>
          {/* Móvil: carrusel de chips. Escritorio: lista vertical */}
          <div role="tablist" aria-label={SCENARIOS.eyebrow[locale]} className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 lg:mx-0 lg:block lg:space-y-0 lg:overflow-visible lg:border-t lg:border-slate-200 lg:px-0">
            {items.map((x) => {
              const on = x.id === id;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="scenario-preview"
                  onClick={() => choose(x.id)}
                  className={cn(
                    'shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    'lg:flex lg:w-full lg:items-center lg:justify-between lg:rounded-none lg:border-0 lg:border-b lg:border-slate-200 lg:px-1 lg:py-3.5 lg:text-[0.95rem]',
                    on ? 'border-slate-900 bg-slate-900 text-white lg:bg-transparent lg:text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 lg:bg-transparent',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn('hidden h-1.5 w-1.5 rounded-full lg:block', on ? 'bg-brand-500' : 'bg-transparent')} aria-hidden />
                    {x.name[locale]}
                  </span>
                  <span className="hidden font-mono text-xs text-slate-400 lg:inline">{x.level} · {x.minutes} min</span>
                </button>
              );
            })}
          </div>

          <div id="scenario-preview" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Frame title={s.name[locale]} meta={`${s.level} · ${s.minutes} min`} bodyClassName="p-5 sm:p-7">
                  <p className="text-sm text-slate-500">{s.context[locale]}</p>

                  <p className="eyebrow mt-7">{SCENARIOS.theySay[locale]}</p>
                  <div className="mt-2 flex items-start gap-3">
                    <p className="flex-1 text-xl font-medium leading-snug tracking-[-0.015em] text-slate-900 sm:text-2xl">“{s.opener}”</p>
                    {supported && (
                      <button
                        onClick={() => (speaking ? stop() : speak(s.opener))}
                        aria-label={speaking ? 'Stop' : 'Play'}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        {speaking ? <Square size={14} aria-hidden /> : <Volume2 size={16} aria-hidden />}
                      </button>
                    )}
                  </div>

                  <p className="eyebrow mt-8">{SCENARIOS.phrases[locale]}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.phrases.map((p) => (
                      <li key={p} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">{p}</li>
                    ))}
                  </ul>

                  <div className="mt-8 border-t border-slate-200 pt-5">
                    <Link to={user ? '/mi-cuenta' : '/registro'} className="btn-primary w-full sm:w-auto">
                      {SCENARIOS.start[locale]} <ArrowRight size={16} aria-hidden />
                    </Link>
                  </div>
                </Frame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
