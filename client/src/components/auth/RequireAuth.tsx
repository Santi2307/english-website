import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '../ui/Spinner';
import { ErrorState, errorKind } from '../ui/ErrorState';

export function RequireAuth({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { user, isLoading, error, refetch } = useAuth();
  const { pathname, search } = useLocation();
  if (isLoading) return <PageLoader />;
  // Sin respuesta del servidor no se sabe si hay sesión: mejor avisar que mandar al login
  if (error && !user) return <ErrorState kind={errorKind(error)} onRetry={() => refetch()} />;
  if (!user) return <Navigate to={`/ingresar?next=${encodeURIComponent(pathname + search)}`} replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}
