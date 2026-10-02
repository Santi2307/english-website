import type { LessonContentInput } from '../../src/lessonContent/schema.js';

/** Conversación Fluida (B1). [módulo][lección], en el mismo orden que el seed. */
export const conversacionFluida: LessonContentInput[][] = [
  // ─── Módulo 1: Rompe el bloqueo ─────────────────────────────────────────
  [
    {
      objective: 'Dejar de traducir palabra por palabra y empezar a pensar en bloques de frases.',
      slides: [
        { en: 'Think in chunks, not in single words.', es: 'Piensa en bloques, no en palabras sueltas.' },
        { en: "I'm looking forward to it.", es: 'Tengo muchas ganas.', note: 'Traducido literal no tiene sentido: apréndelo como un bloque.' },
        { en: 'It depends on the weather.', es: 'Depende del clima.', note: 'En inglés es "depends ON", no "of".' },
        { en: "I'm used to it.", es: 'Ya estoy acostumbrado.' },
        { en: "It's up to you.", es: 'Tú decides.' },
      ],
      vocabulary: [
        { en: 'Chunk', es: 'Bloque de palabras', example: 'Learn chunks like "by the way".', emoji: '🧱' },
        { en: 'By the way', es: 'Por cierto', example: 'By the way, I saw your brother.', emoji: '💡' },
        { en: "It's up to you", es: 'Tú decides', example: "Pizza or tacos? It's up to you.", emoji: '🤷' },
        { en: 'Look forward to', es: 'Esperar con ganas', example: "I'm looking forward to the trip.", emoji: '🤩' },
        { en: 'Get used to', es: 'Acostumbrarse a', example: "You'll get used to the cold.", emoji: '🧥' },
        { en: 'Make sense', es: 'Tener sentido', example: 'That makes sense.', emoji: '✅' },
      ],
      grammar: {
        title: 'Falsos amigos y traducciones literales',
        explanation:
          'Traducir en tu cabeza hace que hables lento y con errores, porque muchas frases no funcionan igual en los dos idiomas. Aprende frases completas tal como las dicen los nativos y cuidado con los falsos amigos: palabras parecidas que significan otra cosa.',
        examples: [
          { en: 'Actually, I disagree.', es: 'En realidad, no estoy de acuerdo.', },
          { en: "I'm embarrassed.", es: 'Me da vergüenza.' },
          { en: "Let's attend the meeting.", es: 'Asistamos a la reunión.' },
          { en: 'He realized his mistake.', es: 'Se dio cuenta de su error.' },
        ],
        tip: '"Actually" no es "actualmente" (currently). "Embarrassed" no es "embarazada" (pregnant). "Realize" es "darse cuenta".',
      },
      dialogue: {
        title: 'Planeando el fin de semana',
        lines: [
          { speaker: 'Nico', en: 'Do you want to go hiking on Saturday?', es: '¿Quieres ir de caminata el sábado?' },
          { speaker: 'Paula', en: 'Sure! But it depends on the weather.', es: '¡Claro! Pero depende del clima.' },
          { speaker: 'Nico', en: 'Makes sense. Early morning or afternoon?', es: 'Tiene sentido. ¿Temprano o en la tarde?' },
          { speaker: 'Paula', en: "It's up to you. I'm used to waking up early.", es: 'Tú decides. Estoy acostumbrada a madrugar.' },
          { speaker: 'Nico', en: "Great. I'm really looking forward to it!", es: '¡Genial! ¡Tengo muchas ganas!' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '"Actually" significa:', options: ['Actualmente', 'En realidad', 'Activamente'], answer: 1, explanation: '"Actualmente" se dice "currently" o "nowadays".' },
        { type: 'choice', prompt: '¿Cómo dices "depende del clima"?', options: ['It depends of the weather.', 'It depends on the weather.', 'It depends from the weather.'], answer: 1 },
        { type: 'fill', sentence: "Pizza or burgers? It's ___ to you.", answers: ['up'] },
        { type: 'match', pairs: [['Embarrassed', 'Avergonzado'], ['Realize', 'Darse cuenta'], ['Actually', 'En realidad'], ['Currently', 'Actualmente']] },
        { type: 'order', words: ["I'm", 'looking', 'forward', 'to', 'the', 'trip'], translation: 'Tengo muchas ganas del viaje.' },
        { type: 'truefalse', statement: 'Paula está acostumbrada a levantarse temprano.', answer: true },
        { type: 'listen', audio: 'By the way, that makes a lot of sense.', options: ['Por cierto, eso tiene mucho sentido.', 'Por el camino, eso es muy raro.', 'De todos modos, no tiene sentido.'], answer: 0 },
        { type: 'speak', phrase: "It's up to you. I'm looking forward to it.", translation: 'Tú decides. Tengo muchas ganas.' },
      ],
    },
    {
      objective: 'Usar muletillas naturales para ganar tiempo sin quedarte en silencio.',
      slides: [
        { en: 'Well, let me think...', es: 'Bueno, déjame pensar...' },
        { en: "That's a good question.", es: 'Buena pregunta.', note: 'Te da segundos para organizar la idea.' },
        { en: 'You know, I kind of like it.', es: 'Pues, como que me gusta.' },
        { en: 'How can I put it?', es: '¿Cómo te lo explico?' },
        { en: 'I mean, it was okay.', es: 'O sea, estuvo bien.' },
      ],
      vocabulary: [
        { en: 'Well...', es: 'Bueno...', example: 'Well, I think it’s a good idea.', emoji: '🤔' },
        { en: 'Let me think', es: 'Déjame pensar', example: 'Hmm, let me think about it.', emoji: '💭' },
        { en: 'I mean', es: 'O sea / quiero decir', example: "It's cheap. I mean, not super cheap.", emoji: '🗣️' },
        { en: 'Kind of', es: 'Más o menos / como que', example: "I'm kind of tired.", emoji: '〰️' },
        { en: 'Basically', es: 'Básicamente', example: 'Basically, we need more time.', emoji: '📌' },
        { en: 'Anyway', es: 'En fin / bueno', example: 'Anyway, what about you?', emoji: '↪️' },
      ],
      grammar: {
        title: 'Rellenos que suenan naturales',
        explanation:
          'Los nativos no hablan en frases perfectas: usan muletillas para pensar. Si las usas, el silencio deja de ser incómodo y tu inglés suena más natural. Evita repetir "eh… eh…" del español: cámbialo por "well", "let me see" o "you know".',
        examples: [
          { en: "Let me see... I'd say around five hours.", es: 'A ver... diría que unas cinco horas.' },
          { en: "It's, you know, a bit complicated.", es: 'Es, pues, un poco complicado.' },
          { en: 'Anyway, back to the topic.', es: 'En fin, volviendo al tema.' },
        ],
        tip: 'No abuses: una o dos muletillas por respuesta. Si las usas todo el tiempo, suena a nervios.',
      },
      dialogue: {
        title: 'Una pregunta difícil',
        lines: [
          { speaker: 'Interviewer', en: 'What do you like most about your city?', es: '¿Qué es lo que más te gusta de tu ciudad?' },
          { speaker: 'Simón', en: "Hmm, that's a good question. Let me think...", es: 'Mmm, buena pregunta. Déjame pensar...' },
          { speaker: 'Simón', en: "Well, I'd say the people. They're kind of warm and friendly.", es: 'Bueno, diría que la gente. Es como cálida y amable.' },
          { speaker: 'Simón', en: 'I mean, the traffic is terrible, but anyway, I love it.', es: 'O sea, el tráfico es terrible, pero en fin, me encanta.' },
          { speaker: 'Interviewer', en: 'That sounds great!', es: '¡Suena genial!' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Necesitas unos segundos para pensar. ¿Qué dices?', options: ['Eh... eh... eh...', 'Let me think...', 'I don\'t know.'], answer: 1 },
        { type: 'fill', sentence: "I'm ___ of tired today.", answers: ['kind', 'sort'] },
        { type: 'match', pairs: [['Anyway', 'En fin'], ['I mean', 'O sea'], ['Basically', 'Básicamente'], ['Well', 'Bueno']] },
        { type: 'order', words: ["That's", 'a', 'good', 'question.', 'Let', 'me', 'think.'], translation: 'Buena pregunta. Déjame pensar.' },
        { type: 'truefalse', statement: 'A Simón le encanta el tráfico de su ciudad.', answer: false, explanation: 'Dice que el tráfico es terrible.' },
        { type: 'listen', audio: "It's, you know, a bit complicated.", options: ['Es, pues, un poco complicado.', 'Ya sabes que es fácil.', 'Es muy complicado saberlo.'], answer: 0 },
        { type: 'speak', phrase: "Well, let me think. I'd say the food.", translation: 'Bueno, déjame pensar. Diría que la comida.' },
      ],
    },
    {
      objective: 'Hacer "small talk" con desconocidos, colegas o clientes sin incomodidad.',
      slides: [
        { en: 'How was your weekend?', es: '¿Cómo te fue el fin de semana?' },
        { en: "It's freezing today, isn't it?", es: 'Hace muchísimo frío hoy, ¿no?' },
        { en: 'Have you been here before?', es: '¿Habías venido antes?' },
        { en: 'Oh really? Tell me more!', es: '¿En serio? ¡Cuéntame más!' },
        { en: 'Anyway, it was nice chatting with you.', es: 'Bueno, fue un gusto charlar contigo.' },
      ],
      vocabulary: [
        { en: 'Small talk', es: 'Charla casual', example: 'Small talk is common at work.', emoji: '💬' },
        { en: 'Chat', es: 'Charlar', example: "Let's chat over coffee.", emoji: '☕' },
        { en: 'Freezing', es: 'Helado / muchísimo frío', example: "It's freezing outside!", emoji: '🥶' },
        { en: 'Busy', es: 'Ocupado', example: 'Busy week?', emoji: '📆' },
        { en: 'Catch up', es: 'Ponerse al día', example: "Let's catch up soon.", emoji: '🔄' },
        { en: 'Grab a coffee', es: 'Tomar un café', example: 'Want to grab a coffee later?', emoji: '🥤' },
      ],
      grammar: {
        title: 'Question tags: "…, isn\'t it?"',
        explanation:
          'Los question tags invitan a la otra persona a responder y hacen la conversación más amable. Si la frase es afirmativa, el tag es negativo y viceversa, usando el mismo auxiliar: "It\'s hot, isn\'t it?", "You don\'t work here, do you?".',
        examples: [
          { en: "It's a beautiful day, isn't it?", es: 'Es un día hermoso, ¿no?' },
          { en: "You're from Medellín, aren't you?", es: 'Eres de Medellín, ¿cierto?' },
          { en: "They didn't come, did they?", es: 'No vinieron, ¿verdad?' },
        ],
        tip: 'Temas seguros para small talk: el clima, el fin de semana, viajes, comida. Evita política, religión y dinero.',
      },
      dialogue: {
        title: 'En la cocina de la oficina',
        lines: [
          { speaker: 'Mike', en: "Morning! It's freezing today, isn't it?", es: '¡Buenos días! Está helando hoy, ¿no?' },
          { speaker: 'Ana', en: "Totally! I'm not used to this weather yet.", es: '¡Totalmente! Todavía no me acostumbro a este clima.' },
          { speaker: 'Mike', en: "Oh, you're not from here, are you?", es: 'Ah, no eres de aquí, ¿cierto?' },
          { speaker: 'Ana', en: "No, I'm from Colombia. It's always warm in my city.", es: 'No, soy de Colombia. En mi ciudad siempre hace calor.' },
          { speaker: 'Mike', en: "Oh really? I've always wanted to visit Colombia!", es: '¿En serio? ¡Siempre he querido conocer Colombia!' },
          { speaker: 'Ana', en: "You should! Let's grab a coffee and I'll tell you more.", es: '¡Deberías! Tomemos un café y te cuento más.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: "It's really hot today, ___?", options: ['is it', "isn't it", "doesn't it"], answer: 1 },
        { type: 'choice', prompt: "You don't speak French, ___?", options: ['do you', "don't you", 'are you'], answer: 0 },
        { type: 'fill', sentence: "Let's ___ up soon! It's been ages.", answers: ['catch'] },
        { type: 'match', pairs: [['Grab a coffee', 'Tomar un café'], ['Busy', 'Ocupado'], ['Freezing', 'Helado'], ['Chat', 'Charlar']] },
        { type: 'truefalse', statement: 'Ana está acostumbrada al clima frío.', answer: false, explanation: '"I\'m not used to this weather yet."' },
        { type: 'listen', audio: 'How was your weekend?', options: ['¿Qué haces este fin de semana?', '¿Cómo te fue el fin de semana?', '¿Trabajas los fines de semana?'], answer: 1 },
        { type: 'order', words: ['It', 'was', 'nice', 'chatting', 'with', 'you'], translation: 'Fue un gusto charlar contigo.' },
        { type: 'speak', phrase: "It's a beautiful day, isn't it?", translation: 'Es un día hermoso, ¿no?' },
      ],
    },
  ],
  // ─── Módulo 2: Cuenta historias ─────────────────────────────────────────
  [
    {
      objective: 'Contar qué pasó y qué estaba pasando usando pasado simple y continuo.',
      slides: [
        { en: 'I was walking home when it started to rain.', es: 'Iba caminando a casa cuando empezó a llover.' },
        { en: 'Past continuous: the background.', es: 'Pasado continuo: el contexto, la acción en progreso.' },
        { en: 'Past simple: the event.', es: 'Pasado simple: el evento que interrumpe.' },
        { en: 'While I was cooking, my phone rang.', es: 'Mientras cocinaba, sonó mi teléfono.' },
      ],
      vocabulary: [
        { en: 'Suddenly', es: 'De repente', example: 'Suddenly, the lights went out.', emoji: '⚡' },
        { en: 'While', es: 'Mientras', example: 'While I was sleeping, he called.', emoji: '⏱️' },
        { en: 'When', es: 'Cuando', example: 'I was eating when you arrived.', emoji: '🕐' },
        { en: 'Ring (rang)', es: 'Sonar (sonó)', example: 'The phone rang twice.', emoji: '📞' },
        { en: 'Fall (fell)', es: 'Caer (cayó)', example: 'I fell off my bike.', emoji: '🚲' },
        { en: 'Happen', es: 'Pasar / ocurrir', example: 'What happened?', emoji: '❓' },
      ],
      grammar: {
        title: 'Pasado continuo vs. pasado simple',
        explanation:
          'El pasado continuo (was/were + -ing) describe una acción que estaba en progreso. El pasado simple describe una acción corta y terminada, muchas veces la que interrumpe. Normalmente: "While + pasado continuo" y "when + pasado simple".',
        examples: [
          { en: 'I was watching TV when the power went out.', es: 'Estaba viendo TV cuando se fue la luz.' },
          { en: 'They were dancing while we were eating.', es: 'Ellos bailaban mientras nosotros comíamos.' },
          { en: 'She called me while I was driving.', es: 'Ella me llamó mientras yo manejaba.' },
        ],
        tip: 'Verbos de estado (know, like, want) casi nunca van en -ing: "I knew", no "I was knowing".',
      },
      dialogue: {
        title: 'Una historia de viaje',
        lines: [
          { speaker: 'Lucía', en: 'Guess what happened to me in Cartagena!', es: '¡Adivina qué me pasó en Cartagena!' },
          { speaker: 'Tom', en: 'What happened?', es: '¿Qué pasó?' },
          { speaker: 'Lucía', en: 'I was taking photos on the wall when a guy asked me for directions.', es: 'Estaba tomando fotos en la muralla cuando un tipo me pidió direcciones.' },
          { speaker: 'Lucía', en: 'While we were talking, I realized he was a famous singer!', es: '¡Mientras hablábamos, me di cuenta de que era un cantante famoso!' },
          { speaker: 'Tom', en: 'No way! Did you take a selfie?', es: '¡No puede ser! ¿Te tomaste una selfie?' },
          { speaker: 'Lucía', en: 'Of course I did!', es: '¡Claro que sí!' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'I ___ dinner when you called.', options: ['cooked', 'was cooking', 'am cooking'], answer: 1 },
        { type: 'choice', prompt: 'While she was driving, she ___ an accident.', options: ['saw', 'was seeing', 'sees'], answer: 0 },
        { type: 'fill', sentence: 'What ___ when you arrived?', answers: ['happened'] },
        { type: 'fill', sentence: 'We ___ sleeping when the alarm rang.', answers: ['were'] },
        { type: 'order', words: ['I', 'was', 'walking', 'when', 'it', 'started', 'to', 'rain'], translation: 'Iba caminando cuando empezó a llover.' },
        { type: 'truefalse', statement: 'Lucía estaba tomando fotos cuando conoció al cantante.', answer: true },
        { type: 'listen', audio: 'Suddenly, the lights went out.', options: ['De repente, se fue la luz.', 'Poco a poco, se apagaron las luces.', 'De repente, salieron todos.'], answer: 0 },
        { type: 'speak', phrase: 'I was cooking when my phone rang.', translation: 'Estaba cocinando cuando sonó mi teléfono.' },
      ],
    },
    {
      objective: 'Hablar de experiencias de vida con el presente perfecto, sin decir cuándo pasaron.',
      slides: [
        { en: 'Have you ever been to Mexico?', es: '¿Alguna vez has ido a México?' },
        { en: "I've never tried sushi.", es: 'Nunca he probado el sushi.' },
        { en: "I've lived here since 2020.", es: 'Vivo aquí desde 2020.', note: 'En español usamos presente; en inglés, presente perfecto.' },
        { en: "She's just finished her degree.", es: 'Ella acaba de terminar su carrera.' },
      ],
      vocabulary: [
        { en: 'Ever', es: 'Alguna vez', example: 'Have you ever seen snow?', emoji: '❄️' },
        { en: 'Never', es: 'Nunca', example: "I've never been to Europe.", emoji: '🚫' },
        { en: 'Already', es: 'Ya', example: "I've already eaten.", emoji: '✔️' },
        { en: 'Yet', es: 'Todavía / ya (en preguntas)', example: "Have you finished yet?", emoji: '⏳' },
        { en: 'Since', es: 'Desde', example: "I've worked here since May.", emoji: '📍' },
        { en: 'For', es: 'Durante / hace', example: "I've known her for ten years.", emoji: '⌛' },
      ],
      grammar: {
        title: 'Presente perfecto: have/has + participio',
        explanation:
          'Úsalo para experiencias de vida sin fecha ("I\'ve been to Peru") y para situaciones que empezaron en el pasado y siguen hoy ("I\'ve lived here for five years"). Si dices cuándo pasó ("last year", "in 2019"), cambia a pasado simple.',
        examples: [
          { en: "I've visited Cusco twice.", es: 'He visitado Cusco dos veces.' },
          { en: 'I visited Cusco in 2019.', es: 'Visité Cusco en 2019.' },
          { en: "We've known each other since school.", es: 'Nos conocemos desde el colegio.' },
          { en: "Has he called you yet?", es: '¿Ya te llamó?' },
        ],
        tip: '"Since" va con un punto en el tiempo (since Monday); "for" con una duración (for three days).',
      },
      dialogue: {
        title: 'Experiencias',
        lines: [
          { speaker: 'Ryan', en: 'Have you ever traveled abroad?', es: '¿Alguna vez has viajado al exterior?' },
          { speaker: 'Mariana', en: "Yes, I've been to Spain and Argentina.", es: 'Sí, he ido a España y Argentina.' },
          { speaker: 'Ryan', en: 'Cool! When did you go to Spain?', es: '¡Genial! ¿Cuándo fuiste a España?' },
          { speaker: 'Mariana', en: 'I went there in 2022. Have you ever been to Colombia?', es: 'Fui en 2022. ¿Alguna vez has ido a Colombia?' },
          { speaker: 'Ryan', en: "Never, but I've always wanted to go.", es: 'Nunca, pero siempre he querido ir.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'I ___ to Japan. (nunca he ido)', options: ["haven't never been", "I've never been", 'never went'], answer: 1 },
        { type: 'choice', prompt: 'She ___ here since 2018.', options: ['works', 'has worked', 'is working'], answer: 1 },
        { type: 'fill', sentence: "I've known him ___ ten years.", answers: ['for'] },
        { type: 'fill', sentence: "We've lived here ___ March.", answers: ['since'] },
        { type: 'choice', prompt: '¿Cuál está correcta?', options: ["I've seen that movie last week.", 'I saw that movie last week.', 'I have saw that movie.'], answer: 1, explanation: 'Con "last week" (momento específico) usas pasado simple.' },
        { type: 'truefalse', statement: 'Ryan ya conoce Colombia.', answer: false, explanation: '"Never, but I\'ve always wanted to go."' },
        { type: 'order', words: ['Have', 'you', 'ever', 'tried', 'Colombian', 'coffee?'], translation: '¿Alguna vez has probado el café colombiano?' },
        { type: 'speak', phrase: "I've never been to Europe, but I'd love to go.", translation: 'Nunca he ido a Europa, pero me encantaría ir.' },
      ],
    },
    {
      objective: 'Contar una anécdota con estructura, conectores y suspenso.',
      slides: [
        { en: 'So, this happened last summer...', es: 'Bueno, esto pasó el verano pasado...' },
        { en: 'At first, everything was normal.', es: 'Al principio, todo era normal.' },
        { en: 'Then, out of nowhere...', es: 'Entonces, de la nada...' },
        { en: 'In the end, we laughed about it.', es: 'Al final, nos reímos de eso.' },
      ],
      vocabulary: [
        { en: 'At first', es: 'Al principio', example: 'At first, I was nervous.', emoji: '1️⃣' },
        { en: 'Then', es: 'Luego / entonces', example: 'Then we went to the beach.', emoji: '➡️' },
        { en: 'After that', es: 'Después de eso', example: 'After that, we took a taxi.', emoji: '⏭️' },
        { en: 'Out of nowhere', es: 'De la nada', example: 'Out of nowhere, a dog appeared.', emoji: '🐕' },
        { en: 'In the end', es: 'Al final', example: 'In the end, it was a great day.', emoji: '🏁' },
        { en: 'Hilarious', es: 'Muy chistoso', example: 'The story was hilarious.', emoji: '😂' },
      ],
      grammar: {
        title: 'La estructura de una buena anécdota',
        explanation:
          '1) Engancha: "You won\'t believe what happened…". 2) Contexto con pasado continuo: "I was waiting for the bus…". 3) El giro con pasado simple y conectores: "Suddenly…", "Then…". 4) Cierre con tu reacción: "In the end…". Los conectores le dan ritmo y hacen que te escuchen hasta el final.',
        examples: [
          { en: "You won't believe what happened yesterday.", es: 'No vas a creer lo que pasó ayer.' },
          { en: 'I was waiting for the bus when, out of nowhere, it started to hail.', es: 'Esperaba el bus cuando, de la nada, empezó a granizar.' },
          { en: 'In the end, we were all soaking wet, but happy.', es: 'Al final, quedamos empapados, pero felices.' },
        ],
        tip: 'Practica tus 2 o 3 mejores anécdotas en voz alta: son oro en entrevistas y en reuniones sociales.',
      },
      dialogue: {
        title: 'La anécdota de Juan',
        lines: [
          { speaker: 'Juan', en: "You won't believe what happened at my cousin's wedding.", es: 'No vas a creer lo que pasó en el matrimonio de mi primo.' },
          { speaker: 'Kate', en: 'Tell me!', es: '¡Cuéntame!' },
          { speaker: 'Juan', en: 'At first, everything was perfect. Then, during the speech, the microphone stopped working.', es: 'Al principio, todo era perfecto. Luego, durante el discurso, el micrófono dejó de funcionar.' },
          { speaker: 'Juan', en: 'Out of nowhere, my grandma stood up and started singing!', es: '¡De la nada, mi abuela se levantó y empezó a cantar!' },
          { speaker: 'Kate', en: "That's hilarious! What happened in the end?", es: '¡Qué chistoso! ¿Qué pasó al final?' },
          { speaker: 'Juan', en: 'In the end, everybody sang with her. It was the best moment of the night.', es: 'Al final, todos cantaron con ella. Fue el mejor momento de la noche.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Para enganchar al inicio de una anécdota dices:', options: ['In the end...', "You won't believe what happened...", 'After that...'], answer: 1 },
        { type: 'match', pairs: [['At first', 'Al principio'], ['Then', 'Luego'], ['Out of nowhere', 'De la nada'], ['In the end', 'Al final']] },
        { type: 'fill', sentence: '___ that, we went home.', answers: ['After'] },
        { type: 'truefalse', statement: 'La abuela de Juan cantó en el matrimonio.', answer: true },
        { type: 'truefalse', statement: 'El micrófono funcionó toda la noche.', answer: false },
        { type: 'order', words: ['In', 'the', 'end,', 'it', 'was', 'a', 'great', 'day'], translation: 'Al final, fue un gran día.' },
        { type: 'listen', audio: 'Out of nowhere, a dog jumped into the pool.', options: ['De la nada, un perro saltó a la piscina.', 'Al final, el perro salió de la piscina.', 'Un perro vio la piscina desde lejos.'], answer: 0 },
        { type: 'speak', phrase: "You won't believe what happened yesterday.", translation: 'No vas a creer lo que pasó ayer.' },
      ],
    },
  ],
  // ─── Módulo 3: Suena natural ────────────────────────────────────────────
  [
    {
      objective: 'Usar los phrasal verbs más comunes de la conversación diaria.',
      slides: [
        { en: 'Phrasal verb = verb + particle.', es: 'Phrasal verb = verbo + partícula (up, out, off...).' },
        { en: 'Give up = rendirse', es: "Don't give up! — ¡No te rindas!" },
        { en: 'Find out = averiguar', es: 'I found out the truth. — Descubrí la verdad.' },
        { en: 'Run out of = quedarse sin', es: "We ran out of milk. — Nos quedamos sin leche." },
        { en: 'Look forward to = esperar con ganas', es: "I'm looking forward to seeing you." },
      ],
      vocabulary: [
        { en: 'Give up', es: 'Rendirse / dejar', example: 'He gave up smoking.', emoji: '🏳️' },
        { en: 'Find out', es: 'Averiguar / enterarse', example: 'I found out about the party.', emoji: '🔍' },
        { en: 'Run out of', es: 'Quedarse sin', example: "We've run out of coffee.", emoji: '🫙' },
        { en: 'Turn down', es: 'Rechazar / bajar volumen', example: 'She turned down the offer.', emoji: '👎' },
        { en: 'Show up', es: 'Aparecer / llegar', example: "He didn't show up.", emoji: '🚶' },
        { en: 'Figure out', es: 'Descifrar / entender', example: "I can't figure out this app.", emoji: '🧩' },
        { en: 'Hang out', es: 'Pasar el rato', example: "Let's hang out this weekend.", emoji: '🛋️' },
      ],
      grammar: {
        title: 'Phrasal verbs separables',
        explanation:
          'Algunos phrasal verbs se pueden separar: "turn down the music" o "turn the music down". Pero si el objeto es un pronombre (it, them, her), SIEMPRE va en medio: "turn it down", nunca "turn down it".',
        examples: [
          { en: 'Can you turn the TV down?', es: '¿Puedes bajarle al TV?' },
          { en: 'Can you turn it down?', es: '¿Puedes bajarle?' },
          { en: 'I need to figure this out.', es: 'Necesito resolver esto.' },
        ],
        tip: 'Aprende cada phrasal verb con una frase de ejemplo, no con su traducción sola.',
      },
      dialogue: {
        title: 'Plan cancelado',
        lines: [
          { speaker: 'Sara', en: "Did you hang out with Leo yesterday?", es: '¿Saliste con Leo ayer?' },
          { speaker: 'Ben', en: "No, he didn't show up. I found out later that his car broke down.", es: 'No, no apareció. Luego me enteré de que se le dañó el carro.' },
          { speaker: 'Sara', en: 'Oh no! Did he figure out what was wrong?', es: '¡Ay no! ¿Descubrió qué tenía?' },
          { speaker: 'Ben', en: 'Yeah, it had just run out of gas!', es: '¡Sí, simplemente se había quedado sin gasolina!' },
          { speaker: 'Sara', en: "Classic Leo! Don't give up on him, he's a good friend.", es: '¡Típico de Leo! No lo des por perdido, es un buen amigo.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'The music is too loud. Can you ___?', options: ['turn down it', 'turn it down', 'turn it under'], answer: 1 },
        { type: 'fill', sentence: "We've run ___ of milk. Can you buy some?", answers: ['out'] },
        { type: 'match', pairs: [['Give up', 'Rendirse'], ['Show up', 'Aparecer'], ['Figure out', 'Descifrar'], ['Hang out', 'Pasar el rato']] },
        { type: 'choice', prompt: 'I just ___ that my flight is cancelled.', options: ['found out', 'gave up', 'showed up'], answer: 0 },
        { type: 'truefalse', statement: 'El carro de Leo se quedó sin gasolina.', answer: true },
        { type: 'order', words: ["Let's", 'hang', 'out', 'this', 'weekend'], translation: 'Salgamos este fin de semana.' },
        { type: 'listen', audio: "She turned down the job offer.", options: ['Ella aceptó la oferta de trabajo.', 'Ella rechazó la oferta de trabajo.', 'Ella buscó una oferta de trabajo.'], answer: 1 },
        { type: 'speak', phrase: "Don't give up. You'll figure it out.", translation: 'No te rindas. Lo vas a resolver.' },
      ],
    },
    {
      objective: 'Entender y producir el inglés hablado rápido: contracciones y sonidos unidos.',
      slides: [
        { en: 'What do you want? → Whaddaya want?', es: 'Así suena en una conversación rápida.' },
        { en: 'Going to → gonna', es: "I'm gonna call you later.", note: 'Úsalo al hablar, no al escribir formalmente.' },
        { en: 'Want to → wanna', es: 'Do you wanna come?' },
        { en: 'Check it out → che-ki-tout', es: 'Las palabras se unen cuando una termina en consonante y la siguiente empieza con vocal.' },
      ],
      vocabulary: [
        { en: 'Gonna', es: 'Voy a (informal)', example: "It's gonna rain.", emoji: '🌧️' },
        { en: 'Wanna', es: 'Quiero / quieres (informal)', example: 'I wanna go home.', emoji: '🏠' },
        { en: 'Gotta', es: 'Tengo que (informal)', example: "I gotta go!", emoji: '🏃' },
        { en: 'Kinda', es: 'Como que / algo', example: "It's kinda cold.", emoji: '🌡️' },
        { en: 'Lemme', es: 'Déjame', example: 'Lemme see.', emoji: '👀' },
        { en: 'Dunno', es: 'No sé', example: "I dunno, maybe.", emoji: '🤷' },
      ],
      grammar: {
        title: 'Formas reducidas',
        explanation:
          'En el habla rápida los nativos reducen sonidos: "going to" → "gonna", "want to" → "wanna", "got to" → "gotta". También unen palabras (linking): "an apple" suena "anapple". Entenderlo es clave para seguir películas y conversaciones reales. Para escribir correos formales, usa siempre la forma completa.',
        examples: [
          { en: "I'm gonna be late. (I'm going to be late.)", es: 'Voy a llegar tarde.' },
          { en: 'Do you wanna eat? (Do you want to eat?)', es: '¿Quieres comer?' },
          { en: "I gotta finish this. (I have got to finish this.)", es: 'Tengo que terminar esto.' },
        ],
        tip: 'Escucha la frase varias veces con el botón de audio e imita el ritmo, no cada palabra por separado.',
      },
      dialogue: {
        title: 'Conversación rápida',
        lines: [
          { speaker: 'Jake', en: 'Hey, whatcha doing tonight?', es: 'Oye, ¿qué vas a hacer esta noche?' },
          { speaker: 'Dani', en: "Dunno. I'm kinda tired. Why?", es: 'No sé. Estoy como cansada. ¿Por qué?' },
          { speaker: 'Jake', en: "We're gonna watch the game. Wanna come?", es: 'Vamos a ver el partido. ¿Quieres venir?' },
          { speaker: 'Dani', en: 'Sounds fun, but I gotta work early tomorrow.', es: 'Suena divertido, pero tengo que trabajar temprano mañana.' },
          { speaker: 'Jake', en: 'No worries. Lemme know if you change your mind.', es: 'Tranquila. Avísame si cambias de opinión.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '"I gotta go" significa:', options: ['Tengo que irme.', 'Me gusta ir.', 'Ya me fui.'], answer: 0 },
        { type: 'match', pairs: [['Gonna', 'Going to'], ['Wanna', 'Want to'], ['Gotta', 'Got to'], ['Lemme', 'Let me']] },
        { type: 'listen', audio: "I'm gonna call you later.", options: ['I am going to call you later.', 'I am gone to call you later.', 'I called you later.'], answer: 0 },
        { type: 'listen', audio: 'Do you wanna grab some food?', options: ['¿Quieres ir por algo de comer?', '¿Tienes comida?', '¿Comiste algo?'], answer: 0 },
        { type: 'truefalse', statement: 'Dani va a ver el partido con Jake.', answer: false, explanation: 'Tiene que trabajar temprano al día siguiente.' },
        { type: 'choice', prompt: 'En un correo formal escribes:', options: ["I'm gonna send the report.", 'I am going to send the report.', 'Im gonna send the report.'], answer: 1 },
        { type: 'speak', phrase: "I'm gonna be late. I gotta finish this first.", translation: 'Voy a llegar tarde. Tengo que terminar esto primero.' },
      ],
    },
    {
      objective: 'Defender tu opinión, estar en desacuerdo con respeto y participar en un debate.',
      slides: [
        { en: 'In my opinion, remote work is better.', es: 'En mi opinión, el trabajo remoto es mejor.' },
        { en: 'I see your point, but...', es: 'Entiendo tu punto, pero...' },
        { en: "I couldn't agree more!", es: '¡Totalmente de acuerdo!' },
        { en: "I'm not sure I agree with that.", es: 'No estoy seguro de estar de acuerdo con eso.' },
        { en: 'For example...', es: 'Por ejemplo...' },
      ],
      vocabulary: [
        { en: 'In my opinion', es: 'En mi opinión', example: 'In my opinion, it’s too expensive.', emoji: '🗨️' },
        { en: 'I see your point', es: 'Entiendo tu punto', example: 'I see your point, but I disagree.', emoji: '👁️' },
        { en: 'Disagree', es: 'No estar de acuerdo', example: 'I respectfully disagree.', emoji: '🙅' },
        { en: 'On the other hand', es: 'Por otro lado', example: 'On the other hand, it saves time.', emoji: '⚖️' },
        { en: 'That’s true, but', es: 'Es cierto, pero', example: "That's true, but it's risky.", emoji: '🤝' },
        { en: 'Convince', es: 'Convencer', example: 'You convinced me!', emoji: '🎯' },
      ],
      grammar: {
        title: 'Estar en desacuerdo sin sonar grosero',
        explanation:
          'En inglés, un "No, you\'re wrong" directo suena agresivo. Suaviza: reconoce primero ("I see your point", "That\'s true") y luego da tu idea con "but" u "on the other hand". Respalda tu opinión con una razón ("because…") y un ejemplo ("for example…").',
        examples: [
          { en: "That's a fair point, but I think it depends on the person.", es: 'Es un buen punto, pero creo que depende de la persona.' },
          { en: "I'm not sure about that. For example, many people feel lonely at home.", es: 'No estoy seguro. Por ejemplo, mucha gente se siente sola en casa.' },
          { en: 'I agree with you to some extent.', es: 'Estoy de acuerdo contigo hasta cierto punto.' },
        ],
        tip: 'Estructura rápida para opinar: opinión + razón + ejemplo + conclusión.',
      },
      dialogue: {
        title: '¿Trabajo remoto u oficina?',
        lines: [
          { speaker: 'Laura', en: 'In my opinion, working from home is much better.', es: 'En mi opinión, trabajar desde casa es mucho mejor.' },
          { speaker: 'Kevin', en: "I see your point, but I think we lose team connection.", es: 'Entiendo tu punto, pero creo que perdemos conexión con el equipo.' },
          { speaker: 'Laura', en: "That's true, but I save two hours of traffic every day.", es: 'Es cierto, pero me ahorro dos horas de tráfico al día.' },
          { speaker: 'Kevin', en: 'On the other hand, the office helps me focus.', es: 'Por otro lado, la oficina me ayuda a concentrarme.' },
          { speaker: 'Laura', en: 'Maybe a hybrid model is the answer.', es: 'Quizás un modelo híbrido sea la respuesta.' },
          { speaker: 'Kevin', en: "I couldn't agree more!", es: '¡Totalmente de acuerdo!' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuál es la forma más respetuosa de estar en desacuerdo?', options: ["You're wrong.", "I see your point, but I don't agree.", 'No. Bad idea.'], answer: 1 },
        { type: 'choice', prompt: '"I couldn\'t agree more" significa:', options: ['No estoy de acuerdo.', 'Estoy totalmente de acuerdo.', 'No puedo opinar.'], answer: 1 },
        { type: 'fill', sentence: 'On the other ___, it saves money.', answers: ['hand'] },
        { type: 'match', pairs: [['Disagree', 'No estar de acuerdo'], ['Convince', 'Convencer'], ['In my opinion', 'En mi opinión'], ['For example', 'Por ejemplo']] },
        { type: 'truefalse', statement: 'Al final, Laura y Kevin coinciden en un modelo híbrido.', answer: true },
        { type: 'order', words: ['I', 'agree', 'with', 'you', 'to', 'some', 'extent'], translation: 'Estoy de acuerdo contigo hasta cierto punto.' },
        { type: 'listen', audio: "That's a fair point, but it depends on the person.", options: ['Es un buen punto, pero depende de la persona.', 'Es justo, la persona decide.', 'No es justo para la persona.'], answer: 0 },
        { type: 'speak', phrase: 'In my opinion, learning English opens many doors.', translation: 'En mi opinión, aprender inglés abre muchas puertas.' },
      ],
    },
  ],
];
