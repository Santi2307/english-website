import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { courseRoutes } from './course.routes.js';
import { couponRoutes, orderRoutes } from './order.routes.js';
import { lessonRoutes, meRoutes } from './learning.routes.js';
import { adminRoutes } from './admin.routes.js';
import { notificationRoutes } from './notification.routes.js';

export const apiRoutes = Router()
  .get('/health', (_req, res) => {
    res.json({ ok: true });
  })
  .use('/auth', authRoutes)
  .use('/courses', courseRoutes)
  .use('/coupons', couponRoutes)
  .use('/orders', orderRoutes)
  .use('/me', meRoutes)
  .use('/lessons', lessonRoutes)
  .use('/admin', adminRoutes)
  .use('/notifications', notificationRoutes);
