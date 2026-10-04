import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowRight, Check, Download, MailWarning, Mic, Settings } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useLocale';
import { Seo } from '@/components/ui/Seo';
import { PageLoader } from '@/components/ui/Spinner';
import { LiveDot } from '@/components/ui/product';
import { SCENARIOS } from '@/data/landing';
import { savedLevel } from '@/data/levelTest';
import { cn } from '@/lib/format';
import type { Level, MyCourses } from '@/lib/types';

/**
 * Dashboard con la estructura del producto de speaking. La acción principal es
 * siempre hablar. English Score y Errores recientes muestran un estado vacío
 * honesto hasta que exista el coach: nunca números inventados para un usuario real.
 */

function VerifyBanner() {
  const { t } = useTranslation();
  const resend = useMutation({ mutationFn: () => api<void>('/auth/verify-email/resend', { method: 'POST' }) });
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" role="status">
      <p className="flex items-start gap-2 text-sm text-amber-900">
        <MailWarning size={18} className="mt-0.5 shrink-0" aria-hidden /> {t('account.verifyBanner')}
      </p>
      {resend.isSuccess ? (
        <span className="text-sm font-medium text-emerald-700">{t('account.resent')}</span>
      ) : (
        <button onClick={() => resend.mutate()} disabled={resend.isPending} className="btn-secondary btn-sm shrink-0">
          {t('account.resend')}
        </button>
      )}
      {resend.error && <p className="text-sm text-rose-700" role="alert">{(resend.error as ApiError).message}</p>}
    </div>
  );
}

function Panel({ title, meta, children, className }: { title: string; meta?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('card flex flex-col p-5 sm:p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-900">{title}</h2>
        {meta}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </section>
  );
}

function Soon() {
  const { t } = useTranslation();
  return <span className="badge">{t('dashboard.soon')}</span>;
}

function last7Days(locale: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000);
    return { key: fmt.format(d), label: new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(d) };
  });
}

function greetingKey() {
  const h = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Bogota' }).format(new Date()));
  return h < 12 ? 'morning' : h < 19 ? 'afternoon' : 'evening';
}

const SCENARIO_FOR_LEVEL: Record<Level, string> = { A1: 'food', A2: 'small-talk', B1: 'interview', B2: 'meeting', C1: 'sales' };

