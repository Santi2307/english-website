import 'dotenv/config';
import { PrismaClient, type Prisma } from '@prisma/client';
import { lessonContentSchema } from '../src/lessonContent/schema.js';
import { courseContent } from './content/index.js';

/**
 * Carga (o actualiza) el contenido interactivo de las lecciones.
 * Idempotente: se puede correr las veces que quieras, también contra producción
 * (Neon). No borra lecciones, progreso ni inscripciones.
 *
 *   npm run seed:content --workspace server
 */
export async function seedContent(prisma: PrismaClient) {
  let updated = 0;
  const problems: string[] = [];

  for (const [slug, modules] of Object.entries(courseContent)) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: { modules: { orderBy: { position: 'asc' }, include: { lessons: { orderBy: { position: 'asc' } } } } },
    });
    if (!course) {
      problems.push(`Curso "${slug}" no existe en la BD (corre primero el seed)`);
      continue;
    }

    for (const [mi, lessons] of modules.entries()) {
      for (const [li, raw] of lessons.entries()) {
        const where = `${slug} › módulo ${mi + 1} › lección ${li + 1}`;
        const parsed = lessonContentSchema.safeParse(raw);
        if (!parsed.success) {
          problems.push(`${where}: contenido inválido → ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
          continue;
        }
        const lesson = course.modules[mi]?.lessons[li];
        if (!lesson) {
          problems.push(`${where}: la lección no existe en la BD`);
          continue;
        }
        const c = parsed.data;
        // Duración realista: mini-clase y vocabulario + ~1,2 min por ejercicio + lectura y misión
        const minutes = 10 + Math.round(c.exercises.length * 1.2) + (c.reading ? 6 : 0) + (c.mission ? 5 : 0) + (c.pronunciation ? 3 : 0);
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            content: parsed.data as unknown as Prisma.InputJsonValue,
            durationMinutes: Math.max(lesson.durationMinutes, minutes),
          },
        });
        updated++;
      }
    }
  }

  if (problems.length) console.warn(`⚠️  ${problems.length} problema(s):\n - ${problems.join('\n - ')}`);
  console.log(`✓ Contenido cargado en ${updated} lecciones`);
  return { updated, problems };
}

// Ejecución directa: tsx prisma/seed-content.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  const prisma = new PrismaClient();
  seedContent(prisma)
    .then(({ problems }) => {
      if (problems.length) process.exitCode = 1;
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
