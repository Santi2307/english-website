import type { Level } from '@/lib/types';

/**
 * Copy y datos de muestra de las páginas secundarias (/how-it-works, /practice,
 * /pricing). El copy del home narrativo vive en data/home.ts.
 *
 * Las vistas del producto (coach, Error Bank, progreso) usan datos de ejemplo:
 * representan hacia dónde va la plataforma, todavía no son funcionalidad real.
 * Las frases en inglés que el usuario practica no se traducen.
 */
export type Locale = 'es' | 'en';
type T = Record<Locale, string>;

export const HERO = {
  eyebrow: { es: 'Práctica de conversación para hispanohablantes', en: 'Speaking practice for Spanish speakers' },
  title: { es: ['Deja de estudiar inglés.', 'Empieza a hablarlo.'], en: ['Stop studying English.', 'Start speaking it.'] },
  subtitle: {
    es: 'Practica conversaciones reales, recibe feedback al instante y gana la confianza para usar tu inglés en el trabajo, en entrevistas, de viaje y en tu día a día.',
    en: 'Practice real conversations, get instant feedback, and build the confidence to use English at work, in interviews, while traveling, and in everyday life.',
  },
  cta: { es: 'Empieza a hablar', en: 'Start speaking' },
  secondary: { es: 'Mira cómo funciona', en: 'See how it works' },
  note: { es: 'Test de nivel gratis · Sin tarjeta', en: 'Free level test · No credit card' },
};



export const HOW = {
  eyebrow: { es: 'Cómo funciona', en: 'How it works' },
  title: { es: 'Practica hasta que hablar se sienta normal.', en: 'Practice until speaking feels normal.' },
  steps: [
    { title: { es: 'Habla', en: 'Speak' }, body: { es: 'Elige una situación real y empieza a hablar.', en: 'Choose a real-life situation and start talking.' } },
    { title: { es: 'Recibe feedback', en: 'Get feedback' }, body: { es: 'Ve exactamente qué hiciste bien y qué tienes que mejorar.', en: 'See exactly what you did well and what needs improvement.' } },
    { title: { es: 'Mejora', en: 'Improve' }, body: { es: 'Tus lecciones se adaptan solas a tus errores.', en: 'Your lessons automatically adapt to your mistakes.' } },
  ],
  screens: {
    choose: { es: 'Elige una situación', en: 'Choose a situation' },
    listening: { es: 'Te escucho…', en: 'Listening…' },
    transcript: { es: 'Lo que dijiste', en: 'What you said' },
    next: { es: 'Tu próxima sesión', en: 'Your next session' },
    nextSub: { es: 'Armada con tus últimas 3 conversaciones', en: 'Built from your last 3 conversations' },
    drills: { es: 'ejercicios', en: 'drills' },
    roleplay: { es: 'juego de roles', en: 'role-play' },
    start: { es: 'Empezar · 12 min', en: 'Start · 12 min' },
  },
};

export type Mistake = { wrong: string; right: string; tag: T; count: number; trend: number[]; status: 'work' | 'improving' | 'fixed' };

export const ERROR_BANK = {
  eyebrow: { es: 'Error Bank', en: 'Error Bank' },
  title: { es: 'Tu coach de inglés no olvida.', en: 'Your English coach remembers.' },
  body: {
    es: 'Cada conversación alimenta tu Error Bank. Los errores que repites se convierten en la práctica que recibes después.',
    en: 'Every conversation adds to your Error Bank. The mistakes you repeat become the practice you get next.',
  },
  tagline: { es: 'Tus errores se vuelven tu próxima lección.', en: 'Your mistakes become your next lesson.' },
  heading: { es: 'Tus errores frecuentes', en: 'Your recurring mistakes' },
  sub: { es: 'Últimos 30 días', en: 'Last 30 days' },
  status: {
    work: { es: 'Por mejorar', en: 'Needs work' },
    improving: { es: 'Mejorando', en: 'Improving' },
    fixed: { es: 'Corregido', en: 'Fixed' },
  },
  practice: { es: 'Practicar los 3 primeros · 5 min', en: 'Practice the top 3 · 5 min' },
  mistakes: [
    { wrong: 'depends of', right: 'depends on', tag: { es: 'Preposición', en: 'Preposition' }, count: 9, trend: [3, 2, 2, 1, 1], status: 'work' },
    { wrong: 'I have 22 years', right: 'I am 22 years old', tag: { es: 'Edad', en: 'Age' }, count: 6, trend: [3, 1, 1, 1, 0], status: 'improving' },
    { wrong: 'people is', right: 'people are', tag: { es: 'Concordancia', en: 'Agreement' }, count: 4, trend: [2, 1, 1, 0, 0], status: 'improving' },
    { wrong: 'explain me', right: 'explain to me', tag: { es: 'Estructura', en: 'Structure' }, count: 3, trend: [1, 1, 1, 0, 0], status: 'fixed' },
  ] as Mistake[],
};

