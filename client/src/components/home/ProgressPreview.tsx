import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PROGRESS } from '@/data/home';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';
import { Reveal } from '../ui/Reveal';

/** Cuatro números, nada más: el foco es "te ves mejorando", no un dashboard. */
export function ProgressPreview() {
  const locale = useLocale();
  const { user } = useAuth();
  return (
    <section className="section border-t border-slate-200">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{PROGRESS.eyebrow[locale]}</p>
          <h2 className="statement mt-5">{PROGRESS.title[locale]}</h2>
        </Reveal>

        <motion.dl
          className="mt-16 grid grid-cols-2 border-t border-slate-900 lg:grid-cols-4"
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {PROGRESS.stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col-reverse gap-2 border-b border-slate-200 py-8 pr-4 odd:border-r even:pl-4 lg:border-b-0 lg:border-r lg:px-8 lg:even:pl-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="text-sm text-slate-500">{s.label[locale]}</dt>
              <dd className="font-mono text-4xl font-medium tracking-[-0.04em] text-slate-900 sm:text-5xl">{s.value}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <Reveal delay={0.2} className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400">{PROGRESS.example[locale]}</p>
          <Link to={user ? '/mi-cuenta' : '/registro'} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-brand-700">
            {PROGRESS.more[locale]} <ArrowRight size={15} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
