
/** Textos de las secciones nuevas del home, en los dos idiomas (mismo patrón que teachers.ts). */
type L = { es: string; en: string };

/* ─── Frase del día ─── Una por día del año, en rotación. */
export const PHRASES: { en: string; es: string; tip: L }[] = [
  { en: "I'd like a coffee to go, please.", es: 'Quisiera un café para llevar, por favor.', tip: { es: '"To go" = para llevar.', en: '"To go" means takeaway.' } },
  { en: 'Could you say that again, please?', es: '¿Podrías repetirlo, por favor?', tip: { es: 'Tu salvavidas en cualquier conversación.', en: 'Your lifesaver in any conversation.' } },
  { en: "I'm looking forward to it!", es: '¡Tengo muchas ganas!', tip: { es: 'Suena natural y entusiasta.', en: 'Sounds natural and enthusiastic.' } },
  { en: 'It depends on the price.', es: 'Depende del precio.', tip: { es: 'Es "depend on", nunca "depend of".', en: 'Always "depend on", never "depend of".' } },
  { en: "I've been working here for two years.", es: 'Llevo dos años trabajando aquí.', tip: { es: 'Así se dice "llevo… tiempo".', en: 'How to talk about duration.' } },
  { en: 'Sorry, I didn\'t catch that.', es: 'Perdón, no te entendí.', tip: { es: 'Más natural que "I don\'t understand".', en: 'More natural than "I don\'t understand".' } },
  { en: 'What do you do for a living?', es: '¿A qué te dedicas?', tip: { es: 'Pregunta por tu trabajo, no por lo que haces ahora.', en: 'Asks about your job.' } },
  { en: 'Can I get the check, please?', es: '¿Me trae la cuenta, por favor?', tip: { es: 'En EE. UU. la cuenta es "check".', en: 'In the US the bill is the "check".' } },
  { en: "Let's keep in touch!", es: '¡Sigamos en contacto!', tip: { es: 'Para despedirte de alguien que acabas de conocer.', en: 'To say bye to someone you just met.' } },
  { en: 'I see your point, but…', es: 'Entiendo tu punto, pero…', tip: { es: 'La forma amable de no estar de acuerdo.', en: 'The polite way to disagree.' } },
  { en: "I'm currently living in Medellín.", es: 'Actualmente vivo en Medellín.', tip: { es: '"Actualmente" es "currently", no "actually".', en: '"Actually" is a false friend for Spanish speakers.' } },
  { en: 'Nice to meet you too!', es: '¡Igualmente, mucho gusto!', tip: { es: '"Too" solo para responder.', en: 'Use "too" only when replying.' } },
  { en: 'Do you have any vegetarian options?', es: '¿Tienen opciones vegetarianas?', tip: { es: 'Útil en cualquier restaurante.', en: 'Useful in any restaurant.' } },
  { en: 'Just a quick question…', es: 'Solo una pregunta rápida…', tip: { es: 'Perfecto para Slack o Teams.', en: 'Perfect for Slack or Teams.' } },
];

export function phraseOfTheDay(date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86_400_000);
  return PHRASES[day % PHRASES.length];
}

/* ─── Situaciones reales (cinta animada) ─── */
export const SITUATIONS: { emoji: string; text: L }[] = [
  { emoji: '☕', text: { es: 'Pedir un café en Nueva York', en: 'Ordering coffee in New York' } },
  { emoji: '💼', text: { es: 'Tu entrevista con una empresa de EE. UU.', en: 'Your interview with a US company' } },
  { emoji: '✈️', text: { es: 'Pasar migración sin nervios', en: 'Going through immigration calmly' } },
  { emoji: '🎓', text: { es: 'Sacar banda 7 en el IELTS', en: 'Scoring band 7 on the IELTS' } },
  { emoji: '💬', text: { es: 'Escribir en Slack sin sonar brusco', en: 'Writing on Slack without sounding rude' } },
  { emoji: '🍽️', text: { es: 'Pedir la cuenta en un restaurante', en: 'Asking for the check' } },
  { emoji: '📈', text: { es: 'Presentar resultados en una reunión', en: 'Presenting results in a meeting' } },
  { emoji: '🗺️', text: { es: 'Preguntar direcciones en Londres', en: 'Asking for directions in London' } },
  { emoji: '🤝', text: { es: 'Hacer small talk con tu nuevo jefe', en: 'Small talk with your new boss' } },
  { emoji: '💸', text: { es: 'Negociar tu salario en dólares', en: 'Negotiating your salary in dollars' } },
  { emoji: '🎬', text: { es: 'Entender series sin subtítulos', en: 'Understanding shows without subtitles' } },
  { emoji: '📞', text: { es: 'Deletrear tu nombre por teléfono', en: 'Spelling your name on the phone' } },
];
