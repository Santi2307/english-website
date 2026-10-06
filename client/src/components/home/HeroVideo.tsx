import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { HERO_VIDEO, type VideoSource } from '@/data/media';
import { cn } from '@/lib/format';

/**
 * Marco cinematográfico del hero. Con `sources` reproduce el video (mudo, en
 * loop, solo mientras está en pantalla); sin ellas muestra `fallback`, la escena
 * construida con la interfaz. Los `children` se superponen en ambos casos.
 *
 * Rendimiento: el video no se descarga hasta acercarse al viewport
 * (preload="none"), no se reproduce con prefers-reduced-motion ni con
 * "ahorro de datos", y el poster reserva el espacio (sin layout shift).
 */
export function HeroVideo({
  sources = HERO_VIDEO.sources,
  poster = HERO_VIDEO.poster,
  label = HERO_VIDEO.label,
  fallback,
  children,
  className,
}: {
  sources?: VideoSource[];
  poster?: string | null;
  label?: string;
  fallback: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: '200px' });
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const saveData = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const canPlay = sources.length > 0 && !failed;
  const autoplay = canPlay && !reduce && !saveData;

  useEffect(() => {
    const v = video.current;
    if (!v || !autoplay) return;
    if (inView) v.play().catch(() => { /* el navegador bloqueó el autoplay: queda el poster */ });
    else v.pause();
  }, [inView, autoplay]);

  return (
    <div ref={ref} className={cn('relative isolate overflow-hidden rounded-2xl bg-slate-900', className)}>
      {canPlay ? (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload={inView ? 'auto' : 'none'}
          poster={poster ?? undefined}
          aria-label={label}
          onError={() => setFailed(true)}
        >
          {sources.map((s) => <source key={s.src} src={s.src} type={s.type} media={s.media} />)}
        </video>
      ) : (
        <div className="absolute inset-0">{fallback}</div>
      )}
      {children}
    </div>
  );
}
