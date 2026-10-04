import { motion, type HTMLMotionProps } from 'framer-motion';

/** Aparece con un fade-up al entrar en pantalla. Framer respeta prefers-reduced-motion vía MotionConfig. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      {...props}
    />
  );
}
