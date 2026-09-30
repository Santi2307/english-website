import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '../ui/Spinner';

export function RequireAuth({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { user, isLoading } = useAuth();
  const { pathname, search } = useLocation();
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to={`/ingresar?next=${encodeURIComponent(pathname + search)}`} replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}
