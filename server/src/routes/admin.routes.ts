import { Router } from 'express';
import * as c from '../controllers/admin.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { idParams } from '../schemas/course.schema.js';
import {
  couponInput, courseInput, lessonInput, lessonUpdate, moduleInput, moduleUpdate, ordersQuery,
} from '../schemas/admin.schema.js';

const withId = validate({ params: idParams });

export const adminRoutes = Router()
  .use(requireAuth, requireAdmin)
  .get('/metrics', c.metrics)

  .get('/courses', c.listCourses)
  .post('/courses', validate({ body: courseInput }), c.createCourse)
  .get('/courses/:id', withId, c.getCourse)
  .put('/courses/:id', validate({ params: idParams, body: courseInput.partial() }), c.updateCourse)
  .delete('/courses/:id', withId, c.deleteCourse)

  .post('/modules', validate({ body: moduleInput }), c.createModule)
  .put('/modules/:id', validate({ params: idParams, body: moduleUpdate }), c.updateModule)
  .delete('/modules/:id', withId, c.deleteModule)

  .post('/lessons', validate({ body: lessonInput }), c.createLesson)
  .put('/lessons/:id', validate({ params: idParams, body: lessonUpdate }), c.updateLesson)
  .delete('/lessons/:id', withId, c.deleteLesson)

  .get('/orders', validate({ query: ordersQuery }), c.listOrders)

  .get('/coupons', c.listCoupons)
  .post('/coupons', validate({ body: couponInput }), c.createCoupon)
  .put('/coupons/:id', validate({ params: idParams, body: couponInput }), c.updateCoupon)
  .delete('/coupons/:id', withId, c.deleteCoupon);
