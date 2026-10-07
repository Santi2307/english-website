import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { CK } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import { SUGGESTED, countries, findCountry, fold, type Country } from '@/lib/countries';
import { T } from '@/lib/motion';
import { cn } from '@/lib/format';

/**
 * Selector de país con búsqueda (patrón combobox de WAI-ARIA).
 * Busca por nombre sin importar tildes, por código ISO o por prefijo (+57).
 */
export function CountrySelect({ id, value, onChange, locale }: { id: string; value: string; onChange: (c: Country) => void; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const all = countries(locale);
  const selected = findCountry(value, locale);

  const options = useMemo(() => {
    const q = fold(query.trim());
    if (!q) {
      const top = SUGGESTED.map((c) => all.find((x) => x.code === c)!).filter(Boolean);
      return { items: [...top, ...all.filter((c) => !SUGGESTED.includes(c.code))], split: top.length };
    }
    const hits = all.filter((c) => fold(c.name).includes(q) || c.code.toLowerCase() === q || c.dial.replace('+', '').startsWith(q.replace('+', '')));
    // Primero los que empiezan con lo escrito
    hits.sort((a, b) => Number(!fold(a.name).startsWith(q)) - Number(!fold(b.name).startsWith(q)));
    return { items: hits, split: 0 };
  }, [query, all]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const i = options.items.findIndex((c) => c.code === value);
    setActive(Math.max(0, i));
    requestAnimationFrame(() => search.current?.focus());
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (c: Country) => {
    onChange(c);
    setOpen(false);
    document.getElementById(id)?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = options.items.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(n - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(n - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); const c = options.items[active]; if (c) choose(c); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); document.getElementById(id)?.focus(); }
  };

  return (
    <div ref={root} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center gap-3 rounded-[10px] border border-slate-300 bg-white px-3.5 text-left text-base text-slate-900 outline-none transition-[border-color,box-shadow] duration-200 hover:border-slate-400 focus-visible:border-slate-900 focus-visible:ring-4 focus-visible:ring-slate-900/[0.06]"
      >
        <span className="w-7 shrink-0 font-mono text-xs font-medium text-slate-500">{selected?.code}</span>
        <span className="min-w-0 flex-1 truncate">{selected?.name ?? value}</span>
        <ChevronDown size={16} className={cn('shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: T.micro }}
            exit={{ opacity: 0, y: -4, transition: T.micro }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-3.5">
              <Search size={16} className="shrink-0 text-slate-400" aria-hidden />
              <input
                ref={search}
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={options.items[active] ? `${listId}-${options.items[active].code}` : undefined}
                aria-label={CK.f.countrySearch[locale]}
                placeholder={CK.f.countrySearch[locale]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                className="h-11 w-full bg-transparent text-base outline-none placeholder:text-slate-400"
              />
            </div>
            <ul ref={list} id={listId} role="listbox" aria-label={CK.f.country[locale]} className="max-h-72 overflow-y-auto overscroll-contain py-1.5">
              {options.items.length === 0 && <li className="px-3.5 py-3 text-sm text-slate-500">{CK.f.noCountry[locale]}</li>}
              {options.items.map((c, i) => (
                <li key={c.code} role="presentation">
                  {i === 0 && options.split > 0 && <p className="px-3.5 pb-1 pt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-400">{CK.f.suggested[locale]}</p>}
                  {i === options.split && options.split > 0 && <p className="mt-1.5 border-t border-slate-100 px-3.5 pb-1 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-slate-400">{CK.f.all[locale]}</p>}
                  <div
                    id={`${listId}-${c.code}`}
                    data-i={i}
                    role="option"
                    aria-selected={c.code === value}
                    onPointerMove={() => setActive(i)}
                    onClick={() => choose(c)}
                    className={cn('flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-[0.95rem]', i === active ? 'bg-slate-100' : '')}
                  >
                    <span className="w-7 shrink-0 font-mono text-xs text-slate-500">{c.code}</span>
                    <span className="min-w-0 flex-1 truncate text-slate-900">{c.name}</span>
                    <span className="font-mono text-xs text-slate-400">{c.dial}</span>
                    {c.code === value && <Check size={15} className="text-slate-900" aria-hidden />}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