/** Categorías de práctica: cada una tiene su página en /practice/:category. */
export type PracticeCategory = 'job-interview' | 'work' | 'travel' | 'everyday-life';

export const PRACTICE_CATEGORIES: { id: PracticeCategory; name: T }[] = [
  { id: 'job-interview', name: { es: 'Entrevistas', en: 'Job interviews' } },
  { id: 'work', name: { es: 'Trabajo', en: 'Work' } },
  { id: 'travel', name: { es: 'Viajes', en: 'Travel' } },
  { id: 'everyday-life', name: { es: 'Día a día', en: 'Everyday life' } },
];

export type Scenario = { id: string; category: PracticeCategory; name: T; level: Level; minutes: number; context: T; opener: string; phrases: string[] };

export const SCENARIOS = {
  eyebrow: { es: 'Practicar', en: 'Practice' },
  title: { es: 'Practica las conversaciones que de verdad importan.', en: 'Practice the conversations that actually matter.' },
  sub: { es: 'Aprende el inglés que sí vas a usar.', en: "Learn the English you'll actually use." },
  theySay: { es: 'Te dicen', en: 'They say' },
  phrases: { es: 'Frases que vas a practicar', en: "Phrases you'll practice" },
  start: { es: 'Empezar esta conversación', en: 'Start this conversation' },
  items: [
    {
      id: 'interview', category: 'job-interview', name: { es: 'Entrevista de trabajo', en: 'Job interview' }, level: 'B1', minutes: 8,
      context: { es: 'Una reclutadora de una empresa de EE. UU. Videollamada, primera ronda.', en: 'A recruiter at a US company. Video call, first round.' },
      opener: "Thanks for joining. Let's start with you: tell me a bit about your background.",
      phrases: ["I've been working in…", 'What I enjoy most is…', "One thing I'm improving is…"],
    },
    {
      id: 'first-day', category: 'work', name: { es: 'Primer día de trabajo', en: 'First day at work' }, level: 'A2', minutes: 6,
      context: { es: 'Tu nueva jefa te muestra la oficina.', en: 'Your new manager shows you around.' },
      opener: 'Welcome aboard! Did you find the office okay?',
      phrases: ["Nice to meet you, I'm…", 'Who should I ask about…?', "I'm looking forward to…"],
    },
    {
      id: 'complaint', category: 'work', name: { es: 'Cliente molesto', en: 'Customer complaint' }, level: 'B1', minutes: 7,
      context: { es: 'Un cliente llama porque su pedido no ha llegado.', en: "A customer calls because their order hasn't arrived." },
      opener: "I ordered this two weeks ago and it still hasn't arrived.",
      phrases: ['I completely understand.', 'Let me check that for you.', "Here's what I can do…"],
    },
    {
      id: 'airport', category: 'travel', name: { es: 'Aeropuerto', en: 'Airport' }, level: 'A2', minutes: 5,
      context: { es: 'Oficial de migración en el aeropuerto de Miami.', en: 'Immigration officer at Miami International.' },
      opener: "What's the purpose of your visit?",
      phrases: ["I'm here on vacation.", "I'll be staying for…", "I'm staying at…"],
    },
    {
      id: 'food', category: 'everyday-life', name: { es: 'Pedir comida', en: 'Ordering food' }, level: 'A1', minutes: 4,
      context: { es: 'Un diner lleno en Nueva York.', en: 'A busy diner in New York.' },
      opener: 'Hi there! Are you ready to order?',
      phrases: ['Could I get…?', 'What do you recommend?', 'Can I have the check, please?'],
    },
    {
      id: 'meeting', category: 'work', name: { es: 'Reunión', en: 'Meeting' }, level: 'B2', minutes: 8,
      context: { es: 'Llamada semanal del equipo. Te toca dar tu actualización.', en: "Weekly team call. It's your turn to give an update." },
      opener: "Okay, let's hear your update. How's the project going?",
      phrases: ["We're on track to…", 'The main blocker is…', "I'll follow up by…"],
    },
    {
      id: 'sales', category: 'work', name: { es: 'Llamada de ventas', en: 'Sales call' }, level: 'B2', minutes: 7,
      context: { es: 'Un posible cliente duda por el precio.', en: 'A potential client is unsure about the price.' },
      opener: 'Honestly, this seems more expensive than other options.',
      phrases: ["That's a fair point.", 'What you get is…', 'Would it help if…?'],
    },
    {
      id: 'small-talk', category: 'everyday-life', name: { es: 'Charla casual', en: 'Small talk' }, level: 'A2', minutes: 5,
      context: { es: 'Pausa del café con un colega.', en: 'Coffee break with a colleague.' },
      opener: 'Any plans for the weekend?',
      phrases: ['Not much, just…', 'How about you?', "I've been meaning to…"],
    },
  ] as Scenario[],
};

