import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, ApiError } from '@/lib/api';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { AuthCard, ResultMessage } from './AuthCard';

const schema = z
  .object({
    password: z.string().min(8, 'password').regex(/[A-Za-z]/, 'password').regex(/\d/, 'password'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: 'mismatch', path: ['confirm'] });
type Values = z.infer<typeof schema>;

export default function ResetPassword() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token');
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const reset = useMutation({
    mutationFn: (v: Values) => api<void>('/auth/password/reset', { method: 'POST', body: { token, password: v.password } }),
    // Todas las sesiones quedan cerradas en el servidor
    onSuccess: () => qc.setQueryData(['me'], null),
  });

  if (!token) {
    return (
      <AuthCard>
        <ResultMessage ok={false} title={t('reset.invalid')}>
          <Link to="/olvide-contrasena" className="btn-primary">{t('forgot.title')}</Link>
        </ResultMessage>
      </AuthCard>
    );
  }

  if (reset.isSuccess) {
    return (
      <AuthCard>
        <ResultMessage ok title={t('reset.done')} text={t('reset.doneText')}>
          <Link to="/ingresar" className="btn-primary">{t('auth.submitLogin')}</Link>
        </ResultMessage>
      </AuthCard>
    );
  }

  const err = (k: keyof Values) =>
    errors[k] && (
      <p className="mt-1 text-sm text-rose-600" role="alert">
        {errors[k]!.message === 'mismatch' ? t('reset.mismatch') : t('auth.errors.password')}
      </p>
    );

  return (
    <AuthCard>
      <Seo title={t('reset.title')} noindex />
      <h1 className="text-2xl font-extrabold">{t('reset.title')}</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit((v) => reset.mutate(v))} noValidate>
        <div>
          <label htmlFor="password" className="label">{t('reset.password')}</label>
          <input id="password" type="password" autoComplete="new-password" className="input" aria-invalid={!!errors.password} {...register('password')} />
          {errors.password ? err('password') : <p className="mt-1 text-xs text-slate-500">{t('auth.passwordHint')}</p>}
        </div>
        <div>
          <label htmlFor="confirm" className="label">{t('reset.confirm')}</label>
          <input id="confirm" type="password" autoComplete="new-password" className="input" aria-invalid={!!errors.confirm} {...register('confirm')} />
          {err('confirm')}
        </div>
        {reset.error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
            {(reset.error as ApiError).message} <Link to="/olvide-contrasena" className="font-semibold underline">{t('forgot.title')}</Link>
          </p>
        )}
        <button type="submit" disabled={reset.isPending} className="btn-primary w-full">
          {reset.isPending ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : t('reset.submit')}
        </button>
      </form>
    </AuthCard>
  );
}
