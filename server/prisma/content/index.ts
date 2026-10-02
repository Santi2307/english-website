import type { LessonContentInput } from '../../src/lessonContent/schema.js';
import { inglesDesdeCero } from './ingles-desde-cero.js';
import { conversacionFluida } from './conversacion-fluida.js';
import { inglesParaNegocios } from './ingles-para-negocios.js';
import { preparacionIeltsToefl } from './preparacion-ielts-toefl.js';

/** Contenido por slug de curso → [posición del módulo][posición de la lección]. */
export const courseContent: Record<string, LessonContentInput[][]> = {
  'ingles-desde-cero': inglesDesdeCero,
  'conversacion-fluida': conversacionFluida,
  'ingles-para-negocios': inglesParaNegocios,
  'preparacion-ielts-toefl': preparacionIeltsToefl,
};
