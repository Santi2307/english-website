export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: Record<string, string[]>) {
    super(message);
  }
}

type Options = Omit<RequestInit, 'body'> & { body?: unknown };

const CONNECTION_ERROR = 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.';

export async function api<T>(path: string, { body, headers, ...opts }: Options = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'include',
      ...opts,
      headers: {
        'X-Requested-With': 'fetch',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, CONNECTION_ERROR);
  }
  if (res.status === 204) return undefined as T;

  // Si la respuesta no es JSON, no viene de nuestra API (proxy caído, backend no desplegado, página de error)
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    if (!isJson) console.error(`[api] ${res.status} sin JSON en /api${path}: ¿el backend está corriendo y /api apunta a él?`);
    throw new ApiError(res.status, data.error ?? (isJson ? 'Algo salió mal. Intenta de nuevo.' : CONNECTION_ERROR), data.details);
  }
  return data as T;
}

export const qs = (params: Record<string, string | number | undefined | null>) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && s.set(k, String(v)));
  const str = s.toString();
  return str ? `?${str}` : '';
};
