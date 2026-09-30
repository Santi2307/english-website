import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import i18n from '@/i18n';

/** Idioma actual de la interfaz: el backend lo usa para los emails. */
const currentLocale = () => (i18n.language?.startsWith('en') ? 'en' : 'es');

const ME = ['me'] as const;

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ME,
    queryFn: () => api<{ user: User | null }>('/auth/me').then((r) => r.user),
    staleTime: 5 * 60_000,
  });
  return { user: data ?? null, isLoading };
}

export function useAuthActions() {
  const qc = useQueryClient();
  const onSuccess = (r: { user: User }) => {
    qc.setQueryData(ME, r.user);
    qc.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
  };
  return {
    login: useMutation({
      mutationFn: (body: { email: string; password: string }) => api<{ user: User }>('/auth/login', { method: 'POST', body }),
      onSuccess,
    }),
    register: useMutation({
      mutationFn: (body: { name: string; email: string; password: string; marketingConsent?: boolean }) =>
        api<{ user: User }>('/auth/register', { method: 'POST', body: { ...body, locale: currentLocale() } }),
      onSuccess,
    }),
    google: useMutation({
      mutationFn: (credential: string) => api<{ user: User }>('/auth/google', { method: 'POST', body: { credential, locale: currentLocale() } }),
      onSuccess,
    }),
    logout: useMutation({
      mutationFn: () => api<void>('/auth/logout', { method: 'POST' }),
      onSuccess: () => {
        qc.setQueryData(ME, null);
        qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
      },
    }),
  };
}
