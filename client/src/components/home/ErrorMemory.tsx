import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MEMORY } from '@/data/home';
import { useLocale } from '@/hooks/useLocale';
import { EASE, fadeUp, VIEWPORT } from '@/lib/motion';
import { RevealLines, Reveal } from '../ui/Reveal';

/**
 * Error → memoria → próxima práctica, revelado en ese orden: cada etapa aparece
 * y una línea la conecta con la siguiente. Una pequeña revelación, no un dashboard.
 */
const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE.inOut } },
};
const lineV: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.5, ease: EASE.inOut } },
};

function Connector() {
  return (
    <>
      <motion.span variants={line} className="hidden h-px w-full origin-left self-center bg-slate-300 lg:block" aria-hidden />
      <motion.span variants={lineV} className="mx-auto h-8 w-px origin-top bg-slate-300 lg:hidden" aria-hidden />
    </>
  );
}

function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col">
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex-1 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">{children}</div>
    </motion.div>
  );
}

export function ErrorMemory() {
  const locale = useLocale();
  const m = MEMORY;
  return (
    <section id="error-bank" className="section border-t border-slate-200">
      <div className="container-page">
        <RevealLines
          as="h2"
          className="statement max-w-3xl"
          lines={[<span key="a" className="text-slate-400">{m.title[locale][0]}</span>, m.title[locale][1]]}
        />

        <motion.div
          className="mt-16 grid items-stretch lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)]"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.28, delayChildren: 0.1 } } }}
        >
          <Stage label={m.stages.mistake[locale]}>
            <p className="text-2xl tracking-[-0.02em]">
              <span className="text-slate-400 line-through decoration-brand-400 decoration-2">{m.mistake.wrong}</span>
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-900">{m.mistake.right}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex gap-1" aria-hidden>
                {[0, 1, 2, 3].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-brand-500" />)}
              </span>
              <span className="text-sm text-slate-500">{m.repeated[locale]}</span>
            </div>
          </Stage>

          <Connector />

          <Stage label={m.stages.memory[locale]}>
            <p className="text-sm font-medium text-slate-900">{m.bank[locale]}</p>
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {[m.mistake, ...m.others].map((x, i) => (
                <li key={x.wrong} className="flex items-center gap-2 py-2.5">
                  <span className={i === 0 ? 'h-1.5 w-1.5 rounded-full bg-brand-500' : 'h-1.5 w-1.5 rounded-full bg-slate-300'} aria-hidden />
                  <span className="text-slate-400 line-through decoration-slate-300">{x.wrong}</span>
                  <ArrowRight size={12} className="text-slate-300" aria-hidden />
                  <span className={i === 0 ? 'font-medium text-slate-900' : 'text-slate-700'}>{x.right}</span>
                </li>
              ))}
            </ul>
          </Stage>

          <Connector />

          <Stage label={m.stages.lesson[locale]}>
            <p className="font-mono text-xs text-slate-500">{m.session[locale]}</p>
            <p className="mt-4 text-xl font-medium tracking-[-0.015em] text-slate-900">
              It <span className="inline-block min-w-[5.5rem] border-b-2 border-slate-900 text-center text-brand-700">depends on</span> the weather.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">{m.tomorrow[locale]}</p>
          </Stage>
        </motion.div>

        <Reveal delay={0.2}>
          <Link to="/how-it-works#error-bank" className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-brand-700">
            {m.more[locale]} <ArrowRight size={15} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
