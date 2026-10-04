import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ERROR_BANK, type Mistake } from '@/data/landing';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { Frame, SectionHeader } from '../ui/product';
import { cn } from '@/lib/format';

const STATUS_STYLE: Record<Mistake['status'], string> = {
  work: 'bg-brand-50 text-brand-700',
  improving: 'bg-amber-50 text-amber-800',
  fixed: 'bg-emerald-50 text-emerald-700',
};

/** Frecuencia semanal del error: barras mínimas, la última es la semana actual. */
function Trend({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden>
      {values.map((v, i) => (
        <span key={i} className={cn('w-1 rounded-sm', v ? 'bg-slate-400' : 'bg-slate-200')} style={{ height: `${Math.max(v / max, 0.15) * 100}%` }} />
      ))}
    </span>
  );
}

export function ErrorBankView({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <Frame className={className} title={ERROR_BANK.heading[locale]} meta={ERROR_BANK.sub[locale]} bodyClassName="p-0 sm:p-0">
      <ul className="divide-y divide-slate-100">
        {ERROR_BANK.mistakes.map((m, i) => (
          <motion.li
            key={m.wrong}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-5"
          >
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-slate-400 line-through decoration-slate-300">{m.wrong}</span>
                <ArrowRight size={14} className="text-slate-300" aria-hidden />
                <span className="font-medium text-slate-900">{m.right}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{m.tag[locale]} · <span className="font-mono">×{m.count}</span></p>
            </div>
            <span className="hidden sm:block"><Trend values={m.trend} /></span>
            <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', STATUS_STYLE[m.status])}>{ERROR_BANK.status[m.status][locale]}</span>
          </motion.li>
        ))}
      </ul>
      <div className="border-t border-slate-200 p-4 sm:px-5">
        <span className="btn-primary btn-sm w-full sm:w-auto">{ERROR_BANK.practice[locale]}</span>
      </div>
    </Frame>
  );
}

export function ErrorBank() {
  const locale = useLocale();
  return (
    <section className="section border-t border-slate-200">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <SectionHeader eyebrow={ERROR_BANK.eyebrow[locale]} title={ERROR_BANK.title[locale]} body={ERROR_BANK.body[locale]}>
          <p className="mt-8 border-l-2 border-brand-500 pl-4 font-medium text-slate-900">{ERROR_BANK.tagline[locale]}</p>
        </SectionHeader>
        <ErrorBankView locale={locale} />
      </div>
    </section>
  );
}
