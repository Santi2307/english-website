import { Router } from 'express';
import * as c from '../controllers/course.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { idParams, listCoursesQuery, reviewSchema, slugParams } from '../schemas/course.schema.js';

export const courseRoutes = Router()
  .get('/', validate({ query: listCoursesQuery }), c.list)
  .get('/:slug', optionalAuth, validate({ params: slugParams }), c.detail)
  .post('/:id/reviews', requireAuth, validate({ params: idParams, body: reviewSchema }), c.review);
