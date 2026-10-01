import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/format';

type Item = { q: string; a: string };

export function Faq() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as Item[];
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <h2 className="section-title text-center">{t('faq.title')}</h2>
        <div className="mt-10 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="glass overflow-hidden rounded-2xl">
                <h3>
                  <button
                    id={`${base}-h${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-p${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900"
                  >
                    {item.q}
                    <ChevronDown size={20} aria-hidden className={cn('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180 text-slate-900')} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${base}-p${i}`}
                      role="region"
                      aria-labelledby={`${base}-h${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-slate-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      {/* Datos estructurados para rich results de Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
          }),
        }}
      />
    </section>
  );
}
