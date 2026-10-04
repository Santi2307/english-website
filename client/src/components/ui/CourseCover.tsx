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

/** Portada del curso: imagen si existe; si no, un degradado generado con el color del curso. */
export function CourseCover({ title, level, color, image, goal, className }: Props) {
  if (image) {
    return <img src={image} alt={title} loading="lazy" decoding="async" className={cn('h-full w-full object-cover', className)} />;
  }
  const Icon = goal ? GOAL_ICONS[goal] : null;
  return (
    <div
      role="img"
      aria-label={title}
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ background: `radial-gradient(120% 90% at 0% 0%, ${color} 0%, ${color}e6 40%, #1e1b4b 100%)` }}
    >
      {/* Textura de puntos que se desvanece hacia abajo */}
      <div
        className="absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
      />
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl transition-transform duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-14 left-1/4 h-36 w-36 rounded-full border-[18px] border-white/10" />
      {Icon && (
        <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-[60%] group-hover:rotate-[-6deg]">
          <Icon size={30} strokeWidth={1.75} aria-hidden />
        </div>
      )}
      <span className="absolute -bottom-3 right-3 text-7xl font-black tracking-tighter text-white/20">{level}</span>
    </div>
  );
}
