import type { Request, Response } from 'express';
import * as courses from '../services/course.service.js';
import { env } from '../config/env.js';

export async function list(_req: Request, res: Response) {
  res.set('Cache-Control', 'public, max-age=60');
  res.json(await courses.listCourses(res.locals.query));
}

export async function detail(req: Request, res: Response) {
  res.json(await courses.getCourseBySlug(res.locals.params.slug, req.user?.id));
}

export async function review(req: Request, res: Response) {
  const r = await courses.addReview(req.user!.id, res.locals.params.id, req.body.rating, req.body.comment);
  res.status(201).json(r);
}

export async function sitemap(_req: Request, res: Response) {
  const entries = await courses.sitemapEntries();
  const base = env.CLIENT_URL.replace(/\/$/, '');
  const staticPaths = [
    '/',
    '/how-it-works',
    '/practice',
    '/practice/job-interview',
    '/practice/work',
    '/practice/travel',
    '/practice/everyday-life',
    '/pricing',
    '/cursos',
  ];
  const urls = [
    ...staticPaths.map((p) => `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`),
    ...entries.map(
      (c) => `<url><loc>${base}/cursos/${c.slug}</loc><lastmod>${c.updatedAt.toISOString().slice(0, 10)}</lastmod><priority>0.9</priority></url>`,
    ),
  ];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
  );
}
