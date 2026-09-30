import type { Request, Response } from 'express';
import * as payments from '../services/payment.service.js';

export async function create(req: Request, res: Response) {
  const result = await payments.createOrder(req.user!.id, req.body.courseId, req.body.couponCode);
  res.status(201).json(result);
}

export async function status(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  res.json(await payments.getOrderStatus(req.user!.id, res.locals.params.id, res.locals.query?.tx));
}

export async function validateCoupon(req: Request, res: Response) {
  res.json(await payments.previewCoupon(req.body.courseId, req.body.code));
}
