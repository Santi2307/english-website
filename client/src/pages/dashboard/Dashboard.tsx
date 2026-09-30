import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Download, Flame, PlayCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/Spinner';
import { CourseCover } from '@/components/ui/CourseCover';
import { cn } from '@/lib/format';
import type { MyCourses } from '@/lib/types';

function last7Days() {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000);
    return { key: fmt.format(d), label: new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(d) };
  });
}

function StreakCard({ streak, active }: { streak: number; active: string[] }) {
  const { t } = useTranslation();
  const days = last7Days();
  const today = days[6].key;
  return (
    <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <motion.div
          animate={streak > 0 ? { scale: [1, 1.12, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn('grid h-14 w-14 place-items-center rounded-2xl', streak > 0 ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400')}
        >
          <Flame size={30} aria-hidden className={streak > 0 ? 'fill-orange-400' : ''} />
        </motion.div>
        <div>
          <p className="text-sm text-slate-500">{t('dashboard.streak')}</p>
          <p className="text-2xl font-extrabold">{t('dashboard.streakDays', { count: streak })}</p>
          {!active.includes(today) && <p className="text-xs text-slate-500">{t('dashboard.streakHint')}</p>}
        </div>
      </div>
      <ol className="flex gap-2" aria-label="Últimos 7 días">
        {days.map((d) => {
          const on = active.includes(d.key);
          return (
            <li key={d.key} className="flex flex-col items-center gap-1">
              <span className={cn('grid h-8 w-8 place-items-center rounded-full text-xs', on ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400')}>
                {on ? '✓' : ''}
              </span>
              <span className={cn('text-xs', d.key === today ? 'font-bold text-slate-900' : 'text-slate-400')}>{d.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['my-courses'], queryFn: () => api<MyCourses>('/me/courses') });

  if (isLoading || !data) return <PageLoader />;

  return (
    <div className="container-page space-y-8 py-10">
      <Seo title={`${t('dashboard.myCourses')} · English Academy`} noindex />
      <h1 className="text-3xl font-extrabold">{t('dashboard.hello', { name: user?.name.split(' ')[0] })}</h1>
      <StreakCard streak={data.streak} active={data.activeDaysLast7} />

      <section>
        <h2 className="text-xl font-bold">{t('dashboard.myCourses')}</h2>
        {data.courses.length === 0 ? (
          <div className="card mt-4 p-10 text-center">
            <p className="text-slate-600">{t('dashboard.empty')}</p>
            <Link to="/cursos" className="btn-primary mt-4">{t('dashboard.explore')}</Link>
          </div>
        ) : (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card overflow-hidden">
                <div className="relative h-32">
                  <CourseCover title={c.title} level={c.level} color={c.coverColor} image={c.coverImage} />
                  {c.completedAt && (
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                      <Award size={14} aria-hidden /> {t('dashboard.completed')}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-slate-500">{c.instructorName}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{t('dashboard.progress', { done: c.completedLessons, total: c.totalLessons })}</span>
                      <span className="font-bold text-slate-900">{c.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={c.progress} aria-valuemin={0} aria-valuemax={100} aria-label={c.title}>
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-400" initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link to={`/aprender/${c.slug}`} className="btn-primary py-2.5 text-sm">
                      <PlayCircle size={16} aria-hidden /> {t('dashboard.continue')}
                    </Link>
                    {c.completedAt && (
                      <a href={`/api/me/certificates/${c.id}`} download className="btn-ghost py-2.5 text-sm">
                        <Download size={16} aria-hidden /> {t('dashboard.certificate')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
