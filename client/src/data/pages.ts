/** Copy de las páginas secundarias: cada una profundiza en un tema que el home solo insinúa. */
import type { Locale } from '@/hooks/useLocale';

type T = Record<Locale, string>;

export const PAGES = {
  how: {
    seo: { es: 'Cómo funciona · English Academy', en: 'How it works · English Academy' } as T,
    eyebrow: { es: 'Cómo funciona', en: 'How it works' } as T,
    title: { es: 'Un lugar para entrenar antes de la conversación real.', en: 'A place to train before the real conversation.' } as T,
    lead: {
      es: 'Hablas, ves qué falló, lo intentas otra vez. La plataforma recuerda tus errores y los convierte en tu próxima práctica.',
      en: 'You speak, see what went wrong, and try again. The platform remembers your mistakes and turns them into your next practice.',
    } as T,
  },
  practice: {
    seo: { es: 'Practicar · Escenarios reales · English Academy', en: 'Practice · Real-life scenarios · English Academy' } as T,
    eyebrow: { es: 'Practicar', en: 'Practice' } as T,
    title: { es: 'Elige la conversación que te pone nervioso.', en: 'Pick the conversation that makes you nervous.' } as T,
    lead: {
      es: 'Entrevistas, reuniones, viajes, el día a día. Practícalas aquí, donde equivocarte no cuesta nada.',
      en: "Interviews, meetings, travel, everyday life. Practice them here, where getting it wrong costs nothing.",
    } as T,
    all: { es: 'Todas', en: 'All' } as T,
  },
  pricing: {
    seo: { es: 'Precios · English Academy', en: 'Pricing · English Academy' } as T,
    eyebrow: { es: 'Precios', en: 'Pricing' } as T,
    title: { es: 'Paga una vez. Practica para siempre.', en: 'Pay once. Practice for good.' } as T,
    lead: {
      es: 'Rutas de aprendizaje con acceso de por vida, en pesos, con PSE, Nequi o tarjeta. 7 días de garantía.',
      en: 'Learning paths with lifetime access, in pesos, with PSE, Nequi or card. 7-day guarantee.',
    } as T,
  },
};
