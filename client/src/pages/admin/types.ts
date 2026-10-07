import type { Badge, Goal, Level, OrderStatus } from '@/lib/types';

export type AdminLesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  position: number;
  durationMinutes: number;
  videoId: string | null;
  isFreePreview: boolean;
  /** Contenido interactivo (ver server/src/lessonContent/schema.ts) */
  content: { exercises?: unknown[] } | null;
};
export type AdminModule = { id: string; courseId: string; title: string; position: number; lessons: AdminLesson[] };

export type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: Level;
  goal: Goal;
  priceCOP: number;
  compareAtCOP: number | null;
  badge: Badge | null;
  coverImage: string | null;
  coverColor: string;
  previewVideoUrl: string | null;
  durationHours: number;
  instructorName: string;
  instructorBio: string;
  instructorAvatar: string | null;
  whatYouLearn: string[];
  published: boolean;
  modules?: AdminModule[];
  _count?: { enrollments: number; modules: number };
};

export type AdminOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  subtotalCOP: number;
  discountCOP: number;
  amountInCents: number;
  paymentMethod: string | null;
  wompiTransactionId: string | null;
  provider: string;
  providerPaymentId: string | null;
  paymentDetail: string | null;
  statusMessage: string | null;
  createdAt: string;
  paidAt: string | null;
  user: { name: string; email: string };
  course: { title: string };
  coupon: { code: string } | null;
};

export type AdminCoupon = {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  courseId: string | null;
  maxRedemptions: number | null;
  redemptions: number;
  expiresAt: string | null;
  active: boolean;
  course: { title: string } | null;
};

export type Metrics = {
  totalRevenueCOP: number;
  revenueLast30COP: number;
  approvedOrders: number;
  averageOrderCOP: number;
  conversionRate: number;
  students: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  daily: { date: string; revenueCOP: number; orders: number }[];
  topCourses: { courseId: string; title: string; sales: number; revenueCOP: number }[];
};
