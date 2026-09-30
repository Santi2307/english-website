import type { Request, Response } from 'express';
import * as admin from '../services/admin.service.js';

const id = (res: Response) => res.locals.params.id as string;

export const listCourses = async (_req: Request, res: Response) => res.json(await admin.listCourses());
export const getCourse = async (_req: Request, res: Response) => res.json(await admin.getCourse(id(res)));
export const createCourse = async (req: Request, res: Response) => res.status(201).json(await admin.createCourse(req.body));
export const updateCourse = async (req: Request, res: Response) => res.json(await admin.updateCourse(id(res), req.body));
export const deleteCourse = async (_req: Request, res: Response) => res.json(await admin.deleteCourse(id(res)));

export const createModule = async (req: Request, res: Response) => res.status(201).json(await admin.createModule(req.body));
export const updateModule = async (req: Request, res: Response) => res.json(await admin.updateModule(id(res), req.body));
export const deleteModule = async (_req: Request, res: Response) => res.json(await admin.deleteModule(id(res)));

export const createLesson = async (req: Request, res: Response) => res.status(201).json(await admin.createLesson(req.body));
export const updateLesson = async (req: Request, res: Response) => res.json(await admin.updateLesson(id(res), req.body));
export const deleteLesson = async (_req: Request, res: Response) => res.json(await admin.deleteLesson(id(res)));

export const listOrders = async (_req: Request, res: Response) => res.json(await admin.listOrders(res.locals.query));

export const listCoupons = async (_req: Request, res: Response) => res.json(await admin.listCoupons());
export const createCoupon = async (req: Request, res: Response) => res.status(201).json(await admin.createCoupon(req.body));
export const updateCoupon = async (req: Request, res: Response) => res.json(await admin.updateCoupon(id(res), req.body));
export const deleteCoupon = async (_req: Request, res: Response) => res.json(await admin.deleteCoupon(id(res)));

export const metrics = async (_req: Request, res: Response) => res.json(await admin.metrics());
