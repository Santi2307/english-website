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
      // La sección puede estar cargando (chunk lazy) y las de arriba aún cambian de altura:
      // espera a que exista y corrige la posición hasta que el layout se estabilice (~3 s)
      let tries = 0;
      let settled = 0;
      const t = setInterval(() => {
        const el = document.getElementById(hash.slice(1));
        tries++;
        if (el) {
          const top = el.getBoundingClientRect().top;
          const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          if (Math.abs(top - offset) > 24) {
            el.scrollIntoView({ behavior: settled === 0 ? 'smooth' : 'auto' });
            settled = 1;
          } else if (settled++ > 3) clearInterval(t);
        }
        if (tries > 30) clearInterval(t);
      }, 120);
      // Si el usuario hace scroll a mano, se deja de corregir
      const stop = () => clearInterval(t);
      window.addEventListener('wheel', stop, { once: true, passive: true });
      window.addEventListener('touchmove', stop, { once: true, passive: true });
      return () => {
        clearInterval(t);
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchmove', stop);
      };
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
