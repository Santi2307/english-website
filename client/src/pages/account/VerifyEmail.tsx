import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import type { User } from '@/lib/types';
import { AuthCard, ResultMessage } from './AuthCard';

/**
 * La verificación ocurre con un POST desde la página, no al abrir el link: los
 * escáneres de correo que "visitan" enlaces no pueden consumir el token.
 */
export default function VerifyEmail() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const started = useRef(false);

  useEffect(() => {
    // El token es de un solo uso: evita el doble efecto de StrictMode
    if (started.current) return;
    started.current = true;
    const token = params.get('token');
    if (!token) {
      setState('error');
      return;
    }
    api<{ user: User }>('/auth/verify-email', { method: 'POST', body: { token } })
      .then(() => {
        setState('ok');
        qc.invalidateQueries({ queryKey: ['me'] });
      })
      .catch(() => setState('error'));
  }, [params, qc]);

  return (
    <AuthCard>
      <Seo title={t('verify.checking')} noindex />
      {state === 'loading' && (
        <div className="py-6 text-center" role="status">
          <Spinner className="h-8 text-slate-900" />
          <p className="mt-4 font-semibold">{t('verify.checking')}</p>
        </div>
      )}
      {state === 'ok' && (
        <ResultMessage ok title={t('verify.success')} text={t('verify.successText')}>
          <Link to="/mi-cuenta" className="btn-primary">{t('verify.cta')}</Link>
        </ResultMessage>
      )}
      {state === 'error' && (
        <ResultMessage ok={false} title={t('verify.error')} text={t('verify.errorText')}>
          <Link to="/mi-cuenta" className="btn-primary">{t('verify.cta')}</Link>
        </ResultMessage>
      )}
    </AuthCard>
  );
}
