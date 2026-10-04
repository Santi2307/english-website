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
    <section id="faq" className="section border-t border-slate-200">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <h2 className="section-title">{t('faq.title')}</h2>
        <div className="border-t border-slate-900">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="overflow-hidden border-b border-slate-200">
                <h3>
                  <button
                    id={`${base}-h${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-p${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-slate-900"
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
                      <p className="max-w-2xl pb-6 leading-relaxed text-slate-600">{item.a}</p>
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