export default function Dashboard() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['my-courses'], queryFn: () => api<MyCourses>('/me/courses') });

  if (isLoading || !data) return <PageLoader />;

  const days = last7Days(locale === 'es' ? 'es-CO' : 'en-US');
  const today = days[6].key;
  const practicedToday = data.activeDaysLast7.includes(today);
  // Ruta en curso: la más avanzada que no esté terminada
  const current = [...data.courses].filter((c) => !c.completedAt).sort((a, b) => b.progress - a.progress)[0];
  const level = savedLevel();
  const scenario = SCENARIOS.items.find((s) => s.id === SCENARIO_FOR_LEVEL[level ?? 'B1'])!;
  const firstName = user?.name.split(' ')[0] ?? '';

  const tasks = [
    { label: t('dashboard.tasks.lesson'), done: practicedToday, soon: false },
    { label: t('dashboard.tasks.speak'), done: false, soon: true },
    { label: t('dashboard.tasks.review'), done: false, soon: true },
  ];

  return (
    <div className="container-page space-y-6 py-8 sm:py-12">
      <Seo title={`${t('nav.myCourses')} · English Academy`} noindex />

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-slate-900 sm:text-4xl">
            {t(`dashboard.greeting.${greetingKey()}`, { name: firstName })}
          </h1>
          <p className="mt-1.5 text-slate-500">{t('dashboard.resume')}</p>
        </div>
        <Link to="/mi-cuenta/ajustes" className="btn-quiet btn-sm shrink-0" aria-label={t('account.settings')}>
          <Settings size={16} aria-hidden /> <span className="hidden sm:inline">{t('account.settings')}</span>
        </Link>
      </header>

      {user && !user.emailVerified && <VerifyBanner />}

      {/* Acción principal: hablar */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-white/50">
              <LiveDot /> Speaking
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{t('dashboard.startConversation')}</h2>
            <p className="mt-1.5 text-white/60">
              {current ? t('dashboard.startSub', { lesson: current.title }) : t('dashboard.startSubEmpty')}
            </p>
          </div>
          <Link
            to={current ? `/aprender/${current.slug}` : '/cursos'}
            className="btn-primary btn-lg w-full shrink-0 sm:h-16 sm:w-16 sm:rounded-full sm:p-0"
            aria-label={t('dashboard.startConversation')}
          >
            <Mic size={20} aria-hidden /> <span className="sm:hidden">{current ? t('dashboard.startConversation') : t('dashboard.pickPath')}</span>
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Panel title={t('dashboard.today')} meta={<span className="font-mono text-xs text-slate-400">{tasks.filter((x) => x.done).length}/{tasks.length}</span>}>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.label} className="flex items-center gap-3 text-sm">
                <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full border', task.done ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300')}>
                  {task.done && <Check size={12} strokeWidth={3} aria-hidden />}
                </span>
                <span className={cn('flex-1', task.done ? 'text-slate-400 line-through' : 'text-slate-700')}>{task.label}</span>
                {task.soon && <Soon />}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={t('dashboard.score')} meta={<Soon />}>
          <p className="font-mono text-5xl font-medium tracking-[-0.04em] text-slate-200">–––</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{t('dashboard.scoreEmpty')}</p>
        </Panel>

        <Panel title={t('dashboard.streak')} className="md:col-span-2 lg:col-span-1">
          <p className="font-mono text-3xl font-medium tracking-tight text-slate-900">
            {data.streak} <span className="font-sans text-base text-slate-500">{t('dashboard.streakDays', { count: data.streak }).replace(/^\d+\s*/, '')}</span>
          </p>
          <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Últimos 7 días">
            {days.map((d) => {
              const on = data.activeDaysLast7.includes(d.key);
              return (
                <li key={d.key} className="flex flex-col items-center gap-1.5">
                  <span className={cn('aspect-square w-full rounded-md', on ? (d.key === today ? 'bg-brand-500' : 'bg-slate-900') : 'bg-slate-100')} aria-label={on ? '✓' : undefined} />
                  <span className={cn('text-[11px]', d.key === today ? 'font-medium text-slate-900' : 'text-slate-400')}>{d.label}</span>
                </li>
              );
            })}
          </ol>
          {!practicedToday && <p className="mt-3 text-xs text-slate-500">{t('dashboard.streakHint')}</p>}
        </Panel>

        <Panel title={t('dashboard.mistakes')} meta={<Soon />} className="md:col-span-2">
          <ul className="space-y-2" aria-hidden>
            {[0.7, 0.5].map((w) => (
              <li key={w} className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 px-3 py-3">
                <span className="h-2 rounded-full bg-slate-100" style={{ width: `${w * 40}%` }} />
                <ArrowRight size={12} className="text-slate-200" />
                <span className="h-2 rounded-full bg-slate-100" style={{ width: `${w * 30}%` }} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-500">{t('dashboard.mistakesEmpty')}</p>
        </Panel>

        <Panel title={t('dashboard.recommended')} meta={level && <span className="font-mono text-xs text-slate-400">{t('dashboard.recommendedFor', { level })}</span>}>
          <p className="font-medium text-slate-900">{scenario.name[locale]}</p>
          <p className="mt-1 text-sm text-slate-500">{scenario.context[locale]}</p>
          <p className="mt-4 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-700">“{scenario.opener}”</p>
          <Link to="/#practicar" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-brand-700">
            {t('dashboard.preview')} <ArrowRight size={14} aria-hidden />
          </Link>
        </Panel>
      </div>

      {/* Rutas de aprendizaje: siguen disponibles, con menos peso visual */}
      <section className="pt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">{t('dashboard.myCourses')}</h2>
          <Link to="/cursos" className="text-sm text-slate-500 hover:text-slate-900">{t('dashboard.explore')}</Link>
        </div>
        {data.courses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-600">{t('dashboard.empty')}</p>
            <Link to="/cursos" className="btn-secondary mt-4">{t('dashboard.explore')}</Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {data.courses.map((c) => (
              <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{c.title}</p>
                  <p className="font-mono text-xs text-slate-400">{c.level} · {t('dashboard.progress', { done: c.completedLessons, total: c.totalLessons })}</p>
                </div>
                <div className="col-span-2 row-start-2 flex items-center gap-3 sm:col-span-1 sm:row-start-auto">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={c.progress} aria-valuemin={0} aria-valuemax={100} aria-label={c.title}>
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-slate-500">{c.progress}%</span>
                </div>
                <div className="flex gap-2">
                  {c.completedAt && (
                    <a href={`/api/me/certificates/${c.id}`} download className="btn-quiet btn-sm" aria-label={t('dashboard.certificate')}>
                      <Download size={15} aria-hidden /> <span className="hidden sm:inline">{t('dashboard.certificate')}</span>
                    </a>
                  )}
                  <Link to={`/aprender/${c.slug}`} className="btn-secondary btn-sm">{c.completedAt ? t('dashboard.completed') : t('dashboard.continue')}</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
