import { appUrl, bulletList, ctaButton, divider, emailLayout, greeting, heading, paragraph, plainText, securityNote } from './components.js';
import { defineTemplate } from './types.js';

type Data = { emailVerified: boolean };

const copy = {
  es: {
    subject: 'Bienvenido a English Academy',
    preheader: 'Tu cuenta está lista. Esto es lo que puedes hacer ahora.',
    title: 'Tu cuenta está lista',
    intro: 'Tu registro fue exitoso. Nos alegra tenerte aquí.',
    next: 'Esto es lo que sigue:',
    steps: [
      'Haz el test de nivel gratis (3 minutos) para saber por dónde empezar.',
      'Explora los cursos y prueba las lecciones gratuitas.',
      'Estudia desde el celular, a tu ritmo, y obtén tu certificado.',
    ],
    verify: 'Te enviamos un email aparte para verificar tu dirección. Revísalo cuando puedas.',
    cta: 'Ir a mi cuenta',
    security: '¿No creaste esta cuenta? Ignora este mensaje o escríbenos y la revisamos.',
  },
  en: {
    subject: 'Welcome to English Academy',
    preheader: "Your account is ready. Here's what you can do next.",
    title: 'Your account is ready',
    intro: "You've signed up successfully. We're glad you're here.",
    next: "Here's what happens next:",
    steps: [
      'Take the free level test (3 minutes) to know where to start.',
      'Browse the courses and try the free lessons.',
      'Study on your phone, at your own pace, and earn your certificate.',
    ],
    verify: "We sent you a separate email to verify your address. Check it when you can.",
    cta: 'Go to my account',
    security: "Didn't create this account? Ignore this email or contact us and we'll look into it.",
  },
};

export const welcomeEmail = defineTemplate<Data>({
  id: 'welcome',
  sample: { emailVerified: false },
  render(data, ctx) {
    const t = copy[ctx.locale];
    const url = appUrl('/mi-cuenta');
    const foot = { locale: ctx.locale, category: ctx.category, preferencesUrl: ctx.preferencesUrl, unsubscribeUrl: ctx.unsubscribeUrl };
    const html = emailLayout({
      ...foot,
      title: t.title,
      preheader: t.preheader,
      content: [
        heading(t.title),
        paragraph(greeting(ctx.name, ctx.locale)),
        paragraph(t.intro),
        paragraph(t.next),
        bulletList(t.steps),
        !data.emailVerified ? paragraph(t.verify, { muted: true, small: true }) : '',
        ctaButton({ href: url, label: t.cta }),
        divider(),
        securityNote(t.security),
      ].join(''),
    });
    const text = plainText(
      [greeting(ctx.name, ctx.locale), t.intro, `${t.next}\n${t.steps.map((s) => `- ${s}`).join('\n')}`, !data.emailVerified && t.verify, `${t.cta}: ${url}`, t.security],
      foot,
    );
    return { subject: t.subject, preheader: t.preheader, html, text };
  },
});
