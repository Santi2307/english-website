import type { Transition, Variants } from 'framer-motion';

/**
 * Sistema de movimiento. Todas las animaciones de la app salen de aquí: no se
 * usan duraciones ni curvas sueltas en los componentes.
 *
 *   micro   150–250 ms  hover, toggles, chips
 *   ui      250–400 ms  cambios de estado de una interfaz
 *   scroll  400–700 ms  entradas y transiciones grandes al hacer scroll
 *
 * Solo se anima `transform` y `opacity` (nada que provoque relayout).
 * `MotionConfig reducedMotion="user"` (main.tsx) apaga los transforms para
 * quien pide menos movimiento; las secciones con scroll también lo consultan.
 */
export const DURATION = { micro: 0.2, ui: 0.32, scroll: 0.6 } as const;

/** Curvas naturales: salida suave para entradas, simétrica para cambios de estado. */
export const EASE = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const T = {
  micro: { duration: DURATION.micro, ease: EASE.out },
  ui: { duration: DURATION.ui, ease: EASE.inOut },
  scroll: { duration: DURATION.scroll, ease: EASE.out },
} satisfies Record<string, Transition>;

/** Distancia vertical estándar de una entrada (px): movimiento sutil, no "vuelos". */
export const RISE = 16;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE },
  show: { opacity: 1, y: 0, transition: T.scroll },
};

/** Contenedor que escalona a sus hijos (líneas de texto, filas). */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Cambio de estado dentro de una interfaz (AnimatePresence). */
export const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: T.ui },
  exit: { opacity: 0, y: -6, transition: T.micro },
};

/** Viewport por defecto para revelar al hacer scroll: una vez y un poco antes de entrar. */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;
