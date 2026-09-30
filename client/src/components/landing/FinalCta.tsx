import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../ui/Reveal';

export function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-6 py-14 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-400/20 blur-2xl" aria-hidden />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t('finalCta.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-200">{t('finalCta.subtitle')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#test-de-nivel" className="btn-accent px-7 py-4 text-base">{t('hero.ctaTest')} →</a>
            <Link to="/cursos" className="btn border border-white/30 px-7 py-4 text-base text-white hover:bg-white/10">{t('hero.ctaCourses')}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
