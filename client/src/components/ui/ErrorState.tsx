import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RotateCw } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/format';

export type ErrorKind = 'error' | 'offline' | 'notFound';

/** Traduce un error de la API al estado que se le muestra al usuario. */
export function errorKind(err: unknown): ErrorKind {
  if (err instanceof ApiError) {
    if (err.status === 0 || err.status === 502 || err.status === 503 || err.status === 504) return 'offline';
    if (err.status === 404) return 'notFound';
  }
  return 'error';
}

/**
 * Ilustración de línea en el estilo de la marca: una burbuja de conversación
 * con el punto rojo de "grabando". Según el estado, dentro hay una onda de voz
 * que se apaga (error), sin señal (offline) o un 404.
 */
function Illustration({ kind }: { kind: ErrorKind }) {
  const ink = 'stroke-slate-900';
  return (
    <svg viewBox="0 0 260 190" fill="none" aria-hidden className="h-auto w-[220px] sm:w-[260px]">
      {/* Burbujas de fondo */}
      <rect x="168" y="14" width="64" height="40" rx="14" className="fill-slate-200" />
      <path d="M214 54l6 12-16-12z" className="fill-slate-200" />
      <rect x="22" y="124" width="58" height="36" rx="13" className="fill-slate-100 stroke-slate-300" strokeWidth="2" />
      <path d="M38 160l-6 12 16-12" className="fill-slate-100 stroke-slate-300" strokeWidth="2" strokeLinejoin="round" />
      {[40, 51, 62].map((x) => <circle key={x} cx={x} cy="142" r="2.6" className="fill-slate-400" />)}

      {/* Reloj o señal, a la izquierda */}
      {kind === 'offline' ? (
        <g className={ink} strokeWidth="3" strokeLinecap="round">
          <path d="M22 62a30 30 0 0 1 42 0" />
          <path d="M31 72a17 17 0 0 1 24 0" />
          <circle cx="43" cy="82" r="2.5" className="fill-slate-900" stroke="none" />
          <path d="M20 90L66 44" className="stroke-brand-600" />
        </g>
      ) : (
        <g className={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="44" cy="62" r="22" className="fill-white" />
          <path d="M44 48v14l9 6" />
        </g>
      )}

      {/* Burbuja principal */}
      <path
        d="M92 38h108a22 22 0 0 1 22 22v52a22 22 0 0 1-22 22h-74l-24 20 4-20h-14a22 22 0 0 1-22-22V60a22 22 0 0 1 22-22z"
        className={cn('fill-white', ink)}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="218" cy="42" r="10" className="fill-brand-600 stroke-slate-50" strokeWidth="4" />

      {kind === 'notFound' ? (
        <text x="146" y="99" textAnchor="middle" className="fill-slate-900 font-mono" fontSize="34" fontWeight="600" letterSpacing="-1">404</text>
      ) : (
        <g strokeWidth="3.5" strokeLinecap="round">
          {/* Onda de voz que se apaga hasta quedar plana */}
          {[[94, 22], [104, 36], [114, 26], [124, 44], [134, 18], [144, 10]].map(([x, h]) => (
            <path key={x} d={`M${x} ${86 - h / 2}v${h}`} className="stroke-slate-900" />
          ))}
          <path d="M154 86h46" className="stroke-slate-300" strokeDasharray="1 8" />
        </g>
      )}
    </svg>
  );
}

type Props = {
  kind?: ErrorKind;
  onRetry?: () => void;
  /** Ocupa casi toda la pantalla (páginas) o es un bloque dentro de una sección */
  size?: 'page' | 'inline';
  className?: string;
};

export function ErrorState({ kind = 'error', onRetry, size = 'page', className }: Props) {
  const { t } = useTranslation();
  const title = kind === 'notFound' ? t('status.notFoundTitle') : kind === 'offline' ? t('status.offlineTitle') : t('status.errorTitle');
  const text = kind === 'notFound' ? t('status.notFoundText') : kind === 'offline' ? t('status.offlineText') : t('status.errorText');
  const retry = onRetry ?? (() => window.location.reload());

  return (
    <div
      role={kind === 'notFound' ? undefined : 'alert'}
      className={cn('container-page flex flex-col items-center justify-center text-center', size === 'page' ? 'min-h-[70vh] py-16' : 'py-12', className)}
    >
      <Illustration kind={kind} />
      <h1 className={cn('mt-8 font-semibold tracking-[-0.03em] text-slate-900', size === 'page' ? 'text-[1.75rem] sm:text-[2.1rem]' : 'text-xl')}>{title}</h1>
      <p className="mt-3 max-w-md text-slate-600">{text}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {kind === 'notFound' ? (
          <>
            <Link to="/" className="btn-primary">{t('status.home')}</Link>
            <Link to="/cursos" className="btn-secondary">{t('status.paths')}</Link>
          </>
        ) : (
          <>
            <button type="button" onClick={retry} className="btn-primary">
              <RotateCw size={16} aria-hidden /> {t('status.retry')}
            </button>
            {size === 'page' && <Link to="/" className="btn-secondary">{t('status.home')}</Link>}
          </>
        )}
      </div>
    </div>
  );
}

/** Tras un despliegue nuevo, los chunks viejos ya no existen: se recarga una vez. */
const isChunkError = (e: Error) => /dynamically imported module|Importing a module script failed|Loading chunk/i.test(e.message);

/**
 * Captura errores de render para que un fallo nunca deje la pantalla en blanco.
 * `resetKey` (la ruta) limpia el error al navegar a otra página.
 */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidMount() {
    // Si la app ya cargó bien, se permite otra recarga automática en el futuro
    setTimeout(() => { try { sessionStorage.removeItem('ea_chunk_reload'); } catch { /* sin storage */ } }, 10_000);
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ui]', error, info.componentStack);
    if (isChunkError(error)) {
      try {
        if (!sessionStorage.getItem('ea_chunk_reload')) {
          sessionStorage.setItem('ea_chunk_reload', '1');
          window.location.reload();
        }
      } catch { /* sin storage: se muestra el error */ }
    }
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (this.state.error) return <ErrorState kind="error" />;
    return this.props.children;
  }
}
