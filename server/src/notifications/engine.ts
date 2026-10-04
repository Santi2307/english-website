import type { AppEvent } from './events.js';
import type { NotificationRule } from './rules.js';
import type { NotificationStore } from './store.js';
import { isCategoryAllowed } from './preferences.js';
import { DeliveryError, type Channel, type ChannelName, type SensitiveData } from './types.js';

export type EngineOptions = {
  store: NotificationStore;
  channels: Channel[];
  rules: NotificationRule[];
  /** Espera antes de cada reintento (ms). Longitud + 1 = intentos máximos. */
  backoffMs?: number[];
  /** Tiempo máximo que una notificación puede quedar PROCESSING antes de volver a la cola */
  leaseMs?: number;
  /** Cuánto tiempo se omiten envíos a una dirección que rebotó */
  suppressionMs?: number;
  /** Cuánto tiempo se conservan en memoria los datos sensibles para reintentos */
  sensitiveTtlMs?: number;
  /** Programa cada reintento con un temporizador en memoria (por defecto sí). Los tests usan reloj falso. */
  retryTimers?: boolean;
  now?: () => Date;
  logger?: Pick<Console, 'info' | 'warn' | 'error'>;
};

const DEFAULT_BACKOFF = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3_600_000];

/**
 * Motor de notificaciones:
 *   evento → reglas → preferencias → registro idempotente → canal → proveedor → log
 *
 * - Idempotencia: clave única "<EVENTO>:<eventId>:<canal>" en BD. Un evento
 *   repetido no genera un segundo envío.
 * - No bloquea: `handle` solo registra; el envío corre en segundo plano.
 * - Reintentos: errores temporales se reprograman con backoff; los permanentes
 *   se marcan FAILED de inmediato.
 * - Datos sensibles (links con token, IP) nunca se persisten: viven en memoria
 *   con TTL. Si se pierden (reinicio), la notificación falla de forma segura en
 *   lugar de enviar un link roto; el usuario puede pedir uno nuevo.
 */
export class NotificationEngine {
  private readonly store: NotificationStore;
  private readonly channels: Map<ChannelName, Channel>;
  private readonly rules: NotificationRule[];
  private readonly backoff: number[];
  private readonly leaseMs: number;
  private readonly suppressionMs: number;
  private readonly sensitiveTtlMs: number;
  private readonly now: () => Date;
  private readonly log: Pick<Console, 'info' | 'warn' | 'error'>;
  private readonly sensitive = new Map<string, { data: SensitiveData; expiresAt: number }>();
  private readonly inFlight = new Set<Promise<void>>();
  private timer: NodeJS.Timeout | null = null;
  private readonly retryTimers: boolean;
  private readonly pendingRetries = new Set<NodeJS.Timeout>();

  constructor(o: EngineOptions) {
    this.store = o.store;
    this.channels = new Map(o.channels.map((c) => [c.name, c]));
    this.rules = o.rules;
    this.backoff = o.backoffMs ?? DEFAULT_BACKOFF;
    this.leaseMs = o.leaseMs ?? 10 * 60_000;
    this.suppressionMs = o.suppressionMs ?? 30 * 24 * 3_600_000;
    this.sensitiveTtlMs = o.sensitiveTtlMs ?? 6 * 3_600_000;
    this.retryTimers = o.retryTimers ?? true;
    this.now = o.now ?? (() => new Date());
    this.log = o.logger ?? console;
  }

  get maxAttempts() {
    return this.backoff.length + 1;
  }

  /** Suscriptor del bus de eventos. */
  handle = async (event: AppEvent): Promise<void> => {
    const rules = this.rules.filter((r) => r.event === event.type);
    for (const rule of rules) {
      try {
        await this.enqueue(rule, event);
      } catch (err) {
        this.log.error(`[notifications] no se pudo encolar ${event.type}:${event.id} (${rule.template})`, err);
      }
    }
  };

  private async enqueue(rule: NotificationRule, event: AppEvent) {
    const out = rule.build(event.payload as never, event as never);
    if (!out) return;
    if (!this.channels.has(rule.channel)) throw new Error(`Canal no registrado: ${rule.channel}`);

    const idempotencyKey = `${event.type}:${event.id}:${rule.channel}`;
    const base = {
      userId: out.recipient.userId ?? null,
      channel: rule.channel,
      recipient: out.recipient.email.toLowerCase(),
      eventType: event.type,
      eventId: event.id,
      template: rule.template,
      category: rule.category,
      idempotencyKey,
      payload: {
        locale: out.recipient.locale,
        name: out.recipient.name ?? null,
        data: out.data,
        ...(out.sensitive && { sensitiveKeys: Object.keys(out.sensitive) }),
      },
    };

    // Preferencias (seguridad y transaccionales siempre pasan)
    const prefs = out.recipient.userId ? await this.store.getPreferences(out.recipient.userId) : null;
    if (prefs && !isCategoryAllowed(rule.category, prefs)) {
      await this.store.create({ ...base, status: 'SKIPPED', errorMessage: 'Desactivado por preferencias del usuario' });
      return;
    }
    if (await this.store.isSuppressed(base.recipient, new Date(this.now().getTime() - this.suppressionMs))) {
      await this.store.create({ ...base, status: 'SKIPPED', errorMessage: 'Destinatario suprimido por rebote reciente' });
      return;
    }

    const { record, duplicate } = await this.store.create(base);
    if (duplicate) {
      this.log.info(`[notifications] duplicado ignorado: ${idempotencyKey}`);
      return;
    }
    if (out.sensitive) this.sensitive.set(record.id, { data: out.sensitive, expiresAt: this.now().getTime() + this.sensitiveTtlMs });
    this.schedule(record.id);
  }

