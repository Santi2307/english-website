import { Link } from 'react-router-dom';
import { FINAL, HERO } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { Waveform } from '../ui/product';

export function FinalCta() {
  const locale = useLocale();
  const { user } = useAuth();
  return (
    <section className="container-page pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-14 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-6 bottom-10 hidden opacity-[0.08] md:block" aria-hidden>
          <Waveform bars={40} tone="muted" className="h-24 w-[26rem] [&>span]:bg-white" />
        </div>
        <h2 className="relative max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl">{FINAL.title[locale]}</h2>
        <p className="relative mt-4 max-w-md text-white/60">{FINAL.sub[locale]}</p>
        <div className="relative mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to={user ? '/mi-cuenta' : '/registro'} className="btn-primary btn-lg">{HERO.cta[locale]}</Link>
          <a href="#test-de-nivel" className="btn btn-lg border border-white/15 text-white hover:bg-white/10">{FINAL.test[locale]}</a>
        </div>
      </div>
    </section>
  );
}
