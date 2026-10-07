import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { CK } from '@/data/checkout';
import { useLocale } from '@/hooks/useLocale';
import { LanguageToggle, Logo } from '../layout/Navbar';
import { PageLoader } from '../ui/Spinner';
import { ErrorBoundary } from '../ui/ErrorState';

/**
 * Marco del checkout: el mismo sistema visual, sin navegación ni distracciones.
 * Logo a la izquierda, "Pago seguro" a la derecha.
 */
export function CheckoutShell() {
  const locale = useLocale();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-600">
              <Lock size={14} aria-hidden /> {CK.secure[locale]}
            </span>
            <span className="hidden sm:block"><LanguageToggle /></span>
          </div>
        </div>
      </header>
      <main id="main" className="flex-1">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="container-page flex flex-col gap-2 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} English Academy</p>
        <span className="sm:hidden"><LanguageToggle /></span>
      </footer>
    </div>
  );
}
