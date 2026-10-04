import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

/**
 * Piezas para representar la interfaz del producto (coach, Error Bank, progreso).
 * Todas comparten el mismo marco para que se lean como una sola aplicación.
 */

export function Frame({ title, meta, children, className, bodyClassName }: { title: ReactNode; meta?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div className={cn('app-frame', className)}>
      <div className="flex h-11 items-center justify-between gap-3 border-b border-slate-200 px-4">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-900">{title}</div>
        {meta && <div className="shrink-0 font-mono text-xs text-slate-500">{meta}</div>}
      </div>
      <div className={cn('p-4 sm:p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

/** Punto rojo "en vivo": la marca del producto. */
export function LiveDot({ className, light }: { className?: string; light?: boolean }) {
  const bg = light ? 'bg-white' : 'bg-brand-500';
  return (
    <span className={cn('relative flex h-2 w-2', className)} aria-hidden>
      <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 motion-reduce:hidden', bg)} />
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', bg)} />
    </span>
  );
}

const WAVE = [0.35, 0.6, 0.9, 0.55, 0.8, 1, 0.65, 0.4, 0.75, 0.95, 0.5, 0.7, 0.45, 0.85, 0.6, 0.3, 0.55, 0.8, 0.4, 0.65];

/** Onda de voz. `live` la anima (escuchando); si no, queda estática (grabación). */
export function Waveform({ bars = 20, live, className, tone = 'brand' }: { bars?: number; live?: boolean; className?: string; tone?: 'brand' | 'muted' }) {
  return (
    <div className={cn('flex h-6 items-center gap-[3px]', className)} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn('w-[3px] rounded-full', tone === 'brand' ? 'bg-brand-500' : 'bg-slate-300', live && 'voice-bar')}
          style={{ height: `${WAVE[i % WAVE.length] * 100}%`, animationDelay: live ? `${(i % 7) * 0.09}s` : undefined }}
        />
      ))}
    </div>
  );
}

/** Puntaje con barra. `max` define la escala (100 en feedback, 1000 en English Score). */
export function ScoreBar({ label, value, max = 100, className, compact }: { label: ReactNode; value: number; max?: number; className?: string; compact?: boolean }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn('text-slate-600', compact ? 'text-xs' : 'text-sm')}>{label}</span>
        <span className={cn('font-mono font-medium tabular-nums text-slate-900', compact ? 'text-sm' : 'text-base')}>{value}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-900" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

/** Línea simple para tendencias (sin ejes: solo la forma). */
export function Sparkline({ values, className, height = 48 }: { values: number[]; className?: string; height?: number }) {
  const w = 240;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={cn('w-full overflow-visible', className)} preserveAspectRatio="none" aria-hidden>
      <path d={`${d} L${w},${height} L0,${height} Z`} className="fill-brand-500/[0.07]" />
      <path d={d} fill="none" className="stroke-brand-600" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r={3.5} className="fill-brand-600" />
    </svg>
  );
}

export function SectionHeader({ eyebrow, title, body, className, children }: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn('section-title', !!eyebrow && 'mt-4')}>{title}</h2>
      {body && <p className="lead mt-4">{body}</p>}
      {children}
    </div>
  );
}
