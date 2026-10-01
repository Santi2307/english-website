import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Quote } from 'lucide-react';
import { TEACHERS } from '@/data/teachers';
import { motion } from 'framer-motion';

export function TeachersSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('en') ? 'en' : 'es';

  return (
    <section id="profes" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="section-title">{t('teachers.title')}</h2>
          <p className="mt-3 text-lg text-slate-600">{t('teachers.subtitle')}</p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHERS.map((teacher, i) => (
            <motion.li
              key={teacher.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass group flex h-full flex-col overflow-hidden rounded-3xl p-2"
            >
                <div className="relative overflow-hidden rounded-[1.4rem]">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    width={400}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[5/6] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="glass absolute inset-x-2 bottom-2 rounded-2xl px-3.5 py-2.5">
                    <p className="font-bold leading-tight text-slate-900">{teacher.name}</p>
                    <p className="text-xs text-slate-600">{teacher.role[locale]}</p>
                  </div>
                </div>
                <blockquote className="flex flex-1 gap-2 px-3 pb-3 pt-4 text-[0.95rem] leading-relaxed text-slate-700">
                  <Quote size={16} className="mt-1 shrink-0 text-slate-400" aria-hidden />
                  <span>{teacher.quote[locale]}</span>
                </blockquote>
                <Link to={`/cursos/${teacher.courseSlug}`} className="group/link mx-3 mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                  {t('teachers.cta')}
                  <span className="transition group-hover/link:translate-x-1" aria-hidden>→</span>
                </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
