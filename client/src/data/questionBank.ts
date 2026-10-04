import type { Level } from '@/lib/types';

/**
 * Banco generativo de preguntas de gramática.
 *
 * Cada "tema" es una plantilla que combina sujetos, verbos, objetos y contextos
 * al azar, así que el número de variantes posibles es de miles. Además, cada
 * pregunta mostrada se recuerda en este navegador (`seen`) y no vuelve a salir,
 * ni en el test de nivel ni en la mini-clase. El orden de las opciones también
 * se baraja en cada pregunta.
 *
 * Convención: en `options` la PRIMERA es la correcta; `finalize` baraja después.
 */

export type Question = { id: string; level: Level; topic: string; prompt: string; options: string[]; answer: number };
type Draft = { prompt: string; options: string[] };
type Topic = { id: string; level: Level; make: () => Draft };

// ─── Azar ────────────────────────────────────────────────────────────────
const rand = (n: number) => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
};
export const pick = <T,>(xs: readonly T[]): T => xs[rand(xs.length)];
export function shuffle<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Memoria de preguntas vistas (por navegador) ────────────────────────────
const SEEN_KEY = 'ea_seen_q';
const SEEN_MAX = 5000;

export function createSeenStore(key = SEEN_KEY) {
  let list: string[] = [];
  try {
    list = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(list)) list = [];
  } catch { /* modo privado o storage bloqueado: solo memoria */ }
  const set = new Set(list);
  return {
    has: (id: string) => set.has(id),
    add(ids: string[]) {
      for (const id of ids) if (!set.has(id)) { set.add(id); list.push(id); }
      if (list.length > SEEN_MAX) list = list.slice(-SEEN_MAX);
      try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* noop */ }
    },
  };
}

