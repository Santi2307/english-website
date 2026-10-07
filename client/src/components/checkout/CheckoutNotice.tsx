import { AnimatePresence, motion } from 'framer-motion';
import { swap } from '@/lib/motion';
import { cn } from '@/lib/format';

/** Aviso junto al botón de pago: errores humanos (nunca códigos) o información neutra. */
export function CheckoutNotice({ notice }: { notice: { tone: 'error' | 'info'; text: string } | null }) {
  return (
    <div aria-live="polite">
      <AnimatePresence>
        {notice && (
          <motion.p
            key={notice.text}
            {...swap}
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={cn('rounded-[10px] px-4 py-3 text-sm', notice.tone === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700')}
          >
            {notice.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
