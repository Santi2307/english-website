import type { LessonContentInput } from '../../src/lessonContent/schema.js';
import { inglesDesdeCero } from './ingles-desde-cero.js';
import { conversacionFluida } from './conversacion-fluida.js';
import { inglesParaNegocios } from './ingles-para-negocios.js';
import { preparacionIeltsToefl } from './preparacion-ielts-toefl.js';
import type { LessonExtras } from './extras/types.js';
import { inglesDesdeCeroExtras } from './extras/ingles-desde-cero.js';
import { conversacionFluidaExtras } from './extras/conversacion-fluida.js';
import { inglesParaNegociosExtras } from './extras/ingles-para-negocios.js';
import { preparacionIeltsToeflExtras } from './extras/preparacion-ielts-toefl.js';

/** Intercala dos listas (a1, b1, a2, b2…) para que la práctica no sea predecible. */
function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

export function mergeLesson(base: LessonContentInput, extras?: LessonExtras): LessonContentInput {
  if (!extras) return base;
  const { vocabulary = [], exercises, ...rest } = extras;
  // El ejercicio de hablar del contenido base cierra la práctica
  const baseEx = base.exercises;
  const closing = baseEx.at(-1)?.type === 'speak' ? baseEx.slice(-1) : [];
  const opening = closing.length ? baseEx.slice(0, -1) : baseEx;
  return {
    ...base,
    ...rest,
    vocabulary: [...(base.vocabulary ?? []), ...vocabulary],
    exercises: [...interleave(opening, exercises), ...closing],
  };
}

const merge = (base: LessonContentInput[][], extras: LessonExtras[][]) =>
  base.map((lessons, mi) => lessons.map((l, li) => mergeLesson(l, extras[mi]?.[li])));

/** Contenido por slug de curso → [posición del módulo][posición de la lección]. */
export const courseContent: Record<string, LessonContentInput[][]> = {
  'ingles-desde-cero': merge(inglesDesdeCero, inglesDesdeCeroExtras),
  'conversacion-fluida': merge(conversacionFluida, conversacionFluidaExtras),
  'ingles-para-negocios': merge(inglesParaNegocios, inglesParaNegociosExtras),
  'preparacion-ielts-toefl': merge(preparacionIeltsToefl, preparacionIeltsToeflExtras),
};
