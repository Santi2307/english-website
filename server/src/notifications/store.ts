import { Prisma, type PrismaClient } from '@prisma/client';
import type { ChannelName, NotificationCategory, NotificationPayload, NotificationRecord } from './types.js';
import { DEFAULT_PREFERENCES, type Preferences } from './preferences.js';

export type CreateNotificationInput = {
  userId: string | null;
  channel: ChannelName;
  recipient: string;
  eventType: string;
  eventId: string;
  template: string;
  category: NotificationCategory;
  idempotencyKey: string;
  payload: NotificationPayload;
  /** SKIPPED se registra para auditoría (preferencias, destinatario suprimido) */
  status?: 'QUEUED' | 'SKIPPED';
  errorMessage?: string;
};

/**
 * Persistencia del motor. La tabla Notification es a la vez log y cola:
 * si el proyecto crece, `findDueIds`/`claim` se reemplazan por BullMQ/SQS
 * sin tocar emisores ni plantillas.
 */
export interface NotificationStore {
  /** Inserta respetando la clave de idempotencia. `duplicate: true` si ya existía. */
  create(input: CreateNotificationInput): Promise<{ record: NotificationRecord; duplicate: boolean }>;
  /** Toma la notificación si está lista (QUEUED y vencida). Marca PROCESSING con un "lease". */
  claim(id: string, now: Date, leaseUntil: Date): Promise<NotificationRecord | null>;
  markSent(id: string, data: { provider: string; providerMessageId: string; at: Date }): Promise<void>;
  markRetry(id: string, data: { nextAttemptAt: Date; error: string; provider?: string }): Promise<void>;
  markFailed(id: string, data: { error: string; at: Date; provider?: string }): Promise<void>;
  findDueIds(now: Date, limit: number): Promise<string[]>;
  /** Devuelve a la cola las que quedaron PROCESSING tras un crash (lease vencido). */
  requeueExpiredLeases(now: Date): Promise<number>;
  getPreferences(userId: string): Promise<Preferences>;
  /** Direcciones con rebote o queja reciente: no se les envía para cuidar la reputación del dominio */
  isSuppressed(recipient: string, since: Date): Promise<boolean>;
  updateDeliveryStatus(providerMessageId: string, status: 'DELIVERED' | 'BOUNCED', at: Date): Promise<boolean>;
}

type Row = Prisma.NotificationGetPayload<object>;
const toRecord = (r: Row): NotificationRecord => ({
  ...r,
  channel: r.channel as ChannelName,
  payload: r.payload as unknown as NotificationPayload,
});

export class PrismaNotificationStore implements NotificationStore {
  constructor(private readonly db: PrismaClient) {}

  async create(input: CreateNotificationInput) {
    // ON CONFLICT DO NOTHING: un duplicado no es un error, no ensucia los logs
    const { count } = await this.db.notification.createMany({
      data: [{ ...input, payload: input.payload as unknown as Prisma.InputJsonValue, status: input.status ?? 'QUEUED' }],
      skipDuplicates: true,
    });
    const row = await this.db.notification.findUniqueOrThrow({ where: { idempotencyKey: input.idempotencyKey } });
    return { record: toRecord(row), duplicate: count === 0 };
  }

  async claim(id: string, now: Date, leaseUntil: Date) {
    // Update condicional: si dos workers intentan tomarla, solo uno lo logra
    const res = await this.db.notification.updateMany({
      where: { id, status: 'QUEUED', nextAttemptAt: { lte: now } },
      data: { status: 'PROCESSING', attempts: { increment: 1 }, nextAttemptAt: leaseUntil },
    });
    if (res.count === 0) return null;
    return toRecord(await this.db.notification.findUniqueOrThrow({ where: { id } }));
  }

  async markSent(id: string, d: { provider: string; providerMessageId: string; at: Date }) {
    await this.db.notification.update({
      where: { id },
      data: { status: 'SENT', provider: d.provider, providerMessageId: d.providerMessageId, sentAt: d.at, errorMessage: null },
    });
  }

  async markRetry(id: string, d: { nextAttemptAt: Date; error: string; provider?: string }) {
    await this.db.notification.update({
      where: { id },
      data: { status: 'QUEUED', nextAttemptAt: d.nextAttemptAt, errorMessage: d.error.slice(0, 500), provider: d.provider },
    });
  }

  async markFailed(id: string, d: { error: string; at: Date; provider?: string }) {
    await this.db.notification.update({
      where: { id },
      data: { status: 'FAILED', failedAt: d.at, errorMessage: d.error.slice(0, 500), provider: d.provider },
    });
  }

  async findDueIds(now: Date, limit: number) {
    const rows = await this.db.notification.findMany({
      where: { status: 'QUEUED', nextAttemptAt: { lte: now } },
      orderBy: { nextAttemptAt: 'asc' },
      take: limit,
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }

  async requeueExpiredLeases(now: Date) {
    const res = await this.db.notification.updateMany({
      where: { status: 'PROCESSING', nextAttemptAt: { lt: now } },
      data: { status: 'QUEUED', nextAttemptAt: now },
    });
    return res.count;
  }

  async getPreferences(userId: string) {
    const p = await this.db.notificationPreference.findUnique({ where: { userId } });
    return p ?? DEFAULT_PREFERENCES;
  }

  async isSuppressed(recipient: string, since: Date) {
    const hit = await this.db.notification.findFirst({
      where: { recipient, status: 'BOUNCED', failedAt: { gte: since } },
      select: { id: true },
    });
    return !!hit;
  }

  async updateDeliveryStatus(providerMessageId: string, status: 'DELIVERED' | 'BOUNCED', at: Date) {
    const res = await this.db.notification.updateMany({
      // Un "delivered" tardío nunca pisa un "bounced"
      where: { providerMessageId, ...(status === 'DELIVERED' && { status: 'SENT' }) },
      data: status === 'BOUNCED' ? { status, failedAt: at } : { status, deliveredAt: at },
    });
    return res.count > 0;
  }
}
