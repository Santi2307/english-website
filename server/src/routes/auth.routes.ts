import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { googleSchema, loginSchema, registerSchema } from '../schemas/auth.schema.js';

export const authRoutes = Router()
  .post('/register', authLimiter, validate({ body: registerSchema }), c.register)
  .post('/login', authLimiter, validate({ body: loginSchema }), c.login)
  .post('/google', authLimiter, validate({ body: googleSchema }), c.google)
  .post('/logout', c.logout)
  .get('/me', optionalAuth, c.me);
