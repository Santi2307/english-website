import { cn } from '@/lib/format';

/**
 * Anillo de carga: un arco fino girando a velocidad moderada sobre una pista
 * tenue. Toma el color del texto; el tamaño se controla con la altura
 * (h-4 en botones, h-8 en estados grandes…).
 */
export function Spinner({ className, label = 'Cargando' }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" role="status" aria-label={label} className={cn('loader-spin inline-block aspect-square h-5 w-auto shrink-0', className)}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 60" />
    </svg>
  );
}

/**
 * Carga de página: un anillo delicado en el color de marca. Aparece con un
 * pequeño retraso para no parpadear en cargas rápidas.
 */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Cargando" className={cn('loader-reveal grid min-h-[60vh] place-items-center', className)}>
      <svg viewBox="0 0 40 40" width={36} height={36} fill="none" aria-hidden className="loader-spin">
        <circle cx="20" cy="20" r="17" className="stroke-slate-200" strokeWidth="2" />
        <circle cx="20" cy="20" r="17" className="stroke-brand-600" strokeWidth="2" strokeLinecap="round" strokeDasharray="26 81" />
      </svg>
    </div>
  );
}
