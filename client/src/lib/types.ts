export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type Goal = 'CONVERSATION' | 'BUSINESS' | 'EXAM' | 'KIDS';
export type Badge = 'BESTSELLER' | 'NEW';
export type OrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  avatarUrl: string | null;
  streakCount: number;
};

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  level: Level;
  goal: Goal;
  priceCOP: number;
  compareAtCOP: number | null;
  badge: Badge | null;
  coverImage: string | null;
  coverColor: string;
  durationHours: number;
  instructorName: string;
  whatYouLearn: string[];
  students: number;
  rating: number;
  reviewsCount: number;
};

export type CourseDetail = CourseSummary & {
  description: string;
  previewVideoUrl: string | null;
  instructorBio: string;
  instructorAvatar: string | null;
  lessonsCount: number;
  isEnrolled: boolean;
  modules: {
    id: string;
    title: string;
    lessons: { id: string; title: string; durationMinutes: number; isFreePreview: boolean }[];
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string; avatarUrl: string | null };
  }[];
};

export type WompiCheckout = {
  publicKey: string;
  currency: 'COP';
  amountInCents: number;
  reference: string;
  signature: string;
  redirectUrl: string;
};

export type CreateOrderResponse =
  | { orderId: string; free: true }
  | {
      orderId: string;
      free: false;
      checkout: WompiCheckout;
      summary: { subtotalCOP: number; discountCOP: number; totalCOP: number };
    };

export type OrderStatusResponse = {
  id: string;
  reference: string;
  status: OrderStatus;
  amountInCents: number;
  discountCOP: number;
  paymentMethod: string | null;
  statusMessage: string | null;
  course: { id: string; slug: string; title: string };
};

export type MyCourses = {
  streak: number;
  activeDaysLast7: string[];
  courses: {
    id: string;
    slug: string;
    title: string;
    level: Level;
    coverImage: string | null;
    coverColor: string;
    instructorName: string;
    enrolledAt: string;
    completedAt: string | null;
    totalLessons: number;
    completedLessons: number;
    progress: number;
  }[];
};

export type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  completedAt: string | null;
  progress: number;
  modules: {
    id: string;
    title: string;
    completed: number;
    total: number;
    lessons: { id: string; title: string; description: string; durationMinutes: number; completed: boolean }[];
  }[];
};

export type Playback = { provider: 'bunny' | 'mux'; embedUrl: string; expiresAt: string } | null;
