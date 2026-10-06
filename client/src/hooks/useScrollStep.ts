import { useEffect, useState, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

/**
 * Para secciones "sticky": divide el recorrido de scroll de `target` en `count`
 * pasos y devuelve el paso actual. Los cambios de paso se animan como cambios
 * de estado (no ligados píxel a píxel al scroll): se sienten tranquilos y
 * funcionan igual con teclado, rueda o touch.
 */
export function useScrollStep(target: RefObject<HTMLElement>, count: number) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
    setStep((s) => (s === next ? s : next));
  });
  return { step, progress: scrollYProgress };
}

/** true en pantallas desde `query` (por defecto md, 768px). Se actualiza al rotar o redimensionar. */
export function useMedia(query = '(min-width: 768px)') {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
