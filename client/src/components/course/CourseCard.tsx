import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Info, Users } from 'lucide-react';
import { CourseCover } from '../ui/CourseCover';
import { Stars } from '../ui/Stars';
import { cn, discountPct, formatCOP } from '@/lib/format';
import type { CourseSummary } from '@/lib/types';

export function PriceTag({ price, compareAt, size = 'md' }: { price: number; compareAt: number | null; size?: 'md' | 'lg' }) {
  const { t } = useTranslation();
  const pct = discountPct(price, compareAt);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn('font-extrabold text-slate-900', size === 'lg' ? 'text-3xl' : 'text-xl')}>{formatCOP(price)}</span>
      {pct > 0 && (
        <>
          <span className="text-sm text-slate-400 line-through">{formatCOP(compareAt!)}</span>
          <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-xs font-bold text-rose-700">{t('common.save', { pct })}</span>
        </>
      )}
    </div>
  );
}

export function BadgePill({ badge }: { badge: CourseSummary['badge'] }) {
  const { t } = useTranslation();
  if (!badge) return null;
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-xs font-bold shadow-sm',
        badge === 'BESTSELLER' ? 'bg-accent-400 text-brand-950' : 'bg-emerald-500 text-white',
      )}
    >
      {badge === 'BESTSELLER' ? '🔥 ' : '✨ '}
      {t(`badges.${badge}`)}
    </span>
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

  return (
    <div
      className="group h-[440px] [perspective:1200px]"
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
          className={cn('card absolute inset-0 flex flex-col overflow-hidden [backface-visibility:hidden]', highlight && 'ring-2 ring-brand-500')}
          aria-hidden={flipped}
        >
          <div className="relative h-40 shrink-0">
            <CourseCover title={course.title} level={course.level} color={course.coverColor} image={course.coverImage} />
            <div className="absolute left-3 top-3 flex gap-2">
              <BadgePill badge={course.badge} />
            </div>
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800">
              {t('common.level')} {course.level}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            {highlight && <p className="mb-1 text-xs font-bold text-slate-700">★ {highlight}</p>}
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(`goals.${course.goal}`)}</p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-slate-900">
              <Link to={href} className="after:absolute after:inset-0 focus:outline-none" tabIndex={flipped ? -1 : 0}>{course.title}</Link>
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <Stars value={course.rating} size={14} />
              <span className="font-semibold">{course.rating.toFixed(1)}</span>
              <span className="text-slate-400">({course.reviewsCount})</span>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock size={13} aria-hidden />{t('common.hours', { count: course.durationHours })}</span>
              <span className="flex items-center gap-1"><Users size={13} aria-hidden />{t('common.students', { count: course.students })}</span>
            </div>
            <div className="mt-auto flex items-end justify-between pt-4">
              <PriceTag price={course.priceCOP} compareAt={course.compareAtCOP} />
            </div>
          </div>
          <button
            onClick={() => setFlipped(true)}
            className="absolute bottom-5 right-5 z-10 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-brand-100 hover:text-brand-700 [@media(hover:hover)]:hidden"
            aria-label={t('coursesSection.flipHint')}
          >
            <Info size={18} aria-hidden />
          </button>
        </article>

        {/* Reverso */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 p-6 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!flipped}
          onClick={(e) => e.target === e.currentTarget && setFlipped(false)}
        >
          <h3 className="text-lg font-bold">{course.title}</h3>
          <p className="mt-1 text-sm text-brand-200">{course.subtitle}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {course.whatYouLearn.slice(0, 4).map((w) => (
              <li key={w} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-400" aria-hidden />{w}</li>
            ))}
          </ul>
          <div className="mt-auto space-y-3">
            <p className="text-2xl font-extrabold">{formatCOP(course.priceCOP)}</p>
            <Link to={href} tabIndex={flipped ? 0 : -1} className="btn-accent w-full">{t('common.viewCourse')} →</Link>
            <button onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1} className="w-full text-sm text-brand-200 [@media(hover:hover)]:hidden">
              ← {t('common.back')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
