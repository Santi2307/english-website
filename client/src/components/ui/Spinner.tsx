import { cn } from '@/lib/format';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn('inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600', className)}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
