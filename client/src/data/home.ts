/**
 * Copy del homepage narrativo. Cada bloque responde una sola pregunta:
 *
 *   HERO       ¿Qué es esto?               "Esto es para mí."
 *   STORY      ¿Qué se siente usarlo?      "Ah, así funciona."
 *   WHY        ¿Por qué me importa?        "Exacto, eso me pasa."
 *   DEMO       ¿Cómo me ayuda a mejorar?   "Entiendo el ciclo."
 *   SCENES     ¿Qué puedo practicar?       "Lo usaría de verdad."
 *   MEMORY     ¿Por qué es distinto?       "Recuerda en qué fallo."
 *   PROGRESS   ¿Voy a notar la mejora?     "Me veo mejorando."
 *   (FinalCta) ¿Qué hago ahora?            "Quiero probarlo."
 *
 * El detalle de cada tema vive en su página (/how-it-works, /practice, /pricing).
 * Las frases en inglés que se practican no se traducen.
 */
import type { Locale } from '@/hooks/useLocale';

type T = Record<Locale, string>;

/** Una respuesta real con un error típico y su versión natural. Se usa en todo el home. */
export const SAMPLE = {
  question: 'Tell me about yourself.',
  said: { before: 'I have experience working with customers ', error: 'since two years', after: '.' },
  fixed: { before: 'I have ', fix: 'two years of experience', after: ' working with customers.' },
  why: {
    es: '“Since” marca un punto de inicio, no una duración. Para hablar de tiempo acumulado, reformula.',
    en: '“Since” marks a starting point, not a length of time. To talk about time spent, rephrase it.',
  } as T,
};

export const HERO = {
  label: { es: 'Inglés para la vida real', en: 'English for real life' } as T,
  title: { es: ['Deja de estudiar inglés.', 'Empieza a hablarlo.'], en: ['Stop studying English.', 'Start speaking it.'] },
  sub: {
    es: 'Practica conversaciones reales, recibe feedback al instante y gana la confianza para usar el inglés cuando de verdad importa.',
    en: 'Practice real conversations, get instant feedback and build the confidence to use English when it actually matters.',
  } as T,
  cta: { es: 'Empieza a hablar', en: 'Start speaking' } as T,
  secondary: { es: 'Mira cómo funciona', en: 'See how it works' } as T,
  note: { es: 'Test de nivel gratis · Sin tarjeta', en: 'Free level test · No credit card' } as T,
  scene: {
    tag: { es: 'Entrevista de trabajo', en: 'Job interview' } as T,
    live: { es: 'En vivo', en: 'Live' } as T,
    interviewer: 'Sarah Kim',
    role: { es: 'Reclutadora · Videollamada', en: 'Recruiter · Video call' } as T,
    you: { es: 'Tú', en: 'You' } as T,
    listening: { es: 'Escuchando…', en: 'Listening…' } as T,
    feedback: { es: 'Gramática', en: 'Grammar' } as T,
    sayIt: { es: 'Dilo así', en: 'Say it like this' } as T,
    retry: { es: 'Otra vez', en: 'Try again' } as T,
    better: { es: 'Natural. Así suena un nativo.', en: 'Natural. That’s how a native says it.' } as T,
    saved: { es: 'Guardado en tu Error Bank', en: 'Saved to your Error Bank' } as T,
  },
  loop: [
    { es: 'Hablas', en: 'Speak' },
    { es: 'Te escucha', en: 'Listen' },
    { es: 'Te corrige', en: 'Correct' },
    { es: 'Repites', en: 'Retry' },
    { es: 'Mejoras', en: 'Improve' },
  ] as T[],
};

export const STORY = {
  steps: [
    { es: 'Lo que dijiste', en: 'What you said' },
    { es: 'Lo que notamos', en: 'What we noticed' },
    { es: 'Cómo suena natural', en: 'How it sounds natural' },
    { es: 'Lo que pasa después', en: 'What happens next' },
  ] as T[],
  lesson: { es: ['Tus errores se vuelven', 'tu próxima lección.'], en: ['Your mistakes become', 'your next lesson.'] },
  lessonSub: {
    es: 'Guardamos cada error para que vuelva en tu práctica, justo cuando estás por olvidarlo.',
    en: 'We keep every mistake so it comes back in your practice, right when you’re about to forget it.',
  } as T,
};

