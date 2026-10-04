import { z } from 'zod';

export const levelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1']);
export const goalEnum = z.enum(['CONVERSATION', 'BUSINESS', 'EXAM', 'KIDS']);

export const listCoursesQuery = z.object({
  level: levelEnum.optional(),
  goal: goalEnum.optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(['popular', 'price_asc', 'price_desc', 'newest']).default('popular'),
});

export const slugParams = z.object({ slug: z.string().min(1).max(120) });
export const idParams = z.object({ id: z.string().min(1).max(40) });

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});
