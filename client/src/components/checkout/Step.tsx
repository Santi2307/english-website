import type { ReactNode } from 'react';

/** Sección numerada del checkout. Una sola página: los números solo orientan. */
export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-slate-200 pt-7 first:border-t-0 first:pt-0">
      {/* float: evita que el borde del fieldset atraviese el título */}
      <legend className="float-left flex w-full items-center gap-3 text-lg font-semibold tracking-[-0.015em] text-slate-900">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 font-mono text-xs font-medium text-white" aria-hidden>{n}</span>
        {title}
      </legend>
      <div className="clear-both space-y-4 pt-5">{children}</div>
    </fieldset>
  );
}
