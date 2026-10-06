import { appUrl, callout, ctaButton, divider, emailLayout, greeting, hero, paragraph, paragraphHtml, plainText, securityNote, steps, subheading, textLink } from './components.js';
import { defineTemplate } from './types.js';

type Data = { emailVerified: boolean };

const copy = {
  es: {
    subject: 'Te damos la bienvenida a English Academy',
    preheader: 'Tu cuenta está lista. Así empiezas a hablar inglés desde hoy.',
    kicker: 'Bienvenida',
    title: 'Tu cuenta está lista',
    lead: 'Aquí aprendes inglés como se aprende de verdad: hablando. Practicas situaciones reales, recibes correcciones al instante y repasas tus propios errores hasta que dejan de serlo.',
    next: 'Tus primeros 15 minutos',
    steps: [
      { title: 'Descubre tu nivel', text: 'Un test de 3 minutos, del A1 al C1, para saber exactamente por dónde empezar.' },
      { title: 'Ten tu primera conversación', text: 'Elige una situación (una entrevista, un restaurante, una reunión) y responde en voz alta.' },
      { title: 'Elige tu ruta', text: 'Conversación, negocios o exámenes: un plan con lecciones cortas que puedes hacer desde el celular.' },
    ],
    cta: 'Empezar a hablar',
    test: 'Hacer el test de nivel',
    verifyTitle: 'Confirma tu email',
    verify: 'Te enviamos un email aparte para verificar tu dirección. Así podemos enviarte recibos, certificados y recuperar tu cuenta si lo necesitas.',
    tip: 'Consejo: 10 minutos al día valen más que 2 horas el fin de semana. La constancia es lo que te hace perder el miedo.',
    security: '¿No creaste esta cuenta? Ignora este mensaje o escríbenos y la revisamos.',
  },
  en: {
    subject: 'Welcome to English Academy',
    preheader: "Your account is ready. Here's how to start speaking English today.",
    kicker: 'Welcome',
    title: 'Your account is ready',
    lead: 'Here you learn English the way it actually sticks: by speaking. You practice real situations, get instant corrections and review your own mistakes until they stop being mistakes.',
    next: 'Your first 15 minutes',
    steps: [
      { title: 'Find your level', text: 'A 3-minute test, A1 to C1, so you know exactly where to start.' },
      { title: 'Have your first conversation', text: 'Pick a situation (a job interview, a restaurant, a meeting) and answer out loud.' },
      { title: 'Choose your path', text: 'Conversation, business or exams: a plan with short lessons you can do from your phone.' },
    ],
    cta: 'Start speaking',
    test: 'Take the level test',
    verifyTitle: 'Confirm your email',
    verify: 'We sent you a separate email to verify your address. That way we can send receipts and certificates, and help you recover your account if needed.',
    tip: 'Tip: 10 minutes a day beats 2 hours on the weekend. Consistency is what makes the fear go away.',
    security: "Didn't create this account? Ignore this email or contact us and we'll look into it.",
  },
};

export const welcomeEmail = defineTemplate<Data>({
  id: 'welcome',
  sample: { emailVerified: false },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const url = appUrl('/mi-cuenta');
    const testUrl = appUrl('/#test-de-nivel');
    const title = t.title;
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const html = emailLayout({
      ...foot,
      kicker: t.kicker,
      title,
      preheader: t.preheader,
      content: [
        hero({ icon: 'audio-lines-brand', title }),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.lead),
        subheading(t.next),
        steps(t.steps),
        ctaButton({ href: url, label: t.cta }),
        paragraphHtml(textLink(testUrl, t.test), { small: true }),
        !data.emailVerified ? callout({ title: t.verifyTitle, text: t.verify, tone: 'brand' }) : '',
        paragraph(t.tip, { muted: true, small: true }),
        divider(),
        securityNote(t.security),
      ].join(''),
    });
    const text = plainText(
      [
        greeting(ctx.name, ctx.locale),
        t.lead,
        `${t.next}:\n${t.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`).join('\n')}`,
        `${t.cta}: ${url}`,
        `${t.test}: ${testUrl}`,
        !data.emailVerified && `${t.verifyTitle}: ${t.verify}`,
        t.tip,
        t.security,
      ],
      foot,
    );
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
