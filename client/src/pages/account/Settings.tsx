import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Bell, Check, KeyRound, Lock, UserRound } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageLoader, Spinner } from '@/components/ui/Spinner';
import { PasswordInput } from '@/components/ui/PasswordInput';
import type { NotificationPreferences, PreferenceKey, User } from '@/lib/types';

function Section({ id, icon: Icon, title, children }: { id: string; icon: typeof Bell; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="card scroll-mt-24 p-6">
      <h2 id={`${id}-title`} className="flex items-center gap-2 text-lg font-bold">
        <Icon size={20} className="text-brand-600" aria-hidden /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Saved({ show, text }: { show: boolean; text: string }) {
  return show ? (
    <span className="flex items-center gap-1 text-sm font-medium text-emerald-700" role="status">
      <Check size={16} aria-hidden /> {text}
    </span>
  ) : null;
}

function Switch({ checked, disabled, onChange, labelledBy }: { checked: boolean; disabled?: boolean; onChange: (v: boolean) => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed',
        checked ? 'bg-brand-600' : 'bg-slate-300',
        disabled && 'opacity-60',
      )}
    >
      <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  );
}

function ProfileForm({ user }: { user: User }) {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState(user.name);
  const [locale, setLocale] = useState(user.locale);
  const save = useMutation({
    mutationFn: () => api<{ user: User }>('/auth/profile', { method: 'PATCH', body: { name, locale } }),
    onSuccess: (r) => {
      qc.setQueryData(['me'], r.user);
      // La web y los emails usan el mismo idioma
      if (!i18n.language.startsWith(r.user.locale)) i18n.changeLanguage(r.user.locale);
    },
  });
  const dirty = name.trim() !== user.name || locale !== user.locale;

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div>
        <label htmlFor="name" className="label">{t('auth.name')}</label>
        <input id="name" className="input" value={name} minLength={2} maxLength={80} required onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="locale" className="label">{t('settings.language')}</label>
        <select id="locale" className="input" value={locale} onChange={(e) => setLocale(e.target.value as 'es' | 'en')}>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="email-ro">{t('auth.email')}</label>
        <input id="email-ro" className="input bg-slate-50 text-slate-500" value={user.email} readOnly />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={!dirty || save.isPending} className="btn-primary py-2.5">{t('settings.save')}</button>
        <Saved show={save.isSuccess && !dirty} text={t('settings.saved')} />
        {save.error && <p className="text-sm text-rose-600" role="alert">{(save.error as ApiError).message}</p>}
      </div>
    </form>
  );
}

function PasswordForm({ user }: { user: User }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const change = useMutation({
    mutationFn: () => api<{ user: User }>('/auth/password', { method: 'PUT', body: { currentPassword: current || undefined, newPassword: next } }),
    onSuccess: (r) => {
      qc.setQueryData(['me'], r.user);
      setCurrent('');
      setNext('');
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        change.mutate();
      }}
    >
      {!user.hasPassword && <p className="text-sm text-slate-600">{t('settings.setPasswordHint')}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {user.hasPassword && (
          <div>
            <label htmlFor="current" className="label">{t('settings.currentPassword')}</label>
            <PasswordInput id="current" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
        )}
        <div>
          <label htmlFor="new" className="label">{t('settings.newPassword')}</label>
          <PasswordInput
            id="new"
            autoComplete="new-password"
            required
            minLength={8}
            pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
            title={t('auth.passwordHint')}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">{t('auth.passwordHint')}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={change.isPending} className="btn-primary py-2.5">{t('settings.changePassword')}</button>
        <Saved show={change.isSuccess} text={t('settings.passwordChanged')} />
        {change.error && <p className="text-sm text-rose-600" role="alert">{(change.error as ApiError).message}</p>}
      </div>
    </form>
  );
}

const ORDER: (keyof NotificationPreferences)[] = ['security', 'transactional', 'accountUpdates', 'productUpdates', 'tips', 'marketing'];

function NotificationsForm() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['notification-preferences'], queryFn: () => api<NotificationPreferences>('/notifications/preferences') });
  const update = useMutation({
    mutationFn: (body: Partial<Record<PreferenceKey, boolean>>) => api<NotificationPreferences>('/notifications/preferences', { method: 'PUT', body }),
    // Actualización optimista: el switch responde al instante
    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: ['notification-preferences'] });
      const prev = qc.getQueryData<NotificationPreferences>(['notification-preferences']);
      if (prev) {
        const next = { ...prev };
        for (const [k, v] of Object.entries(body)) next[k as PreferenceKey] = { ...next[k as PreferenceKey], enabled: !!v };
        qc.setQueryData(['notification-preferences'], next);
      }
      return { prev };
    },
    onError: (_e, _b, ctx) => ctx?.prev && qc.setQueryData(['notification-preferences'], ctx.prev),
    onSuccess: (d) => qc.setQueryData(['notification-preferences'], d),
  });

  if (!data) return <Spinner />;

  return (
    <>
      <p className="text-sm text-slate-600">{t('settings.notificationsHint')}</p>
      <ul className="mt-4 divide-y divide-slate-100">
        {ORDER.map((key) => {
          const pref = data[key];
          const labelId = `pref-${key}`;
          return (
            <li key={key} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p id={labelId} className="font-semibold text-slate-900">{t(`settings.categories.${key}.label`)}</p>
                <p className="text-sm text-slate-500">{t(`settings.categories.${key}.hint`)}</p>
              </div>
              {pref.locked ? (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Lock size={12} aria-hidden /> {t('settings.alwaysOn')}
                </span>
              ) : (
                <Switch
                  checked={pref.enabled}
                  labelledBy={labelId}
                  disabled={update.isPending}
                  onChange={(v) => update.mutate({ [key]: v })}
                />
              )}
            </li>
          );
        })}
      </ul>
      {update.error && <p className="text-sm text-rose-600" role="alert">{(update.error as ApiError).message}</p>}
    </>
  );
}

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Respeta el ancla #notificaciones de los links en los emails
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
  }, []);

  if (!user) return <PageLoader />;

  return (
    <div className="container-page max-w-3xl space-y-6 py-10">
      <Seo title={`${t('settings.title')} · English Academy`} noindex />
      <div>
        <Link to="/mi-cuenta" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
          <ArrowLeft size={16} aria-hidden /> {t('nav.myCourses')}
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">{t('settings.title')}</h1>
      </div>
      <Section id="perfil" icon={UserRound} title={t('settings.profile')}><ProfileForm user={user} /></Section>
      <Section id="seguridad" icon={KeyRound} title={t('settings.security')}><PasswordForm user={user} /></Section>
      <Section id="notificaciones" icon={Bell} title={t('settings.notifications')}><NotificationsForm /></Section>
    </div>
  );
}
