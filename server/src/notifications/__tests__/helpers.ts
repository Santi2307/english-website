import crypto from 'node:crypto';
import type { CreateNotificationInput, NotificationStore } from '../store.js';
import { DEFAULT_PREFERENCES, type Preferences } from '../preferences.js';
import type { NotificationRecord } from '../types.js';
import type { EmailProvider, OutgoingEmail } from '../providers/types.js';
import { DeliveryError } from '../types.js';
import type { EventUser } from '../events.js';

/** Store en memoria con la misma semántica que el de Prisma (idempotencia, claim condicional). */
export class MemoryNotificationStore implements NotificationStore {
  records = new Map<string, NotificationRecord>();
  preferences = new Map<string, Preferences>();

  all() {
    return [...this.records.values()];
  }

  async create(input: CreateNotificationInput) {
    const existing = this.all().find((r) => r.idempotencyKey === input.idempotencyKey);
    if (existing) return { record: existing, duplicate: true };
    const record: NotificationRecord = {
      id: crypto.randomUUID(),
      userId: input.userId,
      channel: input.channel,
      recipient: input.recipient,
      eventType: input.eventType,
      eventId: input.eventId,
      template: input.template,
      category: input.category,
      idempotencyKey: input.idempotencyKey,
      status: input.status ?? 'QUEUED',
      provider: null,
      providerMessageId: null,
      // Copia profunda, como haría la BD
      payload: JSON.parse(JSON.stringify(input.payload)),
      attempts: 0,
      nextAttemptAt: new Date(0),
      errorMessage: input.errorMessage ?? null,
      createdAt: new Date(),
      sentAt: null,
      failedAt: null,
    };
    this.records.set(record.id, record);
    return { record, duplicate: false };
  }

  async claim(id: string, now: Date, leaseUntil: Date) {
    const r = this.records.get(id);
    if (!r || r.status !== 'QUEUED' || r.nextAttemptAt > now) return null;
    Object.assign(r, { status: 'PROCESSING', attempts: r.attempts + 1, nextAttemptAt: leaseUntil });
    return { ...r };
  }

  async markSent(id: string, d: { provider: string; providerMessageId: string; at: Date }) {
    Object.assign(this.records.get(id)!, { status: 'SENT', provider: d.provider, providerMessageId: d.providerMessageId, sentAt: d.at, errorMessage: null });
  }

  async markRetry(id: string, d: { nextAttemptAt: Date; error: string }) {
    Object.assign(this.records.get(id)!, { status: 'QUEUED', nextAttemptAt: d.nextAttemptAt, errorMessage: d.error });
  }

  async markFailed(id: string, d: { error: string; at: Date }) {
    Object.assign(this.records.get(id)!, { status: 'FAILED', failedAt: d.at, errorMessage: d.error });
  }

  async findDueIds(now: Date, limit: number) {
    return this.all().filter((r) => r.status === 'QUEUED' && r.nextAttemptAt <= now).slice(0, limit).map((r) => r.id);
  }

  async requeueExpiredLeases(now: Date) {
    let n = 0;
    for (const r of this.all()) {
      if (r.status === 'PROCESSING' && r.nextAttemptAt < now) {
        Object.assign(r, { status: 'QUEUED', nextAttemptAt: now });
        n++;
      }
    }
    return n;
  }

  async getPreferences(userId: string) {
    return this.preferences.get(userId) ?? DEFAULT_PREFERENCES;
  }

  async isSuppressed(recipient: string, since: Date) {
    return this.all().some((r) => r.recipient === recipient && r.status === 'BOUNCED' && (r.failedAt ?? new Date(0)) >= since);
  }

  async updateDeliveryStatus(providerMessageId: string, status: 'DELIVERED' | 'BOUNCED', at: Date) {
    const r = this.all().find((x) => x.providerMessageId === providerMessageId);
    if (!r) return false;
    Object.assign(r, status === 'BOUNCED' ? { status, failedAt: at } : { status });
    return true;
  }
}

/** Proveedor falso: registra lo enviado y permite simular fallos. */
export class FakeEmailProvider implements EmailProvider {
  readonly name = 'fake';
  sent: OutgoingEmail[] = [];
  failures: DeliveryError[] = [];

  failNext(...errors: DeliveryError[]) {
    this.failures.push(...errors);
  }

  async send(email: OutgoingEmail) {
    const err = this.failures.shift();
    if (err) throw err;
    this.sent.push(email);
    return { messageId: `msg_${this.sent.length}` };
  }
}

export const testUser = (over: Partial<EventUser> = {}): EventUser => ({
  id: 'user_123',
  email: 'santiago@example.com',
  name: 'Santiago Delgado',
  locale: 'es',
  ...over,
});

/** Reloj controlable para probar reintentos sin esperar. */
export class Clock {
  constructor(public current = new Date('2026-09-30T12:00:00Z')) {}
  now = () => new Date(this.current);
  advance(ms: number) {
    this.current = new Date(this.current.getTime() + ms);
  }
}

export const silentLogger = { info: () => {}, warn: () => {}, error: () => {} };
