import { z } from 'zod';

export const completeLessonSchema = z
  .object({ score: z.number().int().min(0).max(100).optional() })
  .default({});
