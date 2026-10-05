import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuthActions } from '@/hooks/useAuth';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { Seo } from '@/components/ui/Seo';
import { Spinner } from '@/components/ui/Spinner';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ApiError } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('email'),
  password: z.string().min(1, 'password'),
});
const registerSchema = z.object({
  name: z.string().min(2, 'name'),
  email: z.string().email('email'),
  password: z.string().min(8, 'password').regex(/[A-Za-z]/, 'password').regex(/\d/, 'password'),
  marketingConsent: z.boolean().optional(),
});
type FormValues = { name?: string; email: string; password: string; marketingConsent?: boolean };

/** Solo permite redirecciones internas (evita open redirect con ?next=https://...). */
function safeNext(raw: string | null) {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/mi-cuenta';
}

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const next = safeNext(new URLSearchParams(search).get('next'));
  const { login, register, google } = useAuthActions();
  const isLogin = mode === 'login';
  const mutation = isLogin ? login : register;

  const { register: field, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (isLogin) await login.mutateAsync({ email: values.email, password: values.password });
    else await register.mutateAsync({ name: values.name!, email: values.email, password: values.password, marketingConsent: !!values.marketingConsent });
    navigate(next, { replace: true });
  });

  const onGoogle = async (credential: string) => {
    await google.mutateAsync(credential);
    navigate(next, { replace: true });
  };

  const serverError = (mutation.error ?? google.error) as ApiError | null;
  const err = (k: keyof FormValues) =>
    errors[k] && <p className="mt-1 text-sm text-rose-600" role="alert">{t(`auth.errors.${errors[k]!.message}`)}</p>;

  return (
    <div className="container-page grid min-h-[80vh] place-items-center py-10">
      <Seo title={`${t(isLogin ? 'auth.loginTitle' : 'auth.registerTitle')} · English Academy`} noindex />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">{t(isLogin ? 'auth.loginTitle' : 'auth.registerTitle')}</h1>
        {next.startsWith('/checkout') && <p className="mt-1 text-sm text-slate-600">{t('checkout.loginRequired')}</p>}

        <div className="mt-6">
          <GoogleButton onCredential={onGoogle} />
        </div>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />{t('auth.or')}<span className="h-px flex-1 bg-slate-200" />
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="label">{t('auth.name')}</label>
              <input id="name" autoComplete="name" className="input" aria-invalid={!!errors.name} {...field('name')} />
              {err('name')}
            </div>
          )}
          <div>
            <label htmlFor="email" className="label">{t('auth.email')}</label>
            <input id="email" type="email" inputMode="email" autoComplete="email" className="input" aria-invalid={!!errors.email} {...field('email')} />
            {err('email')}
          </div>
          <div>
            <label htmlFor="password" className="label">{t('auth.password')}</label>
            <PasswordInput
              id="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-invalid={!!errors.password}
              aria-describedby={!isLogin ? 'pw-hint' : undefined}
              {...field('password')}
            />
            {!isLogin && !errors.password && <p id="pw-hint" className="mt-1 text-xs text-slate-500">{t('auth.passwordHint')}</p>}
            {err('password')}
            {isLogin && (
              <Link to="/olvide-contrasena" className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline">
                {t('auth.forgot')}
              </Link>
            )}
          </div>
          {!isLogin && (
            <label className="flex items-start gap-2 text-sm text-slate-600">
              {/* Consentimiento explícito y opcional (Ley 1581): nunca premarcado */}
              <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" {...field('marketingConsent')} />
              {t('auth.marketingConsent')}
            </label>
          )}
          {serverError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{serverError.message}</p>}
          <button type="submit" disabled={mutation.isPending} aria-busy={mutation.isPending} className="btn-primary w-full py-3.5">
            {mutation.isPending ? <Spinner className="h-4" /> : t(isLogin ? 'auth.submitLogin' : 'auth.submitRegister')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {t(isLogin ? 'auth.noAccount' : 'auth.hasAccount')}{' '}
          <Link to={`${isLogin ? '/registro' : '/ingresar'}${search}`} className="font-semibold text-brand-700 hover:underline">
            {t(isLogin ? 'nav.register' : 'nav.login')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