// ─── Vocabulario compartido ──────────────────────────────────────────────────
const NAMES = ['Carlos', 'Valentina', 'Andrés', 'Laura', 'Sofía', 'Mateo', 'Camila', 'Diego', 'Isabella', 'Juan', 'Mariana', 'Santiago', 'Daniela', 'Felipe', 'Lucía', 'Sebastián', 'Paula', 'Tomás', 'Gabriela', 'Nicolás', 'Manuela', 'Samuel', 'Antonia', 'Emilio'];
const CITIES = ['Medellín', 'Bogotá', 'Cali', 'Cartagena', 'Barranquilla', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Pasto', 'Cúcuta', 'Armenia', 'Villavicencio', 'Ibagué'];
const PLURAL_SUBJ = ['My parents', 'Our neighbors', 'The new students', 'My cousins', 'Your friends', 'The players', 'Those tourists', 'My classmates', 'The engineers'];
const SING_SUBJ = () => pick([pick(NAMES), 'My sister', 'My boss', 'Your brother', 'Our teacher', 'The doctor', 'My best friend', 'Her husband', 'His wife']);
const capital = (s: string) => s[0].toUpperCase() + s.slice(1);

// ─── A1 ───────────────────────────────────────────────────────────────────
const A1: Topic[] = [
  {
    id: 'a1-be',
    level: 'A1',
    make() {
      const rest = pick([`from ${pick(CITIES)}`, 'very tired today', 'at the gym right now', 'in the kitchen', 'late for class', 'happy with the results', `${18 + rand(50)} years old`, 'at home tonight', 'in the same group']);
      const kind = rand(3);
      if (kind === 0) return { prompt: `I ___ ${rest}.`, options: ['am', 'is', 'are', 'be'] };
      if (kind === 1) return { prompt: `${SING_SUBJ()} ___ ${rest}.`, options: ['is', 'am', 'are', 'be'] };
      return { prompt: `${pick(PLURAL_SUBJ)} ___ ${rest}.`, options: ['are', 'is', 'am', 'be'] };
    },
  },
  {
    id: 'a1-do-does',
    level: 'A1',
    make() {
      const act = pick(['wake up', 'have lunch', 'finish work', 'go to bed', 'get home', 'leave the house', 'start work', 'eat dinner', 'take the bus']);
      const sing = rand(2) === 0;
      const subj = sing ? pick(['he', 'she', 'your brother', 'your mom', pick(NAMES)]) : pick(['you', 'they', 'we', 'your parents', 'the kids']);
      const q = pick(['What time', 'When', 'Where', 'How often']);
      return { prompt: `${q} ___ ${subj} ${act}?`, options: sing ? ['does', 'do', 'is', 'are'] : ['do', 'does', 'is', 'are'] };
    },
  },
  {
    id: 'a1-present-s',
    level: 'A1',
    make() {
      const v = pick([
        { base: 'drink', s: 'drinks', ing: 'drinking', obj: ['coffee', 'tea', 'orange juice', 'a lot of water'] },
        { base: 'play', s: 'plays', ing: 'playing', obj: ['soccer', 'the guitar', 'tennis', 'video games'] },
        { base: 'watch', s: 'watches', ing: 'watching', obj: ['the news', 'a movie', 'TV', 'soccer games'] },
        { base: 'cook', s: 'cooks', ing: 'cooking', obj: ['dinner', 'rice', 'breakfast', 'for the family'] },
        { base: 'study', s: 'studies', ing: 'studying', obj: ['English', 'math', 'French', 'at the library'] },
        { base: 'wash', s: 'washes', ing: 'washing', obj: ['the dishes', 'the car', 'the clothes'] },
        { base: 'go', s: 'goes', ing: 'going', obj: ['to the gym', 'to the park', 'to the market', 'running'] },
        { base: 'have', s: 'has', ing: 'having', obj: ['breakfast at seven', 'a shower', 'lunch with friends'] },
        { base: 'read', s: 'reads', ing: 'reading', obj: ['the newspaper', 'a book', 'emails'] },
      ]);
      const time = pick(['every morning', 'every evening', 'every weekend', 'every Sunday', 'every day', 'twice a week', 'on Fridays']);
      return { prompt: `${SING_SUBJ()} ___ ${pick(v.obj)} ${time}.`, options: [v.s, v.base, v.ing, `is ${v.base}`] };
    },
  },
  {
    id: 'a1-negative',
    level: 'A1',
    make() {
      const thing = pick(['spicy food', 'onions', 'cold weather', 'horror movies', 'Mondays', 'loud music', 'black coffee', 'long meetings', 'reggaeton', 'the rain']);
      const sing = rand(2) === 0;
      const subj = sing ? SING_SUBJ() : pick(['I', 'We', 'You', 'They', pick(PLURAL_SUBJ)]);
      return { prompt: `${subj} ___ like ${thing}.`, options: sing ? ["doesn't", "don't", "isn't", "aren't"] : ["don't", "doesn't", "isn't", "aren't"] };
    },
  },
  {
    id: 'a1-there',
    level: 'A1',
    make() {
      const place = pick([
        { where: 'in my house', one: ['a big garden', 'an old piano', 'a small kitchen'], many: ['three bedrooms', 'two bathrooms', 'many plants'] },
        { where: 'on this street', one: ['a bakery', 'a pharmacy', 'a bus stop'], many: ['two banks', 'many restaurants', 'some cafés'] },
        { where: 'in the classroom', one: ['a whiteboard', 'a computer', 'an English dictionary'], many: ['twenty chairs', 'some posters', 'five windows'] },
        { where: 'in the fridge', one: ['a pizza', 'an apple', 'a bottle of milk'], many: ['some eggs', 'two lemons', 'a lot of vegetables'] },
      ]);
      const sing = rand(2) === 0;
      return { prompt: `There ___ ${pick(sing ? place.one : place.many)} ${place.where}.`, options: sing ? ['is', 'are', 'be', 'am'] : ['are', 'is', 'be', 'am'] };
    },
  },
  {
    id: 'a1-article',
    level: 'A1',
    make() {
      const [job, art] = pick([['engineer', 'an'], ['doctor', 'a'], ['architect', 'an'], ['nurse', 'a'], ['artist', 'an'], ['lawyer', 'a'], ['accountant', 'an'], ['pilot', 'a'], ['actor', 'an'], ['dentist', 'a'], ['electrician', 'an'], ['chef', 'a'], ['English teacher', 'an'], ['university student', 'a'], ['excellent cook', 'an']] as const);
      return { prompt: `${SING_SUBJ()} is ___ ${job}.`, options: art === 'a' ? ['a', 'an', 'some', 'any'] : ['an', 'a', 'some', 'any'] };
    },
  },
  {
    id: 'a1-possessive',
    level: 'A1',
    make() {
      const kind = rand(3);
      if (kind === 0) {
        const thing = pick(['dog', 'cat', 'car', 'house', 'garden']);
        return { prompt: `${pick(PLURAL_SUBJ)} have a ${thing}. ___ ${thing} is ${pick(['very big', 'really old', 'beautiful', 'new'])}.`, options: ['Their', 'They', 'There', 'Them'] };
      }
      if (kind === 1) {
        const [thing, np] = pick([['apartment', 'an apartment'], ['office', 'an office'], ['house', 'a house'], ['car', 'an old car']]);
        return { prompt: `${pick(NAMES)} and I share ${np}. ___ ${thing} is in ${pick(CITIES)}.`, options: ['Our', 'We', 'Us', 'Ours'] };
      }
      const thing = pick(['house', 'jacket', 'phone', 'bike', 'garden']);
      return { prompt: `You have a beautiful ${thing}. Is ___ ${thing} new?`, options: ['your', "you're", 'you', 'yours'] };
    },
  },
  {
    id: 'a1-prep-time',
    level: 'A1',
    make() {
      const kind = rand(3);
      const ev = pick(['The party', 'Our English class', 'The concert', 'The meeting', 'The soccer game', 'The exam']);
      if (kind === 0) return { prompt: `${pick(['My birthday', 'Her wedding', ev])} is ___ ${pick(['March', 'July', 'December', 'the summer', 'October'])}.`, options: ['in', 'on', 'at', 'to'] };
      if (kind === 1) return { prompt: `${ev} is ___ ${pick(['Monday', 'Friday', 'Saturday', 'May 5th', 'June 12th', 'Christmas Day'])}.`, options: ['on', 'in', 'at', 'to'] };
      return { prompt: `${ev} starts ___ ${pick(['7 o’clock', 'noon', '8:30', 'midnight', '6 p.m.'])}.`, options: ['at', 'in', 'on', 'to'] };
    },
  },
  {
    id: 'a1-can',
    level: 'A1',
    make() {
      const v = pick([
        ['swim', 'swims', 'swimming', 'very well'],
        ['speak', 'speaks', 'speaking', 'three languages'],
        ['play', 'plays', 'playing', 'the piano'],
        ['drive', 'drives', 'driving', 'a truck'],
        ['cook', 'cooks', 'cooking', 'amazing arepas'],
        ['dance', 'dances', 'dancing', 'salsa'],
        ['ride', 'rides', 'riding', 'a horse'],
        ['run', 'runs', 'running', 'ten kilometers'],
      ]);
      return { prompt: `${SING_SUBJ()} can ___ ${v[3]}.`, options: [v[0], v[1], v[2], `to ${v[0]}`] };
    },
  },
];

// ─── A2 ───────────────────────────────────────────────────────────────────
const A2: Topic[] = [
  {
    id: 'a2-past-irregular',
    level: 'A2',
    make() {
      const v = pick([
        { f: ['went', 'go', 'goes', 'gone'], obj: ['to the supermarket', 'to the beach', 'to a concert', 'to the doctor'] },
        { f: ['ate', 'eat', 'eats', 'eaten'], obj: ['an arepa', 'pizza', 'too much cake', 'at a new restaurant'] },
        { f: ['saw', 'see', 'sees', 'seen'], obj: ['a great movie', 'an old friend', 'a whale', 'the new mall'] },
        { f: ['wrote', 'write', 'writes', 'written'], obj: ['a long email', 'a poem', 'a report'] },
        { f: ['took', 'take', 'takes', 'taken'], obj: ['a taxi', 'a lot of photos', 'the wrong bus'] },
        { f: ['drank', 'drink', 'drinks', 'drunk'], obj: ['two cups of coffee', 'a smoothie', 'lemonade'] },
        { f: ['spoke', 'speak', 'speaks', 'spoken'], obj: ['with the manager', 'to the teacher', 'English all day'] },
        { f: ['broke', 'break', 'breaks', 'broken'], obj: ['a glass', 'the printer', 'a window'] },
        { f: ['forgot', 'forget', 'forgets', 'forgotten'], obj: ['the keys', 'the password', 'an umbrella'] },
        { f: ['gave', 'give', 'gives', 'given'], obj: ['a presentation', 'a speech', 'a gift to the teacher'] },
        { f: ['flew', 'fly', 'flies', 'flown'], obj: ['to Miami', 'to Madrid', 'to San Andrés'] },
      ]);
      const time = pick(['Yesterday', 'Last night', 'Last Saturday', 'Two days ago', 'Last summer', 'Last week']);
      const subj = pick(['I', 'we', 'they', pick(NAMES), 'my brother', 'our team']);
      return { prompt: `${time} ${subj} ___ ${pick(v.obj)}.`, options: v.f };
    },
  },
  {
    id: 'a2-comparative',
    level: 'A2',
    make() {
      const [subj, verb, forms, other] = pick([
        ['Bogotá', 'is', ['colder', 'cold', 'coldest', 'more cold'], 'Cartagena'],
        ['Cartagena', 'is', ['hotter', 'hot', 'hottest', 'more hot'], 'Bogotá'],
        ['Medellín', 'is', ['warmer', 'warm', 'warmest', 'more warm'], 'Bogotá'],
        ['This phone', 'is', ['more expensive', 'expensiver', 'most expensive', 'expensive'], 'that one'],
        ['The metro', 'is', ['faster', 'fast', 'fastest', 'more fast'], 'the bus'],
        ['My new job', 'is', ['better', 'gooder', 'best', 'more good'], 'my old one'],
        ['The traffic today', 'is', ['worse', 'badder', 'worst', 'more bad'], 'yesterday'],
        ['This book', 'is', ['more interesting', 'interestinger', 'most interesting', 'interesting'], 'the movie'],
        ['Your apartment', 'is', ['bigger', 'biger', 'biggest', 'more big'], 'mine'],
        ['The exam', 'was', ['more difficult', 'difficulter', 'most difficult', 'difficult'], 'I expected'],
        ['Coffee here', 'is', ['cheaper', 'cheap', 'cheapest', 'more cheap'], 'at the airport'],
        ['My sister', 'is', ['taller', 'tall', 'tallest', 'more tall'], 'me'],
        ['This year', 'was', ['busier', 'busy', 'busiest', 'more busy'], 'last year'],
      ] as const);
      return { prompt: `${subj} ${verb} ___ than ${other}.`, options: [...forms] };
    },
  },
  {
    id: 'a2-going-to',
    level: 'A2',
    make() {
      const subj = pick(["I'm", "She's", "We're", "They're", "He's", `${pick(NAMES)} is`]);
      const act = pick([`travel to ${pick(CITIES)}`, 'start a new job', 'buy a car', 'visit the grandparents', 'take an English exam', 'paint the house', 'move to a new apartment']);
      return { prompt: `${subj} ___ to ${act} next ${pick(['week', 'month', 'year', 'Monday', 'summer'])}.`, options: ['going', 'go', 'went', 'gone'] };
    },
  },
  {
    id: 'a2-past-continuous',
    level: 'A2',
    make() {
      const sing = rand(2) === 0;
      const subj = sing ? pick(['I', 'She', 'He', pick(NAMES), 'My dad']) : pick(['We', 'They', 'My parents', 'The kids']);
      const [ing, base] = pick([['cooking dinner', 'cook dinner'], ['taking a shower', 'take a shower'], ['watching TV', 'watch TV'], ['driving to work', 'drive to work'], ['sleeping', 'sleep'], ['reading a book', 'read a book'], ['walking the dog', 'walk the dog']]);
      const when = pick(['the phone rang', 'you called', 'the lights went out', 'it started to rain', 'the doorbell rang']);
      const was = `was ${ing}`, were = `were ${ing}`;
      return { prompt: `${subj} ___ when ${when}.`, options: sing ? [was, were, `am ${ing}`, base] : [were, was, `are ${ing}`, base] };
    },
  },
  {
    id: 'a2-superlative',
    level: 'A2',
    make() {
      const [forms, noun] = pick([
        [['biggest', 'bigger', 'most big', 'big'], pick(['mall', 'park', 'stadium'])],
        [['most beautiful', 'beautifulest', 'more beautiful', 'beautiful'], pick(['beach', 'park', 'square'])],
        [['best', 'goodest', 'better', 'most good'], pick(['restaurant', 'bakery', 'coffee shop'])],
        [['oldest', 'older', 'most old', 'old'], pick(['church', 'building', 'bridge'])],
        [['tallest', 'taller', 'most tall', 'tall'], 'building'],
        [['most popular', 'popularest', 'more popular', 'popular'], pick(['club', 'market', 'museum'])],
      ] as const);
      return { prompt: `It's the ___ ${noun} in ${pick([...CITIES, 'the city', 'my neighborhood'])}.`, options: [...forms] };
    },
  },
  {
    id: 'a2-much-many',
    level: 'A2',
    make() {
      const unc = rand(2) === 0;
      const noun = unc ? pick(['water', 'money', 'time', 'sugar', 'milk', 'information', 'rice', 'coffee']) : pick(['eggs', 'chairs', 'tickets', 'bottles', 'copies', 'apples', 'people', 'hours']);
      const tail = pick(unc ? ['do you need', 'did you buy', 'do we have'] : ['do you need', 'did you buy', 'do we have', 'are there']);
      return { prompt: `How ___ ${noun} ${tail}?`, options: unc ? ['much', 'many', 'lot', 'plenty'] : ['many', 'much', 'lot', 'plenty'] };
    },
  },
  {
    id: 'a2-should',
    level: 'A2',
    make() {
      const [problem, advice] = pick([
        ['You look tired.', 'go to bed early'],
        ['Your tooth hurts.', 'see a dentist'],
        ["It's very cold outside.", 'wear a jacket'],
        ['You have an exam tomorrow.', 'study tonight'],
        ['Your English is getting better.', 'keep practicing'],
        ['The roads are wet.', 'drive slowly'],
        ["You don't feel well.", 'stay at home'],
      ]);
      return { prompt: `${problem} You ___ ${advice}.`, options: ['should', 'should to', 'shoulds', 'must to'] };
    },
  },
  {
    id: 'a2-pronouns',
    level: 'A2',
    make() {
      const kind = rand(3);
      if (kind === 0) return { prompt: `I called ${pick(PLURAL_SUBJ).toLowerCase()}, but ___ didn't answer.`, options: ['they', 'them', 'their', 'theirs'] };
      if (kind === 1) return { prompt: `Can you help ___? I'm ${pick(['lost', 'new here', 'late', 'confused'])}.`, options: ['me', 'I', 'my', 'mine'] };
      return { prompt: `The ${pick(['teacher', 'manager', 'doctor', 'police officer'])} asked ___ a question, but we didn't know the answer.`, options: ['us', 'we', 'our', 'ours'] };
    },
  },
  {
    id: 'a2-did-question',
    level: 'A2',
    make() {
      const act = pick(['watch the game', 'call your mom', 'finish the report', 'see the news', 'go out', 'sleep well', 'buy the tickets', 'pay the bill']);
      return { prompt: `___ you ${act} ${pick(['last night', 'yesterday', 'last weekend', 'on Friday'])}?`, options: ['Did', 'Do', 'Were', 'Have'] };
    },
  },
];

// ─── B1 ───────────────────────────────────────────────────────────────────
const B1: Topic[] = [
  {
    id: 'b1-for-since',
    level: 'B1',
    make() {
      const start = pick(['I have lived here', 'She has worked at the bank', 'We have known each other', 'They have been married', 'He has played the guitar', 'My parents have had this car', 'I have studied English', `${pick(NAMES)} has been a teacher`]);
      const since = rand(2) === 0;
      const tail = since ? pick(['2019', 'January', 'I was a child', 'last summer', '2015', 'Christmas', 'the pandemic']) : pick(['ten years', 'three months', 'a long time', 'two weeks', 'ages', 'six years']);
      return { prompt: `${start} ___ ${tail}.`, options: since ? ['since', 'for', 'during', 'from'] : ['for', 'since', 'during', 'from'] };
    },
  },
  {
    id: 'b1-first-conditional',
    level: 'B1',
    make() {
      const [cond, subj, verb, rest] = pick([
        ['If it rains tomorrow,', 'we', 'stay', 'at home'],
        ['If you study hard,', 'you', 'pass', 'the exam'],
        ['If she calls me,', 'I', 'tell', 'you'],
        ['If we leave now,', 'we', 'catch', 'the bus'],
        ['If they invite us,', 'we', 'go', 'to the party'],
        ['If I see your sister,', 'I', 'give', 'her the message'],
        ['If the weather is nice on Sunday,', 'we', 'go', 'to the beach'],
        ['If you eat all that cake,', 'you', 'feel', 'sick'],
        ['If he gets the job,', 'he', 'move', `to ${pick(CITIES)}`],
      ]);
      const past: Record<string, [string, string]> = { stay: ['stayed', 'stayed'], pass: ['passed', 'passed'], tell: ['told', 'told'], catch: ['caught', 'caught'], go: ['went', 'gone'], give: ['gave', 'given'], feel: ['felt', 'felt'], move: ['moved', 'moved'] };
      const [ps, pp] = past[verb];
      return { prompt: `${cond} ${subj} ___ ${rest}.`, options: [`will ${verb}`, `would ${verb}`, ps, `had ${pp}`] };
    },
  },
  {
    id: 'b1-so-such',
    level: 'B1',
    make() {
      const [noun, adj, result] = pick([
        ['movie', 'boring', 'I fell asleep'],
        ['soup', 'hot', 'I burned my tongue'],
        ['exam', 'difficult', 'nobody finished it'],
        ['music', 'loud', "we couldn't talk"],
        ['traffic', 'bad', 'we arrived late'],
        ['party', 'fun', 'we stayed until 3 a.m.'],
        ['hotel', 'expensive', 'we only stayed one night'],
      ]);
      if (rand(2) === 0) return { prompt: `The ${noun} was ___ ${adj} that ${result}.`, options: ['so', 'such', 'too', 'very'] };
      const art = /^[aeiou]/.test(adj) ? 'an' : 'a';
      // "music" y "traffic" no llevan artículo: ahí "such" va sin "a"
      const np = noun === 'music' || noun === 'traffic' ? `${adj} ${noun}` : `${art} ${adj} ${noun}`;
      return { prompt: `It was ___ ${np} that ${result}.`, options: ['such', 'so', 'too', 'very'] };
    },
  },
  {
    id: 'b1-gerund-infinitive',
    level: 'B1',
    make() {
      const [base, ing, rest] = pick([
        ['cook', 'cooking', 'for big groups'],
        ['run', 'running', 'in the park'],
        ['drive', 'driving', 'at night'],
        ['travel', 'traveling', 'alone'],
        ['work', 'working', 'on weekends'],
        ['read', 'reading', 'long novels'],
        ['speak', 'speaking', 'in public'],
        ['learn', 'learning', 'new languages'],
      ]);
      const gerund = rand(2) === 0;
      const sv = gerund
        ? pick(['I enjoy', 'She avoids', 'They keep', "We don't mind", 'He practices', 'My boss suggested', 'I can’t imagine'])
        : pick(['I want', 'She decided', 'We hope', 'They plan', 'He promised', 'My brother refused', 'I need', 'She learned']);
      return { prompt: `${sv} ___ ${rest}.`, options: gerund ? [ing, `to ${base}`, base, `to ${ing}`] : [`to ${base}`, ing, base, `to ${ing}`] };
    },
  },
  {
    id: 'b1-have-you-ever',
    level: 'B1',
    make() {
      const [forms, obj] = pick([
        [['been', 'went', 'go', 'going'], pick([`to ${pick(CITIES)}`, 'to a soccer match', 'to Europe', 'to a wedding'])],
        [['seen', 'saw', 'see', 'seeing'], pick(['a whale', 'snow', 'a ghost', 'the Northern Lights'])],
        [['eaten', 'ate', 'eat', 'eating'], pick(['sushi', 'ajiaco', 'bandeja paisa', 'Indian food'])],
        [['ridden', 'rode', 'ride', 'riding'], pick(['a horse', 'a motorcycle', 'a camel'])],
        [['flown', 'flew', 'fly', 'flying'], pick(['in a helicopter', 'business class', 'a drone'])],
        [['written', 'wrote', 'write', 'writing'], pick(['a song', 'a poem', 'a letter by hand'])],
        [['won', 'winned', 'win', 'winning'], pick(['a competition', 'the lottery', 'a medal'])],
      ] as const);
      const subj = pick(['you', 'your parents', 'they', 'you and your friends']);
      return { prompt: `Have ${subj} ever ___ ${obj}?`, options: [...forms] };
    },
  },
  {
    id: 'b1-used-to',
    level: 'B1',
    make() {
      const age = pick(['a child', 'a kid', 'in school', 'younger', 'ten', 'a teenager']);
      const act = pick(['play in the street', 'walk to school', 'watch cartoons', "eat at my grandma's house", 'collect stickers', 'ride my bike']);
      return { prompt: `When I was ${age}, I ___ ${act} every ${pick(['afternoon', 'day', 'Sunday', 'weekend'])}.`, options: ['used to', 'use to', 'was used to', 'am used to'] };
    },
  },
  {
    id: 'b1-relative',
    level: 'B1',
    make() {
      const [text, ans] = pick([
        ['The woman ___ lives next door is a doctor.', 'who'],
        ['The man ___ called you is my uncle.', 'who'],
        ['The students ___ passed the exam got a certificate.', 'who'],
        ['The restaurant ___ we had dinner was amazing.', 'where'],
        ['This is the town ___ I was born.', 'where'],
        ['The hotel ___ we stayed was near the beach.', 'where'],
        ['The book ___ you lent me is very good.', 'which'],
        ['The phone ___ I bought last week stopped working.', 'which'],
        ['The song ___ won the prize is in Spanish.', 'which'],
        ['The girl ___ bike was stolen called the police.', 'whose'],
        ["That's the neighbor ___ dog barks all night.", 'whose'],
        ['I met a writer ___ books are famous in Mexico.', 'whose'],
      ]);
      return { prompt: text, options: [ans, ...['who', 'which', 'where', 'whose'].filter((x) => x !== ans)] };
    },
  },
  {
    id: 'b1-as-as',
    level: 'B1',
    make() {
      const [subj, adj, other] = pick([
        ['My brother', 'tall', 'my father'],
        ['This apartment', 'expensive', 'the old one'],
        ['The test', 'easy', 'the last one'],
        [pick(['Laura', 'Sofía', 'Camila', 'Valentina']), 'good at math', 'her sister'],
        ['The weather in Cali', 'hot', 'in Barranquilla'],
        ['Your English', 'good', 'mine'],
      ]);
      const neg = rand(2) === 0;
      return { prompt: `${subj} ${neg ? "isn't" : 'is'} as ${adj} ___ ${other}.`, options: ['as', 'than', 'like', 'that'] };
    },
  },
];

// ─── B2 ───────────────────────────────────────────────────────────────────
/** Pares sujeto/posesivo/reflexivo para que la concordancia salga siempre bien. */
const PEOPLE = [
  { s: 'I', be: 'am', was: 'was', pos: 'my', obj: 'me', has: 'have', third: false },
  { s: 'you', be: 'are', was: 'were', pos: 'your', obj: 'you', has: 'have', third: false },
  { s: 'she', be: 'is', was: 'was', pos: 'her', obj: 'her', has: 'has', third: true },
  { s: 'he', be: 'is', was: 'was', pos: 'his', obj: 'him', has: 'has', third: true },
  { s: 'we', be: 'are', was: 'were', pos: 'our', obj: 'us', has: 'have', third: false },
  { s: 'they', be: 'are', was: 'were', pos: 'their', obj: 'them', has: 'have', third: false },
];

const B2: Topic[] = [
  {
    id: 'b2-second-conditional',
    level: 'B2',
    make() {
      if (rand(3) === 0) {
        const advice = pick(['talk to my boss', 'take the job', 'study abroad', 'apologize', 'sell the car', 'ask for a raise', 'see a doctor', 'save more money', 'learn to drive', 'accept the offer']);
        return { prompt: `If I ___ you, I would ${advice}.`, options: ['were', 'am', 'will be', 'be'] };
      }
      const [have, then] = pick([
        ['more time', 'learn French'], ['more money', 'buy a house near the sea'], ['a car', 'drive to work'],
        ['a bigger apartment', 'invite more friends'], ['a dog', 'walk it every morning'], ['better internet', 'work from home'],
        ['a free week', 'travel to San Andrés'], ['a garden', 'grow vegetables'], ['enough savings', 'start a business'],
        ['a better camera', 'take professional photos'], ['more patience', 'teach kids'], ['a bike', 'cycle to the office'],
      ]);
      const p = pick(PEOPLE);
      return { prompt: `If ${p.s} ___ ${have}, ${p.s} would ${then}.`, options: ['had', p.third ? 'has' : 'have', 'will have', 'would have'] };
    },
  },
  {
    id: 'b2-passive',
    level: 'B2',
    make() {
      const [subj, base, pp, ing, rests, plural] = pick([
        ['The report', 'review', 'reviewed', 'reviewing', ['by the manager before the meeting', 'twice last week', 'by an external auditor'], false],
        ['The bridge', 'build', 'built', 'building', ['in 1950', 'by a German company', 'in less than a year'], false],
        ['The contract', 'sign', 'signed', 'signing', ['yesterday afternoon', 'by both parties', 'at the last minute'], false],
        ['These photos', 'take', 'taken', 'taking', ['by my grandfather', 'in 1985', 'with an old camera'], true],
        ['The emails', 'send', 'sent', 'sending', ['last night', 'to the wrong client', 'by mistake'], true],
        ['The new hospital', 'open', 'opened', 'opening', ['last year', 'by the mayor', 'in March'], false],
        ['The winners', 'announce', 'announced', 'announcing', ['on Friday', 'on live TV', 'after the final vote'], true],
        ['The thieves', 'arrest', 'arrested', 'arresting', ['two days later', 'at the airport', 'by the police'], true],
        ['This song', 'write', 'written', 'writing', ['by a Colombian artist', 'in only one night', 'in 1998'], false],
        ['The meeting', 'cancel', 'cancelled', 'cancelling', ['at the last minute', 'because of the rain', 'by the director'], false],
        ['The tickets', 'sell', 'sold', 'selling', ['in ten minutes', 'online', 'too quickly'], true],
        ['The old houses', 'destroy', 'destroyed', 'destroying', ['by the storm', 'in the earthquake', 'last decade'], true],
      ] as const);
      return {
        prompt: `${subj} ___ ${pick(rests)}.`,
        options: [`${plural ? 'were' : 'was'} ${pp}`, `${plural ? 'have' : 'has'} ${ing}`, `${plural ? 'are' : 'is'} ${base}`, `${plural ? 'was' : 'were'} ${ing}`],
      };
    },
  },
  {
    id: 'b2-wish',
    level: 'B2',
    make() {
      const [base, pp, obj] = pick([
        ['send', 'sent', 'that email'], ['eat', 'eaten', 'so much cake'], ['buy', 'bought', 'that expensive phone'],
        ['drink', 'drunk', 'so much coffee'], ['say', 'said', 'those things'], ['spend', 'spent', 'all the savings'],
        ['sell', 'sold', 'the old car'], ['miss', 'missed', 'the flight'], ['lose', 'lost', 'the keys'],
        ['forget', 'forgotten', "the boss's birthday"], ['tell', 'told', 'everyone the secret'], ['quit', 'quit', 'the gym'],
      ]);
      const [subj, wish, who] = pick([['I', 'wish', 'I'], ['She', 'wishes', 'she'], ['He', 'wishes', 'he'], ['We', 'wish', 'we'], ['They', 'wish', 'they'], ['My dad', 'wishes', 'he'], ['My mom', 'wishes', 'she']]);
      return { prompt: `${subj} ${wish} ${who} ___ ${obj} ${pick(['yesterday', 'last night', 'last month', 'at the party', 'last year'])}.`, options: [`hadn't ${pp}`, `didn't ${base}`, `wouldn't ${base}`, `haven't ${pp}`] };
    },
  },
  {
    id: 'b2-third-conditional',
    level: 'B2',
    make() {
      const [cond, base, pp, rest] = pick([
        ['left earlier', 'catch', 'caught', 'the train'],
        ['studied more', 'pass', 'passed', 'the exam'],
        ['booked in advance', 'get', 'got', 'better seats'],
        ['set an alarm', 'wake', 'woken', 'up on time'],
        ['checked the weather', 'take', 'taken', 'an umbrella'],
        ['saved more money', 'buy', 'bought', 'the apartment'],
        ['read the instructions', 'make', 'made', 'fewer mistakes'],
        ['listened to the coach', 'win', 'won', 'the match'],
        ['taken a taxi', 'arrive', 'arrived', 'on time'],
        ['practiced more', 'feel', 'felt', 'more confident'],
      ]);
      const p = pick(PEOPLE);
      return { prompt: `If ${p.s} had ${cond}, ${p.s} ___ ${rest}.`, options: [`would have ${pp}`, `would ${base}`, `will ${base}`, `had ${pp}`] };
    },
  },
  {
    id: 'b2-deduction',
    level: 'B2',
    make() {
      const name = pick(NAMES);
      const text = pick([
        'The streets are wet. It ___ rained last night.',
        'The lights are off. They ___ gone to bed.',
        `${name} isn't here yet. The bus ___ been late.`,
        'She knows everything about the project. Someone ___ told her.',
        'The cake is gone. The kids ___ eaten it.',
        `${name} looks exhausted. ${name} ___ worked all night.`,
        'The door is open. Somebody ___ forgotten to lock it.',
        `There's sand in ${name}'s shoes. ${name} ___ been to the beach.`,
        'The windows are broken. The storm ___ been terrible.',
        'Everyone is smiling. The meeting ___ gone well.',
        `${name} didn't answer. The phone ___ been off.`,
      ]);
      return { prompt: text, options: ['must have', 'must', 'can have', 'should'] };
    },
  },
  {
    id: 'b2-its-time',
    level: 'B2',
    make() {
      const [past, base, rest] = pick([
        ['went', 'go', 'home'], ['found', 'find', 'a new apartment'], ['left', 'leave', 'for the airport'],
        ['started', 'start', 'the meeting'], ['bought', 'buy', 'a new car'], ['cleaned', 'clean', 'the kitchen'],
        ['told', 'tell', 'the truth'], ['booked', 'book', 'the hotel'], ['changed', 'change', 'the password'],
        ['paid', 'pay', 'the bills'], ['had', 'have', 'a serious talk'],
      ]);
      const subj = pick(['we', 'you', 'they', 'he', 'she']);
      return { prompt: `${pick(["It's late.", 'Come on!', 'Look at the time.', "We can't wait forever.", 'Enough excuses.'])} It's time ${subj} ___ ${rest}.`, options: [past, base, `will ${base}`, `are going to ${base}`] };
    },
  },
  {
    id: 'b2-be-used-to',
    level: 'B2',
    make() {
      const [ing, base, past, s, rest] = pick([
        ['getting', 'get', 'got', 'gets', 'up so early'], ['driving', 'drive', 'drove', 'drives', 'on the left'],
        ['working', 'work', 'worked', 'works', 'at night'], ['speaking', 'speak', 'spoke', 'speaks', 'in public'],
        ['eating', 'eat', 'ate', 'eats', 'dinner so late'], ['living', 'live', 'lived', 'lives', 'in such a cold city'],
        ['taking', 'take', 'took', 'takes', 'the metro every day'], ['wearing', 'wear', 'wore', 'wears', 'a suit'],
        ['sharing', 'share', 'shared', 'shares', 'an office'], ['writing', 'write', 'wrote', 'writes', 'reports in English'],
      ]);
      const subj = pick(["I'm not", "She isn't", "We aren't", "He's finally", "They're not", "I'm getting", `${pick(NAMES)} is`, 'My parents are']);
      return { prompt: `${subj} used to ___ ${rest}.`, options: [ing, base, past, s] };
    },
  },
  {
    id: 'b2-causative',
    level: 'B2',
    make() {
      const [base, pp, ing, obj] = pick([
        ['repair', 'repaired', 'repairing', 'car'], ['paint', 'painted', 'painting', 'house'], ['fix', 'fixed', 'fixing', 'phone'],
        ['clean', 'cleaned', 'cleaning', 'suit'], ['translate', 'translated', 'translating', 'documents'], ['check', 'checked', 'checking', 'eyes'],
        ['deliver', 'delivered', 'delivering', 'groceries'], ['install', 'installed', 'installing', 'new kitchen'], ['print', 'printed', 'printing', 'photos'],
      ]);
      const p = pick(PEOPLE);
      const verb = pick(['had', 'got']);
      return { prompt: `${capital(p.s)} ${verb} ${p.pos} ${obj} ___ ${pick(['yesterday', 'last week', 'on Monday', 'last month', 'this morning'])}.`, options: [pp, base, ing, `to ${base}`] };
    },
  },
  {
    id: 'b2-although-despite',
    level: 'B2',
    make() {
      const [np, clause] = pick([
        ['the rain', 'it was raining'], ['the traffic', 'there was a lot of traffic'], ['the cold', 'it was very cold'],
        ['the noise', 'it was really noisy'], ['the long delay', 'the flight was delayed'], ['the bad reviews', 'the reviews were bad'],
        ['the high price', 'it was very expensive'], ['the heat', 'it was extremely hot'],
      ]);
      const result = pick(['we had a great time', 'we arrived on time', 'she finished the race', 'they kept working', 'I slept well', 'the event was a success', 'he stayed calm']);
      if (rand(2) === 0) return { prompt: `___ ${np}, ${result}.`, options: ['Despite', 'Although', 'However', 'Even'] };
      return { prompt: `___ ${clause}, ${result}.`, options: ['Although', 'Despite', 'However', 'In spite'] };
    },
  },
  {
    id: 'b2-reported-question',
    level: 'B2',
    make() {
      const asker = pick(['She', 'He', 'The officer', 'My new boss', 'The interviewer', pick(NAMES), 'The receptionist']);
      const [wh, past, base] = pick([
        ['where', 'lived', 'live'], ['where', 'worked', 'work'], ['why', 'studied English', 'study English'],
        ['how long', 'had been there', 'have been there'], ['what time', 'finished work', 'finish work'],
        ['how', 'knew the manager', 'know the manager'], ['when', 'started the job', 'start the job'],
      ]);
      const did = base.startsWith('have ') ? `had I ${base.slice(5)}` : `did I ${base}`;
      return { prompt: `${asker} asked me ${wh} ___.`, options: [`I ${past}`, did, `do I ${base}`, `I do ${base}`] };
    },
  },
];

// ─── C1 ───────────────────────────────────────────────────────────────────
const C1: Topic[] = [
  {
    id: 'c1-inversion',
    level: 'C1',
    make() {
      const p = pick(PEOPLE.filter((x) => x.s !== 'you'));
      const S = p.s;
      const [text, ok, wrong] = pick([
        [`___ had ${S} ${pick(['arrived', 'sat down', 'opened the laptop', 'started the presentation'])} than ${pick(['the meeting started', 'the lights went out', 'the phone rang', 'it began to rain'])}.`, 'No sooner', ['Hardly', 'As soon', 'Barely']],
        [`___ had ${S} ${pick(['sat down', 'started eating', 'gone to bed', 'closed the door'])} when ${pick(['the phone rang', 'someone knocked', 'the alarm went off', 'the power went out'])}.`, 'Hardly', ['No sooner', 'As soon', 'Only']],
        [`___ ${p.third ? 'does' : 'do'} ${S} speak ${pick(['French', 'German', 'Italian', 'Portuguese'])}, but ${S} also ${p.third ? 'speaks' : 'speak'} ${pick(['Japanese', 'Korean', 'Russian', 'Arabic'])}.`, 'Not only', ['Not just', 'Neither', 'Never']],
        [`___ ${p.has} ${S} seen such a ${pick(['beautiful view', 'chaotic meeting', 'delicious meal', 'boring movie', 'talented team'])}.`, 'Never', ['Ever', 'Always', 'Not only']],
        [`___ did ${S} realize how much ${S} had ${pick(['learned', 'changed', 'missed home', 'grown'])}.`, 'Only then', ['Only', 'Then', 'Even then']],
        [`___ should you ${pick(['share your password with anyone', 'leave the door unlocked', 'sign without reading', 'give out your PIN'])}.`, 'Under no circumstances', ['Under any circumstances', 'In any case', 'Without circumstances']],
        [`___ did ${S} know that ${pick(['the company was about to close', 'everything was about to change', 'the surprise was for them', 'the test had been cancelled'])}.`, 'Little', ['Few', 'Less', 'Small']],
        [`___ ${p.third ? 'does' : 'do'} ${S} ${pick(['eat out', 'watch TV', 'take a day off', 'go to the cinema'])} these days.`, 'Rarely', ['Ever', 'Usually', 'Always']],
      ] as const);
      return { prompt: text, options: [ok, ...wrong] };
    },
  },
  {
    id: 'c1-phrasal',
    level: 'C1',
    make() {
      const name = pick(NAMES);
      const [text, ok, wrong] = pick([
        [`The ${pick(['proposal', 'offer', 'request', 'application'])} was turned ___ due to ${pick(['budget constraints', 'lack of time', 'legal issues'])}.`, 'down', ['off', 'over', 'out']],
        [`We've run ___ of ${pick(['milk', 'coffee', 'paper', 'time', 'ideas'])}, so we need a plan.`, 'out', ['off', 'down', 'away']],
        [`They called ___ the ${pick(['meeting', 'match', 'concert', 'trip', 'wedding'])} because of ${pick(['the storm', 'the strike', 'a family emergency'])}.`, 'off', ['down', 'out', 'over']],
        [`${name} can't put ___ with ${pick(['this noise', 'the delays', 'rude customers', 'the heat'])} anymore.`, 'up', ['on', 'down', 'off']],
        [`${name} takes ___ ${pick(['her mother', 'his father', 'her grandmother', 'his uncle'])}; they look exactly alike.`, 'after', ['up', 'over', 'off']],
        [`The company had to lay ___ ${pick(['fifty', 'two hundred', 'thirty', 'ninety'])} employees.`, 'off', ['out', 'down', 'up']],
        [`I came ___ ${pick(['an old photo', 'a love letter', 'some old coins', 'my first diary'])} while cleaning the house.`, 'across', ['over', 'into', 'along']],
        [`Don't give ___ now; you're ${pick(['almost there', 'so close', 'doing great'])}!`, 'up', ['out', 'away', 'off']],
        [`We need to figure ___ how to ${pick(['fix this bug', 'reduce costs', 'win the client back', 'get there on time'])}.`, 'out', ['up', 'off', 'over']],
        [`The plane took ___ ${pick(['two hours late', 'on time', 'in heavy rain'])}.`, 'off', ['up', 'out', 'away']],
        [`${name} brought ___ ${pick(['an interesting point', 'the budget issue', 'a new idea'])} during the meeting.`, 'up', ['out', 'off', 'over']],
        [`Can you look ___ ${pick(['this problem', 'the complaint', 'the missing payment'])} and tell me what happened?`, 'into', ['after', 'up', 'out']],
        [`We're looking forward ___ ${pick(['meeting you', 'the holidays', 'your reply'])}.`, 'to', ['for', 'at', 'on']],
        [`${name} finally got ___ ${pick(['the flu', 'the breakup', 'the jet lag'])} after two weeks.`, 'over', ['off', 'out', 'along']],
      ] as const);
      return { prompt: text, options: [ok, ...wrong] };
    },
  },
  {
    id: 'c1-reporting-passive',
    level: 'C1',
    make() {
      if (rand(2) === 0) {
        const [subj, rest] = pick([
          [pick(['This restaurant', 'That bakery', 'The new café']), pick(['the best in the country', 'worth a visit', 'extremely popular'])],
          [pick(['The new manager', 'Her boss', 'The coach']), pick(['very demanding', 'extremely fair', 'hard to impress'])],
          [pick(['That hotel', 'The old castle', 'The village']), pick(['haunted', 'over 300 years old', 'worth a visit'])],
          [pick(['Their latest album', 'The new series', 'Her first novel']), pick(['a masterpiece', 'one of a kind', 'extremely popular'])],
        ]);
        return { prompt: `${subj} is ___ to be ${rest}.`, options: ['said', 'told', 'spoken', 'saying'] };
      }
      const subj = pick(['The CEO', 'The suspect', 'The singer', 'The minister', 'The former coach']);
      const rest = pick(['left the country', 'escaped through the window', 'hidden the money', 'resigned last night', 'signed a secret deal']);
      const [ok, ...wrong] = pick([['believed', 'believing', 'belief', 'believes'], ['thought', 'thinking', 'thinks', 'thought of'], ['reported', 'reporting', 'reports', 'report']]);
      return { prompt: `${subj} is ___ to have ${rest}.`, options: [ok, ...wrong] };
    },
  },
  {
    id: 'c1-subjunctive',
    level: 'C1',
    make() {
      const [base, ing, pp, rest] = pick([
        ['drink', 'drinking', 'drunk', 'more water'], ['rest', 'resting', 'rested', 'for a week'], ['avoid', 'avoiding', 'avoided', 'sugar'],
        ['see', 'seeing', 'seen', 'a specialist'], ['take', 'taking', 'taken', 'the medicine twice a day'], ['stop', 'stopping', 'stopped', 'smoking'],
        ['sleep', 'sleeping', 'slept', 'at least eight hours'], ['be', 'being', 'been', 'more careful'],
      ]);
      const intro = pick(['The doctor recommended that', 'The doctor suggested that', 'The doctor insisted that', 'It is essential that', 'It is vital that', 'They demanded that']);
      const subj = pick(['he', 'she', 'the patient', 'my father', 'everyone', pick(NAMES)]);
      return { prompt: `${intro} ${subj} ___ ${rest}.`, options: [base, ing, `to ${base}`, `has ${pp}`] };
    },
  },
  {
    id: 'c1-mixed-conditional',
    level: 'C1',
    make() {
      const p = pick(PEOPLE);
      const [cond, opts] = pick([
        [`If ${p.s} had studied ${pick(['medicine', 'law', 'engineering'])}, ${p.s} ___ a very different life now.`, ['would have', 'will have', 'had had', p.third ? 'has' : 'have']],
        [`If ${p.s} hadn't missed the flight, ${p.s} ___ here with the team now.`, ['would be', 'will be', 'had been', p.be]],
        [`If ${p.s} had saved more money, ${p.s} ___ so worried now.`, ["wouldn't be", "won't be", "hadn't been", `${p.be} not`]],
        [`If ${p.s} had bought that house, ${p.s} ___ near the beach now.`, ['would live', 'will live', 'had lived', p.third ? 'lives' : 'live']],
        [`If ${p.s} had accepted the offer, ${p.s} ___ in ${pick(['London', 'Toronto', 'Madrid'])} now.`, ['would be working', 'will be working', 'had been working', `${p.be} working`]],
      ] as const);
      return { prompt: cond, options: [...opts] };
    },
  },
  {
    id: 'c1-had-i-known',
    level: 'C1',
    make() {
      const p = pick(PEOPLE.filter((x) => x.s !== 'you'));
      const [about, base, pp, rest] = pick([
        ['the traffic', 'leave', 'left', 'earlier'], ['the party', 'come', 'come', ''], ['the problem', 'call', 'called', 'for help'],
        ['the sale', 'buy', 'bought', 'two'], ['the strike', 'work', 'worked', 'from home'], ['the storm', 'stay', 'stayed', 'at home'],
        ['the price', 'choose', 'chosen', 'another hotel'], ['the delay', 'take', 'taken', 'a later flight'],
      ]);
      const end = rest ? ` ${rest}` : '';
      return { prompt: `Had ${p.s} known about ${about}, ${p.s} ___${end}.`, options: [`would have ${pp}`, `would ${base}`, `will ${base}`, `had ${pp}`] };
    },
  },
  {
    id: 'c1-collocation',
    level: 'C1',
    make() {
      const name = pick(NAMES);
      const [text, ans] = pick([
        [`${name} needs to ___ attention in class.`, 'pay'], ['Everyone can ___ a mistake.', 'make'], [`${name} has to ___ the homework tonight.`, 'do'],
        ['Sometimes you have to ___ a risk.', 'take'], [`Can you ___ ${name} a favor?`, 'do'], [`${name} needs to ___ a phone call.`, 'make'],
        ["Let's ___ a break.", 'take'], [`${name} wanted to ___ the chef a compliment.`, 'pay'], ["We're starting to ___ progress.", 'make'],
        ['Please ___ a seat.', 'take'], [`${name} always ___s the dishes after dinner.`, 'do'], [`Did ${name} ___ an effort to arrive on time?`, 'make'],
        ['We should ___ a visit to grandma this weekend.', 'pay'], [`It's hard to ___ a decision under pressure.`, 'make'], [`${name} will ___ care of the kids.`, 'take'],
        ['You should ___ some exercise every day.', 'do'], [`${name} doesn't ___ any notice of what I say.`, 'take'], [`Remember to ___ your respects to the family.`, 'pay'],
      ]);
      if (text.includes('___s')) return { prompt: text.replace('___s', '___'), options: ['does', 'makes', 'takes', 'pays'] };
      return { prompt: text, options: [ans, ...['make', 'do', 'take', 'pay'].filter((x) => x !== ans)] };
    },
  },
  {
    id: 'c1-participle',
    level: 'C1',
    make() {
      const [pp, obj] = pick([['finished', 'the report'], ['read', 'the contract'], ['checked', 'the numbers'], ['cleaned', 'the kitchen'], ['seen', 'the results'], ['written', 'the email'], ['paid', 'the bill']]);
      const follow = pick(['she went home', 'he called the client', 'we went out for dinner', 'they relaxed for a while', 'I sent it to my boss', 'she felt much better']);
      return { prompt: `___ ${pp} ${obj}, ${follow}.`, options: ['Having', 'Have', 'To have', 'Had'] };
    },
  },
  {
    id: 'c1-conditions',
    level: 'C1',
    make() {
      const [text, ok] = pick([
        [`You can borrow my ${pick(['car', 'laptop', 'camera', 'bike'])} ___ you bring it back ${pick(['tomorrow', 'by Friday', 'tonight'])}.`, 'as long as'],
        [`Take ${pick(['an umbrella', 'a jacket', 'some cash'])} ___ ${pick(['it rains', 'it gets cold', 'the card machine is broken'])}.`, 'in case'],
        [`You won't ${pick(['pass', 'improve', 'get the job'])} ___ you ${pick(['practice every day', 'work harder', 'prepare properly'])}.`, 'unless'],
        [`${pick(NAMES)} went to work ___ ${pick(['feeling sick', 'having a fever', 'the terrible weather'])}.`, 'in spite of'],
        [`I'll lend you the money ___ you pay me back ${pick(['next month', 'by Christmas', 'in two weeks'])}.`, 'provided that'],
      ]);
      const pool = ['as long as', 'in case', 'unless', 'in spite of', 'provided that', 'even though'];
      // "as long as" y "provided that" son intercambiables: nunca van juntas
      const clash = (x: string) => (ok === 'as long as' && x === 'provided that') || (ok === 'provided that' && x === 'as long as');
      const wrong = shuffle(pool.filter((x) => x !== ok && !clash(x) && !(ok === 'unless' && x === 'even though'))).slice(0, 3);
      return { prompt: text, options: [ok, ...wrong] };
    },
  },
];

export const TOPICS: Record<Level, Topic[]> = { A1, A2, B1, B2, C1 };

const idOf = (d: Draft) => d.prompt.toLowerCase().replace(/\s+/g, ' ');

function finalize(topic: Topic, d: Draft): Question {
  const correct = d.options[0];
  const options = shuffle(d.options);
  return { id: idOf(d), level: topic.level, topic: topic.id, prompt: capital(d.prompt), options, answer: options.indexOf(correct) };
}

/**
 * Elige `count` preguntas nuevas de un nivel, cada una de un tema distinto.
 * Si un tema está agotado para este navegador, pasa al siguiente; solo como
 * último recurso (tras cientos de tests) acepta una ya vista.
 */
export function generate(level: Level, count: number, seen: { has: (id: string) => boolean }, exclude = new Set<string>()): Question[] {
  const out: Question[] = [];
  const used = new Set(exclude);
  for (const pass of [0, 1]) {
    for (const topic of shuffle(TOPICS[level])) {
      if (out.length >= count) break;
      if (out.some((q) => q.topic === topic.id)) continue;
      for (let tries = 0; tries < 40; tries++) {
        const d = topic.make();
        const id = idOf(d);
        if (used.has(id) || (pass === 0 && seen.has(id))) continue;
        used.add(id);
        out.push(finalize(topic, d));
        break;
      }
    }
  }
  return out;
}
