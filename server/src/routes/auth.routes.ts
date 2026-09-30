import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { authLimiter, emailActionLimiter } from '../middleware/rateLimit.js';
import {
  changePasswordSchema, forgotPasswordSchema, googleSchema, loginSchema, profileSchema, registerSchema,
  resetPasswordSchema, tokenSchema,
} from '../schemas/auth.schema.js';

export const authRoutes = Router()
  .post('/register', authLimiter, validate({ body: registerSchema }), c.register)
  .post('/login', authLimiter, validate({ body: loginSchema }), c.login)
  .post('/google', authLimiter, validate({ body: googleSchema }), c.google)
  .post('/logout', c.logout)
  .get('/me', optionalAuth, c.me)
  .post('/verify-email', authLimiter, validate({ body: tokenSchema }), c.verifyEmail)
  .post('/verify-email/resend', requireAuth, emailActionLimiter, c.resendVerification)
  .post('/password/forgot', emailActionLimiter, validate({ body: forgotPasswordSchema }), c.forgotPassword)
  .post('/password/reset', authLimiter, validate({ body: resetPasswordSchema }), c.resetPassword)
  .put('/password', requireAuth, authLimiter, validate({ body: changePasswordSchema }), c.changePassword)
  .patch('/profile', requireAuth, validate({ body: profileSchema }), c.updateProfile);
