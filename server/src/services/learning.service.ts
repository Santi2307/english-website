import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { forbidden, notFound } from '../utils/httpError.js';
import { bogotaDay, dayDiff } from '../utils/dates.js';
import { signedPlayback } from './video.service.js';
import { events } from '../notifications/index.js';
import { toLocale } from '../notifications/types.js';

async function requireEnrollment(userId: string, courseId: string) {
  const e = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (!e) throw forbidden('No estás inscrito en este curso');
  return e;
}

/** Racha efectiva: si el último día activo fue antes de ayer, la racha ya se rompió. */
function effectiveStreak(streak: number, last: Date | null) {
  if (!last) return 0;
  const diff = dayDiff(bogotaDay(), last.toISOString().slice(0, 10));
  return diff <= 1 ? streak : 0;
}

export async function myCourses(userId: string) {
  const [user, enrollments] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true, slug: true, title: true, level: true, coverImage: true, coverColor: true, instructorName: true,
            modules: { select: { lessons: { select: { id: true } } } },
          },
        },
      },
    }),
  ]);

  const done = await prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true, completedAt: true } });
  const doneSet = new Set(done.map((d) => d.lessonId));
  const last7 = new Set(
    done.filter((d) => Date.now() - d.completedAt.getTime() < 7 * 86_400_000).map((d) => bogotaDay(d.completedAt)),
  );

  return {
    streak: effectiveStreak(user.streakCount, user.lastActiveDate),
    activeDaysLast7: [...last7],
    courses: enrollments.map((e) => {
      const ids = e.course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const completed = ids.filter((id) => doneSet.has(id)).length;
      const { modules: _m, ...course } = e.course;
      return {
        ...course,
        enrolledAt: e.createdAt,
        completedAt: e.completedAt,
        totalLessons: ids.length,
        completedLessons: completed,
        progress: ids.length ? Math.round((completed / ids.length) * 100) : 0,
      };
    }),
  };
}

export async function courseForLearning(userId: string, slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          lessons: {
            orderBy: { position: 'asc' },
            select: { id: true, title: true, description: true, durationMinutes: true, position: true },
          },
        },
      },
    },
  });
  if (!course) throw notFound('Curso no encontrado');
  const enrollment = await requireEnrollment(userId, course.id);

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const done = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true, score: true },
  });
  const doneSet = new Set(done.map((d) => d.lessonId));
  const scores = new Map(done.map((d) => [d.lessonId, d.score]));

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    completedAt: enrollment.completedAt,
    progress: lessonIds.length ? Math.round((doneSet.size / lessonIds.length) * 100) : 0,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      completed: m.lessons.filter((l) => doneSet.has(l.id)).length,
      total: m.lessons.length,
      lessons: m.lessons.map((l) => ({ ...l, completed: doneSet.has(l.id), score: scores.get(l.id) ?? null })),
    })),
  };
}

/** Lección accesible: gratuita, o el usuario está inscrito en el curso. */
async function accessibleLesson(userId: string | undefined, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson) throw notFound('Lección no encontrada');
  if (!lesson.isFreePreview) {
    if (!userId) throw forbidden('Inicia sesión para ver esta lección');
    await requireEnrollment(userId, lesson.module.courseId);
  }
  return lesson;
}

export async function lessonPlayback(userId: string | undefined, lessonId: string) {
  const lesson = await accessibleLesson(userId, lessonId);
  return { lessonId: lesson.id, playback: signedPlayback(lesson.videoId) };
}

/** Contenido interactivo (mini-clase, vocabulario, ejercicios). Mismo control de acceso que el video. */
export async function lessonContent(userId: string | undefined, lessonId: string) {
  const lesson = await accessibleLesson(userId, lessonId);
  const progress = userId
    ? await prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } }, select: { score: true } })
    : null;
  return { lessonId: lesson.id, content: lesson.content, bestScore: progress?.score ?? null };
}

export async function completeLesson(userId: string, lessonId: string, score?: number) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
  });
  if (!lesson) throw notFound('Lección no encontrada');
  const courseId = lesson.module.courseId;
  const enrollment = await requireEnrollment(userId, courseId);

  // Se conserva la mejor nota: repetir los ejercicios nunca baja el puntaje
  const existing = await prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } });
  const best = score === undefined ? existing?.score ?? null : Math.max(score, existing?.score ?? 0);
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, score: best },
    update: { score: best },
  });

  // Racha diaria (zona horaria de Colombia)
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const today = bogotaDay();
  const last = user.lastActiveDate?.toISOString().slice(0, 10);
  if (last !== today) {
    const streak = last && dayDiff(today, last) === 1 ? user.streakCount + 1 : 1;
    await prisma.user.update({ where: { id: userId }, data: { streakCount: streak, lastActiveDate: new Date(`${today}T00:00:00Z`) } });
  }

  // ¿Curso completo?
  const [total, completed] = await Promise.all([
    prisma.lesson.count({ where: { module: { courseId } } }),
    prisma.lessonProgress.count({ where: { userId, lesson: { module: { courseId } } } }),
  ]);
  let courseCompleted = !!enrollment.completedAt;
  if (!enrollment.completedAt && total > 0 && completed >= total) {
    // Condicional: si dos peticiones completan la última lección a la vez, solo una cierra el curso
    const completedAt = new Date();
    const certificateCode = crypto.randomBytes(6).toString('hex').toUpperCase();
    const res = await prisma.enrollment.updateMany({
      where: { id: enrollment.id, completedAt: null },
      data: { completedAt, certificateCode },
    });
    if (res.count === 1) {
      const e = await prisma.enrollment.findUniqueOrThrow({ where: { id: enrollment.id }, include: { user: true, course: true } });
      void events.emit(
        'COURSE_COMPLETED',
        {
          user: { id: e.user.id, email: e.user.email, name: e.user.name, locale: toLocale(e.user.locale) },
          enrollmentId: e.id,
          courseId: e.course.id,
          courseTitle: e.course.title,
          certificateCode,
          completedAt,
        },
        { id: e.id },
      );
    }
    courseCompleted = true;
  }

  const fresh = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { streakCount: true } });
  return { completed, total, progress: Math.round((completed / total) * 100), courseCompleted, streak: fresh.streakCount };
}

export async function certificateData(userId: string, courseId: string) {
  const e = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: { user: true, course: true },
  });
  if (!e) throw forbidden('No estás inscrito en este curso');
  if (!e.completedAt || !e.certificateCode) throw forbidden('Completa todas las lecciones para obtener el certificado');
  return e;
}
