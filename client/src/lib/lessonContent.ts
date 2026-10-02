/** Espejo de server/src/lessonContent/schema.ts (el servidor valida; aquí solo tipamos). */
export type Slide = { en: string; es: string; note?: string };
export type VocabItem = { en: string; es: string; example: string; emoji?: string };
export type Grammar = { title: string; explanation: string; examples: { en: string; es: string }[]; tip?: string };
export type Dialogue = { title: string; lines: { speaker: string; en: string; es: string }[] };

export type Exercise =
  | { type: 'choice'; prompt: string; options: string[]; answer: number; explanation?: string }
  | { type: 'fill'; sentence: string; answers: string[]; hint?: string }
  | { type: 'order'; words: string[]; translation: string }
  | { type: 'match'; prompt?: string; pairs: [string, string][] }
  | { type: 'listen'; audio: string; options: string[]; answer: number }
  | { type: 'speak'; phrase: string; translation: string }
  | { type: 'truefalse'; statement: string; answer: boolean; explanation?: string };

export type LessonContent = {
  objective: string;
  slides: Slide[];
  vocabulary: VocabItem[];
  grammar?: Grammar;
  dialogue?: Dialogue;
  exercises: Exercise[];
};

export type LessonContentResponse = { lessonId: string; content: LessonContent | null; bestScore: number | null };

/** Compara respuestas escritas sin castigar mayúsculas, espacios ni apóstrofes tipográficos. */
export const normalizeAnswer = (s: string) =>
  s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?¿¡,]/g, '').replace(/\s+/g, ' ').trim();

/** Mezcla estable dentro de un render (Fisher–Yates). */
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
