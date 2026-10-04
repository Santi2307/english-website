import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Clock, Info, Users } from 'lucide-react';
import { CourseCover } from '../ui/CourseCover';
import { Stars } from '../ui/Stars';
import { TEACHERS } from '@/data/teachers';
import { cn, discountPct, formatCOP } from '@/lib/format';
import type { CourseSummary } from '@/lib/types';

export function PriceTag({ price, compareAt, size = 'md' }: { price: number; compareAt: number | null; size?: 'md' | 'lg' }) {
  const { t } = useTranslation();
  const pct = discountPct(price, compareAt);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn('font-semibold text-slate-900', size === 'lg' ? 'text-3xl' : 'text-xl')}>{formatCOP(price)}</span>
      {pct > 0 && (
        <>
          <span className="text-sm text-slate-400 line-through">{formatCOP(compareAt!)}</span>
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700">{t('common.save', { pct })}</span>
        </>
      )}
    </div>
  );
}

export function BadgePill({ badge }: { badge: CourseSummary['badge'] }) {
  const { t } = useTranslation();
  if (!badge) return null;
  return (
    <span className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-900 shadow-xs">{t(`badges.${badge}`)}</span>
  );
}

/**
 * Tarjeta con flip: en escritorio gira al hacer hover; en móvil con el botón (i).
 * El frente y el reverso tienen CTA hacia el detalle del curso.
 */
export function CourseCard({ course, highlight }: { course: CourseSummary; highlight?: string }) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);
  const href = `/cursos/${course.slug}`;
  const teacher = TEACHERS.find((x) => x.name === course.instructorName);

  return (
    <div
      className="group h-[480px] [perspective:1200px]"
      onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90, damping: 16 }}
      >
        {/* Frente */}
        <article
          className={cn(
            'absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-colors group-hover:border-slate-300 [backface-visibility:hidden]',
            highlight && 'ring-2 ring-slate-900 ring-offset-2',
          )}
          aria-hidden={flipped}
        >
          <div className="relative h-44 shrink-0">
            <CourseCover title={course.title} level={course.level} goal={course.goal} color={course.coverColor} image={course.coverImage} />
            <div className="absolute left-3 top-3 flex gap-2">
              <BadgePill badge={course.badge} />
            </div>
            <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-0.5 font-mono text-xs text-slate-700 shadow-xs">
              {t('common.level')} {course.level}
            </span>
            {teacher && (
              <img
                src={teacher.photo}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="absolute -bottom-6 left-5 h-12 w-12 rounded-full object-cover ring-4 ring-white"
              />
            )}
          </div>
          <div className={cn('flex flex-1 flex-col px-5 pb-5', teacher ? 'pt-8' : 'pt-5')}>
            {highlight && <p className="mb-1 text-xs font-bold text-brand-700">★ {highlight}</p>}
            <p className="eyebrow">
              {t(`goals.${course.goal}`)} · <span className="font-semibold normal-case tracking-normal text-slate-500">{course.instructorName}</span>
            </p>
            <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-slate-900">
              <Link to={href} className="after:absolute after:inset-0 focus:outline-none" tabIndex={flipped ? -1 : 0}>{course.title}</Link>
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{course.subtitle}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Stars value={course.rating} size={13} />
                <span className="font-bold text-slate-800">{course.rating.toFixed(1)}</span>
                <span>({course.reviewsCount})</span>
              </span>
              <span className="flex items-center gap-1"><Clock size={13} aria-hidden />{t('common.hours', { count: course.durationHours })}</span>
              <span className="flex items-center gap-1"><Users size={13} aria-hidden />{t('common.students', { count: course.students })}</span>
            </div>
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
              <PriceTag price={course.priceCOP} compareAt={course.compareAtCOP} />
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-700 transition-colors group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white [@media(hover:none)]:hidden"
              >
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
          <button
            onClick={() => setFlipped(true)}
            className="absolute bottom-5 right-5 z-10 rounded-full bg-brand-50 p-2.5 text-brand-700 hover:bg-brand-100 [@media(hover:hover)]:hidden"
            aria-label={t('coursesSection.flipHint')}
          >
            <Info size={18} aria-hidden />
          </button>
        </article>

        {/* Reverso */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-slate-900 p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!flipped}
          onClick={(e) => e.target === e.currentTarget && setFlipped(false)}
        >
          <h3 className="text-lg font-bold">{course.title}</h3>
          <p className="mt-1 text-sm text-white/60">{course.subtitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {course.whatYouLearn.slice(0, 4).map((w) => (
              <li key={w} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-400" aria-hidden />{w}</li>
            ))}
          </ul>
          <div className="mt-auto space-y-3">
            <p className="text-2xl font-semibold">{formatCOP(course.priceCOP)}</p>
            <Link to={href} tabIndex={flipped ? 0 : -1} className="btn-accent w-full">{t('common.viewCourse')} →</Link>
            <button onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1} className="w-full text-sm text-white/60 [@media(hover:hover)]:hidden">
              ← {t('common.back')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
