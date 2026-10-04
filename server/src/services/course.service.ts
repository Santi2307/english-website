import type { CourseGoal, CourseLevel, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { forbidden, notFound } from '../utils/httpError.js';

type ListFilters = {
  level?: CourseLevel;
  goal?: CourseGoal;
  minPrice?: number;
  maxPrice?: number;
  sort: 'popular' | 'price_asc' | 'price_desc' | 'newest';
};

const orderBy: Record<ListFilters['sort'], Prisma.CourseOrderByWithRelationInput> = {
  popular: { enrollments: { _count: 'desc' } },
  price_asc: { priceCOP: 'asc' },
  price_desc: { priceCOP: 'desc' },
  newest: { createdAt: 'desc' },
};

async function ratingsFor(courseIds: string[]) {
  const rows = await prisma.review.groupBy({
    by: ['courseId'],
    where: { courseId: { in: courseIds } },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.courseId, { avg: r._avg.rating ?? 0, count: r._count._all }]));
}

export async function listCourses(f: ListFilters) {
  const courses = await prisma.course.findMany({
    where: {
      published: true,
      level: f.level,
      goal: f.goal,
      priceCOP: { gte: f.minPrice, lte: f.maxPrice },
    },
    orderBy: orderBy[f.sort],
    select: {
      id: true, slug: true, title: true, subtitle: true, level: true, goal: true,
      priceCOP: true, compareAtCOP: true, badge: true, coverImage: true, coverColor: true,
      durationHours: true, instructorName: true, whatYouLearn: true,
      _count: { select: { enrollments: true, modules: true } },
    },
  });
  const ratings = await ratingsFor(courses.map((c) => c.id));
  return courses.map(({ _count, ...c }) => ({
    ...c,
    students: _count.enrollments,
    rating: ratings.get(c.id)?.avg ?? 0,
    reviewsCount: ratings.get(c.id)?.count ?? 0,
  }));
}

export async function getCourseBySlug(slug: string, userId?: string) {
  const course = await prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            // videoId nunca se envía en el endpoint público
            select: { id: true, title: true, durationMinutes: true, isFreePreview: true, position: true },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, rating: true, comment: true, createdAt: true, user: { select: { name: true, avatarUrl: true } } },
      },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) throw notFound('Curso no encontrado');

  const ratings = await ratingsFor([course.id]);
  const enrolled = userId
    ? !!(await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } }))
    : false;

  const { _count, ...rest } = course;
  return {
    ...rest,
    students: _count.enrollments,
    rating: ratings.get(course.id)?.avg ?? 0,
    reviewsCount: ratings.get(course.id)?.count ?? 0,
    lessonsCount: course.modules.reduce((n, m) => n + m.lessons.length, 0),
    isEnrolled: enrolled,
  };
}

export async function addReview(userId: string, courseId: string, rating: number, comment: string) {
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (!enrollment) throw forbidden('Solo estudiantes inscritos pueden dejar reseñas');
  return prisma.review.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, rating, comment },
    update: { rating, comment },
  });
}

export async function sitemapEntries() {
  return prisma.course.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
}
