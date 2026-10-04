import type { Level } from '@/lib/types';

/* ─── Calculadora de plan ─── */
export type StartLevel = 'A0' | Level;

/**
 * Horas guiadas acumuladas aproximadas para alcanzar cada nivel MCER
 * (orden de magnitud de las guías de Cambridge English; varía mucho por persona).
 */
export const GUIDED_HOURS: Record<StartLevel, number> = { A0: 0, A1: 90, A2: 190, B1: 375, B2: 550, C1: 750 };

export const START_LEVELS: StartLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2'];
export const GOAL_LEVELS: Level[] = ['A2', 'B1', 'B2', 'C1'];

/** Curso sugerido según la meta (slugs del seed). */
export const COURSE_FOR_GOAL: Record<Level, string> = {
  A1: 'ingles-desde-cero',
  A2: 'ingles-desde-cero',
  B1: 'conversacion-fluida',
  B2: 'conversacion-fluida',
  C1: 'preparacion-ielts-toefl',
};

export const PLAN = {
  eyebrow: { es: 'Planea tu meta', en: 'Plan your goal' },
  title: { es: '¿Cuánto te falta para hablar inglés?', en: 'How long until you speak English?' },
  subtitle: {
    es: 'Mueve los controles y mira una estimación honesta según el Marco Común Europeo.',
    en: 'Move the controls and get an honest estimate based on the CEFR.',
  },
  from: { es: 'Mi nivel hoy', en: 'My level today' },
  to: { es: 'Mi meta', en: 'My goal' },
  minutes: { es: 'Minutos al día', en: 'Minutes per day' },
  days: { es: 'Días por semana', en: 'Days per week' },
  zero: { es: 'Desde cero', en: 'From zero' },
  result: { es: 'Llegarías a tu meta en unos', en: 'You could reach your goal in about' },
  weeks: { es: 'semanas', en: 'weeks' },
  months: { es: 'meses', en: 'months' },
  hours: { es: 'horas de estudio', en: 'study hours' },
  reached: { es: 'Ya estás en ese nivel o más arriba. Escoge una meta más alta 🚀', en: "You're already there. Pick a higher goal 🚀" },
  suggested: { es: 'Empieza con', en: 'Start with' },
  savedLevel: { es: 'Usamos el nivel de tu test', en: 'Using your test result' },
  noLevel: { es: '¿No sabes tu nivel? Haz el test gratis', en: "Don't know your level? Take the free test" },
  disclaimer: {
    es: 'Estimación orientativa basada en horas guiadas de referencia por nivel. Cada persona avanza distinto: practicar hablando y escuchando fuera de la plataforma acelera mucho el proceso.',
    en: 'Indicative estimate based on reference guided hours per level. Everyone progresses differently; speaking and listening outside the platform speeds things up a lot.',
  },
};
