import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { MailX } from 'lucide-react';
import { api, qs } from '@/lib/api';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { AuthCard, ResultMessage } from './AuthCard';

/** Requiere confirmar con un clic: evita bajas accidentales por escáneres que abren los links. */
export default function Unsubscribe() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token');
  const unsub = useMutation({ mutationFn: () => api<{ category: string }>(`/notifications/unsubscribe${qs({ token })}`, { method: 'POST' }) });

  const manage = <Link to="/mi-cuenta/ajustes#notificaciones" className="btn-ghost">{t('unsubscribe.manage')}</Link>;

  return (
    <AuthCard>
      <Seo title={t('unsubscribe.title')} noindex />
      {unsub.isSuccess ? (
        <ResultMessage ok title={t('unsubscribe.done')} text={t('unsubscribe.doneText')}>{manage}</ResultMessage>
      ) : !token || unsub.isError ? (
        <ResultMessage ok={false} title={t('unsubscribe.error')}>{manage}</ResultMessage>
      ) : (
        <div className="text-center">
          <MailX size={56} className="mx-auto text-brand-600" aria-hidden />
          <h1 className="mt-4 text-2xl font-extrabold">{t('unsubscribe.confirm')}</h1>
          <p className="mt-2 text-slate-600">{t('unsubscribe.note')}</p>
          <button onClick={() => unsub.mutate()} disabled={unsub.isPending} className="btn-primary mt-6 w-full">
            {unsub.isPending ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : t('unsubscribe.submit')}
          </button>
        </div>
      )}
    </AuthCard>
  );
}
