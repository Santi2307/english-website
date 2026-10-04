import { PROGRESS } from '@/data/landing';
import { useLocale, type Locale } from '@/hooks/useLocale';
import { Frame, ScoreBar, SectionHeader, Sparkline } from '../ui/product';
import { cn } from '@/lib/format';

/** Racha: últimas 3 semanas, el último día es hoy. */
function StreakGrid({ days }: { days: number }) {
  const total = 21;
  return (
    <div className="mt-3 grid max-w-[11rem] grid-cols-7 gap-1" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const on = i >= total - days;
        return <span key={i} className={cn('aspect-square rounded-[4px]', on ? (i === total - 1 ? 'bg-brand-500' : 'bg-slate-900') : 'bg-slate-100')} />;
      })}
    </div>
  );
}

export function ProgressView({ locale }: { locale: Locale }) {
  return (
    <Frame title="English Score" meta="B1 → B2" bodyClassName="p-0 sm:p-0">
      <div className="grid divide-y divide-slate-200 md:grid-cols-[1.15fr_1fr_0.9fr] md:divide-x md:divide-y-0">
        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-6xl font-medium tracking-[-0.04em] text-slate-900">{PROGRESS.score}</p>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">{PROGRESS.delta[locale]}</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">/ 1000</p>
          <p className="mt-auto pt-8 text-xs text-slate-400">{PROGRESS.weeks[locale]}</p>
          <Sparkline values={PROGRESS.history} className="mt-2 h-20" height={80} />
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          {PROGRESS.skills.map((s) => (
            <ScoreBar key={s.label.en} label={s.label[locale]} value={s.value} max={1000} />
          ))}
        </div>

        <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-1 md:divide-x-0 md:divide-y">
          <div className="p-5 sm:p-7">
            <p className="text-sm text-slate-500">{PROGRESS.time.label[locale]}</p>
            <p className="mt-2 font-mono text-xl font-medium tracking-tight text-slate-900 sm:text-2xl">{PROGRESS.time.value[locale]}</p>
          </div>
          <div className="p-5 sm:p-7">
            <p className="text-sm text-slate-500">{PROGRESS.streak.label[locale]}</p>
            <p className="mt-2 font-mono text-xl font-medium tracking-tight text-slate-900 sm:text-2xl">
              {PROGRESS.streak.value} <span className="font-sans text-base text-slate-500">{PROGRESS.streak.unit[locale]}</span>
            </p>
            <StreakGrid days={PROGRESS.streak.value} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function Progress() {
  const locale = useLocale();
  return (
    <section className="section border-t border-slate-200">
      <div className="container-page">
        <SectionHeader eyebrow={PROGRESS.eyebrow[locale]} title={PROGRESS.title[locale]} body={PROGRESS.body[locale]} />
        <div className="mt-12">
          <ProgressView locale={locale} />
        </div>
      </div>
    </section>
  );
}