export const PROGRESS = {
  eyebrow: { es: 'Progreso', en: 'Progress' },
  title: { es: 'Un progreso que puedes medir.', en: 'Progress you can measure.' },
  body: {
    es: 'Un solo puntaje para tu inglés, dividido por habilidad. Sube cuando practicas hablando.',
    en: 'One score for your English, broken down by skill. It goes up when you practice speaking.',
  },
  score: 647,
  delta: { es: '+23 esta semana', en: '+23 this week' },
  history: [571, 584, 590, 603, 611, 618, 624, 647],
  weeks: { es: 'Últimas 8 semanas', en: 'Last 8 weeks' },
  skills: [
    { label: { es: 'Hablar', en: 'Speaking' }, value: 610 },
    { label: { es: 'Escuchar', en: 'Listening' }, value: 700 },
    { label: { es: 'Gramática', en: 'Grammar' }, value: 620 },
    { label: { es: 'Pronunciación', en: 'Pronunciation' }, value: 645 },
  ],
  time: { label: { es: 'Tiempo hablando este mes', en: 'Speaking time this month' }, value: { es: '4 h 37 min', en: '4h 37min' } },
  streak: { label: { es: 'Racha hablando', en: 'Speaking streak' }, value: 18, unit: { es: 'días', en: 'days' } },
};

export const PATHS = {
  eyebrow: { es: 'Precios', en: 'Pricing' },
  title: { es: '¿Necesitas reforzar las bases?', en: 'Need the foundations first?' },
  sub: {
    es: 'Rutas de aprendizaje con lecciones, ejercicios y certificado. Un solo pago, acceso de por vida.',
    en: 'Learning paths with lessons, exercises and a certificate. One payment, lifetime access.',
  },
  lessons: { es: 'h de práctica', en: 'h of practice' },
  view: { es: 'Ver ruta', en: 'View path' },
  all: { es: 'Ver todas las rutas', en: 'See all paths' },
  guarantee: { es: 'Precios en COP. Pago seguro con tarjeta. 7 días de garantía.', en: 'Prices in COP. Secure card payment. 7-day guarantee.' },
};

export const FINAL = {
  title: { es: 'Equivócate aquí, no en la entrevista.', en: 'Make your mistakes here, not in the interview.' },
  sub: { es: 'Empieza con un test de nivel gratis. Toma tres minutos.', en: 'Start with a free level test. It takes three minutes.' },
  test: { es: 'Hacer el test de nivel', en: 'Take the level test' },
};
