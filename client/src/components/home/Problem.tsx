import { motion } from 'framer-motion';
import { PROBLEM } from '@/data/landing';
import { useLocale } from '@/hooks/useLocale';
import { SectionHeader } from '../ui/product';

/** Tres momentos reales en filas editoriales: la frase que te dicen y lo que pasa por dentro. */
export function Problem() {
  const locale = useLocale();
  return (
    <section className="section border-t border-slate-200">
      <div className="container-page">
        <SectionHeader title={PROBLEM.title[locale]} body={PROBLEM.body[locale]} />

        <ol className="mt-14 border-t border-slate-900">
          {PROBLEM.situations.map((s, i) => (
            <motion.li
              key={s.line}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="grid gap-x-8 gap-y-3 border-b border-slate-200 py-8 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,17rem)] md:items-baseline md:py-10"
            >
              <p className="flex items-baseline gap-3 text-sm font-medium text-slate-900">
                <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                {s.name[locale]}
              </p>
              <p className="text-2xl font-medium leading-snug tracking-[-0.02em] text-slate-900 sm:text-[1.75rem]">{s.line}</p>
              <p className="text-[0.95rem] leading-relaxed text-slate-500">{s.reality[locale]}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
