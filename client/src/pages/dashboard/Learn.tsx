import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle2, ChevronLeft, ChevronRight, Circle, Download, Flame, ListVideo, PlayCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageLoader, Spinner } from '@/components/ui/Spinner';
import type { LearningCourse, Playback } from '@/lib/types';
import type { LessonContentResponse } from '@/lib/lessonContent';
import { LessonContentView } from '@/components/lesson/LessonContentView';

type CompleteResponse = { completed: number; total: number; progress: number; courseCompleted: boolean; streak: number };

function Sidebar({ course, currentId, onPick }: { course: LearningCourse; currentId: string; onPick: (id: string) => void }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('learn.content')} className="divide-y divide-slate-200">
      {course.modules.map((m, mi) => {
        const pct = m.total ? Math.round((m.completed / m.total) * 100) : 0;
        return (
          <div key={m.id} className="py-3">
            <div className="px-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-900">{mi + 1}. {m.title}</p>
                <span className="shrink-0 text-xs text-slate-500">{m.completed}/{m.total}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <ul className="mt-2">
              {m.lessons.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => onPick(l.id)}
                    aria-current={l.id === currentId ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition',
                      l.id === currentId ? 'bg-brand-50 font-semibold text-brand-800' : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    {l.completed ? (
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-500" aria-label={t('learn.completed')} />
                    ) : l.id === currentId ? (
                      <PlayCircle size={18} className="shrink-0 text-brand-600" aria-hidden />
                    ) : (
                      <Circle size={18} className="shrink-0 text-slate-300" aria-hidden />
                    )}
                    <span className="flex-1">{l.title}</span>
                    {l.score !== null && l.score !== undefined && (
                      <span className={cn('rounded-full px-1.5 py-0.5 text-[11px] font-bold', l.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{l.score}%</span>
                    )}
                    <span className="text-xs text-slate-400">{l.durationMinutes}m</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export default function Learn() {
  const { slug = '', lessonId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [celebrate, setCelebrate] = useState<CompleteResponse | null>(null);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['learn', slug],
    queryFn: () => api<LearningCourse>(`/me/courses/${slug}`),
  });

  const lessons = useMemo(() => course?.modules.flatMap((m) => m.lessons) ?? [], [course]);
  // Sin lección en la URL: abre la primera sin completar
  const current = lessons.find((l) => l.id === lessonId) ?? lessons.find((l) => !l.completed) ?? lessons[0];
  const idx = current ? lessons.indexOf(current) : -1;
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined;

  const { data: playback, isLoading: loadingVideo } = useQuery({
    queryKey: ['playback', current?.id],
    queryFn: () => api<{ playback: Playback }>(`/lessons/${current!.id}/playback`).then((r) => r.playback),
    enabled: !!current,
    // Las URLs firmadas expiran: se renuevan antes de que caduquen
    staleTime: 30 * 60_000,
  });

  const { data: lessonContent } = useQuery({
    queryKey: ['lesson-content', current?.id],
    queryFn: () => api<LessonContentResponse>(`/lessons/${current!.id}/content`),
    enabled: !!current,
    staleTime: 5 * 60_000,
  });
  const content = lessonContent?.content ?? null;

  const complete = useMutation({
    mutationFn: (score?: number) => api<CompleteResponse>(`/lessons/${current!.id}/complete`, { method: 'POST', body: score === undefined ? {} : { score } }),
    onSuccess: (r, score) => {
      qc.invalidateQueries({ queryKey: ['learn', slug] });
      qc.invalidateQueries({ queryKey: ['my-courses'] });
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['lesson-content', current?.id] });
      if (r.courseCompleted && !course?.completedAt) setCelebrate(r);
      // Tras la práctica se queda en la pantalla de resultados; el botón manual sí avanza
      else if (score === undefined && next) go(next.id);
    },
  });

  const go = (id: string) => {
    navigate(`/aprender/${slug}/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current?.id]);

  if (isLoading) return <PageLoader />;
  if (error || !course || !current) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p>{(error as Error)?.message ?? t('common.error')}</p>
          <Link to={`/cursos/${slug}`} className="btn-primary mt-4">{t('common.viewCourse')}</Link>
        </div>
      </div>
    );
  }

  const done = !!course.completedAt || !!celebrate;

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div className="ambient-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <Seo title={`${current.title} · ${course.title}`} noindex />

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl">
        <Link to="/mi-cuenta" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-700">
          <ArrowLeft size={18} aria-hidden /> <span className="hidden sm:inline">{t('learn.back')}</span>
        </Link>
        <p className="min-w-0 flex-1 truncate font-semibold">{course.title}</p>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${course.progress}%` }} />
          </div>
          <span className="text-sm font-bold">{course.progress}%</span>
        </div>
        <button
          onClick={() => document.getElementById('temario')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          aria-label={t('learn.content')}
        >
          <ListVideo size={20} aria-hidden />
        </button>
      </header>

      <div className="flex flex-1">
        <main className="min-w-0 flex-1">
          {(loadingVideo || playback || !content) && (
          <div className="bg-black">
            <div className="mx-auto aspect-video max-w-5xl">
              {loadingVideo ? (
                <div className="grid h-full place-items-center"><Spinner className="h-10 w-10 border-white/20 border-t-white" /></div>
              ) : playback ? (
                <iframe
                  key={current.id}
                  src={playback.embedUrl}
                  title={current.title}
                  className="h-full w-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="grid h-full place-items-center p-6 text-center text-slate-300">
                  <div>
                    <PlayCircle size={56} className="mx-auto opacity-40" aria-hidden />
                    <p className="mt-3">{t('learn.noVideo')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{current.title}</h1>
                <p className="mt-2 text-slate-600">{current.description}</p>
              </div>
              {current.completed ? (
                <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">
                  <CheckCircle2 size={18} aria-hidden /> {t('learn.completed')}
                </span>
              ) : (
                <button onClick={() => complete.mutate(undefined)} disabled={complete.isPending} className="btn-primary shrink-0">
                  {complete.isPending ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : <CheckCircle2 size={18} aria-hidden />}
                  {t('learn.markComplete')}
                </button>
              )}
            </div>

            {content && (
              <LessonContentView
                title={current.title}
                content={content}
                bestScore={lessonContent?.bestScore ?? null}
                onFinish={(score) => complete.mutate(score)}
                finishing={complete.isPending}
              />
            )}

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 p-6 text-center text-white sm:flex-row sm:text-left"
                >
                  <Award size={48} className="shrink-0 text-accent-400" aria-hidden />
                  <div className="flex-1">
                    <p className="text-lg font-bold">{t('learn.courseDone')}</p>
                    {celebrate && (
                      <p className="mt-1 flex items-center justify-center gap-1 text-sm text-brand-200 sm:justify-start">
                        <Flame size={14} aria-hidden /> {t('dashboard.streakDays', { count: celebrate.streak })}
                      </p>
                    )}
                  </div>
                  <a href={`/api/me/certificates/${course.id}`} download className="btn-accent">
                    <Download size={18} aria-hidden /> {t('learn.certificate')}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between gap-3 border-t border-slate-200 pt-4">
              <button onClick={() => prev && go(prev.id)} disabled={!prev} className="btn-ghost py-2.5 text-sm">
                <ChevronLeft size={16} aria-hidden /> {t('learn.prev')}
              </button>
              <button onClick={() => next && go(next.id)} disabled={!next} className="btn-ghost py-2.5 text-sm">
                {t('learn.next')} <ChevronRight size={16} aria-hidden />
              </button>
            </div>

            {/* Temario en móvil */}
            <section id="temario" className="glass-strong scroll-mt-16 overflow-hidden rounded-3xl lg:hidden">
              <h2 className="border-b border-slate-200 px-4 py-3 font-bold">{t('learn.content')}</h2>
              <Sidebar course={course} currentId={current.id} onPick={go} />
            </section>
          </div>
        </main>

        <aside className="hidden w-80 shrink-0 border-l border-white/60 bg-white/70 backdrop-blur-xl lg:block">
          <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
            <p className="border-b border-slate-200 px-4 py-3 font-bold">{t('learn.content')}</p>
            <Sidebar course={course} currentId={current.id} onPick={go} />
          </div>
        </aside>
      </div>
    </div>
  );
}
