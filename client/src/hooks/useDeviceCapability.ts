import { useEffect, useState } from 'react';

type NavigatorExtras = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };

/** true si el dispositivo puede con un canvas 3D sin afectar la experiencia. */
export function useCanRender3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const nav = navigator as NavigatorExtras;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowCpu = (nav.hardwareConcurrency ?? 4) < 4;
    const lowMem = (nav.deviceMemory ?? 4) < 4;
    const saveData = nav.connection?.saveData || /2g/.test(nav.connection?.effectiveType ?? '');
    const webgl = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    setOk(!reduced && !lowCpu && !lowMem && !saveData && webgl);
  }, []);
  return ok;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
