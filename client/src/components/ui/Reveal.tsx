import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

type As = 'div' | 'p' | 'h2' | 'h3' | 'li' | 'section' | 'ul' | 'ol';

/** Aparece al entrar en pantalla (opacidad + leve subida), una sola vez. */
export function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: As }) {
  const M = motion[as];
  return (
    <M className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT} transition={{ delay }}>
      {children}
    </M>
  );
}

/**
 * Texto que se revela línea por línea. Cada línea es un bloque propio,
 * así el lector de pantalla lo lee como una frase normal.
 */
export function RevealLines({ lines, className, lineClassName, gap = 0.12, delay = 0, as = 'h2' }: { lines: ReactNode[]; className?: string; lineClassName?: string; gap?: number; delay?: number; as?: 'h1' | 'h2' | 'p' }) {
  const M = motion[as];
  return (
    <M className={className} variants={stagger(gap, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {lines.map((l, i) => (
        <motion.span key={i} variants={fadeUp} className={lineClassName ?? 'block'}>
          {l}
        </motion.span>
      ))}
    </M>
  );
}
