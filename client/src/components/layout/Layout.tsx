import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { PageLoader } from '../ui/Spinner';
import { ErrorBoundary } from '../ui/ErrorState';
import { trackPageView } from '@/lib/analytics';

/** Hace scroll al hash (/#faq) o al inicio al cambiar de ruta, y registra la vista. */
function useRouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
    if (hash) {
      // La sección puede estar en un chunk lazy y las de arriba siguen creciendo al montarse.
      // Se ancla al destino cada vez que la página cambia de alto, durante ~4 s o hasta
      // que el usuario haga scroll a mano.
      const id = hash.slice(1);
      const started = Date.now();
      let first = true;
      let stopped = false;
      const align = () => {
        const el = document.getElementById(id);
        if (!el || stopped) return;
        // No interrumpir el scroll suave inicial
        if (!first && Date.now() - started < 700) return;
        const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (Math.abs(el.getBoundingClientRect().top - offset) > 4) {
          el.scrollIntoView({ behavior: first ? 'smooth' : 'auto' });
          first = false;
        }
      };
      const ro = new ResizeObserver(() => align());
      ro.observe(document.body);
      const poll = setInterval(align, 150);
      const end = setTimeout(() => stop(), 4000);
      const stop = () => {
        stopped = true;
        ro.disconnect();
        clearInterval(poll);
        clearTimeout(end);
      };
      window.addEventListener('wheel', stop, { once: true, passive: true });
      window.addEventListener('touchmove', stop, { once: true, passive: true });
      window.addEventListener('keydown', stop, { once: true });
      return () => {
        stop();
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchmove', stop);
        window.removeEventListener('keydown', stop);
      };
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function Layout() {
  useRouteEffects();
  const { pathname } = useLocation();
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <a href="#main" className="sr-only z-50 rounded bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
