import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { MailCheck } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { AuthCard } from './AuthCard';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const send = useMutation({ mutationFn: () => api<void>('/auth/password/forgot', { method: 'POST', body: { email } }) });

  return (
    <AuthCard>
      <Seo title={t('forgot.title')} noindex />
      {send.isSuccess ? (
        <div className="text-center" role="status">
          <MailCheck size={56} className="mx-auto text-brand-600" aria-hidden />
          <h1 className="mt-4 text-2xl font-extrabold">{t('forgot.sent')}</h1>
          {/* Mismo mensaje exista o no la cuenta: no revela qué emails están registrados */}
          <p className="mt-2 text-slate-600">{t('forgot.sentText', { email })}</p>
          <Link to="/ingresar" className="btn-ghost mt-6 w-full">{t('forgot.back')}</Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold">{t('forgot.title')}</h1>
          <p className="mt-1 text-slate-600">{t('forgot.subtitle')}</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              send.mutate();
            }}
          >
            <div>
              <label htmlFor="email" className="label">{t('auth.email')}</label>
              <input id="email" type="email" required autoComplete="email" inputMode="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {send.error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{(send.error as ApiError).message}</p>}
            <button type="submit" disabled={send.isPending} className="btn-primary w-full">
              {send.isPending ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : t('forgot.submit')}
            </button>
          </form>
          <Link to="/ingresar" className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline">{t('forgot.back')}</Link>
        </>
      )}
    </AuthCard>
  );
}
