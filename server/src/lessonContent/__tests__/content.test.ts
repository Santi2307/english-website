import { describe, expect, it } from 'vitest';
import { lessonContentSchema } from '../schema.js';
import { courseContent } from '../../../prisma/content/index.js';

const lessons = Object.entries(courseContent).flatMap(([slug, modules]) =>
  modules.flatMap((ls, mi) => ls.map((content, li) => ({ id: `${slug} M${mi + 1}L${li + 1}`, content }))),
);

describe('contenido de los cursos', () => {
  it('cada curso tiene 3 módulos con 3 lecciones', () => {
    for (const modules of Object.values(courseContent)) {
      expect(modules).toHaveLength(3);
      for (const m of modules) expect(m).toHaveLength(3);
    }
  });

  it.each(lessons)('$id es válido según el esquema', ({ content }) => {
    const r = lessonContentSchema.safeParse(content);
    if (!r.success) throw new Error(JSON.stringify(r.error.flatten().fieldErrors));
  });

  it.each(lessons)('$id tiene práctica variada (≥ 4 tipos de ejercicio)', ({ content }) => {
    const types = new Set(content.exercises.map((e) => e.type));
    expect(types.size).toBeGreaterThanOrEqual(4);
  });

  it('ninguna opción múltiple tiene opciones repetidas', () => {
    for (const { id, content } of lessons) {
      for (const ex of content.exercises) {
        if (ex.type === 'choice' || ex.type === 'listen') {
          expect(new Set(ex.options).size, `${id}: ${JSON.stringify(ex.options)}`).toBe(ex.options.length);
        }
      }
    }
  });

  it('los ejercicios de ordenar no son triviales (no todas las palabras iguales)', () => {
    for (const { id, content } of lessons) {
      for (const ex of content.exercises) {
        if (ex.type === 'order') expect(new Set(ex.words).size, id).toBeGreaterThan(2);
      }
    }
  });
});

describe('material de profundización', () => {
  it.each(lessons)('$id tiene lectura, errores típicos, pronunciación, cultura y misión', ({ content }) => {
    const c = lessonContentSchema.parse(content);
    expect(c.reading?.questions.length).toBeGreaterThanOrEqual(3);
    expect(c.mistakes.length).toBeGreaterThanOrEqual(3);
    expect(c.pronunciation?.words.length).toBeGreaterThanOrEqual(4);
    expect(c.culture).toBeDefined();
    expect(c.mission).toBeDefined();
    expect(c.exercises.length).toBeGreaterThanOrEqual(15);
    expect(c.exercises.some((e) => e.type === 'dictation')).toBe(true);
    expect(c.exercises.some((e) => e.type === 'fix')).toBe(true);
  });

  it.each(lessons)('$id no repite vocabulario', ({ content }) => {
    const words = (content.vocabulary ?? []).map((v) => v.en.toLowerCase());
    expect(new Set(words).size).toBe(words.length);
  });

  it('las preguntas de lectura no repiten opciones', () => {
    for (const { id, content } of lessons) {
      for (const q of content.reading?.questions ?? []) {
        expect(new Set(q.options).size, `${id}: ${q.q}`).toBe(q.options.length);
      }
    }
  });
});
