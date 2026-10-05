import { cn } from '@/lib/format';

/**
 * Indicador de carga en línea (botones, estados pequeños): una onda de voz de
 * cuatro barras en el color del texto, coherente con "hablar es el producto".
 * El tamaño se controla con la altura (h-4, h-5, h-10…).
 */
export function Spinner({ className, label = 'Cargando' }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex h-5 items-center gap-[3px]', className)}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="loader-wave h-full w-[3px] rounded-full bg-current" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

/**
 * Carga de página: el logo con el punto "en vivo" respirando y una línea de
 * progreso indeterminada. Aparece con un pequeño retraso para no parpadear
 * en cargas rápidas.
 */
export function PageLoader() {
  return (
    <div role="status" aria-label="Cargando" className="loader-reveal flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <svg viewBox="0 0 64 64" width={40} height={40} aria-hidden className="shrink-0">
        <rect width="64" height="64" rx="15" className="fill-slate-900" />
        <path d="M19 19h21v6.5H26.5v3.75h11.5v6.5H26.5v3.75H40V46H19z" fill="#fff" />
        <circle cx="48" cy="42.5" r="5.5" className="loader-dot fill-brand-500" />
      </svg>
      <span className="relative h-0.5 w-14 overflow-hidden rounded-full bg-slate-200" aria-hidden>
        <span className="loader-line absolute inset-y-0 left-0 w-1/2 rounded-full bg-slate-900" />
      </span>
    </div>
  );
}
