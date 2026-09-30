import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { EventBus } from './events.js';
import { NotificationEngine } from './engine.js';
import { PrismaNotificationStore } from './store.js';
import { EmailChannel } from './channels/email.channel.js';
import { createEmailProvider } from './providers/index.js';
import { notificationRules } from './rules.js';

export type { AppEventMap, AppEventType, EventUser, RequestContext } from './events.js';

/** Bus único de la aplicación. Los servicios de dominio solo importan `events`. */
export const events = new EventBus();

export const emailProvider = createEmailProvider();
export const emailChannel = new EmailChannel(emailProvider, { from: env.EMAIL_FROM, replyTo: env.EMAIL_REPLY_TO });

export const notificationStore = new PrismaNotificationStore(prisma);

export const notificationEngine = new NotificationEngine({
  store: notificationStore,
  channels: [emailChannel],
  rules: notificationRules,
});

events.subscribe(notificationEngine.handle);

export function startNotifications() {
  notificationEngine.start();
  console.info(`📬 Notificaciones activas (EMAIL_MODE=${env.EMAIL_MODE}, proveedor=${emailProvider.name})`);
}
