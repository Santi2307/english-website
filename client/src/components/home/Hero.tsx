import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HERO } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { LiveDot } from '../ui/product';
import { CoachMock } from './CoachMock';

export function Hero() {
  const locale = useLocale();
  const { user } = useAuth();
  const [line1, line2] = HERO.title[locale];

  return (
    <section className="container-page grid items-center gap-12 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
      <div>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <LiveDot /> {HERO.eyebrow[locale]}
        </p>
        <h1 className="display mt-6">
          <span className="block text-slate-400">{line1}</span>
          <span className="block">{line2}</span>
        </h1>
        <p className="lead mt-6 max-w-xl">{HERO.subtitle[locale]}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to={user ? '/mi-cuenta' : '/registro'} className="btn-primary btn-lg">
            {HERO.cta[locale]}
          </Link>
          <a href="#como-funciona" className="btn-secondary btn-lg">
            {HERO.secondary[locale]} <ArrowRight size={16} aria-hidden />
          </a>
        </div>
        <p className="mt-5 text-sm text-slate-500">{HERO.note[locale]}</p>
      </div>

      <CoachMock className="lg:pl-2" />
    </section>
  );
}