export const WHY = {
  a: { es: 'No necesitas otra clase de gramática.', en: "You don't need another grammar lesson." } as T,
  b: {
    es: ['Necesitas un lugar para practicar', 'antes de que la conversación sea real.'],
    en: ['You need somewhere to practice', 'before the conversation is real.'],
  },
  c: {
    es: 'Entiendes casi todo. Sabes qué quieres decir. Pero cuando te toca hablar, la frase no sale a tiempo. Eso no se arregla leyendo: se arregla practicando.',
    en: "You understand almost everything. You know what you want to say. But when it's your turn, the sentence doesn't come out in time. Reading won't fix that. Practice will.",
  } as T,
};

export const DEMO = {
  eyebrow: { es: 'Cómo practicas', en: 'How you practice' } as T,
  steps: [
    {
      title: { es: 'Habla con naturalidad', en: 'Speak naturally' } as T,
      body: { es: 'Responde en voz alta, como en la vida real. Sin opciones múltiples, sin escribir.', en: 'Answer out loud, like in real life. No multiple choice, no typing.' } as T,
    },
    {
      title: { es: 'Mira qué falló', en: 'See what went wrong' } as T,
      body: { es: 'Ves tu respuesta transcrita, el error marcado y por qué suena raro.', en: 'You see your answer transcribed, the mistake marked, and why it sounds off.' } as T,
    },
    {
      title: { es: 'Inténtalo otra vez', en: 'Try it again' } as T,
      body: { es: 'Repites la respuesta hasta que suena natural. Ahí es donde se fija.', en: "You repeat the answer until it sounds natural. That's where it sticks." } as T,
    },
  ],
  panel: {
    title: { es: 'Entrevista · Pregunta 1', en: 'Interview · Question 1' } as T,
    coach: 'Coach',
    you: { es: 'Tú', en: 'You' } as T,
    attempt: { es: 'Intento', en: 'Attempt' } as T,
    listening: { es: 'Te escucho…', en: 'Listening…' } as T,
    score: { es: 'Naturalidad', en: 'Naturalness' } as T,
    retry: { es: 'Responder otra vez', en: 'Answer again' } as T,
  },
  sample: {
    context: { es: 'Trabajo · Actualización del equipo', en: 'Work · Team update' } as T,
    question: 'How did your team do this year?',
    said: { before: 'Our team ', error: 'grow', after: ' from five to twelve people.' },
    fix: 'grew',
    note: {
      es: 'Hablas de algo que ya pasó este año: usa el pasado, “grew”.',
      en: 'You’re talking about something that already happened: use the past, “grew”.',
    } as T,
    natural: { es: 'Suena natural', en: 'Sounds natural' } as T,
  },
  more: { es: 'Así funciona por dentro', en: 'How it works in detail' } as T,
};

export type SceneId = 'interview' | 'work' | 'travel' | 'everyday';

