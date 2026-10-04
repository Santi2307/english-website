import type { CourseSummary, Level } from '@/lib/types';

export type Question = { level: Level; prompt: string; options: string[]; answer: number };

/** 15 preguntas, 3 por nivel del MCER, ordenadas de menor a mayor dificultad. */
export const QUESTIONS: Question[] = [
  { level: 'A1', prompt: 'Hello! My name ___ Carlos.', options: ['am', 'is', 'are', 'be'], answer: 1 },
  { level: 'A1', prompt: 'They ___ from Medellín.', options: ['is', 'am', 'are', 'be'], answer: 2 },
  { level: 'A1', prompt: 'What time ___ you wake up?', options: ['do', 'does', 'are', 'is'], answer: 0 },
  { level: 'A2', prompt: 'Yesterday I ___ to the supermarket.', options: ['go', 'goes', 'went', 'going'], answer: 2 },
  { level: 'A2', prompt: 'Bogotá is ___ than Cartagena.', options: ['cold', 'colder', 'coldest', 'more cold'], answer: 1 },
  { level: 'A2', prompt: "I'm ___ to travel to Miami next month.", options: ['go', 'going', 'went', 'gone'], answer: 1 },
  { level: 'B1', prompt: 'I have lived here ___ 2019.', options: ['for', 'since', 'during', 'from'], answer: 1 },
  // Sin "stay" como opción: el condicional cero también sería correcto
  { level: 'B1', prompt: 'If it rains tomorrow, we ___ at home.', options: ['will stay', 'would stay', 'stayed', 'had stayed'], answer: 0 },
  { level: 'B1', prompt: 'The movie was ___ boring that I fell asleep.', options: ['such', 'too', 'so', 'very'], answer: 2 },
  { level: 'B2', prompt: 'If I ___ more time, I would learn French too.', options: ['have', 'had', 'will have', 'would have'], answer: 1 },
  { level: 'B2', prompt: 'The report ___ by the manager before the meeting.', options: ['was reviewed', 'reviewed', 'has reviewing', 'is review'], answer: 0 },
  { level: 'B2', prompt: 'I wish I ___ that email yesterday.', options: ["didn't send", "hadn't sent", "wouldn't send", "haven't sent"], answer: 1 },
  { level: 'C1', prompt: '___ had I arrived than the meeting started.', options: ['No sooner', 'Hardly', 'As soon', 'Barely'], answer: 0 },
  { level: 'C1', prompt: 'The proposal was turned ___ due to budget constraints.', options: ['off', 'down', 'over', 'out'], answer: 1 },
  { level: 'C1', prompt: 'She is ___ to be the best candidate for the role.', options: ['said', 'told', 'spoken', 'saying'], answer: 0 },
];

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

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
export function computeLevel(answers: (number | null)[]): { level: Level; score: number } {
  const isCorrect = (i: number) => answers[i] === QUESTIONS[i].answer;
  const score = QUESTIONS.filter((_, i) => isCorrect(i)).length;

  let level: Level = 'A1';
  let cumCorrect = 0;
  let cumTotal = 0;
  for (const lvl of LEVELS) {
    const idx = QUESTIONS.flatMap((q, i) => (q.level === lvl ? [i] : []));
    const correct = idx.filter(isCorrect).length;
    cumCorrect += correct;
    cumTotal += idx.length;
    if (correct / idx.length >= PASS_RATIO && cumCorrect / cumTotal >= PASS_RATIO) level = lvl;
  }
  return { level, score };
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
