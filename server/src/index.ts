import { env } from './config/env.js';
import { createApp } from './app.js';
import { prisma } from './lib/prisma.js';
import { notificationEngine, startNotifications } from './notifications/index.js';

const server = createApp().listen(env.PORT, () => {
  console.log(`🚀 API lista en http://localhost:${env.PORT} (Wompi: ${env.WOMPI_ENV})`);
  startNotifications();
});

const shutdown = async () => {
  server.close();
  // Deja terminar los envíos en curso antes de salir
  await notificationEngine.stop();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
