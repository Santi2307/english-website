import { Router } from 'express';
import * as c from '../controllers/notification.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { preferencesUpdateSchema, unsubscribeQuery } from '../schemas/notification.schema.js';

export const notificationRoutes = Router()
  .get('/preferences', requireAuth, c.getPreferences)
  .put('/preferences', requireAuth, validate({ body: preferencesUpdateSchema }), c.updatePreferences);

/**
 * Pública y fuera del guard CSRF: los clientes de correo hacen el POST de un clic
 * sin headers propios. El token firmado solo permite desactivar una categoría opcional.
 */
export const unsubscribeRoutes = Router().post('/', authLimiter, validate({ query: unsubscribeQuery }), c.unsubscribe);
