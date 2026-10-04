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
  | { type: 'truefalse'; statement: string; answer: boolean; explanation?: string }
  | { type: 'dictation'; audio: string; translation?: string }
  | { type: 'fix'; sentence: string; answers: string[]; explanation?: string };

export type Reading = {
  title: string;
  paragraphs: string[];
  glossary: { en: string; es: string }[];
  questions: { q: string; options: string[]; answer: number; explanation?: string }[];
};
export type Mistake = { wrong: string; right: string; why: string };
export type Pronunciation = { focus: string; tip: string; words: { word: string; sounds: string; es?: string }[] };
export type Culture = { title: string; body: string };
export type Mission = { title: string; task: string; steps: string[]; model?: string };

export type LessonContent = {
  objective: string;
  slides: Slide[];
  vocabulary: VocabItem[];
  grammar?: Grammar;
  mistakes?: Mistake[];
  pronunciation?: Pronunciation;
  dialogue?: Dialogue;
  reading?: Reading;
  culture?: Culture;
  exercises: Exercise[];
  mission?: Mission;
};

export type LessonContentResponse = { lessonId: string; content: LessonContent | null; bestScore: number | null };

/** Compara respuestas escritas sin castigar mayúsculas, espacios ni apóstrofes tipográficos. */
export const normalizeAnswer = (s: string) =>
  s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.!?¿¡,]/g, '').replace(/\s+/g, ' ').trim();

/** Igual que normalizeAnswer pero respetando mayúsculas (para errores de mayúscula). */
const normalizeCase = (s: string) => s.replace(/[’‘`]/g, "'").replace(/[.!?¿¡,]/g, '').replace(/\s+/g, ' ').trim();

/**
 * ¿La corrección es válida? Normalmente no castiga mayúsculas, salvo cuando el error
 * a corregir ES la mayúscula (p. ej. "colombian" → "Colombian").
 */
export function isFixCorrect(wrong: string, answers: string[], typed: string) {
  return answers.some((a) => {
    if (normalizeAnswer(a) !== normalizeAnswer(typed)) return false;
    return normalizeAnswer(a) !== normalizeAnswer(wrong) || normalizeCase(a) === normalizeCase(typed);
  });
}

/** ¿El estudiante todavía no ha cambiado nada? */
export const isUnchanged = (original: string, typed: string) => normalizeCase(original) === normalizeCase(typed);

/** Mezcla estable dentro de un render (Fisher–Yates). */
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** % de palabras del objetivo presentes, en orden aproximado (para dictado y corrección). */
export function wordAccuracy(target: string, typed: string) {
  const t = normalizeAnswer(target).split(' ').filter(Boolean);
  const pool = normalizeAnswer(typed).split(' ').filter(Boolean);
  const words = t.map((w) => {
    const i = pool.indexOf(w);
    if (i >= 0) pool.splice(i, 1);
    return { word: w, ok: i >= 0 };
  });
  const extra = pool.length;
  const hits = words.filter((w) => w.ok).length;
  return { words, pct: t.length ? Math.round((hits / (t.length + extra)) * 100) : 0 };
}
