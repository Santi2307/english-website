import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Clock, PlayCircle, ShieldCheck, Users, X } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { Seo } from '@/components/ui/Seo';
import { Stars } from '@/components/ui/Stars';
import { CourseCover } from '@/components/ui/CourseCover';
import { PageLoader } from '@/components/ui/Spinner';
import { BadgePill, PriceTag } from '@/components/course/CourseCard';
import { api } from '@/lib/api';
import { track } from '@/lib/analytics';
import { cn, formatCOP } from '@/lib/format';
import type { CourseDetail as Course, Playback } from '@/lib/types';
import type { LessonContentResponse, Slide } from '@/lib/lessonContent';
import { MiniClass } from '@/components/lesson/MiniClass';
import NotFound from './NotFound';

function BuyButton({ course, className }: { course: Course; className?: string }) {
  const { t } = useTranslation();
  if (course.isEnrolled) {
    return <Link to={`/aprender/${course.slug}`} className={cn('btn-primary', className)}>{t('course.goToCourse')} →</Link>;
  }
  return <Link to={`/checkout/${course.slug}`} className={cn('btn-accent', className)}>{t('common.buyNow')} →</Link>;
}

function Syllabus({ course, onPreview }: { course: Course; onPreview: (lessonId: string, title: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Set<string>>(new Set([course.modules[0]?.id]));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section aria-labelledby="syllabus">
      <h2 id="syllabus" className="text-2xl font-bold">{t('course.syllabus')}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {t('course.syllabusSummary', { modules: course.modules.length, lessons: course.lessonsCount, hours: course.durationHours })}
      </p>
      <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
        {course.modules.map((m, i) => {
          const isOpen = open.has(m.id);
          const minutes = m.lessons.reduce((a, l) => a + l.durationMinutes, 0);
          return (
            <div key={m.id}>
              <button
                onClick={() => toggle(m.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 bg-slate-50 px-5 py-4 text-left hover:bg-slate-100"
              >
                <span className="font-semibold text-slate-900">{i + 1}. {m.title}</span>
                <span className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
                  <span className="hidden sm:inline">{t('common.lessons', { count: m.lessons.length })} · {minutes} min</span>
                  <ChevronDown size={18} className={cn('transition-transform', isOpen && 'rotate-180')} aria-hidden />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-white">
                    {m.lessons.map((l) => (
                      <li key={l.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                        <PlayCircle size={16} className="shrink-0 text-slate-400" aria-hidden />
                        <span className="flex-1 text-slate-700">{l.title}</span>
                        {l.isFreePreview && (
                          <button onClick={() => onPreview(l.id, l.title)} className="font-semibold text-brand-600 hover:underline">
                            {t('course.preview')}
                          </button>
                        )}
                        <span className="text-slate-400">{l.durationMinutes} min</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PreviewModal({ lessonId, title, onClose }: { lessonId: string; title: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [playback, setPlayback] = useState<Playback | undefined>(undefined);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  useEffect(() => {
    api<{ playback: Playback }>(`/lessons/${lessonId}/playback`).then((r) => setPlayback(r.playback)).catch(() => setPlayback(null));
    // Sin video grabado, la vista previa muestra la mini-clase animada de la lección
    api<LessonContentResponse>(`/lessons/${lessonId}/content`).then((r) => setSlides(r.content?.slides ?? null)).catch(() => setSlides(null));
  }, [lessonId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between text-white">
          <p className="font-semibold">{title}</p>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 hover:bg-white/10" autoFocus><X aria-hidden /></button>
        </div>
        {playback === undefined ? (
          <div className="aspect-video rounded-xl bg-black" />
        ) : playback ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe src={playback.embedUrl} title={title} className="h-full w-full" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        ) : slides ? (
          <MiniClass slides={slides} title={title} />
        ) : (
          <p className="grid aspect-video place-items-center rounded-xl bg-black p-6 text-center text-slate-300">{t('learn.noVideo')}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function CourseDetail() {
  const { slug = '' } = useParams();
  const { t } = useTranslation();
  const { data: course, isLoading, error } = useCourse(slug);
  const [preview, setPreview] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (course) track.viewItem({ id: course.id, name: course.title, price: course.priceCOP });
  }, [course]);

  if (isLoading) return <PageLoader />;
  if (error || !course) return <NotFound />;

  const includes = t('course.includes', { returnObjects: true }) as string[];

  return (
    <>
      <Seo
        title={`${course.title} · English Academy`}
        description={course.subtitle}
        image={course.coverImage ?? undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.subtitle,
          provider: { '@type': 'Organization', name: 'English Academy' },
          offers: { '@type': 'Offer', price: course.priceCOP, priceCurrency: 'COP', category: 'Paid' },
          ...(course.reviewsCount > 0 && {
            aggregateRating: { '@type': 'AggregateRating', ratingValue: course.rating.toFixed(1), reviewCount: course.reviewsCount },
          }),
        }}
      />

      {/* Cabecera */}
      <section className="bg-brand-950 text-white">
        <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px] lg:py-14">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-brand-300">
              <Link to="/cursos" className="hover:underline">{t('nav.courses')}</Link> / {t(`goals.${course.goal}`)}
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <BadgePill badge={course.badge} />
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">{t('common.level')} {course.level}</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-lg text-brand-100">{course.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-100">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-accent-400">{course.rating.toFixed(1)}</span>
                <Stars value={course.rating} size={14} />
                <span>({t('common.reviews', { count: course.reviewsCount })})</span>
              </span>
              <span className="flex items-center gap-1"><Users size={15} aria-hidden />{t('common.students', { count: course.students })}</span>
              <span className="flex items-center gap-1"><Clock size={15} aria-hidden />{t('common.hours', { count: course.durationHours })}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          {/* Video preview (móvil lo ve aquí; en escritorio está en la tarjeta de compra) */}
          <div className="aspect-video overflow-hidden rounded-2xl lg:hidden">
            {course.previewVideoUrl ? (
              <iframe src={course.previewVideoUrl} title={`Trailer ${course.title}`} loading="lazy" className="h-full w-full" allowFullScreen />
            ) : (
              <CourseCover title={course.title} level={course.level} goal={course.goal} color={course.coverColor} image={course.coverImage} />
            )}
          </div>

          <section className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-2xl font-bold">{t('course.whatYouLearn')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.whatYouLearn.map((w) => (
                <li key={w} className="flex gap-2 text-slate-700"><CheckCircle2 size={20} className="shrink-0 text-emerald-600" aria-hidden />{w}</li>
              ))}
            </ul>
          </section>

          <p className="whitespace-pre-line text-lg leading-relaxed text-slate-700">{course.description}</p>

          <Syllabus course={course} onPreview={(id, title) => setPreview({ id, title })} />

          <section aria-labelledby="instructor">
            <h2 id="instructor" className="text-2xl font-bold">{t('course.instructor')}</h2>
            <div className="mt-4 flex gap-4">
              {course.instructorAvatar ? (
                <img src={course.instructorAvatar} alt={course.instructorName} loading="lazy" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700" aria-hidden>
                  {course.instructorName.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                </span>
              )}
              <div>
                <p className="text-lg font-bold">{course.instructorName}</p>
                <p className="mt-1 text-slate-600">{course.instructorBio}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="reviews">
            <h2 id="reviews" className="text-2xl font-bold">{t('course.reviews')}</h2>
            {course.reviews.length === 0 ? (
              <p className="mt-3 text-slate-500">{t('course.noReviews')}</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {course.reviews.map((r) => (
                  <li key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.user.name}</p>
                      <Stars value={r.rating} size={14} />
                    </div>
                    <p className="mt-2 text-slate-600">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex gap-4 rounded-2xl bg-emerald-50 p-6">
            <ShieldCheck size={40} className="shrink-0 text-emerald-600" aria-hidden />
            <div>
              <h2 className="text-lg font-bold text-emerald-900">{t('course.guarantee')}</h2>
              <p className="text-emerald-800">{t('course.guaranteeText')}</p>
            </div>
          </section>
        </div>

        {/* Tarjeta de compra fija en escritorio */}
        <aside className="hidden lg:block">
          <div className="card sticky top-24 -mt-64 overflow-hidden">
            <div className="aspect-video">
              {course.previewVideoUrl ? (
                <iframe src={course.previewVideoUrl} title={`Trailer ${course.title}`} loading="lazy" className="h-full w-full" allowFullScreen />
              ) : (
                <CourseCover title={course.title} level={course.level} goal={course.goal} color={course.coverColor} image={course.coverImage} />
              )}
            </div>
            <div className="space-y-4 p-6">
              <PriceTag price={course.priceCOP} compareAt={course.compareAtCOP} size="lg" />
              <BuyButton course={course} className="w-full py-4 text-base" />
              <p className="text-center text-xs text-slate-500">{t('course.paymentMethods')}</p>
              <ul className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-700">
                {includes.map((i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-600" aria-hidden />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Barra de compra fija en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 pr-[4.5rem]">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold leading-tight">{formatCOP(course.priceCOP)}</p>
            {course.compareAtCOP && <p className="text-xs text-slate-400 line-through">{formatCOP(course.compareAtCOP)}</p>}
          </div>
          <BuyButton course={course} className="px-5" />
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />

      <AnimatePresence>
        {preview && <PreviewModal lessonId={preview.id} title={preview.title} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </>
  );
}
