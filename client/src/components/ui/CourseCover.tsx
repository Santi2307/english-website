import { Baby, Briefcase, GraduationCap, MessagesSquare, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/format';
import type { Goal, Level } from '@/lib/types';

type Props = { title: string; level: Level; color: string; image?: string | null; goal?: Goal; className?: string };

const GOAL_ICONS: Record<Goal, LucideIcon> = {
  CONVERSATION: MessagesSquare,
  BUSINESS: Briefcase,
  EXAM: GraduationCap,
  KIDS: Baby,
};

/**
 * Portada de la ruta: imagen si existe; si no, una portada neutra con el nivel.
 * `color` se mantiene en la API por compatibilidad, pero ya no se pinta:
 * la paleta del producto usa un solo color de marca.
 */
export function CourseCover({ title, level, image, goal, className }: Props) {
  if (image) {
    return <img src={image} alt={title} loading="lazy" decoding="async" className={cn('h-full w-full object-cover', className)} />;
  }
  const Icon = goal ? GOAL_ICONS[goal] : null;
  return (
    <div role="img" aria-label={title} className={cn('relative h-full w-full overflow-hidden bg-slate-100', className)}>
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: 'linear-gradient(var(--color-slate-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-slate-200) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        aria-hidden
      />
      {Icon && (
        <span className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700" aria-hidden>
          <Icon size={20} strokeWidth={1.75} />
        </span>
      )}
      <span className="absolute -bottom-2 right-3 font-mono text-7xl font-medium tracking-[-0.06em] text-slate-300" aria-hidden>{level}</span>
    </div>
  );
}
