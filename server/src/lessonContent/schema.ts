import { z } from 'zod';

/**
 * Contenido interactivo de una lección. Las explicaciones van en español
 * (el público es hispanohablante) y el material de práctica en inglés.
 */
const text = (max = 600) => z.string().min(1).max(max);

const slide = z.object({
  en: text(200),
  es: text(240),
  /** Pista breve que se muestra bajo la frase */
  note: text(200).optional(),
});

const vocab = z.object({
  en: text(80),
  es: text(80),
  example: text(200),
  emoji: z.string().max(8).optional(),
});

const grammar = z.object({
  title: text(120),
  explanation: text(1200),
  examples: z.array(z.object({ en: text(200), es: text(240) })).min(1).max(8),
  tip: text(400).optional(),
});

const dialogue = z.object({
  title: text(120),
  lines: z
    .array(z.object({ speaker: text(30), en: text(300), es: text(320) }))
    .min(2)
    .max(14),
});

const choice = z.object({
  type: z.literal('choice'),
  prompt: text(400),
  options: z.array(text(200)).min(2).max(5),
  answer: z.number().int().min(0),
  explanation: text(400).optional(),
});

const fill = z.object({
  type: z.literal('fill'),
  /** Usa ___ para el espacio en blanco */
  sentence: text(300).refine((s) => s.includes('___'), 'Debe incluir ___'),
  /** Respuestas aceptadas (sin distinguir mayúsculas) */
  answers: z.array(text(80)).min(1).max(6),
  hint: text(200).optional(),
});

const order = z.object({
  type: z.literal('order'),
  /** Palabras en el orden correcto; la interfaz las desordena */
  words: z.array(text(40)).min(3).max(14),
  translation: text(300),
});

const match = z.object({
  type: z.literal('match'),
  prompt: text(200).optional(),
  pairs: z.array(z.tuple([text(80), text(80)])).min(3).max(6),
});

const listen = z.object({
  type: z.literal('listen'),
  /** Frase que se reproduce con voz */
  audio: text(300),
  options: z.array(text(300)).min(2).max(4),
  answer: z.number().int().min(0),
});

const speak = z.object({
  type: z.literal('speak'),
  phrase: text(200),
  translation: text(240),
});

const truefalse = z.object({
  type: z.literal('truefalse'),
  statement: text(300),
  answer: z.boolean(),
  explanation: text(300).optional(),
});

/** Dictado: se reproduce la frase y el estudiante la escribe. */
const dictation = z.object({
  type: z.literal('dictation'),
  audio: text(200),
  translation: text(240).optional(),
});

/** Corrección de errores: frase con un error típico; el estudiante la reescribe bien. */
const fix = z.object({
  type: z.literal('fix'),
  sentence: text(240),
  /** Versiones correctas aceptadas */
  answers: z.array(text(240)).min(1).max(4),
  explanation: text(400).optional(),
});

export const exerciseSchema = z
  .discriminatedUnion('type', [choice, fill, order, match, listen, speak, truefalse, dictation, fix])
  .superRefine((ex, ctx) => {
    if ((ex.type === 'choice' || ex.type === 'listen') && ex.answer >= ex.options.length) {
      ctx.addIssue({ code: 'custom', message: 'answer fuera de rango', path: ['answer'] });
    }
  });

/** Lectura con preguntas de comprensión. */
const reading = z.object({
  title: text(120),
  /** Párrafos en inglés */
  paragraphs: z.array(text(900)).min(1).max(6),
  glossary: z.array(z.object({ en: text(60), es: text(120) })).max(10).default([]),
  questions: z
    .array(z.object({ q: text(300), options: z.array(text(200)).min(2).max(4), answer: z.number().int().min(0), explanation: text(300).optional() }))
    .min(1)
    .max(6),
});

/** Errores típicos de hispanohablantes. */
const mistake = z.object({ wrong: text(200), right: text(200), why: text(400) });

/** Laboratorio de pronunciación. */
const pronunciation = z.object({
  focus: text(120),
  tip: text(600),
  words: z.array(z.object({ word: text(80), sounds: text(80), es: text(120).optional() })).min(2).max(10),
});

const culture = z.object({ title: text(120), body: text(900) });

/** Reto para aplicar la lección en la vida real, con respuesta modelo. */
const mission = z.object({
  title: text(120),
  task: text(600),
  steps: z.array(text(200)).max(5).default([]),
  model: text(1200).optional(),
});

export const lessonContentSchema = z.object({
  objective: text(300),
  slides: z.array(slide).min(2).max(10),
  vocabulary: z.array(vocab).max(20).default([]),
  grammar: grammar.optional(),
  mistakes: z.array(mistake).max(6).default([]),
  pronunciation: pronunciation.optional(),
  dialogue: dialogue.optional(),
  reading: reading.optional(),
  culture: culture.optional(),
  exercises: z.array(exerciseSchema).min(1).max(30),
  mission: mission.optional(),
}).superRefine((c, ctx) => {
  c.reading?.questions.forEach((q, i) => {
    if (q.answer >= q.options.length) ctx.addIssue({ code: 'custom', message: 'answer fuera de rango', path: ['reading', 'questions', i, 'answer'] });
  });
});

export type LessonContent = z.infer<typeof lessonContentSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
/** Para escribir contenido con autocompletado (el seed lo valida antes de guardar). */
export type LessonContentInput = z.input<typeof lessonContentSchema>;
