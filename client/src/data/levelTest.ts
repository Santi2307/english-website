import type { CourseSummary, Level } from '@/lib/types';
import { createSeenStore, generate, type Question } from './questionBank';

export type { Question };

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const PER_LEVEL = 3;
export const TOTAL_QUESTIONS = LEVELS.length * PER_LEVEL;

/**
 * Arma un test nuevo: 3 preguntas por nivel, de temas distintos, que este
 * navegador nunca haya visto. Las marca como vistas al crearlas, así que ni
 * recargar la página ni repetir el test vuelve a mostrarlas.
 */
export function buildTest(): Question[] {
  const seen = createSeenStore();
  const questions = LEVELS.flatMap((l) => generate(l, PER_LEVEL, seen));
  seen.add(questions.map((q) => q.id));
  return questions;
}

/** Pregunta de muestra para la tarjeta de introducción (también queda vetada para el test). */
export function sampleQuestion(): Question {
  const seen = createSeenStore();
  const [q] = generate('A1', 1, seen);
  seen.add([q.id]);
  return q;
}

/** Aciertos mínimos para dar un nivel como dominado (2 de 3 = 67 %). */
const PASS_RATIO = 2 / 3;

/**
 * Nivel = el más alto que cumple dos condiciones:
 * 1. Acertó al menos 2 de las 3 preguntas de ese nivel.
 * 2. Acertó al menos el 67 % de todas las preguntas hasta ese nivel inclusive.
 *
 * Un tropiezo aislado en un nivel intermedio no anula los aciertos en niveles
 * superiores (12/15 no puede dar A2). La condición 2 evita que aciertos al azar
 * en C1 den un nivel alto a quien falló la base (4 opciones → 25 % por azar).
 */
export function computeLevel(questions: Question[], answers: (number | null)[]) {
  const isCorrect = (i: number) => answers[i] === questions[i].answer;
  const score = questions.filter((_, i) => isCorrect(i)).length;
  const byLevel = {} as Record<Level, { correct: number; total: number }>;

  let level: Level = 'A1';
  let cumCorrect = 0;
  let cumTotal = 0;
  for (const lvl of LEVELS) {
    const idx = questions.flatMap((q, i) => (q.level === lvl ? [i] : []));
    if (!idx.length) continue;
    const correct = idx.filter(isCorrect).length;
    byLevel[lvl] = { correct, total: idx.length };
    cumCorrect += correct;
    cumTotal += idx.length;
    if (correct / idx.length >= PASS_RATIO && cumCorrect / cumTotal >= PASS_RATIO) level = lvl;
  }
  return { level, score, byLevel };
}

/** Curso del mismo nivel; si no hay, el más cercano (prefiere uno inferior). */
export function recommendCourse(level: Level, courses: CourseSummary[]) {
  const target = LEVELS.indexOf(level);
  return [...courses].sort((a, b) => {
    const da = LEVELS.indexOf(a.level) - target;
    const db = LEVELS.indexOf(b.level) - target;
    const score = (d: number) => (d === 0 ? 0 : d < 0 ? -d * 2 - 1 : d * 2);
    return score(da) - score(db) || b.students - a.students;
  })[0];
}

const KEY = 'ea_level';
export const savedLevel = (): Level | null => {
  try {
    const v = localStorage.getItem(KEY);
    return LEVELS.includes(v as Level) ? (v as Level) : null;
  } catch {
    return null;
  }
};
export const saveLevel = (l: Level) => {
  try {
    localStorage.setItem(KEY, l);
  } catch { /* noop */ }
};
