import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { seedContent } from './seed-content.js';
import { PrismaClient, type CourseBadge, type CourseGoal, type CourseLevel } from '@prisma/client';

const prisma = new PrismaClient();

type SeedCourse = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  goal: CourseGoal;
  priceCOP: number;
  compareAtCOP?: number;
  badge?: CourseBadge;
  coverColor: string;
  durationHours: number;
  instructorName: string;
  instructorBio: string;
  whatYouLearn: string[];
  modules: { title: string; lessons: string[] }[];
};

const courses: SeedCourse[] = [
  {
    slug: 'ingles-desde-cero',
    title: 'Inglés desde Cero',
    subtitle: 'De no saber nada a tener tus primeras conversaciones en 8 semanas',
    description:
      'El curso ideal si nunca has estudiado inglés o sientes que olvidaste todo. Aprendes vocabulario de la vida diaria, pronunciación y las estructuras esenciales con lecciones cortas de 10 minutos que puedes ver desde el celular.',
    level: 'A1',
    goal: 'CONVERSATION',
    priceCOP: 189_000,
    compareAtCOP: 299_000,
    badge: 'BESTSELLER',
    coverColor: '#4f46e5',
    durationHours: 24,
    instructorName: 'Laura Gómez',
    instructorBio: 'Licenciada en idiomas de la Universidad de Antioquia, 10 años enseñando a adultos principiantes.',
    whatYouLearn: [
      'Presentarte y hablar de tu vida diaria',
      'Pronunciar los sonidos que más cuestan a los hispanohablantes',
      'Usar el presente simple y continuo con confianza',
      'Entender conversaciones básicas en viajes y trabajo',
    ],
    modules: [
      { title: 'Primeros pasos', lessons: ['Saludos y presentaciones', 'El alfabeto y deletrear', 'Números y precios'] },
      { title: 'Mi vida diaria', lessons: ['Rutinas con presente simple', 'La familia', 'Comida y restaurantes'] },
      { title: 'Salir al mundo', lessons: ['Direcciones en la ciudad', 'En el aeropuerto', 'Tu primera conversación'] },
    ],
  },
  {
    slug: 'conversacion-fluida',
    title: 'Conversación Fluida',
    subtitle: 'Pierde el miedo a hablar y responde sin traducir en tu cabeza',
    description:
      'Para quienes entienden inglés pero se bloquean al hablar. Practicas con situaciones reales, frases hechas, phrasal verbs y técnicas de fluidez. Incluye ejercicios de pronunciación con reconocimiento de voz.',
    level: 'B1',
    goal: 'CONVERSATION',
    priceCOP: 249_000,
    compareAtCOP: 349_000,
    badge: 'NEW',
    coverColor: '#0ea5e9',
    durationHours: 30,
    instructorName: 'Daniel Ortiz',
    instructorBio: 'Profesor certificado CELTA. Vivió 6 años en Toronto y se especializa en fluidez oral.',
    whatYouLearn: [
      'Mantener conversaciones de 15 minutos sin bloquearte',
      '100 phrasal verbs que usan los nativos',
      'Contar historias usando pasado y presente perfecto',
      'Entender series y podcasts sin subtítulos',
    ],
    modules: [
      { title: 'Rompe el bloqueo', lessons: ['Por qué traducimos al hablar', 'Frases de relleno naturales', 'Small talk'] },
      { title: 'Cuenta historias', lessons: ['Pasado simple vs continuo', 'Presente perfecto en la práctica', 'Anécdotas'] },
      { title: 'Suena natural', lessons: ['Phrasal verbs esenciales', 'Connected speech', 'Debate guiado'] },
    ],
  },
  {
    slug: 'ingles-para-negocios',
    title: 'Inglés para Negocios',
    subtitle: 'Reuniones, emails y entrevistas de trabajo en inglés',
    description:
      'Diseñado para profesionales colombianos que trabajan (o quieren trabajar) con empresas extranjeras. Prepárate para entrevistas, presentaciones, negociaciones y comunicación escrita profesional.',
    level: 'B2',
    goal: 'BUSINESS',
    priceCOP: 349_000,
    compareAtCOP: 449_000,
    coverColor: '#059669',
    durationHours: 28,
    instructorName: 'Andrea Restrepo',
    instructorBio: 'MBA y ex-recruiter para empresas de tecnología en EE. UU. Ha preparado a más de 800 profesionales.',
    whatYouLearn: [
      'Superar entrevistas de trabajo en inglés',
      'Escribir emails profesionales claros',
      'Liderar reuniones y presentaciones',
      'Negociar salario y condiciones',
    ],
    modules: [
      { title: 'Entrevistas de trabajo', lessons: ['Tell me about yourself', 'Método STAR', 'Negociar salario'] },
      { title: 'Comunicación escrita', lessons: ['Emails que se responden', 'Slack y mensajes cortos', 'Reportes'] },
      { title: 'Reuniones', lessons: ['Abrir y moderar', 'Dar tu opinión con tacto', 'Presentaciones efectivas'] },
    ],
  },
  {
    slug: 'preparacion-ielts-toefl',
    title: 'Preparación IELTS / TOEFL',
    subtitle: 'Estrategias probadas para alcanzar la banda que necesitas',
    description:
      'Preparación intensiva para estudiar o migrar. Cubre las cuatro habilidades con simulacros cronometrados, rúbricas oficiales y retroalimentación de writing y speaking.',
    level: 'C1',
    goal: 'EXAM',
    priceCOP: 449_000,
    compareAtCOP: 590_000,
    coverColor: '#e11d48',
    durationHours: 40,
    instructorName: 'Michael Brown',
    instructorBio: 'Ex-examinador IELTS, nativo de Reino Unido, vive en Bogotá desde 2015.',
    whatYouLearn: [
      'Conocer el formato y las rúbricas oficiales',
      'Estrategias de reading y listening contra el reloj',
      'Estructurar ensayos de Task 1 y Task 2',
      'Responder speaking parte 2 con seguridad',
    ],
    modules: [
      { title: 'Diagnóstico y estrategia', lessons: ['Formato del examen', 'Simulacro diagnóstico', 'Plan de estudio'] },
      { title: 'Reading & Listening', lessons: ['Skimming y scanning', 'Tipos de pregunta', 'Simulacro cronometrado'] },
      { title: 'Writing & Speaking', lessons: ['Task 1: gráficas', 'Task 2: ensayo', 'Speaking parte 2'] },
    ],
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@englishacademy.co';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin12345!';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Administrador',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash(adminPassword, 12),
      emailVerifiedAt: new Date(),
    },
  });

  const demoHash = await bcrypt.hash('Demo12345!', 12);
  const students = await Promise.all(
    [
      { email: 'valentina@demo.co', name: 'Valentina Ríos' },
      { email: 'santiago@demo.co', name: 'Santiago Mejía' },
      { email: 'camila@demo.co', name: 'Camila Torres' },
    ].map((s) =>
      prisma.user.upsert({ where: { email: s.email }, update: {}, create: { ...s, passwordHash: demoHash, emailVerifiedAt: new Date() } }),
    ),
  );

  const reviewTexts = [
    'Las lecciones son cortas y las puedo ver en el TransMilenio. ¡Por fin entiendo el presente perfecto!',
    'Excelente profesor, muy claro. Los ejercicios de pronunciación me ayudaron muchísimo.',
    'Conseguí trabajo remoto gracias a este curso. Totalmente recomendado.',
  ];

  for (const c of courses) {
    const { modules, ...data } = c;
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (existing) {
      console.log(`↷ ${c.slug} ya existe, se omite`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        // Trailer público de ejemplo; reemplázalo por el tuyo desde el panel admin
        previewVideoUrl: null,
        modules: {
          create: modules.map((m, mi) => ({
            title: m.title,
            position: mi,
            lessons: {
              create: m.lessons.map((title, li) => ({
                title,
                position: li,
                durationMinutes: 8 + ((mi + li) % 4) * 3,
                description: `En esta lección: ${title.toLowerCase()}. Incluye ejercicios prácticos al final.`,
                isFreePreview: mi === 0 && li === 0,
              })),
            },
          })),
        },
      },
    });

    for (const [i, s] of students.entries()) {
      await prisma.enrollment.create({ data: { userId: s.id, courseId: course.id } });
      await prisma.review.create({
        data: { userId: s.id, courseId: course.id, rating: i === 1 ? 4 : 5, comment: reviewTexts[i] },
      });
    }
    console.log(`✓ Curso creado: ${c.title}`);
  }

  await prisma.coupon.upsert({
    where: { code: 'BIENVENIDO20' },
    update: {},
    create: { code: 'BIENVENIDO20', type: 'PERCENT', value: 20 },
  });
  await prisma.coupon.upsert({
    where: { code: 'TEST100' },
    update: {},
    create: { code: 'TEST100', type: 'PERCENT', value: 100, maxRedemptions: 50 },
  });

  await seedContent(prisma);

  console.log(`\n✓ Admin: ${adminEmail} / ${adminPassword}`);
  console.log('✓ Estudiantes demo: valentina@demo.co / Demo12345!');
  console.log('✓ Cupones: BIENVENIDO20 (20%), TEST100 (100%, para probar sin pagar)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