  /** Despacha fuera del request actual y rastrea la promesa (para tests y apagado ordenado). */
  private schedule(id: string) {
    const p = new Promise<void>((resolve) => setImmediate(resolve))
      .then(() => this.dispatch(id))
      .catch((err) => this.log.error(`[notifications] dispatch ${id} falló`, err))
      .finally(() => this.inFlight.delete(p));
    this.inFlight.add(p);
  }

  /** Intenta enviar una notificación. Seguro de llamar varias veces (claim condicional). */
  async dispatch(id: string): Promise<void> {
    const now = this.now();
    const n = await this.store.claim(id, now, new Date(now.getTime() + this.leaseMs));
    if (!n) return;

    const channel = this.channels.get(n.channel);
    const secret = this.sensitive.get(id);
    const secretData = secret && secret.expiresAt > now.getTime() ? secret.data : undefined;

    try {
      if (!channel) throw new DeliveryError(`Canal no registrado: ${n.channel}`, false);
      const required = n.payload.sensitiveKeys ?? [];
      if (required.length && !secretData) {
        throw new DeliveryError('Datos sensibles expirados o perdidos (reinicio); el usuario debe solicitarlo de nuevo', false);
      }
      const res = await channel.send(n, secretData);
      await this.store.markSent(id, { provider: res.provider, providerMessageId: res.providerMessageId, at: this.now() });
      this.sensitive.delete(id);
      this.log.info(`[notifications] enviado ${n.template} → ${n.recipient} (${res.provider})`);
    } catch (err) {
      const e = err instanceof DeliveryError ? err : new DeliveryError((err as Error).message ?? String(err), false);
      const canRetry = e.retryable && n.attempts < this.maxAttempts;
      if (canRetry) {
        const wait = this.backoff[n.attempts - 1] ?? this.backoff[this.backoff.length - 1];
        await this.store.markRetry(id, { nextAttemptAt: new Date(this.now().getTime() + wait), error: e.message, provider: e.provider });
        this.scheduleRetry(id, wait);
        this.log.warn(`[notifications] ${n.template} → ${n.recipient}: error temporal, reintento ${n.attempts}/${this.maxAttempts - 1} en ${Math.round(wait / 1000)}s: ${e.message}`);
      } else {
        await this.store.markFailed(id, { error: e.message, at: this.now(), provider: e.provider });
        this.sensitive.delete(id);
        this.log.error(`[notifications] ${n.template} → ${n.recipient}: FALLÓ tras ${n.attempts} intento(s): ${e.message}`);
      }
    }
  }

  /** Procesa reintentos vencidos y recupera notificaciones atascadas. */
  async processDue(limit = 25) {
    const now = this.now();
    await this.store.requeueExpiredLeases(now);
    for (const [id, s] of this.sensitive) if (s.expiresAt <= now.getTime()) this.sensitive.delete(id);
    const ids = await this.store.findDueIds(now, limit);
    for (const id of ids) await this.dispatch(id);
    return ids.length;
  }

  /**
   * Reintento sin consultar la BD en bucle: un temporizador por notificación.
   * Así una base serverless (Neon) puede suspenderse cuando no hay tráfico.
   */
  private scheduleRetry(id: string, waitMs: number) {
    if (!this.retryTimers) return;
    const t = setTimeout(() => {
      this.pendingRetries.delete(t);
      this.schedule(id);
    }, waitMs);
    t.unref();
    this.pendingRetries.add(t);
  }

  /**
   * Red de seguridad: revisa la BD al arrancar y luego cada `intervalMs`
   * (reintentos perdidos por un reinicio, leases vencidos).
   * Con más tráfico, esto se reemplaza por una cola dedicada (BullMQ, SQS).
   */
  start(intervalMs = 60 * 60_000) {
    if (this.timer) return;
    const sweep = () => this.processDue().catch((err) => this.log.error('[notifications] worker falló', err));
    void sweep();
    this.timer = setInterval(sweep, intervalMs);
    this.timer.unref();
  }

  async stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const t of this.pendingRetries) clearTimeout(t);
    this.pendingRetries.clear();
    await this.idle();
  }

  /** Espera a que terminen los envíos en curso. */
  async idle() {
    while (this.inFlight.size) await Promise.all([...this.inFlight]);
  }
}
