import type { Locale } from './i18nTypes';

export type Teacher = {
  name: string;
  photo: string;
  courseSlug: string;
  role: Record<Locale, string>;
  quote: Record<Locale, string>;
};

/**
 * Coinciden con los instructores de los cursos del seed.
 * Fotos de stock (ver public/images/people/CREDITS.md): reemplázalas por las de tus profes reales.
 */
export const TEACHERS: Teacher[] = [
  {
    name: 'Laura Gómez',
    photo: '/images/people/teacher-laura.webp',
    courseSlug: 'ingles-desde-cero',
    role: { es: 'Inglés desde cero · Medellín', en: 'English from scratch · Medellín' },
    quote: {
      es: 'Yo también me bloqueaba al hablar. Por eso enseño paso a paso y sin afán.',
      en: 'I used to freeze when speaking too. That’s why I teach step by step, no rush.',
    },
  },
  {
    name: 'Daniel Ortiz',
    photo: '/images/people/teacher-daniel.webp',
    courseSlug: 'conversacion-fluida',
    role: { es: 'Conversación · Bogotá', en: 'Conversation · Bogotá' },
    quote: {
      es: 'Viví seis años en Toronto. Te enseño el inglés que de verdad se habla en la calle.',
      en: 'I lived in Toronto for six years. I teach the English people actually speak.',
    },
  },
  {
    name: 'Andrea Restrepo',
    photo: '/images/people/teacher-andrea.webp',
    courseSlug: 'ingles-para-negocios',
    role: { es: 'Inglés para negocios · Cali', en: 'Business English · Cali' },
    quote: {
      es: 'He entrevistado a cientos de candidatos. Sé qué buscan los reclutadores.',
      en: 'I’ve interviewed hundreds of candidates. I know what recruiters look for.',
    },
  },
  {
    name: 'Michael Brown',
    photo: '/images/people/teacher-michael.webp',
    courseSlug: 'preparacion-ielts-toefl',
    role: { es: 'IELTS / TOEFL · Bogotá', en: 'IELTS / TOEFL · Bogotá' },
    quote: {
      es: 'Fui examinador IELTS. Te muestro exactamente qué evalúan y cómo prepararte.',
      en: 'I was an IELTS examiner. I’ll show you exactly what they assess and how to prepare.',
    },
  },
];
