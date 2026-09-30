import { useQuery } from '@tanstack/react-query';
import { api, qs } from '@/lib/api';
import type { CourseDetail, CourseSummary, Goal, Level } from '@/lib/types';

export type CourseFilters = {
  level?: Level;
  goal?: Goal;
  maxPrice?: number;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
};

export const useCourses = (f: CourseFilters = {}) =>
  useQuery({
    queryKey: ['courses', f],
    queryFn: () => api<CourseSummary[]>(`/courses${qs(f)}`),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

export const useCourse = (slug: string) =>
  useQuery({
    queryKey: ['course', slug],
    queryFn: () => api<CourseDetail>(`/courses/${slug}`),
  });
