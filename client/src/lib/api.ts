import i18n from '@/i18n';

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string[]>) {
    super(message);
  }
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown };

const connectionError = () => i18n.t('common.connectionError');

/**
 * Idioma y zona horaria del usuario en cada petición: el backend los usa para
 * escribirle los emails en su idioma y con las fechas en su hora local.
 */
function clientHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'X-Client-Locale': i18n.language?.startsWith('en') ? 'en' : 'es' };
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) h['X-Client-Timezone'] = tz;
  } catch { /* navegador sin Intl: el servidor usa su valor por defecto */ }
  return h;
}

export async function api<T>(path: string, { body, headers, ...opts }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'include',
      ...opts,
      headers: {
        'X-Requested-With': 'fetch',
        ...clientHeaders(),
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, connectionError());
  }
  if (res.status === 204) return undefined as T;

  // Si la respuesta no es JSON, no viene de nuestra API (proxy caído, backend no desplegado, página de error)
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    if (!isJson) console.error(`[api] ${res.status} sin JSON en /api${path}: ¿el backend está corriendo y /api apunta a él?`);
    throw new ApiError(res.status, data.error ?? (isJson ? i18n.t('common.error') : connectionError()), data.details);
  }
  return data as T;
}

export const qs = (params: Record<string, string | number | undefined | null>) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && s.set(k, String(v)));
  const str = s.toString();
  return str ? `?${str}` : '';
};
