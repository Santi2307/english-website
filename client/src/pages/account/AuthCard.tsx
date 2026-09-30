import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

/** Tarjeta centrada compartida por las pantallas de cuenta (verificar, recuperar, baja). */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-md p-6 sm:p-8">
        {children}
      </motion.div>
    </div>
  );
}

export function ResultMessage({ ok, title, text, children }: { ok: boolean; title: string; text?: string; children?: ReactNode }) {
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div className="text-center" role="status" aria-live="polite">
      <Icon size={56} className={`mx-auto ${ok ? 'text-emerald-500' : 'text-rose-500'}`} aria-hidden />
      <h1 className="mt-4 text-2xl font-extrabold">{title}</h1>
      {text && <p className="mt-2 text-slate-600">{text}</p>}
      {children && <div className="mt-6 flex flex-col gap-2">{children}</div>}
    </div>
  );
}
