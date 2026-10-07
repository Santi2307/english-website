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
  locale: 'es' | 'en';
  emailVerified: boolean;
  hasPassword: boolean;
};

export type PreferenceKey = 'accountUpdates' | 'productUpdates' | 'tips' | 'marketing';
export type NotificationPreferences = Record<'security' | 'transactional' | PreferenceKey, { enabled: boolean; locked: boolean }>;

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


export type CreateOrderResponse =
  | { orderId: string; free: true }
  | {
      orderId: string;
      free: false;
      provider: 'stripe';
      /** client_secret del PaymentIntent: solo sirve para confirmar ESTE pago desde el navegador */
      clientSecret: string;
      status: string;
      amountInCents: number;
      currency: string;
      returnUrl: string;
      summary: { subtotalCOP: number; discountCOP: number; totalCOP: number };
    };

export type OrderStatusResponse = {
  id: string;
  reference: string;
  status: OrderStatus;
  amountInCents: number;
  subtotalCOP: number;
  discountCOP: number;
  currency: string;
  paymentMethod: string | null;
  paymentDetail: string | null;
  receiptUrl: string | null;
  /** Código del último intento fallido (card_declined…); la UI lo traduce */
  attemptError: string | null;
  statusMessage: string | null;
  createdAt: string;
  paidAt: string | null;
  receiptEmail: string;
  course: { id: string; slug: string; title: string };
};

export type CheckoutConfig = {
  provider: 'stripe';
  /** false si faltan las llaves de Stripe: el checkout lo dice, no simula nada */
  enabled: boolean;
  publishableKey: string | null;
  currency: string;
  savedBilling: Record<string, string> | null;
};

export type OrderHistoryItem = {
  id: string;
  reference: string;
  status: OrderStatus;
  totalCOP: number;
  currency: string;
  paymentMethod: string | null;
  paymentDetail: string | null;
  receiptUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  course: { slug: string; title: string };
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
    lessons: { id: string; title: string; description: string; durationMinutes: number; completed: boolean; score: number | null }[];
  }[];
};

export type Playback = { provider: 'bunny' | 'mux'; embedUrl: string; expiresAt: string } | null;
