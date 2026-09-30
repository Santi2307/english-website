import { cn } from '@/lib/format';
import type { Level } from '@/lib/types';

type Props = { title: string; level: Level; color: string; image?: string | null; className?: string };

/** Portada del curso: imagen si existe; si no, un degradado generado con el color del curso. */
export function CourseCover({ title, level, color, image, className }: Props) {
  if (image) {
    return <img src={image} alt={title} loading="lazy" decoding="async" className={cn('h-full w-full object-cover', className)} />;
  }
  return (
    <div
      role="img"
      aria-label={title}
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 55%, #1e1b4b 100%)` }}
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 left-6 h-32 w-32 rounded-full bg-white/10" />
      <span className="absolute bottom-3 right-4 text-5xl font-black tracking-tighter text-white/25">{level}</span>
    </div>
  );
}
