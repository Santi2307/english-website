import { pick, shuffle, createSeenStore, generate, type Question } from './questionBank';

/**
 * Ejercicios de la mini-clase del home. Igual que el test de nivel, se generan
 * combinando plantillas y se recuerdan por navegador para no repetirse.
 */

export type OrderItem = { id: string; target: string[]; bank: string[]; es: string };

const PLACES = [['station', 'la estación'], ['bank', 'el banco'], ['pharmacy', 'la farmacia'], ['museum', 'el museo'], ['airport', 'el aeropuerto'], ['bathroom', 'el baño'], ['supermarket', 'el supermercado'], ['hospital', 'el hospital'], ['hotel', 'el hotel'], ['library', 'la biblioteca'], ['stadium', 'el estadio'], ['beach', 'la playa']];
const ITEMS = [['shirt', 'esta camisa'], ['jacket', 'esta chaqueta'], ['coffee', 'este café'], ['book', 'este libro'], ['bag', 'este bolso'], ['hat', 'este sombrero'], ['watch', 'este reloj'], ['sweater', 'este suéter']];
const EVENTS = [['movie', 'la película'], ['class', 'la clase'], ['meeting', 'la reunión'], ['concert', 'el concierto'], ['game', 'el partido'], ['party', 'la fiesta'], ['tour', 'el tour']];
const FOODS = [[['coffee'], 'un café'], [['sandwich'], 'un sándwich'], [['cup', 'of', 'tea'], 'una taza de té'], [['glass', 'of', 'water'], 'un vaso de agua'], [['table', 'for', 'two'], 'una mesa para dos'], [['bottle', 'of', 'juice'], 'una botella de jugo']] as const;
const RELATIVES = [[['brother'], 'Mi hermano'], [['sister'], 'Mi hermana'], [['aunt'], 'Mi tía'], [['uncle'], 'Mi tío'], [['grandmother'], 'Mi abuela'], [['best', 'friend'], 'Mi mejor amigo']] as const;
const CITIES = ['Medellín', 'Bogotá', 'Cali', 'Cartagena', 'Miami', 'Madrid', 'Toronto', 'London', 'Mexico'];
const NUMBERS = [['two', 'dos'], ['three', 'tres'], ['five', 'cinco'], ['six', 'seis'], ['ten', 'diez'], ['twelve', 'doce']];
const HELP = [['homework', 'mi tarea'], ['suitcase', 'mi maleta'], ['resume', 'mi hoja de vida'], ['computer', 'mi computador'], ['project', 'mi proyecto'], ['bags', 'mis bolsas']];
const PLANS = [['travel', 'viajar'], ['move', 'mudarnos'], ['celebrate', 'celebrar'], ['study', 'estudiar']];
const WHEN = [['week', 'la próxima semana'], ['month', 'el próximo mes'], ['year', 'el próximo año'], ['weekend', 'el próximo fin de semana']];

const ORDER_TEMPLATES: (() => { target: string[]; es: string; extra: string })[] = [
  () => { const [p, es] = pick(PLACES); return { target: ['Where', 'is', 'the', p, '?'], es: `¿Dónde está ${es}?`, extra: 'are' }; },
  () => { const [p, es] = pick(PLACES); return { target: ['I', 'am', 'looking', 'for', 'the', p, '.'], es: `Estoy buscando ${es}.`, extra: 'at' }; },
  () => { const [i, es] = pick(ITEMS); return { target: ['How', 'much', 'is', 'this', i, '?'], es: `¿Cuánto cuesta ${es}?`, extra: 'many' }; },
  () => { const [e, es] = pick(EVENTS); return { target: ['What', 'time', 'does', 'the', e, 'start', '?'], es: `¿A qué hora empieza ${es}?`, extra: 'do' }; },
  () => { const [f, es] = pick(FOODS); return { target: ['I', 'would', 'like', 'a', ...f, ',', 'please'], es: `Me gustaría ${es}, por favor.`, extra: 'want' }; },
  () => { const [r, es] = pick(RELATIVES); const c = pick(CITIES); return { target: ['My', ...r, 'lives', 'in', c, '.'], es: `${es} vive en ${c}.`, extra: 'live' }; },
  () => { const [v, ves] = pick(PLANS); const [w, wes] = pick(WHEN); return { target: ['We', 'are', 'going', 'to', v, 'next', w, '.'], es: `Vamos a ${ves} ${wes}.`, extra: 'go' }; },
  () => { const [n, nes] = pick(NUMBERS); return { target: ['She', 'has', 'worked', 'here', 'for', n, 'years', '.'], es: `Ella ha trabajado aquí por ${nes} años.`, extra: 'since' }; },
  () => { const [h, hes] = pick(HELP); return { target: ['Can', 'you', 'help', 'me', 'with', 'my', h, '?'], es: `¿Me puedes ayudar con ${hes}?`, extra: 'I' }; },
  () => { const [e, es] = pick(EVENTS); return { target: ['Did', 'you', 'like', 'the', e, '?'], es: `¿Te gustó ${es}?`, extra: 'Do' }; },
];

export function nextOrderItem(): OrderItem {
  const seen = createSeenStore('ea_seen_demo');
  let item = ORDER_TEMPLATES[0]();
  for (let i = 0; i < 60; i++) {
    item = pick(ORDER_TEMPLATES)();
    if (!seen.has(item.target.join(' '))) break;
  }
  const id = item.target.join(' ');
  seen.add([id]);
  return { id, target: item.target, es: item.es, bank: shuffle([...item.target, item.extra]) };
}

/** Tres frases para completar, de niveles A1–A2 y temas distintos; comparten la memoria del test de nivel. */
export function nextFillSet(): Question[] {
  const seen = createSeenStore();
  const a1 = generate('A1', 2, seen);
  const a2 = generate('A2', 1, seen, new Set(a1.map((q) => q.id)));
  const set = shuffle([...a1, ...a2]);
  seen.add(set.map((q) => q.id));
  return set;
}

const SPEAK_TEMPLATES: (() => string)[] = [
  () => `Could you tell me where the ${pick(PLACES)[0]} is?`,
  () => `I would like a ${pick(['coffee', 'sandwich', 'cup of tea', 'glass of water', 'hamburger'])}, please.`,
  () => `My ${pick(['brother', 'sister', 'aunt', 'uncle', 'best friend'])} lives in ${pick(['Canada', 'Spain', 'Mexico', 'Australia', 'Germany', 'Japan'])}.`,
  () => `What time does the ${pick(EVENTS)[0]} start?`,
  () => `I usually ${pick(['go to the gym', 'visit my parents', 'play soccer', 'cook dinner', 'read a book'])} on ${pick(['Mondays', 'Fridays', 'Saturdays', 'Sundays'])}.`,
  () => `The weather is ${pick(['beautiful', 'terrible', 'perfect', 'very cold', 'really hot'])} today.`,
  () => `How much does this ${pick(ITEMS)[0]} cost?`,
  () => `I have been learning English for ${pick(['two', 'three', 'six', 'eight'])} months.`,
  () => `Can I pay ${pick(['with my card', 'in cash', 'by phone'])}?`,
  () => `Nice to meet you, I'm ${pick(['a teacher', 'an engineer', 'a student', 'a designer', 'a nurse'])}.`,
];

export function nextSpeakPhrase(): string {
  const seen = createSeenStore('ea_seen_demo');
  let phrase = SPEAK_TEMPLATES[0]();
  for (let i = 0; i < 60; i++) {
    phrase = pick(SPEAK_TEMPLATES)();
    if (!seen.has(phrase)) break;
  }
  seen.add([phrase]);
  return phrase;
}
