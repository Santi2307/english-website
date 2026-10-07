import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { T } from '@/lib/motion';
import { cn } from '@/lib/format';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  id: string;
  label: string;
  /** Texto pequeño junto al label ("opcional") */
  aside?: string;
  hint?: ReactNode;
  error?: string | null;
  /** Campo válido y ya revisado: muestra un check discreto (sin bordes verdes) */
  done?: boolean;
  addon?: ReactNode;
};

/**
 * Campo del checkout. Label real siempre visible, error pegado al campo y
 * asociado con aria-describedby, y un check sutil cuando quedó bien.
 */
export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { id, label, aside, hint, error, done, addon, className, ...input },
  ref,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-800">
        {label}
        {aside && <span className="text-xs font-normal text-slate-500">{aside}</span>}
      </label>
      <div className="relative flex">
        {addon}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={[error ? errId : null, hintId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'h-12 w-full min-w-0 rounded-[10px] border bg-white px-3.5 text-base text-slate-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400',
            'hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/[0.06] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            error ? 'border-rose-500 hover:border-rose-500 focus:border-rose-600 focus:ring-rose-500/10' : 'border-slate-300',
            !!addon && 'rounded-l-none',
            done && !error && 'pr-10',
          )}
          {...input}
        />
        <AnimatePresence>
          {done && !error && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, transition: T.micro }}
              exit={{ opacity: 0, transition: T.micro }}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            >
              <Check size={16} strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {/* Altura animada: el error aparece sin empujar el resto de golpe */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="err"
            id={errId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: T.ui }}
            exit={{ opacity: 0, height: 0, transition: T.micro }}
            className="overflow-hidden text-sm text-rose-700"
          >
            <span className="block pt-1.5">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && <p id={hintId} className="pt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
});
