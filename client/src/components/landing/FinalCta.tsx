import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../ui/Reveal';
import { CommunityRow } from './Hero';

export function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src="/images/people/cta-students.webp"
            alt=""
            width={1400}
            height={700}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-brand-950/50 to-transparent" aria-hidden />
          <div className="relative p-4 sm:p-10 lg:p-14">
            <div className="glass-dark max-w-lg rounded-[2rem] p-7 text-white sm:p-9">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{t('finalCta.title')}</h2>
              <p className="mt-3 text-white/80">{t('finalCta.subtitle')}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#test-de-nivel" className="btn-accent px-7 py-4 text-base">{t('hero.ctaTest')} →</a>
                <Link to="/cursos" className="btn border border-white/30 bg-white/10 px-7 py-4 text-base text-white hover:bg-white/20">
                  {t('hero.ctaCourses')}
                </Link>
              </div>
              <div className="mt-7 rounded-2xl bg-white/90 p-3">
                <CommunityRow />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
