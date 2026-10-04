import type { Request, Response } from 'express';
import * as learning from '../services/learning.service.js';
import { renderCertificate } from '../services/certificate.service.js';

export async function myCourses(req: Request, res: Response) {
  res.json(await learning.myCourses(req.user!.id));
}

export async function course(req: Request, res: Response) {
  res.json(await learning.courseForLearning(req.user!.id, res.locals.params.slug));
}

export async function playback(req: Request, res: Response) {
  res.set('Cache-Control', 'private, no-store');
  res.json(await learning.lessonPlayback(req.user?.id, res.locals.params.id));
}

export async function content(req: Request, res: Response) {
  res.set('Cache-Control', 'private, no-store');
  res.json(await learning.lessonContent(req.user?.id, res.locals.params.id));
}

export async function complete(req: Request, res: Response) {
  res.json(await learning.completeLesson(req.user!.id, res.locals.params.id, req.body?.score));
}

export async function certificate(req: Request, res: Response) {
  const e = await learning.certificateData(req.user!.id, res.locals.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="certificado-${e.course.slug}.pdf"`);
  renderCertificate(res, {
    studentName: e.user.name,
    courseTitle: e.course.title,
    level: e.course.level,
    hours: e.course.durationHours,
    instructor: e.course.instructorName,
    completedAt: e.completedAt!,
    code: e.certificateCode!,
  });
}
