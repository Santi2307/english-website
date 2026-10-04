import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Monta a sus hijos solo cuando el bloque se acerca al viewport. Así el JS de las
 * secciones bajo el pliegue (chunks lazy) no compite con la carga inicial.
 * Si la URL trae un #ancla, monta de una vez para que el scroll al ancla funcione.
 */
export function WhenVisible({ children, minHeight = 600, margin = '800px' }: { children: ReactNode; minHeight?: number; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();
  const [visible, setVisible] = useState(() => !!hash || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (visible || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible, margin]);

  // Ir a /#faq desde el menú: hay que montar todo para que exista el ancla
  useEffect(() => {
    if (hash) setVisible(true);
  }, [hash]);

  if (visible) return <>{children}</>;
  return <div ref={ref} style={{ minHeight }} aria-hidden />;
}
