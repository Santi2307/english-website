import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

type Props = { to: number; decimals?: number; suffix?: string; prefix?: string };

export function AnimatedCounter({ to, decimals = 0, suffix = '', prefix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to]);

  const formatted = new Intl.NumberFormat('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  return (
    <span ref={ref} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
