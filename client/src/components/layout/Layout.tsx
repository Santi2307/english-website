import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { PageLoader } from '../ui/Spinner';
import { trackPageView } from '@/lib/analytics';

/** Hace scroll al hash (/#faq) o al inicio al cambiar de ruta, y registra la vista. */
function useRouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function Layout() {
  useRouteEffects();
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      {/* Fondo ambiente fijo: el vidrio necesita color detrás para verse */}
      <div className="ambient-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <a href="#main" className="sr-only z-50 rounded bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
