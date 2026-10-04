import type { LessonExtras } from './types.js';

/** Conversación Fluida (B1-B2): lectura, errores típicos, pronunciación, cultura, misión y práctica extra. */
export const conversacionFluidaExtras: LessonExtras[][] = [
  // ─── Módulo 1: Rompe el bloqueo ─────────────────────────────────────────
  [
    // M1L1 · Pensar en bloques (chunks)
    {
      vocabulary: [
        { en: 'Make a decision', es: 'Tomar una decisión', example: "I can't make a decision right now.", emoji: '🤔' },
        { en: 'Take a break', es: 'Tomar un descanso', example: "Let's take a ten-minute break.", emoji: '☕' },
        { en: 'Pay attention', es: 'Prestar atención', example: 'Pay attention to the details.', emoji: '👀' },
        { en: 'Have a good time', es: 'Pasarla bien', example: 'We had a really good time at the party.', emoji: '🥳' },
        { en: 'Do me a favor', es: 'Hazme un favor', example: 'Could you do me a favor?', emoji: '🙏' },
        { en: 'No wonder', es: 'Con razón', example: "You didn't sleep? No wonder you're tired.", emoji: '💡' },
      ],
      mistakes: [
        { wrong: 'I am agree with you.', right: 'I agree with you.', why: '"Agree" ya es un verbo: no necesita "am". Es una de las traducciones literales más comunes de "estoy de acuerdo".' },
        { wrong: 'Make a photo / make a question', right: 'Take a photo / ask a question', why: 'Las combinaciones de palabras (collocations) no se traducen: en inglés se "toma" una foto y se "pregunta" una pregunta.' },
        { wrong: 'I am actually living in Cali. (queriendo decir "actualmente")', right: "I'm currently living in Cali.", why: '"Actually" es un falso amigo: significa "en realidad". "Actualmente" es "currently" o "nowadays".' },
        { wrong: 'It depends of the weather.', right: 'It depends on the weather.', why: 'En inglés es "depend ON". Aprende el verbo con su preposición, como un solo bloque.' },
        { wrong: 'Explain me the plan.', right: 'Explain the plan to me.', why: '"Explain" no admite el objeto directo de persona justo después: "explain something to someone".' },
      ],
      pronunciation: {
        focus: 'Decir un chunk de un solo tirón',
        tip: 'Los nativos no dicen las palabras de un chunk separadas: las unen como si fueran una sola. "Make sense" suena "meiksens", "by the way" suena "baide-wei". Practica cada bloque como una palabra larga, con un solo acento fuerte.',
        words: [
          { word: 'by the way', sounds: '"bai-dhe-WEI"', es: 'por cierto' },
          { word: 'it makes sense', sounds: '"it-meik-SENS"', es: 'tiene sentido' },
          { word: "it's up to you", sounds: '"its-ap-tu-IU"', es: 'tú decides' },
          { word: 'get used to it', sounds: '"guet-IUS-tu-it" (la d no suena)', es: 'acostumbrarse' },
          { word: 'look forward to', sounds: '"luk-FOR-ward-tu"', es: 'esperar con ganas' },
        ],
      },
      reading: {
        title: "Why your brain loves chunks",
        paragraphs: [
          "When we learn a new language, most of us start by memorizing individual words and grammar rules. Then, when we try to speak, we build every sentence from scratch: subject, verb, object, check the tense, check the preposition. No wonder it feels slow and exhausting.",
          "Native speakers don't work that way. Linguists estimate that a large part of everyday speech is made of prefabricated chunks: expressions like \"I was wondering if…\", \"to be honest\" or \"it's not a big deal\". Speakers retrieve them from memory as complete units, which frees the brain to focus on what they actually want to say.",
          "The practical lesson is simple: stop collecting single words and start collecting phrases. When you find a useful expression in a series or a podcast, write down the whole sentence, say it out loud several times and use it that same week. Little by little, your speaking will stop sounding translated and start sounding natural.",
        ],
        glossary: [
          { en: 'from scratch', es: 'desde cero' },
          { en: 'exhausting', es: 'agotador' },
          { en: 'retrieve', es: 'recuperar, sacar (de la memoria)' },
          { en: 'frees', es: 'libera' },
        ],
        questions: [
          { q: 'According to the text, why does speaking feel slow for learners?', options: ['They build every sentence from scratch', "They don't know enough grammar", 'They speak too fast'], answer: 0 },
          { q: 'What is a "chunk"?', options: ['A single difficult word', 'A ready-made expression used as one unit', 'A grammar rule'], answer: 1 },
          { q: 'What does the author recommend?', options: ['Memorizing word lists', 'Collecting and using whole phrases', 'Studying more grammar rules'], answer: 1 },
          { q: 'The word "actually" in paragraph 2 means…', options: ['currently', 'really / in fact', 'quickly'], answer: 1, explanation: '"What they actually want to say" = lo que realmente quieren decir.' },
        ],
      },
      culture: {
        title: 'Los falsos amigos que más vergüenza dan',
        body: '"Embarrassed" es avergonzado, no embarazada (pregnant). "Constipated" es estreñido, no resfriado (I have a cold). "Carpet" es alfombra, no carpeta (folder). "Exit" es salida, no éxito (success). "Sensible" es sensato, no sensible (sensitive). Un nativo entenderá el error, pero vale la pena evitar estas risas.',
      },
      mission: {
        title: 'Tu banco personal de 10 chunks',
        task: 'Mira 10 minutos de una serie en inglés con subtítulos en inglés. Anota 10 expresiones completas (no palabras sueltas) que te parezcan útiles y escribe una frase propia con cada una.',
        steps: ['Pausa cuando escuches algo que se repite', 'Anota la frase completa con su contexto', 'Escribe tu propia versión', 'Úsalas en tu próxima conversación'],
        model: '"I\'ll figure it out" → I lost my keys, but I\'ll figure it out. "It\'s not a big deal" → I missed the bus, but it\'s not a big deal. "I was wondering if…" → I was wondering if you could help me.',
      },
      exercises: [
        { type: 'fix', sentence: 'I am agree with your idea.', answers: ['I agree with your idea.'], explanation: '"Agree" ya es verbo.' },
        { type: 'dictation', audio: 'By the way, it makes sense.', translation: 'Por cierto, tiene sentido.' },
        { type: 'choice', prompt: '¿Cuál es la combinación correcta?', options: ['make a photo', 'take a photo', 'do a photo'], answer: 1 },
        { type: 'fix', sentence: 'It depends of the price.', answers: ['It depends on the price.'], explanation: 'depend ON.' },
        { type: 'choice', prompt: '"Actually, I live in Medellín" significa…', options: ['Actualmente vivo en Medellín.', 'En realidad, vivo en Medellín.', 'Siempre he vivido en Medellín.'], answer: 1 },
        { type: 'listen', audio: "I'm really looking forward to the trip.", options: ['Tengo muchas ganas del viaje.', 'Estoy buscando el viaje.', 'Miro hacia adelante en el viaje.'], answer: 0 },
        { type: 'dictation', audio: "It's up to you.", translation: 'Tú decides.' },
        { type: 'fix', sentence: 'Can you explain me the problem?', answers: ['Can you explain the problem to me?', 'Could you explain the problem to me?'], explanation: 'explain something TO someone.' },
        { type: 'match', prompt: 'Une el falso amigo con su significado real', pairs: [['embarrassed', 'avergonzado'], ['carpet', 'alfombra'], ['exit', 'salida'], ['sensible', 'sensato'], ['actually', 'en realidad']] },
        { type: 'fill', sentence: "You worked 12 hours? No ___ you're tired.", answers: ['wonder'], hint: 'con razón' },
        { type: 'truefalse', statement: 'Según la lectura, los nativos construyen cada frase palabra por palabra.', answer: false, explanation: 'Usan bloques prefabricados (chunks).' },
      ],
    },
    // M1L2 · Muletillas
    {
      vocabulary: [
        { en: "That's a good question", es: 'Buena pregunta', example: "Hmm, that's a good question.", emoji: '❓' },
        { en: 'How can I put it?', es: '¿Cómo lo digo?', example: "It's… how can I put it… complicated.", emoji: '🧩' },
        { en: 'You know what I mean?', es: '¿Me entiendes?', example: "It's not bad, just weird, you know what I mean?", emoji: '🤝' },
        { en: "What's the word?", es: '¿Cómo se dice?', example: "It's like a… what's the word… a ladder!", emoji: '🔍' },
        { en: 'Sort of', es: 'Más o menos, algo así', example: "I'm sort of nervous.", emoji: '〰️' },
        { en: 'Off the top of my head', es: 'Así de memoria / sin pensarlo mucho', example: "Off the top of my head, I'd say fifty.", emoji: '🧠' },
      ],
      mistakes: [
        { wrong: 'Eeeh… este… (en una conversación en inglés)', right: 'Um… / Well… / Let me see…', why: 'Las muletillas en español delatan que estás traduciendo. Cambia tus rellenos automáticos por los ingleses para sonar natural incluso cuando dudas.' },
        { wrong: 'I don\'t know how to say it in English, sorry, sorry… (y te quedas callado)', right: "I don't know the exact word, but it's like a…", why: 'Si no sabes la palabra, descríbela (circumlocution). Es una habilidad que los examinadores y los nativos valoran mucho.' },
        { wrong: 'Like, like, like, I was like, like…', right: 'So… / I mean… / Basically…', why: '"Like" es natural, pero en exceso suena inmaduro, sobre todo en contextos profesionales. Varía tus rellenos.' },
        { wrong: 'How do you say "escalera"? (y nada más)', right: "What do you call the thing you use to go upstairs? It's like stairs but portable.", why: 'Describir la función o la forma de un objeto mantiene viva la conversación y enseña vocabulario al mismo tiempo.' },
      ],
      pronunciation: {
        focus: 'Pausas que suenan seguras',
        tip: 'Un silencio con "uhm" bien colocado suena reflexivo, no inseguro. El truco es alargar la muletilla con calma ("Weeell…", "Sooo…") y mantener el contacto visual. Lo que suena inseguro es la voz que sube y pide disculpas.',
        words: [
          { word: 'Well…', sounds: 'alarga la L: "ueeel…" ↘', es: 'Bueno…' },
          { word: 'Let me think…', sounds: '"LEM-mi-think" ↘', es: 'Déjame pensar…' },
          { word: 'I mean…', sounds: '"ai-MIIN" ↘', es: 'O sea…' },
          { word: "That's a good question.", sounds: '"dats-a-GUD-kues-chen"', es: 'Buena pregunta.' },
        ],
      },
      reading: {
        title: 'In defense of "um"',
        paragraphs: [
          "For decades, teachers and public-speaking coaches told students to eliminate fillers like \"um\" and \"uh\". They were seen as a sign of nervousness or poor preparation. However, research on spontaneous conversation suggests that fillers actually play an important role.",
          "Fillers signal to the listener that you are still thinking and that you intend to keep talking. In other words, they help you keep your turn. Some studies have even found that listeners pay more attention to the word that comes right after an \"um\", because they expect something new or difficult.",
          "For English learners, the problem isn't using fillers; it's using the wrong ones. Saying \"este…\" or \"o sea…\" in the middle of an English sentence breaks the flow and reminds you that you are translating. Replace them with English fillers and you'll be able to think in real time without losing your listener.",
        ],
        glossary: [
          { en: 'fillers', es: 'muletillas, rellenos' },
          { en: 'spontaneous', es: 'espontáneo' },
          { en: 'keep your turn', es: 'conservar el turno (de habla)' },
          { en: 'flow', es: 'fluidez, ritmo' },
        ],
        questions: [
          { q: 'What was the traditional view of fillers?', options: ['They are a sign of intelligence', 'They should be eliminated', 'They help you keep your turn'], answer: 1 },
          { q: 'According to research, what do fillers signal?', options: ["That you've finished speaking", "That you're still thinking and want to continue", 'That you are lying'], answer: 1 },
          { q: 'What happens with the word after "um"?', options: ['Listeners ignore it', 'Listeners pay more attention to it', 'It is usually a mistake'], answer: 1 },
          { q: "What is the learner's real problem, according to the author?", options: ['Using fillers at all', 'Using fillers from their native language', 'Speaking too slowly'], answer: 1 },
        ],
      },
      culture: {
        title: '"Like", "you know" y la generación Z',
        body: 'En EE. UU. "like" se usa muchísimo para citar a alguien ("She was like, \'No way!\'") o para aproximar ("It was like ten dollars"). Es totalmente natural entre amigos. En una entrevista de trabajo o una presentación, cámbialo por "around", "about" o "she said". Saber cuándo cambiar de registro es parte de sonar fluido.',
      },
      mission: {
        title: 'El reto del minuto sin silencio',
        task: 'Pon un cronómetro de 60 segundos y habla sin parar sobre un tema difícil (por ejemplo: "¿Cuál es el mejor invento de la historia?"). Está prohibido el silencio y está prohibido el español: usa muletillas inglesas para pensar.',
        steps: ['Empieza con "That\'s a good question…"', 'Usa al menos 3 rellenos distintos', 'Si no sabes una palabra, descríbela', 'Cierra con "Anyway, that\'s what I think."'],
        model: "Hmm, that's a good question. Well, I mean, there are so many… Let me think. I'd say the internet. Basically, it changed everything — how we work, how we, um, what's the word… communicate. Anyway, that's what I think.",
      },
      exercises: [
        { type: 'choice', prompt: 'No recuerdas la palabra "destornillador". ¿Qué haces?', options: ['Te quedas callado.', 'Dices "the thing you use to turn screws".', 'Dices la palabra en español y sigues.'], answer: 1 },
        { type: 'dictation', audio: "Let me think about it for a second.", translation: 'Déjame pensarlo un segundo.' },
        { type: 'fill', sentence: "It's ___ of complicated, you know?", answers: ['kind', 'sort'], hint: 'más o menos' },
        { type: 'listen', audio: "Off the top of my head, I'd say around fifty people.", options: ['Calculo, sin pensarlo mucho, unas 50 personas.', 'Hay exactamente 50 personas.', 'Me duele la cabeza con 50 personas.'], answer: 0 },
        { type: 'fix', sentence: 'I don\'t know how say it.', answers: ["I don't know how to say it."], explanation: 'how TO + verbo.' },
        { type: 'dictation', audio: "That's a good question.", translation: 'Buena pregunta.' },
        { type: 'match', prompt: 'Une cada muletilla con su función', pairs: [['Let me think…', 'Ganar tiempo'], ['I mean…', 'Aclarar'], ['Anyway…', 'Volver al tema'], ['By the way…', 'Cambiar de tema']] },
        { type: 'order', words: ['I', "don't", 'know', 'the', 'exact', 'word'], translation: 'No sé la palabra exacta.' },
        { type: 'fix', sentence: 'How do you call this in English?', answers: ['What do you call this in English?', 'How do you say this in English?'], explanation: '"What do you call…?" o "How do you say…?".' },
        { type: 'truefalse', statement: 'Según la lectura, usar muletillas en inglés siempre es una señal de mala preparación.', answer: false, explanation: 'Ayudan a mantener el turno; el problema es usar las del español.' },
      ],
    },
    // M1L3 · Small talk
    {
      vocabulary: [
        { en: 'Nice weather, huh?', es: 'Buen clima, ¿no?', example: 'Nice weather today, huh?', emoji: '☀️' },
        { en: 'How was your weekend?', es: '¿Qué tal tu fin de semana?', example: 'Hey! How was your weekend?', emoji: '🗓️' },
        { en: 'Long time no see', es: '¡Cuánto tiempo!', example: 'Long time no see! How have you been?', emoji: '👀' },
        { en: 'Hang in there', es: 'Ánimo, aguanta', example: 'Busy week? Hang in there!', emoji: '💪' },
        { en: 'I should let you go', es: 'Te dejo seguir', example: 'Well, I should let you go. See you around!', emoji: '🚪' },
        { en: 'Small world!', es: '¡El mundo es un pañuelo!', example: "You know Carlos? Small world!", emoji: '🌍' },
      ],
      mistakes: [
        { wrong: 'How are you? — Terrible, my boss is horrible and I have problems with…', right: "How are you? — Pretty good, thanks! A bit busy. How about you?", why: 'En small talk las respuestas son ligeras y positivas. Las quejas largas se guardan para amigos cercanos.' },
        { wrong: 'And you are married? How much money do you make?', right: 'So, what do you do for fun?', why: 'Estado civil, salario y edad son temas personales. Hobbies, viajes y planes son seguros.' },
        { wrong: 'Bye. (y te vas de golpe)', right: "Well, it was great chatting with you. I'll let you get back to work!", why: 'En inglés se "aterriza" la conversación antes de irse. Cortar de golpe parece grosero.' },
        { wrong: 'The weather is very hot, no?', right: "It's really hot today, isn't it?", why: 'En lugar de ", no?" usa question tags (isn\'t it?, don\'t you?) o "huh?" en registro informal.' },
      ],
      pronunciation: {
        focus: 'La entonación de los question tags',
        tip: 'Si el tag BAJA, no estás preguntando: solo buscas que la otra persona esté de acuerdo ("Nice day, isn\'t it? ↘"). Si SUBE, sí tienes una duda real ("You\'re from Cali, aren\'t you? ↗"). En small talk casi siempre bajan.',
        words: [
          { word: "Lovely day, isn't it?", sounds: '↘ baja: buscas acuerdo', es: 'Lindo día, ¿no?' },
          { word: "You're new here, aren't you?", sounds: '↗ sube: tienes la duda', es: 'Eres nuevo, ¿cierto?' },
          { word: "It's freezing, isn't it?", sounds: '↘ baja', es: 'Está helando, ¿no?' },
          { word: "You know Ana, don't you?", sounds: '↗ sube', es: 'Conoces a Ana, ¿verdad?' },
        ],
      },
      reading: {
        title: 'The art of small talk',
        paragraphs: [
          "Many Latin Americans find English small talk strange. Why would a stranger in an elevator comment on the weather? Isn't it a bit superficial? But small talk isn't really about the weather. It's a social ritual whose purpose is to show that you are friendly and approachable.",
          "The secret is the FORD method: Family, Occupation, Recreation and Dreams. These four topics are safe in almost any context and they open the door to deeper conversations. \"Do you have any plans for the holidays?\" can quickly turn into a story about a family trip or a dream of living abroad.",
          "Equally important is knowing how to end the conversation gracefully. Native speakers use \"exit lines\" such as \"Well, I should get going\" or \"I'll let you get back to it\". These phrases close the chat warmly, so everyone leaves with a good impression and no awkward silence.",
        ],
        glossary: [
          { en: 'approachable', es: 'accesible, fácil de abordar' },
          { en: 'abroad', es: 'en el extranjero' },
          { en: 'gracefully', es: 'con elegancia' },
          { en: 'awkward', es: 'incómodo' },
        ],
        questions: [
          { q: 'What is the real purpose of small talk?', options: ['To get information about the weather', 'To show you are friendly and approachable', 'To make business deals'], answer: 1 },
          { q: 'What does the "R" in FORD stand for?', options: ['Religion', 'Recreation', 'Relationships'], answer: 1 },
          { q: 'What are "exit lines"?', options: ['Phrases to end a conversation politely', 'Emergency exits', 'Questions about work'], answer: 0 },
          { q: 'Which question follows the FORD method?', options: ['How much is your rent?', 'Who did you vote for?', 'Any plans for the holidays?'], answer: 2 },
        ],
      },
      culture: {
        title: 'El clima: el tema favorito de los británicos',
        body: 'En Reino Unido hablar del clima es casi un deporte nacional. "Lovely day, isn\'t it?" o "Terrible weather, huh?" son maneras de iniciar contacto con cualquiera: el vecino, el cajero, un desconocido en el bus. No esperan una opinión meteorológica: responde con acuerdo y algo de humor ("At least it\'s not raining!").',
      },
      mission: {
        title: 'Tres conversaciones de 2 minutos',
        task: 'Practica tres escenas de small talk (en voz alta, con un compañero o con IA): en el ascensor con un vecino, en la cocina de la oficina con un colega y en un evento con un desconocido. Cada una debe tener apertura, 2 preguntas FORD y una frase de salida.',
        steps: ['Apertura: clima, lugar o situación', 'Dos preguntas FORD', 'Una reacción con interés ("Oh, nice!")', 'Frase de salida cálida'],
        model: "Hi! Crazy rain today, huh? — I know! — So, are you new in the building? — Yeah, I moved in last week. — Oh, nice! Where did you move from? — Bogotá. — Cool! Well, this is my floor. Nice meeting you!",
      },
      exercises: [
        { type: 'choice', prompt: 'Un colega pregunta "How are you?" en el pasillo. ¿Cuál es la respuesta más natural?', options: ['I have many problems with my family.', 'Pretty good, thanks! You?', 'Fine. (y sigues caminando)'], answer: 1 },
        { type: 'dictation', audio: 'Long time no see! How have you been?', translation: '¡Cuánto tiempo! ¿Cómo has estado?' },
        { type: 'fix', sentence: 'The weather is very nice, no?', answers: ["The weather is very nice, isn't it?", "The weather's very nice, isn't it?"], explanation: 'Usa un question tag: isn\'t it?' },
        { type: 'fill', sentence: "You work in marketing, ___ you?", answers: ["don't", 'do not'], hint: 'tag para "you work"' },
        { type: 'listen', audio: "Well, I should let you go. See you around!", options: ['Bueno, te dejo seguir. ¡Nos vemos!', 'Bueno, deberías irte ya.', 'Bueno, déjame ir contigo.'], answer: 0 },
        { type: 'choice', prompt: '¿Qué pregunta es mejor para small talk con alguien que acabas de conocer?', options: ['How old are you?', 'Do you have any plans for the weekend?', 'Are you married?'], answer: 1 },
        { type: 'dictation', audio: "Nice weather today, isn't it?", translation: 'Lindo clima hoy, ¿no?' },
        { type: 'fix', sentence: "She's from Canada, doesn't she?", answers: ["She's from Canada, isn't she?", 'She is from Canada, isn\'t she?'], explanation: '"She\'s" = she is → isn\'t she?' },
        { type: 'match', prompt: 'Une la frase con la situación', pairs: [['Hang in there!', 'Alguien tiene una semana difícil'], ['Small world!', 'Tienen un amigo en común'], ['Long time no see!', 'No se veían hace meses'], ['I should get going.', 'Quieres terminar la charla']] },
        { type: 'truefalse', statement: 'En el método FORD, la "D" significa "Dreams".', answer: true },
      ],
    },
  ],
  // ─── Módulo 2: Cuenta historias ─────────────────────────────────────────
  [
    // M2L1 · Pasado simple y continuo
    {
      vocabulary: [
        { en: 'Bump into', es: 'Encontrarse por casualidad', example: 'I bumped into my ex at the mall!', emoji: '😳' },
        { en: 'Run out of', es: 'Quedarse sin', example: 'We ran out of gas on the highway.', emoji: '⛽' },
        { en: 'Break down', es: 'Vararse, dañarse', example: 'The bus broke down in the middle of nowhere.', emoji: '🚌' },
        { en: 'Get lost', es: 'Perderse', example: 'We got lost in the old town.', emoji: '🧭' },
        { en: 'Miss (a flight)', es: 'Perder (un vuelo)', example: 'I almost missed my flight.', emoji: '✈️' },
        { en: 'As soon as', es: 'Tan pronto como', example: 'As soon as I arrived, it started to rain.', emoji: '⏱️' },
      ],
      mistakes: [
        { wrong: 'When I was walking, I was seeing an accident.', right: 'When I was walking, I saw an accident.', why: 'El pasado continuo es para la acción larga de fondo; la acción corta que interrumpe va en pasado simple. Además, "see" casi nunca se usa en continuo.' },
        { wrong: 'Yesterday I go to the beach.', right: 'Yesterday I went to the beach.', why: 'Si dices "yesterday", el verbo tiene que ir en pasado. Muchos estudiantes lo saben, pero al hablar rápido se les olvida.' },
        { wrong: 'Did you went to the party?', right: 'Did you go to the party?', why: 'Con "did" el verbo vuelve a la forma base. El pasado ya lo lleva el "did".' },
        { wrong: 'I losted my phone.', right: 'I lost my phone.', why: 'Los verbos irregulares no llevan -ed. Lost, broke, fell, ran: hay que memorizarlos (por bloques, no en listas).' },
      ],
      pronunciation: {
        focus: 'Las tres formas de -ed',
        tip: 'La -ed suena /t/ después de sonidos sordos (walked, stopped), /d/ después de sonidos sonoros (played, called) e /ɪd/ SOLO después de t o d (wanted, needed). El error clásico es decir "walk-ED" con sílaba extra: suena "uokt".',
        words: [
          { word: 'walked', sounds: '/wɔːkt/ — "uokt" (1 sílaba)' },
          { word: 'stopped', sounds: '/stɑːpt/ — "stapt"' },
          { word: 'called', sounds: '/kɔːld/ — "kold"' },
          { word: 'wanted', sounds: '/ˈwɑːntɪd/ — "UAN-tid" (2 sílabas)' },
          { word: 'needed', sounds: '/ˈniːdɪd/ — "NII-did"' },
        ],
      },
      reading: {
        title: 'The day everything went wrong',
        paragraphs: [
          "Last December, my sister and I were driving from Bogotá to Villa de Leyva for a weekend getaway. The sun was shining, we were singing along to old reggaeton songs and everything was perfect. Then, about an hour into the trip, the car started making a strange noise.",
          "While my sister was looking for a mechanic on her phone, the engine suddenly stopped. We were in the middle of nowhere and there was no signal. We waited for forty minutes. Nobody stopped. Just when we were starting to panic, a farmer appeared on a tractor and offered to help.",
          "He towed us to the next town, where his cousin fixed the car in two hours. While we were waiting, his family invited us to lunch: ajiaco, arepas and hot chocolate. We arrived in Villa de Leyva late, but honestly, that lunch was the best part of the whole trip.",
        ],
        glossary: [
          { en: 'getaway', es: 'escapada' },
          { en: 'singing along', es: 'cantando (con la música)' },
          { en: 'signal', es: 'señal (de celular)' },
          { en: 'towed', es: 'remolcó' },
        ],
        questions: [
          { q: 'What were they doing when the car started making a noise?', options: ['Looking for a mechanic', 'Driving and singing', 'Having lunch'], answer: 1 },
          { q: 'Why couldn\'t they call for help?', options: ['There was no signal', "Their phone didn't have battery", 'They lost the phone'], answer: 0 },
          { q: 'Who fixed the car?', options: ['The farmer', "The farmer's cousin", 'The narrator\'s sister'], answer: 1 },
          { q: 'What was the best part of the trip for the narrator?', options: ['Villa de Leyva', 'The reggaeton songs', 'The lunch with the family'], answer: 2 },
        ],
      },
      culture: {
        title: 'Las historias se cuentan en presente (a veces)',
        body: 'En conversaciones informales los nativos a veces cuentan anécdotas en presente para darles más drama: "So I\'m walking down the street, and this guy comes up to me and says…". Se llama "historical present". Entiéndelo cuando lo escuches, pero para ti lo más seguro es combinar el pasado simple y el continuo.',
      },
      mission: {
        title: 'Cuenta un día que salió mal',
        task: 'Graba un audio de 90 segundos contando un día en que algo salió mal (un viaje, un examen, una cita). Usa al menos 3 frases con "was/were + -ing" interrumpidas por una acción en pasado simple.',
        steps: ['Pinta la escena: "It was raining, I was…"', 'La interrupción: "when suddenly…"', 'Qué hiciste después', 'Cómo terminó'],
        model: "It was a Monday. I was running to catch the bus because I was late for a job interview. While I was crossing the street, my coffee fell all over my shirt! I bought a new shirt at a store nearby, and in the end, I got the job.",
      },
      exercises: [
        { type: 'fix', sentence: 'Yesterday I go to the gym.', answers: ['Yesterday I went to the gym.'], explanation: 'Yesterday → pasado: went.' },
        { type: 'dictation', audio: 'I was cooking when the lights went out.', translation: 'Estaba cocinando cuando se fue la luz.' },
        { type: 'choice', prompt: 'Elige la opción correcta', options: ['While I watched TV, the phone was ringing.', 'While I was watching TV, the phone rang.', 'While I was watching TV, the phone was ring.'], answer: 1 },
        { type: 'fix', sentence: 'Did you saw the game last night?', answers: ['Did you see the game last night?'], explanation: 'Did + verbo base.' },
        { type: 'listen', audio: 'We ran out of gas on the highway.', options: ['Nos quedamos sin gasolina en la autopista.', 'Corrimos por la autopista.', 'Salimos de la autopista.'], answer: 0 },
        { type: 'choice', prompt: '¿Cómo suena la -ed en "wanted"?', options: ['/t/', '/d/', '/ɪd/ (sílaba extra)'], answer: 2 },
        { type: 'dictation', audio: 'Suddenly, the bus broke down.', translation: 'De repente, el bus se varó.' },
        { type: 'fill', sentence: 'They ___ (play) soccer when it started to rain.', answers: ['were playing'], hint: 'pasado continuo, plural' },
        { type: 'fix', sentence: 'She losted her keys.', answers: ['She lost her keys.'], explanation: 'Lose → lost (irregular).' },
        { type: 'truefalse', statement: 'En la lectura, el granjero llegó en carro para ayudarlos.', answer: false, explanation: 'Llegó en un tractor.' },
      ],
    },
    // M2L2 · Presente perfecto
    {
      vocabulary: [
        { en: 'So far', es: 'Hasta ahora', example: "So far, I've visited six countries.", emoji: '📍' },
        { en: 'Just', es: 'Acabar de', example: "I've just finished my homework.", emoji: '⚡' },
        { en: 'Once in a lifetime', es: 'Una vez en la vida', example: 'It was a once-in-a-lifetime experience.', emoji: '🌠' },
        { en: 'Bucket list', es: 'Lista de cosas por hacer antes de morir', example: 'Skydiving is on my bucket list.', emoji: '📝' },
        { en: 'Lately', es: 'Últimamente', example: "I've been really busy lately.", emoji: '🕰️' },
        { en: 'Been to', es: 'Haber ido a (y vuelto)', example: "Have you ever been to Japan?", emoji: '🗾' },
      ],
      mistakes: [
        { wrong: 'I have visited Paris in 2019.', right: 'I visited Paris in 2019.', why: 'Si dices CUÁNDO pasó (in 2019, last year, yesterday), usa pasado simple. El presente perfecto es para experiencias sin fecha.' },
        { wrong: 'I live here since five years.', right: "I've lived here for five years.", why: 'Para algo que empezó en el pasado y sigue hoy, se usa presente perfecto. "For" + duración; "since" + punto de inicio.' },
        { wrong: 'Have you ever gone to Cartagena?', right: 'Have you ever been to Cartagena?', why: '"Been to" = has ido y regresado. "Gone to" = se fue y todavía está allá: "She\'s gone to Spain".' },
        { wrong: 'I didn\'t finish yet.', right: "I haven't finished yet.", why: '"Yet" va casi siempre con presente perfecto en inglés británico y en el habla cuidada.' },
      ],
      pronunciation: {
        focus: 'Contracciones del presente perfecto',
        tip: 'Nadie dice "I have been" completo en conversación: se dice "I\'ve been" (aivbin). Y "She has gone" se dice "She\'s gone". Si no usas contracciones, sonarás robótico y te costará entender a los nativos.',
        words: [
          { word: "I've been", sounds: '"aiv-BIN"', es: 'he estado / he ido' },
          { word: "She's done", sounds: '"shiiz-DAN"', es: 'ella ha hecho' },
          { word: "We've seen", sounds: '"uiv-SIIN"', es: 'hemos visto' },
          { word: "I haven't", sounds: '"ai-JA-vent"', es: 'yo no he' },
          { word: "Have you ever…?", sounds: '"ja-viu-E-ver"', es: '¿Alguna vez has…?' },
        ],
      },
      reading: {
        title: "A traveler's confession",
        paragraphs: [
          "I've been to twenty-three countries so far, and people often ask me what my favorite one is. The truth is, I've never been able to answer that question. Every place has surprised me in a different way.",
          "I've slept in an ice hotel in Sweden, I've eaten fried tarantula in Cambodia and I've gotten lost in the markets of Marrakech more times than I can count. But the experience that changed me most happened close to home: last year I walked for four days to reach Ciudad Perdida, in the Sierra Nevada de Santa Marta.",
          "Since that trip, I've started to travel differently. I've stopped collecting stamps in my passport and I've started looking for slow, meaningful experiences. I haven't decided where to go next yet, but I know it won't be about the number of countries.",
        ],
        glossary: [
          { en: 'so far', es: 'hasta ahora' },
          { en: 'tarantula', es: 'tarántula' },
          { en: 'reach', es: 'llegar a' },
          { en: 'meaningful', es: 'significativo' },
        ],
        questions: [
          { q: 'How many countries has the writer visited?', options: ['13', '23', '33'], answer: 1 },
          { q: 'Which experience changed the writer the most?', options: ['The ice hotel', 'The trip to Ciudad Perdida', 'The markets of Marrakech'], answer: 1 },
          { q: 'Why does the writer use "walked" (past simple) for Ciudad Perdida?', options: ['Because it says when it happened: last year', "Because it's an irregular verb", 'Because it is still happening'], answer: 0 },
          { q: 'What has changed in the way the writer travels?', options: ['Visits more countries', 'Looks for slow, meaningful experiences', 'Only travels in Colombia'], answer: 1 },
        ],
      },
      culture: {
        title: 'Diferencias EE. UU. vs. Reino Unido',
        body: 'Los británicos usan el presente perfecto mucho más: "I\'ve just eaten", "Have you finished yet?". En EE. UU. es muy común oír el pasado simple en esos casos: "I just ate", "Did you finish yet?". Ambas son correctas. Si vas a presentar el IELTS, mejor usa la versión británica; en la vida diaria, cualquiera funciona.',
      },
      mission: {
        title: 'Juego: "Have you ever…?"',
        task: 'Escribe 8 preguntas "Have you ever…?" interesantes. Házselas a alguien (o respóndelas tú). Por cada "Yes", pide detalles en pasado simple: When? Where? What happened?',
        steps: ['8 preguntas con participios distintos', 'Si la respuesta es sí: When did you…?', 'Termina con tu bucket list: "I\'ve never…, but I\'d love to."'],
        model: "Have you ever eaten something really weird? — Yes, I have! — Really? What did you eat? — I ate ants in Santander. — How did they taste? — Crunchy! … I've never gone skydiving, but I'd love to.",
      },
      exercises: [
        { type: 'fix', sentence: 'I have seen that movie last week.', answers: ['I saw that movie last week.'], explanation: '"Last week" → pasado simple.' },
        { type: 'dictation', audio: "Have you ever been to Mexico?", translation: '¿Alguna vez has ido a México?' },
        { type: 'choice', prompt: 'Tu amiga se mudó a Madrid y sigue allá. ¿Qué dices?', options: ["She's been to Madrid.", "She's gone to Madrid.", 'She went to Madrid already.'], answer: 1 },
        { type: 'fix', sentence: 'I work here since 2020.', answers: ["I've worked here since 2020.", 'I have worked here since 2020.', "I've been working here since 2020.", 'I have been working here since 2020.'], explanation: 'Desde el pasado hasta hoy → presente perfecto.' },
        { type: 'fill', sentence: "We've lived in Cali ___ ten years.", answers: ['for'], hint: 'duración' },
        { type: 'listen', audio: "I've just finished the report.", options: ['Acabo de terminar el informe.', 'Solo terminé el informe.', 'Ya casi termino el informe.'], answer: 0 },
        { type: 'dictation', audio: "I haven't decided yet.", translation: 'Todavía no lo he decidido.' },
        { type: 'match', prompt: 'Une la palabra con su uso', pairs: [['for', 'duración (5 years)'], ['since', 'punto de inicio (2018)'], ['yet', 'negativas y preguntas'], ['already', 'antes de lo esperado']] },
        { type: 'order', words: ["I've", 'never', 'tried', 'sushi', 'before'], translation: 'Nunca he probado el sushi.' },
        { type: 'truefalse', statement: 'El viajero de la lectura ya decidió su próximo destino.', answer: false, explanation: '"I haven\'t decided where to go next yet."' },
      ],
    },
    // M2L3 · Anécdotas
    {
      vocabulary: [
        { en: 'You won\'t believe what happened', es: 'No vas a creer lo que pasó', example: "You won't believe what happened to me today!", emoji: '😱' },
        { en: 'To make a long story short', es: 'Para no hacerte el cuento largo', example: 'To make a long story short, we missed the flight.', emoji: '✂️' },
        { en: 'It turned out that…', es: 'Resultó que…', example: 'It turned out that he was the new boss.', emoji: '🔄' },
        { en: 'I couldn\'t believe my eyes', es: 'No podía creer lo que veía', example: "I opened the door and I couldn't believe my eyes.", emoji: '👁️' },
        { en: 'Burst out laughing', es: 'Estallar en risa', example: 'Everyone burst out laughing.', emoji: '🤣' },
        { en: 'Meanwhile', es: 'Mientras tanto', example: 'Meanwhile, my phone kept ringing.', emoji: '⏸️' },
      ],
      mistakes: [
        { wrong: 'And then… and then… and then…', right: 'At first… Then… After that… Eventually…', why: 'Repetir "and then" hace la historia monótona. Varía los conectores de secuencia.' },
        { wrong: 'It was very funny. (sin contar por qué)', right: 'Everyone burst out laughing, even the teacher.', why: 'Muestra, no digas. Describe la reacción en lugar de decir solo "funny" o "scary".' },
        { wrong: 'The history of my trip is very interesting.', right: 'The story of my trip is very interesting.', why: '"History" es la historia como ciencia o el pasado. Un relato o anécdota es "story".' },
        { wrong: 'I was very surprise.', right: 'I was very surprised.', why: 'Para cómo te sientes se usa -ed (surprised, bored, excited); para lo que causa la emoción, -ing (surprising, boring).' },
      ],
      pronunciation: {
        focus: 'Ritmo y suspenso: dónde hacer pausas',
        tip: 'Contar bien en inglés es cuestión de ritmo. Haz una pausa ANTES del momento clave y baja el volumen ("And then… [pausa] …the door opened."). Acelera en las partes de contexto y desacelera en el clímax.',
        words: [
          { word: "You won't believe this…", sounds: 'pausa después de "this"', es: 'No vas a creer esto…' },
          { word: 'And guess what?', sounds: '"and-GUES-uat" ↗', es: '¿Y adivina qué?' },
          { word: 'It turned out…', sounds: '"it-TERND-aut" + pausa', es: 'Resultó que…' },
          { word: 'Out of nowhere', sounds: '"au-dov-NOU-uer"', es: 'De la nada' },
        ],
      },
      reading: {
        title: 'The wrong wedding',
        paragraphs: [
          "This happened to my uncle Fernando, and our family still talks about it. A few years ago he was invited to the wedding of a colleague in Medellín. He'd never been to that church before, but he had the address on his phone, so he wasn't worried.",
          "He arrived a bit late, sat in the back and enjoyed the ceremony. He even cried a little when the couple said their vows. Then he went to the reception, ate, danced and gave a very emotional toast about \"his dear friend Andrés\". People looked a little confused, but they applauded politely.",
          "It turned out that the groom's name was Santiago. There were two weddings that afternoon in two churches on the same street, and my uncle had gone to the wrong one. To make a long story short, the couple found it hilarious and invited him to their first anniversary. He went, of course.",
        ],
        glossary: [
          { en: 'colleague', es: 'colega' },
          { en: 'vows', es: 'votos (matrimoniales)' },
          { en: 'toast', es: 'brindis' },
          { en: 'groom', es: 'novio (el que se casa)' },
        ],
        questions: [
          { q: 'Why was Fernando not worried about finding the church?', options: ['He knew the city well', 'He had the address on his phone', 'He went with a friend'], answer: 1 },
          { q: 'Why did people look confused during his toast?', options: ['He spoke in English', 'He used the wrong name for the groom', 'He was very late'], answer: 1 },
          { q: 'What was the cause of the confusion?', options: ['Two weddings on the same street', 'His phone was wrong', 'The colleague changed his name'], answer: 0 },
          { q: 'How did the couple react?', options: ['They were angry', 'They called the police', 'They found it funny and invited him again'], answer: 2 },
        ],
      },
      culture: {
        title: 'La autocrítica con humor (self-deprecating humor)',
        body: 'En la cultura británica y estadounidense, las mejores anécdotas suelen ser aquellas en las que el narrador queda mal o hace el ridículo. Reírse de uno mismo genera confianza y cercanía. Por eso, en una entrevista o en una presentación, una pequeña historia de un error tuyo (y lo que aprendiste) funciona mejor que presumir.',
      },
      mission: {
        title: 'Tu mejor anécdota en 2 minutos',
        task: 'Escoge tu anécdota más divertida o vergonzosa y cuéntala en 2 minutos usando la estructura: gancho, contexto, problema, clímax, final y reflexión. Grábate dos veces y quédate con la mejor.',
        steps: ['Gancho: "You won\'t believe what happened…"', 'Contexto con pasado continuo', 'Clímax con pausa', 'Cierre: "To make a long story short…"', 'Reflexión o remate final'],
        model: "You won't believe what happened on my first day at work. I was trying to make a good impression… I sent a funny meme to my best friend, but out of nowhere, I realized I'd sent it to the whole company! To make a long story short, my boss replied with another meme. Since then, I always check twice before I hit send.",
      },
      exercises: [
        { type: 'fix', sentence: 'I was very bored in the class because it was very bored.', answers: ['I was very bored in the class because it was very boring.'], explanation: 'Cómo te sientes (-ed) vs. lo que lo causa (-ing).' },
        { type: 'dictation', audio: 'It turned out that he was the new boss.', translation: 'Resultó que era el nuevo jefe.' },
        { type: 'choice', prompt: '¿Qué palabra usas para "anécdota"?', options: ['history', 'story', 'historic'], answer: 1 },
        { type: 'listen', audio: 'To make a long story short, we missed the flight.', options: ['Para no alargar el cuento, perdimos el vuelo.', 'La historia fue corta y perdimos el vuelo.', 'Hicimos un vuelo corto.'], answer: 0 },
        { type: 'fix', sentence: 'I was very surprise when I saw him.', answers: ['I was very surprised when I saw him.'], explanation: 'Sentimiento → -ed.' },
        { type: 'order', words: ['Everyone', 'burst', 'out', 'laughing'], translation: 'Todos estallaron en risa.' },
        { type: 'dictation', audio: "You won't believe what happened!", translation: '¡No vas a creer lo que pasó!' },
        { type: 'match', prompt: 'Ordena la historia: une la etapa con su conector', pairs: [['Inicio', 'At first'], ['Desarrollo', 'After that'], ['Giro', 'Out of nowhere'], ['Final', 'In the end']] },
        { type: 'fill', sentence: "I opened the box and I couldn't believe my ___.", answers: ['eyes'], hint: 'no podía creer lo que veía' },
        { type: 'truefalse', statement: 'En la lectura, el tío Fernando nunca volvió a ver a la pareja.', answer: false, explanation: 'Lo invitaron a su primer aniversario y fue.' },
      ],
    },
  ],
  // ─── Módulo 3: Suena natural ────────────────────────────────────────────
  [
    // M3L1 · Phrasal verbs
    {
      vocabulary: [
        { en: 'Look up', es: 'Buscar (información)', example: 'Look it up on Google.', emoji: '🔎' },
        { en: 'Put off', es: 'Posponer', example: "Don't put off your homework.", emoji: '⏭️' },
        { en: 'Come up with', es: 'Ocurrírsele (una idea)', example: 'She came up with a great idea.', emoji: '💡' },
        { en: 'Get along with', es: 'Llevarse bien con', example: 'I get along with my coworkers.', emoji: '🤗' },
        { en: 'Look after', es: 'Cuidar', example: 'Can you look after my dog this weekend?', emoji: '🐶' },
        { en: 'Catch up on', es: 'Ponerse al día con', example: 'I need to catch up on sleep.', emoji: '😴' },
        { en: 'Call off', es: 'Cancelar', example: 'They called off the meeting.', emoji: '🚫' },
      ],
      mistakes: [
        { wrong: 'I need to search it in Google.', right: 'I need to look it up (on Google).', why: '"Look up" es lo natural para buscar información. "Search for" también sirve, pero "search it" no.' },
        { wrong: 'Turn off it.', right: 'Turn it off.', why: 'Con phrasal verbs separables, si el objeto es un pronombre (it, them, him) DEBE ir en medio.' },
        { wrong: 'I look after my keys everywhere.', right: "I'm looking for my keys everywhere.", why: '"Look for" es buscar; "look after" es cuidar. Una preposición cambia todo el significado.' },
        { wrong: 'We postponed the meeting for Monday.', right: 'We put off the meeting until Monday.', why: '"Postpone" es correcto pero formal; en conversación se dice "put off" y se usa "until", no "for".' },
      ],
      pronunciation: {
        focus: 'El acento va en la partícula',
        tip: 'En los phrasal verbs el acento fuerte casi siempre cae en la partícula (up, out, off), no en el verbo: "give UP", "find OUT", "show UP". Si acentúas el verbo, suena extraño. Y las palabras se unen: "give up" → "gi-VAP".',
        words: [
          { word: 'give up', sounds: '"gi-VAP"', es: 'rendirse' },
          { word: 'find out', sounds: '"fain-DAUT"', es: 'averiguar' },
          { word: 'turn it off', sounds: '"ter-ni-DOF"', es: 'apagarlo' },
          { word: 'pick me up', sounds: '"pik-mi-AP"', es: 'recógeme' },
          { word: 'work out', sounds: '"uor-KAUT"', es: 'ejercitarse / funcionar' },
        ],
      },
      reading: {
        title: 'Texts between two roommates',
        paragraphs: [
          "Mia: Hey! Are you coming back home tonight? The landlord came by. He says they're going to turn off the water tomorrow from 8 to 12 to fix a pipe. Can you fill up some bottles before you go to bed?",
          "Leo: Sure, no problem. Btw, I ran into Carla at the gym. She's throwing a party on Saturday and she asked if we wanted to come. I told her I'd check with you. Are you up for it?",
          "Mia: I'd love to, but I have to look after my sister's kids on Saturday. She just found out she has a work trip. Maybe I can drop by later if they go to bed early. Leo: OK, I'll let Carla know. And don't worry about dinner, I'll pick up some pizza on my way back.",
        ],
        glossary: [
          { en: 'landlord', es: 'arrendador, dueño' },
          { en: 'pipe', es: 'tubo' },
          { en: 'are you up for it?', es: '¿te animas?' },
          { en: 'drop by', es: 'pasar un rato (de visita)' },
        ],
        questions: [
          { q: 'Why will the water be turned off?', options: ["They didn't pay the bill", 'To fix a pipe', "It's a holiday"], answer: 1 },
          { q: 'Where did Leo see Carla?', options: ['At the gym', 'At a party', 'At home'], answer: 0 },
          { q: "Why can't Mia go to the party early?", options: ["She's working", "She's taking care of her sister's kids", "She's sick"], answer: 1 },
          { q: '"I\'ll pick up some pizza" means Leo will…', options: ['make pizza', 'buy and bring pizza', 'order pizza delivery'], answer: 1 },
        ],
      },
      culture: {
        title: 'Phrasal verbs en lo cotidiano, latinismos en lo formal',
        body: 'El inglés tiene dos "capas": la germánica (phrasal verbs: find out, put off, come back) y la latina (discover, postpone, return). Los hispanohablantes tienden a usar la latina porque se parece al español, y por eso suenan formales en conversación. Regla práctica: con amigos, phrasal verbs; en un ensayo o un email formal, la versión latina.',
      },
      mission: {
        title: 'Reescribe tu semana con phrasal verbs',
        task: 'Escribe 8 frases sobre tu semana (pasada o próxima) usando un phrasal verb distinto en cada una. Luego léelas en voz alta acentuando la partícula.',
        steps: ['Usa al menos 2 separables con pronombre (turn it off)', 'Incluye uno de cada: up, out, off, on', 'Léelas con el acento en la partícula'],
        model: "On Monday I woke up late and put off my workout. On Tuesday my boss called off the meeting. I came up with a new idea for the project. On Friday I hung out with my friends and caught up on gossip.",
      },
      exercises: [
        { type: 'fix', sentence: 'The music is too loud. Turn down it, please.', answers: ['The music is too loud. Turn it down, please.'], explanation: 'Pronombre en medio: turn IT down.' },
        { type: 'dictation', audio: "Don't give up!", translation: '¡No te rindas!' },
        { type: 'choice', prompt: '"They called off the concert" significa…', options: ['Llamaron al concierto.', 'Cancelaron el concierto.', 'Anunciaron el concierto.'], answer: 1 },
        { type: 'match', prompt: 'Une el phrasal verb', pairs: [['look for', 'buscar'], ['look after', 'cuidar'], ['look up', 'buscar información'], ['look forward to', 'esperar con ganas']] },
        { type: 'fix', sentence: "I don't know this word. I'll search it.", answers: ["I don't know this word. I'll look it up."], explanation: 'Buscar información = look it up.' },
        { type: 'listen', audio: 'She came up with a brilliant idea.', options: ['Se le ocurrió una idea brillante.', 'Subió con una idea brillante.', 'Vino con una amiga brillante.'], answer: 0 },
        { type: 'fill', sentence: 'I get ___ with my boss. She\'s great.', answers: ['along'], hint: 'llevarse bien' },
        { type: 'dictation', audio: 'Can you pick me up at six?', translation: '¿Me puedes recoger a las seis?' },
        { type: 'order', words: ['We', 'ran', 'out', 'of', 'coffee', 'again'], translation: 'Se nos acabó el café otra vez.' },
        { type: 'truefalse', statement: 'En los mensajes, Mía no puede ir temprano a la fiesta porque tiene que trabajar.', answer: false, explanation: 'Tiene que cuidar a los hijos de su hermana.' },
      ],
    },
    // M3L2 · Inglés rápido
    {
      vocabulary: [
        { en: 'Whatcha', es: 'What are you / What do you', example: 'Whatcha doing?', emoji: '👀' },
        { en: 'Didja', es: 'Did you', example: 'Didja see that?', emoji: '😲' },
        { en: 'Gimme', es: 'Give me', example: 'Gimme a sec.', emoji: '✋' },
        { en: 'Y\'all', es: 'Ustedes (sur de EE. UU.)', example: "Y'all coming tonight?", emoji: '🤠' },
        { en: 'Hafta', es: 'Have to', example: 'I hafta go now.', emoji: '🏃' },
        { en: 'Oughta', es: 'Ought to (debería)', example: 'You oughta try it.', emoji: '👉' },
      ],
      mistakes: [
        { wrong: 'Escribir "gonna" o "wanna" en un email de trabajo.', right: 'Write "going to" / "want to" in formal writing.', why: 'Las formas reducidas son para el habla y los chats informales. En escritos profesionales o exámenes, siempre la forma completa.' },
        { wrong: 'I gonna call you.', right: "I'm gonna call you.", why: '"Gonna" reemplaza solo a "going to". El verbo "to be" sigue siendo obligatorio (aunque a veces suene muy débil).' },
        { wrong: 'I wanna that phone.', right: 'I want that phone. / I wanna buy that phone.', why: '"Wanna" = want to, así que necesita un verbo después. Antes de un sustantivo es solo "want".' },
        { wrong: 'Intentar entender cada palabra cuando escuchas a un nativo.', right: 'Listen for stressed words (content words).', why: 'Los nativos reducen las palabras de función (to, of, and, the). Concéntrate en las palabras acentuadas: llevan el significado.' },
      ],
      pronunciation: {
        focus: 'Linking: consonante + vocal',
        tip: 'Cuando una palabra termina en consonante y la siguiente empieza por vocal, se pegan: "turn it off" → "tur-ni-doff", "pick it up" → "pi-ki-dup". En inglés americano la t entre vocales suena como una r suave (flap t): "get it" → "gue-rit".',
        words: [
          { word: 'turn it off', sounds: '"TUR-ni-DOF"' },
          { word: 'pick it up', sounds: '"PI-ki-DAP"' },
          { word: 'get out of here', sounds: '"gue-RAU-da-JIR"' },
          { word: 'a lot of', sounds: '"a-LA-da"' },
          { word: 'what do you', sounds: '"UA-da-ya" / "whaddaya"' },
        ],
      },
      reading: {
        title: 'Why you understand your teacher but not Netflix',
        paragraphs: [
          "Most English learners have had this frustrating experience: you understand your teacher perfectly, but when you watch a series without subtitles, it sounds like one long, fast word. Are the actors speaking a different language? Not exactly. They are speaking connected speech.",
          "In natural conversation, English speakers stress the important words (nouns, main verbs, adjectives) and reduce the rest. \"I want to go to the beach\" becomes \"I wanna go t'the BEACH\". Words link together, sounds disappear and vowels become a short, lazy sound called schwa. Teachers, on the other hand, tend to speak slowly and clearly.",
          "The good news is that connected speech follows rules. Once you learn the most common patterns, your listening will improve dramatically. A great exercise is shadowing: play a short clip, pause, and repeat it exactly like the actor, copying the rhythm and the reductions, not just the words.",
        ],
        glossary: [
          { en: 'connected speech', es: 'habla conectada' },
          { en: 'stress', es: 'acentuar, dar énfasis' },
          { en: 'schwa', es: 'vocal neutra /ə/' },
          { en: 'shadowing', es: 'repetir como sombra (técnica)' },
        ],
        questions: [
          { q: 'Why is it easier to understand teachers?', options: ['They use simpler grammar', 'They speak slowly and clearly', 'They speak British English'], answer: 1 },
          { q: 'Which words do native speakers usually stress?', options: ['Articles and prepositions', 'Nouns, main verbs and adjectives', 'All words equally'], answer: 1 },
          { q: 'What is "schwa"?', options: ['A short, relaxed vowel sound', 'A type of slang', 'A British accent'], answer: 0 },
          { q: 'What is shadowing?', options: ['Watching series with subtitles', 'Repeating a clip copying rhythm and reductions', 'Writing down every word you hear'], answer: 1 },
        ],
      },
      culture: {
        title: 'Acentos: no hay uno "correcto"',
        body: 'El inglés tiene cientos de acentos: americano general, sureño, neoyorquino, británico RP, londinense, escocés, australiano, indio, nigeriano… Ninguno es el "correcto". Tu acento colombiano está bien siempre que se te entienda. Concéntrate en el ritmo, el acento de las palabras y los sonidos que cambian significados, no en sonar como un nativo.',
      },
      mission: {
        title: 'Shadowing de 5 minutos',
        task: 'Escoge un clip de 30 segundos de una serie o un podcast (sin subtítulos en español). Escúchalo 3 veces, luego repítelo frase por frase imitando el ritmo y las reducciones. Grábate y compara con el original.',
        steps: ['Escucha sin leer', 'Escucha con subtítulos en inglés', 'Repite frase por frase (shadowing)', 'Grábate y compara'],
        model: 'Clip: "Whaddaya wanna do tonight?" — "I dunno, I gotta finish this thing first, but we could grab a bite after." Tú: repites con el mismo ritmo, sin pronunciar cada palabra por separado.',
      },
      exercises: [
        { type: 'listen', audio: 'Whatcha doing later?', options: ['What are you doing later?', 'What is she doing later?', 'Watch the doing later.'], answer: 0 },
        { type: 'dictation', audio: "I'm gonna call you later.", translation: 'Te voy a llamar más tarde.' },
        { type: 'fix', sentence: 'I gonna buy a new phone.', answers: ["I'm gonna buy a new phone.", "I'm going to buy a new phone.", 'I am going to buy a new phone.'], explanation: 'Falta "I\'m".' },
        { type: 'choice', prompt: '¿Dónde NO deberías escribir "wanna"?', options: ['En un chat con amigos', 'En un email a un cliente', 'En un comentario de Instagram'], answer: 1 },
        { type: 'match', prompt: 'Une la forma reducida', pairs: [['gimme', 'give me'], ['hafta', 'have to'], ['didja', 'did you'], ['lemme', 'let me']] },
        { type: 'dictation', audio: 'I want to go to the beach.', translation: 'Quiero ir a la playa.' },
        { type: 'fix', sentence: 'I wanna a coffee.', answers: ['I want a coffee.', 'I wanna get a coffee.', 'I wanna have a coffee.'], explanation: 'Antes de un sustantivo: want.' },
        { type: 'listen', audio: 'Gimme a sec.', options: ['Give me a second.', 'Give me a check.', 'Get me a sack.'], answer: 0 },
        { type: 'fill', sentence: 'I dunno = I don\'t ___.', answers: ['know'], hint: 'no sé' },
        { type: 'truefalse', statement: 'Según la lectura, el habla rápida de las series no sigue ninguna regla.', answer: false, explanation: 'El habla conectada sigue patrones que se pueden aprender.' },
      ],
    },
    // M3L3 · Opinión y debate
    {
      vocabulary: [
        { en: 'I see where you\'re coming from', es: 'Entiendo tu punto de vista', example: "I see where you're coming from, but…", emoji: '🧭' },
        { en: 'Fair enough', es: 'Me parece justo / Vale', example: 'Fair enough. You have a point.', emoji: '⚖️' },
        { en: 'I\'m not so sure about that', es: 'No estoy tan seguro', example: "I'm not so sure about that.", emoji: '🤨' },
        { en: 'Devil\'s advocate', es: 'Abogado del diablo', example: "Let me play devil's advocate.", emoji: '😈' },
        { en: 'To be fair', es: 'Para ser justos', example: "To be fair, the price is reasonable.", emoji: '🙌' },
        { en: 'Absolutely', es: 'Totalmente', example: 'Absolutely! I couldn\'t agree more.', emoji: '💯' },
      ],
      mistakes: [
        { wrong: 'You are wrong.', right: "I see your point, but I'm not sure I agree.", why: '"You\'re wrong" suena agresivo en inglés. Suaviza: reconoce la idea del otro y luego da la tuya.' },
        { wrong: 'In my opinion, I think that…', right: 'In my opinion, … / I think…', why: 'Es redundante: "in my opinion" y "I think" dicen lo mismo. Usa uno solo.' },
        { wrong: 'I am according with you.', right: 'I agree with you.', why: '"According to" significa "según" (according to the news). Para estar de acuerdo: agree.' },
        { wrong: 'Discuss (para decir "pelear")', right: 'Argue', why: '"Discuss" es conversar sobre un tema de forma calmada. Pelear o discutir acaloradamente es "argue".' },
      ],
      pronunciation: {
        focus: 'Acento de contraste para opinar',
        tip: 'Para mostrar contraste, acentúa la palabra que cambia: "I see your POINT, but I don\'t AGREE." o "It\'s not the PRICE, it\'s the QUALITY." Ese énfasis hace que tu argumento se entienda sin tener que explicarlo más.',
        words: [
          { word: 'I see your point, but…', sounds: 'acento en POINT, pausa en but' },
          { word: 'That’s true, but…', sounds: '"dats-TRUU, bat…"' },
          { word: 'I couldn\'t agree more.', sounds: '"ai-KU-dent-a-grii-MOR"' },
          { word: 'On the other hand…', sounds: '"on-dhi-A-dher-JAND"' },
        ],
      },
      reading: {
        title: 'Should cities ban cars from their centers?',
        paragraphs: [
          "More and more European cities, from Oslo to Madrid, are restricting cars in their historic centers. Supporters argue that the benefits are obvious: cleaner air, less noise, safer streets for children and more space for parks, cafés and bike lanes. Local businesses, they claim, actually gain customers because people walk more.",
          "Critics, however, are not so sure. They point out that not everyone can walk or cycle: older people, people with disabilities and workers who live far from the center depend on their cars. Some shop owners also report losing customers who now prefer shopping malls with free parking.",
          "Perhaps the answer lies somewhere in the middle. Most experts agree that car-free zones work best when cities invest first in reliable, affordable public transport. Without good alternatives, banning cars simply moves the problem somewhere else.",
        ],
        glossary: [
          { en: 'supporters', es: 'partidarios' },
          { en: 'bike lanes', es: 'ciclovías, ciclorrutas' },
          { en: 'point out', es: 'señalar' },
          { en: 'reliable', es: 'confiable' },
        ],
        questions: [
          { q: 'According to supporters, how are local businesses affected?', options: ['They lose customers', 'They gain customers because people walk more', 'They have to close'], answer: 1 },
          { q: 'Which group do critics mention?', options: ['Tourists', 'People with disabilities', 'Students'], answer: 1 },
          { q: 'What do most experts agree on?', options: ['Cars should be banned everywhere', 'Public transport must improve first', 'Cars are not a problem'], answer: 1 },
          { q: 'What is the tone of the final paragraph?', options: ['Strongly against', 'Balanced', 'Strongly in favor'], answer: 1 },
        ],
      },
      culture: {
        title: 'El desacuerdo indirecto británico',
        body: 'Los británicos son maestros del desacuerdo indirecto. "That\'s an interesting idea" puede significar "no me gusta". "I hear what you say" puede querer decir "no estoy de acuerdo y no quiero seguir hablando". "With all due respect" casi siempre anuncia una crítica fuerte. En EE. UU. la gente es más directa, pero igual suaviza con "I see your point, but…".',
      },
      mission: {
        title: 'Debate contigo mismo',
        task: 'Escoge un tema polémico (trabajo remoto, redes sociales para menores, la semana laboral de 4 días). Graba 1 minuto a favor y 1 minuto en contra. Luego graba 30 segundos con tu conclusión equilibrada.',
        steps: ['A favor: "In my opinion… because…"', 'En contra: "Let me play devil\'s advocate…"', 'Usa "On the other hand"', 'Conclusión: "All things considered…"'],
        model: "In my opinion, a four-day week is a great idea because people would be more productive and less stressed. Let me play devil's advocate, though: some companies, like hospitals, can't close one day a week. On the other hand… All things considered, I think it should be optional.",
      },
      exercises: [
        { type: 'fix', sentence: 'I am according with you.', answers: ['I agree with you.'], explanation: 'Estar de acuerdo = agree.' },
        { type: 'choice', prompt: '¿Cuál es la forma más diplomática de no estar de acuerdo?', options: ["You're wrong.", "I see your point, but I'm not sure I agree.", "That's stupid."], answer: 1 },
        { type: 'dictation', audio: "I see your point, but I don't agree.", translation: 'Entiendo tu punto, pero no estoy de acuerdo.' },
        { type: 'fix', sentence: 'In my opinion, I think that remote work is better.', answers: ['In my opinion, remote work is better.', 'I think that remote work is better.', 'I think remote work is better.'], explanation: 'No repitas: usa uno solo.' },
        { type: 'listen', audio: "Fair enough. You have a point.", options: ['Vale. Tienes razón en algo.', 'No es justo. Tienes un punto.', 'Basta. Señala el punto.'], answer: 0 },
        { type: 'match', prompt: 'Une la expresión', pairs: [['To be fair', 'Para ser justos'], ['On the other hand', 'Por otro lado'], ["I couldn't agree more", 'Estoy totalmente de acuerdo'], ['Fair enough', 'Vale, me parece justo']] },
        { type: 'choice', prompt: 'Dos personas gritan por política. Están…', options: ['discussing', 'arguing', 'debating calmly'], answer: 1 },
        { type: 'dictation', audio: "Let me play devil's advocate.", translation: 'Déjame hacer de abogado del diablo.' },
        { type: 'order', words: ['With', 'all', 'due', 'respect,', 'I', 'disagree'], translation: 'Con todo respeto, no estoy de acuerdo.' },
        { type: 'truefalse', statement: 'La lectura concluye que hay que prohibir los carros sin importar el transporte público.', answer: false, explanation: 'Dice que primero hay que invertir en transporte público.' },
      ],
    },
  ],
];
