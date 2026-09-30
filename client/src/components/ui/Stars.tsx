import { Star } from 'lucide-react';

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden
          className={i <= Math.round(value) ? 'fill-accent-400 text-accent-400' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </span>
  );
}
