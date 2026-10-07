import { Prisma, type OrderStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { bogotaDay } from '../utils/dates.js';

// ─── Cursos / módulos / lecciones ────────────────────────────
export const listCourses = () =>
  prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true, modules: true } } },
  });

export const getCourse = (id: string) =>
  prisma.course.findUniqueOrThrow({
    where: { id },
    include: {
      modules: { orderBy: { position: 'asc' }, include: { lessons: { orderBy: { position: 'asc' } } } },
    },
  });

export const createCourse = (data: Prisma.CourseCreateInput) => prisma.course.create({ data });
export const updateCourse = (id: string, data: Prisma.CourseUpdateInput) => prisma.course.update({ where: { id }, data });

export async function deleteCourse(id: string) {
  const sold = await prisma.order.count({ where: { courseId: id } });
  // Con ventas no se borra (historial contable): se despublica
  if (sold > 0) return prisma.course.update({ where: { id }, data: { published: false } });
  return prisma.course.delete({ where: { id } });
}

export const createModule = (data: Prisma.ModuleUncheckedCreateInput) => prisma.module.create({ data });
export const updateModule = (id: string, data: Prisma.ModuleUpdateInput) => prisma.module.update({ where: { id }, data });
export const deleteModule = (id: string) => prisma.module.delete({ where: { id } });

/** Prisma requiere DbNull para vaciar una columna Json */
const jsonContent = (c: unknown) => (c === null ? Prisma.DbNull : (c as Prisma.InputJsonValue | undefined));

export const createLesson = ({ content, ...data }: Omit<Prisma.LessonUncheckedCreateInput, 'content'> & { content?: unknown }) =>
  prisma.lesson.create({ data: { ...data, content: jsonContent(content) } });
export const updateLesson = (id: string, { content, ...data }: Omit<Prisma.LessonUpdateInput, 'content'> & { content?: unknown }) =>
  prisma.lesson.update({ where: { id }, data: { ...data, content: jsonContent(content) } });
export const deleteLesson = (id: string) => prisma.lesson.delete({ where: { id } });

// ─── Órdenes ─────────────────────────────────────────────────
export async function listOrders(q: { status?: OrderStatus; q?: string; page: number; pageSize: number }) {
  const where: Prisma.OrderWhereInput = {
    status: q.status,
    ...(q.q && {
      OR: [
        { reference: { contains: q.q, mode: 'insensitive' } },
        { providerPaymentId: { contains: q.q, mode: 'insensitive' } },
        { user: { email: { contains: q.q, mode: 'insensitive' } } },
      ],
    }),
  };
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
        coupon: { select: { code: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total, page: q.page, pageSize: q.pageSize };
}

// ─── Cupones ─────────────────────────────────────────────────
export const listCoupons = () =>
  prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, include: { course: { select: { title: true } } } });
export const createCoupon = (data: Prisma.CouponUncheckedCreateInput) => prisma.coupon.create({ data });
export const updateCoupon = (id: string, data: Prisma.CouponUncheckedUpdateInput) =>
  prisma.coupon.update({ where: { id }, data });
export const deleteCoupon = async (id: string) => {
  const used = await prisma.order.count({ where: { couponId: id } });
  if (used > 0) return prisma.coupon.update({ where: { id }, data: { active: false } });
  return prisma.coupon.delete({ where: { id } });
};

// ─── Métricas ────────────────────────────────────────────────
export async function metrics() {
  const since = new Date(Date.now() - 30 * 86_400_000);
  const [revenue, byStatus, students, recentApproved, top] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'APPROVED' }, _sum: { amountInCents: true }, _count: true }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.order.findMany({
      where: { status: 'APPROVED', paidAt: { gte: since } },
      select: { paidAt: true, amountInCents: true },
    }),
    prisma.order.groupBy({
      by: ['courseId'],
      where: { status: 'APPROVED' },
      _count: { _all: true },
      _sum: { amountInCents: true },
      orderBy: { _sum: { amountInCents: 'desc' } },
      take: 5,
    }),
  ]);

  // Serie diaria de los últimos 30 días (con ceros)
  const daily = new Map<string, { revenueCOP: number; orders: number }>();
  for (let i = 29; i >= 0; i--) daily.set(bogotaDay(new Date(Date.now() - i * 86_400_000)), { revenueCOP: 0, orders: 0 });
  for (const o of recentApproved) {
    const d = daily.get(bogotaDay(o.paidAt!));
    if (d) {
      d.revenueCOP += o.amountInCents / 100;
      d.orders += 1;
    }
  }

  const titles = await prisma.course.findMany({ where: { id: { in: top.map((t) => t.courseId) } }, select: { id: true, title: true } });
  const titleMap = new Map(titles.map((t) => [t.id, t.title]));
  const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])) as Record<OrderStatus, number>;
  const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0);
  const approved = counts.APPROVED ?? 0;
  const last30 = [...daily.values()].reduce((a, d) => a + d.revenueCOP, 0);

  return {
    totalRevenueCOP: (revenue._sum.amountInCents ?? 0) / 100,
    revenueLast30COP: last30,
    approvedOrders: approved,
    averageOrderCOP: approved ? Math.round((revenue._sum.amountInCents ?? 0) / 100 / approved) : 0,
    conversionRate: totalOrders ? approved / totalOrders : 0,
    students,
    ordersByStatus: counts,
    daily: [...daily.entries()].map(([date, v]) => ({ date, ...v })),
    topCourses: top.map((t) => ({
      courseId: t.courseId,
      title: titleMap.get(t.courseId) ?? '—',
      sales: t._count._all,
      revenueCOP: (t._sum.amountInCents ?? 0) / 100,
    })),
  };
}
