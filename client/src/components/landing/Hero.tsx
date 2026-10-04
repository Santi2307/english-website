import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BadgeCheck, Mic, ShieldCheck, Star, Volume2 } from 'lucide-react';
import { pronunciationScore, useListen, useSpeak } from '@/hooks/useSpeech';
import { phraseOfTheDay } from '@/data/home';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/format';

const AVATARS = [1, 2, 3, 4, 5].map((n) => `/images/people/avatar-${n}.webp`);

/** Fila de rostros reales: comunica "personas como tú" mejor que un número suelto. */
export function CommunityRow({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex shrink-0 -space-x-2.5" aria-hidden>
        {AVATARS.map((src) => (
          <img key={src} src={src} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
        ))}
      </div>
      <div className="text-sm leading-tight">
        <div className="flex items-center gap-1 font-bold text-slate-900">
          <Star size={14} className="fill-accent-400 text-accent-400" aria-hidden /> 4,9
          <span className="font-normal text-slate-500">/ 5</span>
        </div>
        <p className="text-slate-600">{t('hero.community')}</p>
      </div>
    </div>
  );
}

/**
 * Frase del día: el visitante la escucha, la oye lenta y la dice con su micrófono.
 * Es la primera experiencia real del producto, antes de registrarse.
 */
function PhraseOfTheDay() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en' : 'es';
  const phrase = useMemo(() => phraseOfTheDay(), []);
  const { speak, speaking } = useSpeak();
  const { start, listening, transcript, supported, reset } = useListen();
  const result = transcript ? pronunciationScore(phrase.en, transcript) : null;

  useEffect(() => {
    if (result) track.phraseSpoken(result.pct);
  }, [transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="glass-strong w-[17.5rem] rounded-3xl p-4 sm:w-80">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('hero.phraseTitle')}</p>
      <p className="mt-1.5 text-lg font-bold leading-snug text-slate-900">
        {result
          ? result.words.map((w, i) => (
              <span key={i} className={cn('mr-1 inline-block rounded px-0.5', !w.ok && 'bg-rose-100 text-rose-700')}>{w.word}</span>
            ))
          : phrase.en}
      </p>
      <p className="text-sm text-slate-600">{phrase.es}</p>

      <div className="mt-3 flex items-center gap-2">
        <motion.button
          onClick={() => speak(phrase.en, { rate: 0.9 })}
          animate={speaking ? { scale: [1, 1.08, 1] } : {}}
          transition={{ repeat: speaking ? Infinity : 0, duration: 0.8 }}
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white"
          aria-label={t('hero.listen')}
        >
          <Volume2 size={18} aria-hidden />
        </motion.button>
        <button onClick={() => speak(phrase.en, { rate: 0.6 })} className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white" aria-label={t('hero.slow')}>
          🐢
        </button>
        {supported && (
          <button
            onClick={() => {
              reset();
              start();
            }}
            disabled={listening}
            className={cn('ml-auto flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white', listening && 'animate-pulse')}
          >
            <Mic size={15} aria-hidden /> {listening ? t('hero.listening') : result ? t('hero.tryAgain') : t('hero.sayIt')}
          </button>
        )}
      </div>

      <AnimatePresence>
        {result ? (
          <motion.p key="r" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm font-semibold text-slate-700" aria-live="polite">
            {result.pct >= 80 ? '🎉 ' : '💪 '}
            {t('hero.accuracy', { pct: result.pct })}
          </motion.p>
        ) : (
          <motion.p key="tip" className="mt-3 text-xs text-slate-500">💡 {phrase.tip[locale]}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const float = (delay: number) => ({
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: { opacity: 1, y: [0, -6, 0], scale: 1 },
  transition: {
    opacity: { delay, duration: 0.5 },
    scale: { delay, duration: 0.5 },
    y: { delay: delay + 0.5, duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
  },
});

export function Hero() {
  const { t } = useTranslation();
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <section className="relative">
      <div className="container-page grid items-center gap-12 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="glass mb-5 inline-flex rounded-full px-4 py-1.5 text-sm font-medium text-slate-700">
            {t('hero.eyebrow')}
          </motion.p>
          <motion.h1
            variants={item}
            className="text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {t('hero.subtitle')}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#test-de-nivel" onClick={() => track.levelTestStarted()} className="btn-primary px-7 py-4 text-base">
              {t('hero.ctaTest')} →
            </a>
            <Link to="/cursos" className="btn-glass px-7 py-4 text-base">{t('hero.ctaCourses')}</Link>
          </motion.div>
          <motion.div variants={item}>
            <CommunityRow className="mt-8" />
          </motion.div>
          <motion.ul variants={item} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-600" aria-hidden />{t('hero.trust1')}</li>
            <li className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-emerald-600" aria-hidden />{t('hero.trust2')}</li>
            <li className="flex items-center gap-1.5"><Award size={16} className="text-emerald-600" aria-hidden />{t('hero.trust3')}</li>
          </motion.ul>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          {/* Aro de luz detrás de la foto */}
          <div className="absolute -inset-4 rounded-[2.75rem] bg-gradient-to-br from-white/70 via-peach-200/60 to-brand-200/60 blur-2xl" aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass relative overflow-hidden rounded-[2.25rem] p-2"
          >
            <picture>
              <source media="(max-width: 640px)" srcSet="/images/people/hero-santi-sm.webp" />
              <img
                src="/images/people/hero-santi.webp"
                alt={t('hero.photoAlt')}
                width={720}
                height={960}
                // React 18 no reconoce fetchPriority: se pasa el atributo HTML tal cual
                {...{ fetchpriority: "high" }}
                decoding="async"
                className="aspect-[3/4] w-full rounded-[1.85rem] object-cover"
              />
            </picture>
          </motion.div>

          <motion.div {...float(0.5)} className="absolute -right-2 top-8 sm:-right-6">
            <div className="glass flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4">
              <img src="/images/people/teacher-laura.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div className="text-sm leading-tight">
                <p className="font-bold text-slate-900">{t('hero.teacherChip')}</p>
                <p className="text-slate-600">{t('hero.teacherChipSub')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...float(0.9)} className="absolute -left-3 bottom-6 sm:-left-10">
            <PhraseOfTheDay />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
