import { Router } from 'express';
import * as c from '../controllers/webhook.controller.js';

export const webhookRoutes = Router().post('/wompi', c.wompi);
