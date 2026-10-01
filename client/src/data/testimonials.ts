// Testimonios y fotos de ejemplo: reemplázalos por historias reales (con autorización) antes de lanzar.
export type Testimonial = {
  name: string;
  city: string;
  role: string;
  quote: string;
  course: string;
  rating: number;
  photo?: string;
  // Si hay video, se muestra la tarjeta con play. Agrega tus archivos en /public/videos.
  video?: { src: string; poster?: string };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Valentina Ríos',
    photo: '/images/people/student-valentina.webp',
    city: 'Medellín',
    role: 'Desarrolladora de software',
    quote: 'En 4 meses pasé de congelarme en las dailies a presentar demos en inglés. Hoy trabajo remoto para una empresa de EE. UU.',
    course: 'Inglés para Negocios',
    rating: 5,
    video: { src: '/videos/testimonio-valentina.mp4' },
  },
  {
    name: 'Andrés Castaño',
    photo: '/images/people/student-andres.webp',
    city: 'Bogotá',
    role: 'Estudiante universitario',
    quote: 'Las lecciones de 10 minutos me salvaron. Estudio en el TransMilenio y ya tengo racha de 60 días.',
    course: 'Conversación Fluida',
    rating: 5,
  },
  {
    name: 'María José Pérez',
    photo: '/images/people/student-mariajose.webp',
    city: 'Barranquilla',
    role: 'Enfermera',
    quote: 'Necesitaba 7.0 en IELTS para mi proceso en Canadá. Lo logré en el primer intento gracias a los simulacros.',
    course: 'Preparación IELTS / TOEFL',
    rating: 5,
    video: { src: '/videos/testimonio-mariajose.mp4' },
  },
  {
    name: 'Jorge Ramírez',
    photo: '/images/people/student-jorge.webp',
    city: 'Cali',
    role: 'Dueño de restaurante',
    quote: 'Empecé de cero a los 45 años. Ahora atiendo a los turistas en inglés sin miedo.',
    course: 'Inglés desde Cero',
    rating: 5,
  },
];
