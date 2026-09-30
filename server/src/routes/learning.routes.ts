import { Router } from 'express';
import * as c from '../controllers/learning.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { idParams, slugParams } from '../schemas/course.schema.js';

export const meRoutes = Router()
  .use(requireAuth)
  .get('/courses', c.myCourses)
  .get('/courses/:slug', validate({ params: slugParams }), c.course)
  .get('/certificates/:id', validate({ params: idParams }), c.certificate);

export const lessonRoutes = Router()
  .get('/:id/playback', optionalAuth, validate({ params: idParams }), c.playback)
  .post('/:id/complete', requireAuth, validate({ params: idParams }), c.complete);
