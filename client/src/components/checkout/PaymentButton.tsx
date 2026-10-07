import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { CK, fill } from '@/data/checkout';
import type { Locale } from '@/hooks/useLocale';
import type { Phase } from '@/hooks/useCheckout';
import { swap } from '@/lib/motion';
import { cn } from '@/lib/format';
import { Spinner } from '../ui/Spinner';

/**
 * Botón de pago con el monto real. Estados: idle, validando, creando, procesando
 * (incluye 3D Secure), completado y error. Deshabilitado mientras hay algo en curso.
 */
export function PaymentButton({ phase, amount, free, disabled, locale }: { phase: Phase; amount: string; free: boolean; disabled?: boolean; locale: Locale }) {
  const busy = phase === 'validating' || phase === 'creating' || phase === 'confirming';
  const done = phase === 'succeeded';
  const label =
    phase === 'validating' ? CK.pay.validating[locale]
    : phase === 'creating' ? CK.pay.creating[locale]
    : phase === 'confirming' ? CK.pay.processing[locale]
    : done ? CK.pay.succeeded[locale]
    : free ? CK.pay.ctaFree[locale]
    : fill(CK.pay.cta[locale], { amount });

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {phase === 'confirming' && (
          <motion.p key="hold" {...swap} role="status" className="text-center text-sm text-slate-600">{CK.pay.processingSub[locale]}</motion.p>
        )}
      </AnimatePresence>
      <button
        type="submit"
        disabled={busy || done || disabled}
        aria-busy={busy}
        className={cn('btn-primary h-14 w-full text-base disabled:opacity-60', done && 'bg-emerald-700 hover:bg-emerald-700 disabled:opacity-100')}
      >
        {busy ? <Spinner className="h-4" /> : done ? <Check size={18} aria-hidden /> : <Lock size={17} aria-hidden />}
        {label}
      </button>
    </div>
  );
}