export const SCENES = {
  eyebrow: { es: 'Situaciones reales', en: 'Real-life scenarios' } as T,
  title: { es: 'El inglés cambia según dónde estés.', en: 'English changes depending on where you are.' } as T,
  sub: {
    es: 'No es lo mismo hablar con una reclutadora que pedir un café. Practicas el tono correcto para cada momento.',
    en: "Talking to a recruiter isn't like ordering coffee. You practice the right tone for each moment.",
  } as T,
  theySay: { es: 'Te dicen', en: 'They say' } as T,
  tone: { es: 'Tono', en: 'Tone' } as T,
  youCould: { es: 'Podrías empezar con', en: 'You could start with' } as T,
  listen: { es: 'Escuchar', en: 'Listen' } as T,
  all: { es: 'Explorar todos los escenarios', en: 'Explore all scenarios' } as T,
  items: [
    {
      id: 'interview' as SceneId,
      path: '/practice/job-interview',
      name: { es: 'Entrevista de trabajo', en: 'Job interview' } as T,
      setting: { es: 'Videollamada con una reclutadora de EE. UU.', en: 'Video call with a US recruiter' } as T,
      line: 'Tell me about a time you solved a difficult problem.',
      tone: { es: 'Formal · Seguro', en: 'Formal · Confident' } as T,
      starts: ['In my last role, we had…', 'What I did first was…', 'As a result, we…'],
    },
    {
      id: 'work' as SceneId,
      path: '/practice/work',
      name: { es: 'En el trabajo', en: 'At work' } as T,
      setting: { es: 'Reunión del equipo después de un incidente', en: 'Team meeting after an incident' } as T,
      line: 'Can you walk us through what happened?',
      tone: { es: 'Claro · Colaborativo', en: 'Clear · Collaborative' } as T,
      starts: ['So, around 10 a.m. we noticed…', 'The root cause was…', 'Going forward, we’ll…'],
    },
    {
      id: 'travel' as SceneId,
      path: '/practice/travel',
      name: { es: 'De viaje', en: 'Travel' } as T,
      setting: { es: 'Migración en el aeropuerto de Miami', en: 'Immigration at Miami International' } as T,
      line: "What's the purpose of your visit?",
      tone: { es: 'Corto · Directo', en: 'Short · Direct' } as T,
      starts: ["I'm here on vacation.", "I'll be staying for two weeks.", "I'm staying at…"],
    },
    {
      id: 'everyday' as SceneId,
      path: '/practice/everyday-life',
      name: { es: 'Día a día', en: 'Everyday life' } as T,
      setting: { es: 'Una cafetería llena un lunes por la mañana', en: 'A busy coffee shop on a Monday morning' } as T,
      line: 'What can I get started for you?',
      tone: { es: 'Casual · Amable', en: 'Casual · Friendly' } as T,
      starts: ['Could I get a…?', "What's good here?", "That's it, thanks!"],
    },
  ],
};

export const MEMORY = {
  title: { es: ['Tus errores no desaparecen.', 'Nosotros los recordamos.'], en: ["Your mistakes don't disappear.", 'We remember them.'] },
  stages: {
    mistake: { es: 'Error', en: 'Mistake' } as T,
    memory: { es: 'Memoria', en: 'Memory' } as T,
    lesson: { es: 'Próxima práctica', en: 'Next practice' } as T,
  },
  mistake: { wrong: 'depends of', right: 'depends on' },
  repeated: { es: 'Repetido 4 veces', en: 'Repeated 4 times' } as T,
  bank: { es: 'Tu Error Bank', en: 'Your Error Bank' } as T,
  others: [
    { wrong: 'people is', right: 'people are' },
    { wrong: 'explain me', right: 'explain to me' },
  ],
  tomorrow: { es: 'La práctica de mañana incluirá esto.', en: "Tomorrow's practice will include this." } as T,
  session: { es: 'Mañana · 8 min', en: 'Tomorrow · 8 min' } as T,
  drill: { es: 'It ___ the weather.', en: 'It ___ the weather.' } as T,
  more: { es: 'Mira cómo funciona la práctica personalizada', en: 'See how personalized practice works' } as T,
};

export const PROGRESS = {
  eyebrow: { es: 'Este mes', en: 'This month' } as T,
  title: { es: 'Te ves mejorando.', en: 'You can see yourself getting better.' } as T,
  stats: [
    { value: '3h 42m', label: { es: 'hablando', en: 'speaking' } as T },
    { value: '+18', label: { es: 'English Score', en: 'English Score' } as T },
    { value: '14', label: { es: 'días seguidos hablando', en: 'day speaking streak' } as T },
    { value: '23', label: { es: 'errores superados', en: 'mistakes improved' } as T },
  ],
  example: { es: 'Mes de ejemplo de un estudiante B1', en: 'Example month of a B1 learner' } as T,
  more: { es: 'Mira tu progreso', en: 'See your progress' } as T,
};
