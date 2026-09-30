import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiRoutes } from './routes/index.js';
import { webhookRoutes } from './routes/webhook.routes.js';
import { sitemap } from './controllers/course.controller.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { csrfGuard } from './middleware/auth.js';
import { sanitizeBody } from './middleware/sanitize.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { unsubscribeRoutes } from './routes/notification.routes.js';
import { emailPreviewRoutes } from './notifications/preview.js';

declare global {
  namespace Express {
    interface Request {
      /** Body sin parsear: necesario para verificar firmas de webhooks (Resend/Svix) */
      rawBody?: Buffer;
    }
  }
}

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // Railway/Render/Vercel están detrás de un proxy
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL.split(',').map((o) => o.trim()),
      credentials: true,
      allowedHeaders: ['Content-Type', 'X-Requested-With'],
    }),
  );
  app.use(
    express.json({
      limit: '200kb',
      verify: (req, _res, buf) => {
        (req as express.Request).rawBody = buf;
      },
    }),
  );
  app.use(cookieParser());

  // Webhooks: servidor a servidor, sin CSRF ni sanitización (el checksum depende de los valores exactos)
  app.use('/api/webhooks', webhookRoutes);
  app.use('/api/notifications/unsubscribe', unsubscribeRoutes);
  if (!env.isProd) app.use('/api/dev/emails', emailPreviewRoutes);

  app.get('/sitemap.xml', sitemap);
  app.use('/api', apiLimiter, csrfGuard, sanitizeBody, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
