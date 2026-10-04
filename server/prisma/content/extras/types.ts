import type { LessonContentInput } from '../../../src/lessonContent/schema.js';

/**
 * Material de profundización de una lección. Se fusiona con el contenido base
 * (content/<curso>.ts): vocabulario y ejercicios se suman, el resto se agrega.
 */
export type LessonExtras = Pick<LessonContentInput, 'mistakes' | 'pronunciation' | 'reading' | 'culture' | 'mission'> & {
  vocabulary?: LessonContentInput['vocabulary'];
  exercises: LessonContentInput['exercises'];
};
