import { Router } from 'express';
import * as c from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimit.js';
import { idParams } from '../schemas/course.schema.js';
import { createOrderSchema, orderStatusQuery, validateCouponSchema } from '../schemas/order.schema.js';

export const orderRoutes = Router()
  .post('/', requireAuth, orderLimiter, validate({ body: createOrderSchema }), c.create)
  .get('/:id', requireAuth, validate({ params: idParams, query: orderStatusQuery }), c.status);

export const couponRoutes = Router().post(
  '/validate',
  orderLimiter,
  validate({ body: validateCouponSchema }),
  c.validateCoupon,
);
