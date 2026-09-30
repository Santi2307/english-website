import type { Coupon, Course } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { badRequest } from '../utils/httpError.js';

export type PriceQuote = {
  subtotalCOP: number;
  discountCOP: number;
  totalCOP: number;
  coupon: Coupon | null;
};

export async function findValidCoupon(code: string, courseId: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const now = new Date();
  if (
    !coupon ||
    !coupon.active ||
    (coupon.expiresAt && coupon.expiresAt < now) ||
    (coupon.maxRedemptions !== null && coupon.redemptions >= coupon.maxRedemptions) ||
    (coupon.courseId && coupon.courseId !== courseId)
  ) {
    throw badRequest('Cupón inválido o expirado');
  }
  return coupon;
}

/** Calcula el precio final en el servidor. El cliente nunca envía montos. */
export async function quote(course: Pick<Course, 'id' | 'priceCOP'>, couponCode?: string): Promise<PriceQuote> {
  const subtotalCOP = course.priceCOP;
  if (!couponCode) return { subtotalCOP, discountCOP: 0, totalCOP: subtotalCOP, coupon: null };

  const coupon = await findValidCoupon(couponCode, course.id);
  const raw = coupon.type === 'PERCENT' ? Math.round((subtotalCOP * coupon.value) / 100) : coupon.value;
  const discountCOP = Math.min(raw, subtotalCOP);
  return { subtotalCOP, discountCOP, totalCOP: subtotalCOP - discountCOP, coupon };
}
