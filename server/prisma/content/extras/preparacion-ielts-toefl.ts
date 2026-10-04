import type { LessonExtras } from './types.js';

/**
 * Preparación IELTS (Academic, B2-C1). Igual que el contenido base, describe solo
 * el IELTS Academic; los textos son originales, al estilo del examen.
 */
export const preparacionIeltsToeflExtras: LessonExtras[][] = [
  // ─── Módulo 1: Diagnóstico y estrategia ─────────────────────────────────
  [
    // M1L1 · Formato del examen
    {
      vocabulary: [
        { en: 'Lexical resource', es: 'Recurso léxico (vocabulario)', example: 'Lexical resource is 25% of your Writing score.', emoji: '📖' },
        { en: 'Coherence and cohesion', es: 'Coherencia y cohesión', example: 'Use linking words to improve coherence and cohesion.', emoji: '🔗' },
        { en: 'Task achievement', es: 'Cumplimiento de la tarea', example: 'Answer every part of the question for task achievement.', emoji: '🎯' },
        { en: 'Answer sheet', es: 'Hoja de respuestas', example: 'Transfer your answers to the answer sheet.', emoji: '📝' },
        { en: 'Round (score)', es: 'Redondear (puntaje)', example: 'The overall score is rounded to the nearest half band.', emoji: '🔢' },
        { en: 'Computer-delivered', es: 'En computador', example: 'I chose the computer-delivered test.', emoji: '💻' },
      ],
      mistakes: [
        { wrong: 'Pensar que el IELTS evalúa "inglés británico" y que debes cambiar tu acento.', right: 'Any accent is fine if it is clear and consistent.', why: 'El examen acepta cualquier variedad del inglés. Lo que evalúan es la claridad, no que suenes británico.' },
        { wrong: 'Dejar respuestas en blanco en Reading o Listening.', right: 'Always write an answer — there is no penalty for wrong answers.', why: 'No se restan puntos por respuestas incorrectas. Una respuesta en blanco es un punto perdido seguro.' },
        { wrong: 'Escribir 120 palabras en Task 1 "porque se entiende".', right: 'Write at least 150 words in Task 1 and 250 in Task 2.', why: 'Por debajo del mínimo de palabras, tu puntaje de Task Achievement/Response baja.' },
        { wrong: 'Creer que Writing Task 1 y Task 2 valen lo mismo.', right: 'Task 2 is worth twice as much as Task 1.', why: 'Por eso se recomiendan unos 20 minutos para Task 1 y 40 para Task 2.' },
      ],
      pronunciation: {
        focus: 'Vocabulario del examen',
        tip: 'Estas palabras las escucharás en las instrucciones y en el Speaking. Pronunciarlas bien desde el inicio te da confianza el día del examen.',
        words: [
          { word: 'IELTS', sounds: '/ˈaɪelts/ — "AI-elts"' },
          { word: 'criteria', sounds: '/kraɪˈtɪriə/ — "krai-TI-ri-a"', es: 'criterios' },
          { word: 'vocabulary', sounds: '/voʊˈkæbjəleri/ — "vou-KA-biu-le-ri"', es: 'vocabulario' },
          { word: 'fluency', sounds: '/ˈfluːənsi/ — "FLU-en-si"', es: 'fluidez' },
          { word: 'academic', sounds: '/ˌækəˈdemɪk/ — "a-ka-DE-mik"', es: 'académico' },
        ],
      },
      reading: {
        title: 'How the IELTS Academic band score works',
        paragraphs: [
          "Each of the four IELTS skills — Listening, Reading, Writing and Speaking — receives a band score from 0 to 9, and the overall score is the average of the four, rounded to the nearest half band. For example, if a candidate scores 6.5, 6.5, 5.0 and 7.0, the average is 6.25, which is rounded up to 6.5.",
          "Listening and Reading each contain 40 questions, and the number of correct answers is converted into a band score. In Academic Reading, around 30 correct answers usually correspond to band 7, although the exact conversion varies slightly from test to test. Writing and Speaking, by contrast, are assessed by trained examiners using four equally weighted criteria.",
          "Many universities set a minimum overall score as well as a minimum score for each skill. A program may require an overall 6.5 with no band below 6.0, which means that a weak Writing score can prevent admission even if the overall score is high enough. For this reason, a balanced preparation strategy is more effective than focusing only on your strongest skill.",
        ],
        glossary: [
          { en: 'rounded up', es: 'redondeado hacia arriba' },
          { en: 'by contrast', es: 'en cambio' },
          { en: 'equally weighted', es: 'con el mismo peso' },
          { en: 'prevent', es: 'impedir' },
        ],
        questions: [
          { q: 'Scores: 7.0, 6.0, 6.0, 6.0. Average 6.25. What is the overall band?', options: ['6.0', '6.5', '7.0'], answer: 1, explanation: '6.25 se redondea a la media banda superior: 6.5.' },
          { q: 'How many questions are there in the Reading test?', options: ['30', '40', '60'], answer: 1 },
          { q: 'How are Writing and Speaking assessed?', options: ['By counting correct answers', 'By examiners using four criteria', 'By a computer'], answer: 1 },
          { q: 'Why does the text recommend balanced preparation?', options: ['Universities often require a minimum in each skill', 'The test is very long', 'Speaking is the most important skill'], answer: 0 },
        ],
      },
      culture: {
        title: 'Qué banda piden las universidades',
        body: 'Como referencia general: muchos pregrados en Reino Unido, Canadá y Australia piden 6.0-6.5 overall; las maestrías, 6.5-7.0; y programas como derecho, medicina o periodismo pueden pedir 7.0-7.5 con mínimos altos en Writing. Los requisitos cambian por universidad y por año: revisa siempre la página oficial del programa antes de fijar tu meta.',
      },
      mission: {
        title: 'Define tu meta oficial',
        task: 'Busca en la página oficial de 2 programas o procesos que te interesen (universidad, visa, trabajo) la banda exacta que piden: overall y mínimo por habilidad. Escríbelo en inglés.',
        steps: ['Programa y país', 'Overall requerido', 'Mínimo por habilidad', 'Fecha límite para presentar el resultado'],
        model: "Target 1: a master's in Data Science in the UK — overall 6.5 with no less than 6.0 in each component. Target 2: an undergraduate nursing program in Australia — overall 7.0 with at least 7.0 in each skill. My deadline: results by March, because applications close in April.",
      },
      exercises: [
        { type: 'choice', prompt: 'Scores: L 7.5, R 7.0, W 6.0, S 6.5 → promedio 6.75. ¿Banda overall?', options: ['6.5', '7.0', '6.75'], answer: 1, explanation: '6.75 se redondea a 7.0.' },
        { type: 'dictation', audio: 'The overall score is the average of the four skills.', translation: 'El puntaje general es el promedio de las cuatro habilidades.' },
        { type: 'truefalse', statement: 'En el IELTS se restan puntos por respuestas incorrectas en Reading.', answer: false, explanation: 'No hay penalización: nunca dejes respuestas en blanco.' },
        { type: 'match', prompt: 'Une la habilidad con su formato', pairs: [['Listening', '40 preguntas, 4 partes'], ['Reading', '40 preguntas, 3 textos'], ['Writing', '2 tareas, 60 minutos'], ['Speaking', 'Entrevista de 11-14 min']] },
        { type: 'fix', sentence: 'Task 1 and Task 2 has the same value.', answers: ['Task 2 is worth twice as much as Task 1.', 'Task 2 is worth more than Task 1.'], explanation: 'Task 2 vale el doble.' },
        { type: 'listen', audio: 'You need an overall six point five with no band below six.', options: ['6.5 general y ninguna habilidad por debajo de 6.0', '6.0 general y mínimo 6.5 en cada una', '6.5 en todas las habilidades'], answer: 0 },
        { type: 'dictation', audio: 'Lexical resource is one of the four criteria.', translation: 'El recurso léxico es uno de los cuatro criterios.' },
        { type: 'fill', sentence: 'Task 1 requires at least ___ words.', answers: ['150', 'one hundred and fifty', 'one hundred fifty'], hint: 'mínimo de palabras' },
        { type: 'choice', prompt: '¿Qué acento debes usar en el Speaking?', options: ['Británico obligatoriamente', 'Americano obligatoriamente', 'Cualquiera, si es claro y consistente'], answer: 2 },
        { type: 'order', words: ['There', 'is', 'no', 'penalty', 'for', 'wrong', 'answers'], translation: 'No hay penalización por respuestas incorrectas.' },
      ],
    },
    // M1L2 · Diagnóstico
    {
      vocabulary: [
        { en: 'Baseline', es: 'Línea base, punto de partida', example: 'Take a mock test to set your baseline.', emoji: '📏' },
        { en: 'Error log', es: 'Registro de errores', example: 'Write every mistake in your error log.', emoji: '📓' },
        { en: 'Recurring', es: 'Recurrente', example: 'Articles are a recurring problem for me.', emoji: '🔁' },
        { en: 'Synonym', es: 'Sinónimo', example: '"Rise" is a synonym of "increase".', emoji: '🟰' },
        { en: 'Benchmark', es: 'Referencia, parámetro', example: 'Use official band descriptors as your benchmark.', emoji: '📊' },
        { en: 'Self-assessment', es: 'Autoevaluación', example: 'Self-assessment is useful, but get external feedback too.', emoji: '🪞' },
      ],
      mistakes: [
        { wrong: 'Hacer simulacros sin revisar por qué fallaste.', right: 'Analyze every wrong answer: vocabulary, paraphrase, distractor or time?', why: 'El simulacro mide; el análisis de errores es lo que mejora tu banda. Clasifica cada error.' },
        { wrong: 'Escoger la opción que tiene las mismas palabras del texto.', right: 'Look for the option that paraphrases the meaning.', why: 'En el IELTS las respuestas correctas casi siempre están parafraseadas. La palabra idéntica suele ser una trampa (distractor).' },
        { wrong: 'Evaluar tu propio Writing y ponerte 7.', right: 'Compare your text with the official band descriptors or get a teacher to grade it.', why: 'La autoevaluación tiende a ser generosa. Usa los descriptores públicos de banda como referencia objetiva.' },
        { wrong: 'Make a diagnostic. / Make an exam.', right: 'Take a diagnostic test. / Take an exam.', why: 'Los exámenes se "take" (presentan), no se "make".' },
      ],
      pronunciation: {
        focus: 'Palabras que confunden en el Listening',
        tip: 'En el Listening se oyen pares de sonidos que los hispanohablantes confunden: /ɪ/ vs. /iː/ (ship/sheep), /æ/ vs. /ʌ/ (cap/cup), /b/ vs. /v/ (berry/very). Una letra mal escuchada es una respuesta incorrecta.',
        words: [
          { word: 'ship / sheep', sounds: '/ʃɪp/ corta vs. /ʃiːp/ larga' },
          { word: 'live / leave', sounds: '/lɪv/ corta vs. /liːv/ larga' },
          { word: 'cap / cup', sounds: '/kæp/ boca abierta vs. /kʌp/ relajada' },
          { word: 'berry / very', sounds: '/b/ labios juntos vs. /v/ dientes en el labio' },
          { word: 'thirteen / thirty', sounds: 'thir-TEEN vs. THIR-ty' },
        ],
      },
      reading: {
        title: 'The urban heat island effect',
        paragraphs: [
          "Cities are typically warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. The difference is most noticeable at night, when urban areas can be several degrees warmer than nearby rural zones. The main cause is the replacement of vegetation with materials such as asphalt and concrete, which absorb heat during the day and release it slowly after sunset.",
          "Other factors also contribute. Tall buildings reduce wind circulation and trap warm air, while vehicles, air conditioners and industrial activity generate additional heat. The effect is not merely a matter of comfort: higher temperatures increase energy consumption, worsen air quality and have been linked to a rise in heat-related illnesses among elderly residents.",
          "Several strategies have proved effective in reducing urban temperatures. 'Cool roofs', painted with reflective materials, can lower roof surface temperatures considerably. Expanding urban parks and planting street trees provides shade and cools the air through evaporation. However, researchers stress that such measures work best when they are part of long-term city planning rather than isolated projects.",
        ],
        glossary: [
          { en: 'surrounding', es: 'circundante' },
          { en: 'release', es: 'liberar' },
          { en: 'trap', es: 'atrapar' },
          { en: 'elderly', es: 'personas mayores' },
        ],
        questions: [
          { q: 'TRUE / FALSE / NOT GIVEN: The heat island effect is strongest during the day.', options: ['True', 'False', 'Not Given'], answer: 1, explanation: 'El texto dice que es más notable de noche.' },
          { q: 'TRUE / FALSE / NOT GIVEN: Asphalt releases heat quickly after sunset.', options: ['True', 'False', 'Not Given'], answer: 1, explanation: '"Release it slowly".' },
          { q: 'TRUE / FALSE / NOT GIVEN: Cool roofs are more expensive than normal roofs.', options: ['True', 'False', 'Not Given'], answer: 2, explanation: 'El texto no menciona el costo.' },
          { q: 'According to researchers, measures work best when they are…', options: ['isolated projects', 'part of long-term planning', 'paid by residents'], answer: 1 },
        ],
      },
      culture: {
        title: 'Los descriptores de banda son públicos',
        body: 'Los criterios con que los examinadores califican Writing y Speaking (band descriptors) se publican de forma oficial y gratuita. Léelos en inglés: describen exactamente qué separa una banda 6 de una 7 (por ejemplo, "uses a range of complex structures" o "frequent error-free sentences"). Estudiar con ellos es como conocer la rúbrica antes del examen.',
      },
      mission: {
        title: 'Crea tu error log',
        task: 'Haz un mini diagnóstico: responde las preguntas de la lectura y del práctica de esta lección, y crea una tabla (en papel o Excel) con cada error clasificado.',
        steps: ['Columna 1: pregunta', 'Columna 2: mi respuesta / respuesta correcta', 'Columna 3: tipo de error (vocabulario, paráfrasis, distractor, tiempo)', 'Columna 4: qué haré diferente'],
        model: "Q3 | My answer: False → Correct: Not Given | Type: confused False with Not Given | Next time: check if the text says the OPPOSITE (False) or says NOTHING (Not Given).",
      },
      exercises: [
        { type: 'choice', prompt: 'Texto: "The number of visitors rose sharply." ¿Qué opción es una paráfrasis?', options: ['The number of visitors rose.', 'Visitor numbers increased dramatically.', 'Visitors were sharp.'], answer: 1 },
        { type: 'dictation', audio: 'Take a mock test to set your baseline.', translation: 'Haz un simulacro para establecer tu punto de partida.' },
        { type: 'fix', sentence: 'I will make the IELTS exam in May.', answers: ['I will take the IELTS exam in May.', "I'll take the IELTS exam in May.", 'I will take the IELTS in May.', "I'm taking the IELTS in May."], explanation: 'Presentar un examen = take.' },
        { type: 'listen', audio: 'Please write the word "sheep".', options: ['ship', 'sheep', 'cheap'], answer: 1 },
        { type: 'match', prompt: 'Une la palabra con su sinónimo académico', pairs: [['rise', 'increase'], ['show', 'illustrate'], ['main', 'primary'], ['about', 'approximately'], ['big', 'substantial']] },
        { type: 'listen', audio: 'The price was thirteen pounds.', options: ['£13', '£30', '£3'], answer: 0 },
        { type: 'dictation', audio: 'The answer is usually paraphrased.', translation: 'La respuesta normalmente está parafraseada.' },
        { type: 'fill', sentence: 'A wrong option designed to trick you is called a ___.', answers: ['distractor'], hint: 'distractor' },
        { type: 'truefalse', statement: 'Según la lectura, los edificios altos aumentan la circulación del viento.', answer: false, explanation: '"Reduce wind circulation".' },
        { type: 'order', words: ['Analyze', 'every', 'wrong', 'answer', 'after', 'a', 'mock', 'test'], translation: 'Analiza cada respuesta incorrecta después de un simulacro.' },
      ],
    },
    // M1L3 · Plan de estudio
    {
      vocabulary: [
        { en: 'Spaced repetition', es: 'Repetición espaciada', example: 'Use spaced repetition to memorize vocabulary.', emoji: '🗂️' },
        { en: 'Burnout', es: 'Agotamiento', example: 'Studying ten hours a day can lead to burnout.', emoji: '🥵' },
        { en: 'Milestone', es: 'Hito', example: 'My first milestone is band 6 in Writing.', emoji: '🏁' },
        { en: 'Allocate', es: 'Asignar', example: 'Allocate more time to your weakest skill.', emoji: '📦' },
        { en: 'Intensive', es: 'Intensivo', example: 'I need an intensive plan for six weeks.', emoji: '🔥' },
        { en: 'Realistic', es: 'Realista', example: 'Set a realistic target.', emoji: '✅' },
      ],
      mistakes: [
        { wrong: 'Estudiar 6 horas el domingo y nada entre semana.', right: 'Study 45–60 minutes every day.', why: 'La constancia gana a la intensidad. El cerebro consolida mejor en sesiones cortas y frecuentes.' },
        { wrong: 'Practicar solo lo que ya te sale bien.', right: 'Allocate 50% of your time to your weakest skill.', why: 'Las universidades piden mínimos por habilidad; tu habilidad más débil es la que más puntaje te puede dar.' },
        { wrong: 'I will study more hard.', right: 'I will study harder.', why: 'Los adjetivos cortos forman el comparativo con -er: harder, faster. "More" es para los largos: more consistent.' },
        { wrong: 'Hacer simulacros completos todos los días.', right: 'Take one full mock test every 1–2 weeks.', why: 'Los simulacros miden, no enseñan. La mayor parte del tiempo debe ir a práctica enfocada y corrección.' },
      ],
      pronunciation: {
        focus: 'Hablar de planes con contracciones',
        tip: 'En el Speaking Part 1 te pueden preguntar por tus planes. Usa contracciones naturales: "I\'m going to" → "I\'m gonna" (está bien al hablar), "I\'ll" → "ail", "I\'d like to" → "aid-LAIK-tu".',
        words: [
          { word: "I'm going to study abroad.", sounds: '"aim-GO-in-tu" o "aim-GA-na"' },
          { word: "I'll probably…", sounds: '"ail-PRA-ba-bli"' },
          { word: "I'd like to…", sounds: '"aid-LAIK-tu"' },
          { word: "I'm planning to…", sounds: '"aim-PLA-ning-tu"' },
        ],
      },
      reading: {
        title: 'Why cramming does not work',
        paragraphs: [
          "In the 1880s, the German psychologist Hermann Ebbinghaus conducted a series of experiments on his own memory. He found that newly learned information is forgotten rapidly at first and then more slowly, a pattern now known as the forgetting curve. Crucially, he also discovered that reviewing the material at increasing intervals dramatically reduced the rate of forgetting.",
          "This finding is the basis of spaced repetition, a technique used by many language-learning apps today. Instead of studying a list of words ten times in one evening, a learner reviews them after one day, then after three days, then after a week, and so on. Each review is shorter, yet long-term retention is far greater.",
          "For exam candidates, the implications are clear. Last-minute cramming may help you remember information for a few hours, but the IELTS requires skills and vocabulary that must be available automatically under time pressure. A plan of short daily sessions, spread over several weeks, is therefore more effective than intensive study immediately before the test.",
        ],
        glossary: [
          { en: 'conducted', es: 'realizó' },
          { en: 'forgetting curve', es: 'curva del olvido' },
          { en: 'retention', es: 'retención' },
          { en: 'cramming', es: 'estudiar todo a última hora' },
        ],
        questions: [
          { q: 'Who did Ebbinghaus experiment on?', options: ['University students', 'Himself', 'Children'], answer: 1 },
          { q: 'TRUE / FALSE / NOT GIVEN: We forget new information at a constant speed.', options: ['True', 'False', 'Not Given'], answer: 1, explanation: 'Rápido al principio y después más lento.' },
          { q: 'TRUE / FALSE / NOT GIVEN: Ebbinghaus invented a language-learning app.', options: ['True', 'False', 'Not Given'], answer: 1, explanation: 'Las apps usan su hallazgo; él vivió en el siglo XIX.' },
          { q: 'What does the writer recommend?', options: ['Intensive study just before the test', 'Short daily sessions over several weeks', 'Reviewing words ten times in one night'], answer: 1 },
        ],
      },
      culture: {
        title: '¿Cuánto tiempo se necesita para subir una banda?',
        body: 'No hay una cifra exacta, pero los centros de preparación suelen estimar que subir media banda o una banda completa requiere varios meses de estudio constante, sobre todo por encima de 6.5. Desconfía de las promesas de "banda 8 en dos semanas". Un plan honesto parte de tu diagnóstico y se ajusta cada 2-3 semanas según los simulacros.',
      },
      mission: {
        title: 'Tu plan semanal en inglés',
        task: 'Diseña tu plan de 7 días para las próximas 4 semanas: qué habilidad, cuántos minutos y qué recurso cada día. Escríbelo en inglés y pégalo donde lo veas.',
        steps: ['50 % del tiempo para tu habilidad más débil', 'Vocabulario con repetición espaciada a diario', 'Un simulacro cada 1-2 semanas', 'Un día de descanso'],
        model: 'Mon: Writing Task 2 — 1 essay (40 min) + correction. Tue: Listening Part 3 (30 min) + 15 min vocab. Wed: Writing Task 1 — 1 graph. Thu: Reading — 1 passage timed. Fri: Speaking — record Part 2 twice. Sat: full mock test (every other week). Sun: rest.',
      },
      exercises: [
        { type: 'fix', sentence: 'I will study more hard this month.', answers: ['I will study harder this month.', "I'll study harder this month."], explanation: 'hard → harder.' },
        { type: 'dictation', audio: "I'm going to study abroad next year.", translation: 'Voy a estudiar en el exterior el próximo año.' },
        { type: 'choice', prompt: '¿Cuál es el plan más efectivo?', options: ['Seis horas cada domingo', '45-60 minutos todos los días', 'Un simulacro completo diario'], answer: 1 },
        { type: 'listen', audio: 'Allocate more time to your weakest skill.', options: ['Dedica más tiempo a tu habilidad más débil.', 'Ubica tu habilidad más fuerte.', 'Asigna menos tiempo a lo difícil.'], answer: 0 },
        { type: 'choice', prompt: '"I think I\'ll take a gap year" expresa…', options: ['un plan ya decidido', 'una decisión espontánea o una predicción', 'algo que ya pasó'], answer: 1 },
        { type: 'dictation', audio: 'Spaced repetition improves long-term memory.', translation: 'La repetición espaciada mejora la memoria a largo plazo.' },
        { type: 'match', prompt: 'Une el concepto', pairs: [['cramming', 'estudiar todo a última hora'], ['burnout', 'agotamiento'], ['milestone', 'hito'], ['mock test', 'simulacro']] },
        { type: 'fill', sentence: "I'm ___ to take the test in June. I've already booked it.", answers: ['going'], hint: 'plan decidido' },
        { type: 'order', words: ['Consistency', 'is', 'more', 'important', 'than', 'intensity'], translation: 'La constancia es más importante que la intensidad.' },
        { type: 'truefalse', statement: 'Según la lectura, cada repaso en la repetición espaciada es más largo que el anterior.', answer: false, explanation: '"Each review is shorter".' },
      ],
    },
  ],
  // ─── Módulo 2: Reading & Listening ──────────────────────────────────────
  [
    // M2L1 · Skimming y scanning
    {
      vocabulary: [
        { en: 'Gist', es: 'Idea general', example: 'Read the first paragraph to get the gist.', emoji: '🧠' },
        { en: 'Proper noun', es: 'Nombre propio', example: 'Scan for proper nouns like names and places.', emoji: '🔠' },
        { en: 'Signpost words', es: 'Palabras señal', example: '"However" is a signpost word.', emoji: '🪧' },
        { en: 'Locate', es: 'Ubicar', example: 'Locate the paragraph that mentions dates.', emoji: '📍' },
        { en: 'Underline', es: 'Subrayar', example: 'Underline the keywords in each question.', emoji: '✏️' },
        { en: 'Passage', es: 'Texto (de lectura)', example: 'The third passage is the hardest.', emoji: '📄' },
      ],
      mistakes: [
        { wrong: 'Leer el texto completo con calma antes de ver las preguntas.', right: 'Skim the passage (2-3 minutes), then read the questions, then scan.', why: 'Tienes unos 20 minutos por texto. Leer todo en detalle te deja sin tiempo para las preguntas.' },
        { wrong: 'Buscar exactamente las palabras de la pregunta en el texto.', right: 'Scan for synonyms, numbers and names.', why: 'El texto usa paráfrasis. Los nombres propios, números y fechas no cambian: son tu mejor ancla para escanear.' },
        { wrong: 'Quedarse 5 minutos en una pregunta difícil.', right: 'Guess, mark it and move on.', why: 'Todas las preguntas valen lo mismo. Vuelve a las difíciles si te sobra tiempo.' },
        { wrong: 'Ignorar "however", "although", "but".', right: 'Pay attention to contrast words — the answer often comes after them.', why: 'Los conectores de contraste cambian el sentido de la frase y suelen marcar la información que se pregunta.' },
      ],
      pronunciation: {
        focus: 'Conectores académicos',
        tip: 'Estos conectores aparecen en los textos y también te sirven para el Speaking. Pronúncialos con la sílaba fuerte correcta.',
        words: [
          { word: 'however', sounds: '/haʊˈevər/ — "jau-E-ver"' },
          { word: 'although', sounds: '/ɔːlˈðoʊ/ — "ol-DHOU"' },
          { word: 'nevertheless', sounds: '/ˌnevərðəˈles/ — "ne-ver-dhe-LES"' },
          { word: 'whereas', sounds: '/werˈæz/ — "uer-AZ"' },
          { word: 'consequently', sounds: '/ˈkɑːnsəkwentli/ — "KAN-se-kuent-li"' },
        ],
      },
      reading: {
        title: 'The history of the humble pencil',
        paragraphs: [
          "A. In 1564, a large deposit of unusually pure graphite was discovered in Borrowdale, in the north of England. Local shepherds initially used it to mark their sheep, but it soon became clear that the material was ideal for writing and drawing. Because the graphite was so solid, it could be cut into sticks and wrapped in string or sheepskin.",
          "B. The deposit was so valuable that it was guarded, and graphite was even smuggled out of the mines. England enjoyed a near monopoly on pencil production for almost two centuries. However, when war cut off supplies to France in the 1790s, the French engineer Nicolas-Jacques Conté developed a new method: mixing powdered graphite with clay and baking it in a kiln.",
          "C. Conté's process had an important advantage beyond solving a supply problem. By changing the proportion of clay and graphite, manufacturers could produce pencils of different hardness, from soft, dark leads to hard, light ones. This is the origin of the grading system still printed on pencils today, such as HB and 2B.",
        ],
        glossary: [
          { en: 'deposit', es: 'yacimiento' },
          { en: 'smuggled', es: 'contrabandeado' },
          { en: 'kiln', es: 'horno (de cerámica)' },
          { en: 'lead', es: 'mina (del lápiz)' },
        ],
        questions: [
          { q: 'Scanning: In what year was the graphite discovered?', options: ['1564', '1790', '1654'], answer: 0 },
          { q: 'Which paragraph explains the origin of HB and 2B?', options: ['Paragraph A', 'Paragraph B', 'Paragraph C'], answer: 2 },
          { q: 'Why did Conté develop a new method?', options: ['English graphite became too expensive', 'War cut off supplies to France', 'Shepherds stopped using graphite'], answer: 1 },
          { q: 'What was the extra advantage of mixing graphite with clay?', options: ['Pencils became cheaper', 'Pencils of different hardness could be made', 'Pencils lasted longer'], answer: 1 },
        ],
      },
      culture: {
        title: 'En papel o en computador',
        body: 'El IELTS se puede presentar en papel o en computador, con el mismo contenido y la misma calificación. En computador puedes subrayar y tomar notas en pantalla, y los resultados suelen llegar más rápido. En papel tienes que transferir las respuestas de Listening a la hoja al final. Practica en el mismo formato que vas a presentar.',
      },
      mission: {
        title: 'Reto de velocidad',
        task: 'Escoge un artículo de 600-800 palabras de un medio en inglés (BBC, The Guardian, National Geographic). Pon un cronómetro: 2 minutos para skimming y escribe la idea principal de cada párrafo en 5 palabras. Luego crea 3 preguntas de scanning y respóndelas en 1 minuto.',
        steps: ['2 min: lee títulos, primeras frases y conectores', 'Escribe la idea de cada párrafo', '1 min: busca números, nombres y fechas'],
        model: 'P1: graphite discovered in England. P2: France creates new method. P3: different hardness, HB system. Scan Q: "When did war cut supplies?" → 1790s (found in 15 seconds by searching for numbers).',
      },
      exercises: [
        { type: 'choice', prompt: 'Para encontrar una fecha rápido en el texto, haces…', options: ['skimming', 'scanning', 'leer palabra por palabra'], answer: 1 },
        { type: 'dictation', audio: 'Read the first sentence of each paragraph.', translation: 'Lee la primera oración de cada párrafo.' },
        { type: 'match', prompt: 'Une el conector con su función', pairs: [['however', 'contraste'], ['consequently', 'consecuencia'], ['furthermore', 'adición'], ['for instance', 'ejemplo']] },
        { type: 'fix', sentence: 'Although it was cheap, but nobody bought it.', answers: ['Although it was cheap, nobody bought it.', 'It was cheap, but nobody bought it.'], explanation: 'No uses "although" y "but" juntos.' },
        { type: 'listen', audio: 'However, the results were disappointing.', options: ['Sin embargo, los resultados fueron decepcionantes.', 'Por lo tanto, los resultados fueron buenos.', 'Además, los resultados fueron sorprendentes.'], answer: 0 },
        { type: 'choice', prompt: 'Te quedas 4 minutos en una pregunta difícil. ¿Qué haces?', options: ['Sigues hasta resolverla', 'Adivinas, la marcas y sigues', 'La dejas en blanco'], answer: 1 },
        { type: 'dictation', audio: 'Scan for names, numbers and dates.', translation: 'Escanea buscando nombres, números y fechas.' },
        { type: 'fill', sentence: 'Skimming means reading quickly to get the ___.', answers: ['gist', 'main idea', 'general idea'], hint: 'idea general' },
        { type: 'truefalse', statement: 'Según la lectura, los pastores usaron primero el grafito para escribir cartas.', answer: false, explanation: 'Lo usaron para marcar a sus ovejas.' },
        { type: 'order', words: ['Underline', 'the', 'keywords', 'in', 'each', 'question'], translation: 'Subraya las palabras clave de cada pregunta.' },
      ],
    },
    // M2L2 · TFNG y Matching Headings
    {
      vocabulary: [
        { en: 'Qualifier', es: 'Calificador (palabra que limita)', example: '"Mostly" and "always" are qualifiers.', emoji: '🎚️' },
        { en: 'Opposite', es: 'Lo contrario', example: 'If the text says the opposite, the answer is False.', emoji: '🔄' },
        { en: 'Overall idea', es: 'Idea global', example: 'A heading summarizes the overall idea.', emoji: '🌐' },
        { en: 'Detail', es: 'Detalle', example: "Don't choose a heading based on one detail.", emoji: '🔬' },
        { en: 'Eliminate', es: 'Eliminar, descartar', example: 'Eliminate headings you have already used.', emoji: '❌' },
        { en: 'Statement', es: 'Afirmación', example: 'Read each statement carefully.', emoji: '💬' },
      ],
      mistakes: [
        { wrong: 'Marcar False cuando el texto simplemente no dice nada.', right: 'False = the text says the opposite. Not Given = the text gives no information.', why: 'Es el error más común. Pregúntate: ¿el texto CONTRADICE la frase o simplemente NO la menciona?' },
        { wrong: 'Usar tu conocimiento general para responder TFNG.', right: 'Answer only according to the text.', why: 'Aunque sepas que algo es cierto en la vida real, si el texto no lo dice, la respuesta es Not Given.' },
        { wrong: 'Escoger el heading que repite una palabra del párrafo.', right: 'Choose the heading that summarizes the whole paragraph.', why: 'Los distractores en Matching Headings toman un detalle del párrafo. El correcto resume la idea principal.' },
        { wrong: 'Ignorar palabras como "all", "only", "never".', right: 'Check qualifiers: "some" ≠ "all", "often" ≠ "always".', why: 'Un solo calificador puede convertir un True en False.' },
      ],
      pronunciation: {
        focus: 'Palabras de cantidad y frecuencia',
        tip: 'Los calificadores son clave en TFNG y también en el Listening. Escúchalos y pronúncialos con claridad: si confundes "most" con "almost", cambias el sentido.',
        words: [
          { word: 'almost', sounds: '/ˈɔːlmoʊst/ — "OL-moust"' },
          { word: 'most', sounds: '/moʊst/ — "moust"' },
          { word: 'rarely', sounds: '/ˈrerli/ — "RER-li"' },
          { word: 'entirely', sounds: '/ɪnˈtaɪərli/ — "in-TAIR-li"' },
          { word: 'occasionally', sounds: '/əˈkeɪʒənəli/ — "o-KEI-zho-na-li"' },
        ],
      },
      reading: {
        title: 'Honeybees and the language of dance',
        paragraphs: [
          "A. When a honeybee discovers a good source of food, it returns to the hive and performs a series of movements known as the waggle dance. The Austrian scientist Karl von Frisch, who studied this behavior for decades, showed that the dance communicates both the direction and the distance of the food. He was awarded the Nobel Prize in 1973 for his work.",
          "B. The angle of the dance relative to vertical indicates the direction of the food relative to the sun. The duration of the 'waggle' portion indicates distance: the longer the bee waggles, the farther away the food is. Remarkably, bees adjust the angle throughout the day to compensate for the movement of the sun.",
          "C. Not all scientists accepted von Frisch's conclusions immediately. Some argued that bees found food mainly by following smells rather than by interpreting the dance. It was only in the 2000s, when researchers tracked bees with radar, that the dance's role in guiding foragers to specific locations was widely confirmed.",
        ],
        glossary: [
          { en: 'hive', es: 'colmena' },
          { en: 'waggle', es: 'menear, contonear' },
          { en: 'compensate', es: 'compensar' },
          { en: 'foragers', es: 'abejas recolectoras' },
        ],
        questions: [
          { q: 'TFNG: Von Frisch received the Nobel Prize for his research on bees.', options: ['True', 'False', 'Not Given'], answer: 0 },
          { q: 'TFNG: A shorter waggle means the food is farther away.', options: ['True', 'False', 'Not Given'], answer: 1, explanation: 'Más largo = más lejos.' },
          { q: 'TFNG: Von Frisch also studied the dances of wasps.', options: ['True', 'False', 'Not Given'], answer: 2, explanation: 'El texto no habla de avispas.' },
          { q: 'Best heading for paragraph C:', options: ['How bees use the sun', 'A theory that took time to be confirmed', 'The importance of smell for bees'], answer: 1, explanation: 'El olor es solo un detalle; la idea global es la confirmación tardía.' },
        ],
      },
      culture: {
        title: 'Por qué los textos del IELTS parecen de revista científica',
        body: 'Los textos del Reading Academic vienen de libros, revistas y periódicos y están escritos para un lector no especialista. No necesitas saber de biología o historia: todo lo necesario está en el texto. Leer divulgación científica en inglés (por ejemplo, revistas de ciencia o la sección de ciencia de un periódico) es el mejor entrenamiento.',
      },
      mission: {
        title: 'Crea tus propias preguntas TFNG',
        task: 'Toma un párrafo de cualquier artículo en inglés y escribe 6 afirmaciones: 2 True, 2 False y 2 Not Given. Explica en una línea por qué cada una es así. Crear trampas es la mejor forma de detectarlas.',
        steps: ['True: parafrasea algo que el texto sí dice', 'False: cambia un calificador o di lo contrario', 'Not Given: agrega un detalle que no aparece'],
        model: 'Text: "Most bees die within six weeks in summer." True: "Many bees have a short summer lifespan." False: "All bees live longer than six weeks." Not Given: "Bees live longer in winter because it is cold." (el texto no habla del invierno).',
      },
      exercises: [
        { type: 'choice', prompt: 'Texto: "Some experts support the plan." Frase: "All experts support the plan."', options: ['True', 'False', 'Not Given'], answer: 1, explanation: '"Some" no es "all": lo contradice.' },
        { type: 'choice', prompt: 'Texto: "The museum opened in 1990." Frase: "The museum was popular when it opened."', options: ['True', 'False', 'Not Given'], answer: 2, explanation: 'No se dice nada de su popularidad.' },
        { type: 'dictation', audio: 'The text does not mention this information.', translation: 'El texto no menciona esta información.' },
        { type: 'choice', prompt: 'Texto: "Sales doubled in 2020." Frase: "Sales increased significantly in 2020."', options: ['True', 'False', 'Not Given'], answer: 0, explanation: 'Doblarse es un aumento significativo: paráfrasis.' },
        { type: 'match', prompt: 'Une la respuesta con su definición', pairs: [['True', 'El texto dice lo mismo'], ['False', 'El texto dice lo contrario'], ['Not Given', 'El texto no lo menciona']] },
        { type: 'listen', audio: 'Bees rarely travel more than five kilometers.', options: ['Las abejas casi nunca viajan más de 5 km.', 'Las abejas nunca viajan más de 5 km.', 'Las abejas siempre viajan 5 km.'], answer: 0 },
        { type: 'dictation', audio: 'Choose the heading that summarizes the paragraph.', translation: 'Escoge el título que resume el párrafo.' },
        { type: 'fill', sentence: 'If the text gives no information, the answer is Not ___.', answers: ['Given'], hint: 'TFNG' },
        { type: 'truefalse', statement: 'En TFNG puedes usar tu conocimiento general si estás seguro de que algo es cierto.', answer: false, explanation: 'Solo cuenta lo que dice el texto.' },
        { type: 'fix', sentence: "The text don't mention the price.", answers: ["The text doesn't mention the price.", 'The text does not mention the price.'], explanation: 'The text (it) → doesn\'t. Y si no lo menciona, la respuesta es Not Given.' },
      ],
    },
    // M2L3 · Práctica con tiempo / Listening
    {
      vocabulary: [
        { en: 'Postcode', es: 'Código postal (UK)', example: "What's your postcode?", emoji: '📮' },
        { en: 'Double (in numbers)', es: 'Doble (número repetido)', example: 'Double seven, three, four.', emoji: '2️⃣' },
        { en: 'Hyphenated', es: 'Con guion', example: 'Is the name hyphenated?', emoji: '➖' },
        { en: 'Correction (in audio)', es: 'Corrección (en el audio)', example: '"It\'s on Monday — sorry, Tuesday." The answer is Tuesday.', emoji: '↩️' },
        { en: 'Transfer time', es: 'Tiempo para transferir respuestas', example: 'Paper test: 10 minutes of transfer time.', emoji: '📋' },
        { en: 'Booking reference', es: 'Código de reserva', example: 'Your booking reference is BK7Q2.', emoji: '🎟️' },
      ],
      mistakes: [
        { wrong: 'Escribir la primera información que escuchas.', right: 'Wait — speakers often correct themselves.', why: 'El Listening incluye correcciones a propósito: "Monday… oh no, actually Tuesday". La respuesta es la última versión.' },
        { wrong: 'Escribir "a beautiful garden" cuando dice ONE WORD ONLY.', right: 'garden', why: 'Si excedes el límite de palabras, la respuesta es incorrecta aunque la información sea correcta.' },
        { wrong: 'Escribir "acommodation" o "goverment".', right: 'accommodation, government', why: 'La ortografía cuenta en Listening y Reading. Memoriza las palabras que más se repiten en el examen.' },
        { wrong: 'Usar el tiempo de pausa para revisar la sección anterior.', right: 'Use the pause to read the NEXT questions and predict answers.', why: 'Predecir el tipo de respuesta (número, nombre, lugar) te prepara para escucharla.' },
      ],
      pronunciation: {
        focus: 'Deletreo y números británicos',
        tip: 'En el Listening Part 1 te deletrean nombres y direcciones, muchas veces con acento británico. Ojo: "double" para letras repetidas, "oh" para el cero, "Zed" para la Z en Reino Unido, y "H" se dice "eich".',
        words: [
          { word: 'Z', sounds: '"zed" (UK) / "zii" (US)' },
          { word: 'H', sounds: '/eɪtʃ/ — "eich"' },
          { word: 'W', sounds: '/ˈdʌbəljuː/ — "DA-bel-iu"' },
          { word: '0 in phone numbers', sounds: '"oh"' },
          { word: '77', sounds: '"double seven"' },
        ],
      },
      reading: {
        title: 'Transcript: booking a language course',
        paragraphs: [
          "Receptionist: Good morning, Riverside Language Centre. How can I help? Student: Hi, I'd like to enrol in an evening course. Receptionist: Of course. Can I take your surname? Student: It's Restrepo. R-E-S-T-R-E-P-O. Receptionist: Thank you. And a contact number? Student: Yes, it's 0 7 7 3 2, 4 1 9, 5 6 0. Receptionist: So that's double seven, three, two… Student: Sorry, no — the last part is 5 6 5, not 5 6 0.",
          "Receptionist: Got it. Now, the evening courses run on Mondays and Wednesdays, or Tuesdays and Thursdays. Student: Mondays and Wednesdays would be better. Receptionist: Unfortunately, that group is full. Student: Oh. Then Tuesdays and Thursdays, I suppose. Receptionist: Great. Classes start at half past six and finish at eight thirty.",
          "Receptionist: The fee for the ten-week course is £320, but students get a fifteen percent discount. Student: I'm a student at the university. Receptionist: Then it's £272. You'll also need to buy the course book, which is £24. Student: Can I pay by card? Receptionist: Yes, or by bank transfer before the first class.",
        ],
        glossary: [
          { en: 'enrol', es: 'inscribirse (UK)' },
          { en: 'surname', es: 'apellido (UK)' },
          { en: 'fee', es: 'tarifa, costo' },
          { en: 'bank transfer', es: 'transferencia bancaria' },
        ],
        questions: [
          { q: 'What are the last three digits of the phone number?', options: ['560', '565', '556'], answer: 1, explanation: 'El estudiante se corrige: 5 6 5.' },
          { q: 'Which days will the student attend?', options: ['Mondays and Wednesdays', 'Tuesdays and Thursdays', 'Only Thursdays'], answer: 1, explanation: 'El grupo de lunes y miércoles está lleno.' },
          { q: 'What time do classes start?', options: ['6:00', '6:30', '8:30'], answer: 1 },
          { q: 'How much will the course fee be (without the book)?', options: ['£320', '£272', '£296'], answer: 1 },
        ],
      },
      culture: {
        title: 'Inglés británico en el Listening',
        body: 'El IELTS usa acentos de distintos países (británico, australiano, norteamericano, entre otros), y los contextos suelen ser británicos: "flat" (apartamento), "postcode", "enrol", "timetable", "car park", "ground floor" (primer piso), "first floor" (segundo piso). Familiarízate con este vocabulario antes del examen.',
      },
      mission: {
        title: 'Simulacro de Listening Part 1',
        task: 'Pídele a alguien que te dicte (o usa un audio de práctica) 10 datos: nombres deletreados, números de teléfono, direcciones y precios. Escríbelos con límite de "ONE WORD AND/OR A NUMBER".',
        steps: ['Lee las preguntas y predice el tipo de dato', 'Escucha una sola vez', 'Revisa ortografía y límite de palabras'],
        model: 'Name: Restrepo · Phone: 07732 419 565 · Days: Tuesday/Thursday · Start time: 6.30 · Fee: £272 · Book: £24',
      },
      exercises: [
        { type: 'listen', audio: 'My number is double seven, three, oh, two.', options: ['77302', '7302', '77322'], answer: 0 },
        { type: 'dictation', audio: 'The course starts at half past six.', translation: 'El curso empieza a las seis y media.' },
        { type: 'choice', prompt: 'Audio: "The meeting is on Thursday — sorry, I mean Friday." ¿Respuesta?', options: ['Thursday', 'Friday', 'Thursday or Friday'], answer: 1 },
        { type: 'fix', sentence: 'We need to book acommodation.', answers: ['We need to book accommodation.'], explanation: 'accommodation: doble c y doble m.' },
        { type: 'choice', prompt: 'Instrucción: "NO MORE THAN TWO WORDS". ¿Qué respuesta es válida?', options: ['a large city park', 'city park', 'the big city park'], answer: 1 },
        { type: 'listen', audio: 'The fee is two hundred and seventy-two pounds.', options: ['£272', '£227', '£2,072'], answer: 0 },
        { type: 'dictation', audio: 'Can I take your surname, please?', translation: '¿Me da su apellido, por favor?' },
        { type: 'match', prompt: 'Une el británico con el americano', pairs: [['flat', 'apartment'], ['postcode', 'zip code'], ['timetable', 'schedule'], ['car park', 'parking lot']] },
        { type: 'fill', sentence: 'In British English, the letter Z is pronounced "___".', answers: ['zed'], hint: 'Reino Unido' },
        { type: 'truefalse', statement: 'En la transcripción, el estudiante obtiene descuento por ser estudiante universitario.', answer: true },
      ],
    },
  ],
  // ─── Módulo 3: Writing & Speaking ───────────────────────────────────────
  [
    // M3L1 · Task 1
    {
      vocabulary: [
        { en: 'Proportion', es: 'Proporción', example: 'The proportion of young people decreased.', emoji: '🥧' },
        { en: 'Dramatically', es: 'Drásticamente', example: 'Prices rose dramatically.', emoji: '🚀' },
        { en: 'Gradually', es: 'Gradualmente', example: 'The number gradually declined.', emoji: '📉' },
        { en: 'Hit a low', es: 'Tocar fondo', example: 'Sales hit a low of 200 units in May.', emoji: '⬇️' },
        { en: 'In contrast', es: 'En contraste', example: 'In contrast, rural areas grew slowly.', emoji: '↔️' },
        { en: 'Approximately', es: 'Aproximadamente', example: 'Approximately 40% of users were women.', emoji: '≈' },
      ],
      mistakes: [
        { wrong: 'The graph shows the information about…', right: 'The line graph illustrates changes in the number of…', why: 'No copies la pregunta. Parafrasea: show → illustrate/compare; information about → the number/proportion of.' },
        { wrong: 'Dar tu opinión o explicar causas en Task 1.', right: 'Describe and compare only what the chart shows.', why: 'Task 1 Academic es objetiva. Explicar por qué pasó algo no suma y puede restar en Task Achievement.' },
        { wrong: 'No escribir un overview.', right: 'Overall, X increased while Y remained stable.', why: 'Sin overview (resumen de las tendencias principales) es muy difícil pasar de banda 5 en Task Achievement.' },
        { wrong: 'Describir cada número uno por uno.', right: 'Group and compare the key features.', why: 'El examinador valora la selección: agrupa datos similares y destaca los extremos y los cambios más grandes.' },
        { wrong: 'The sales increased of 10%.', right: 'Sales increased by 10%.', why: 'Cantidad del cambio con "by"; un aumento DE 10 % como sustantivo: "an increase of 10%".' },
      ],
      pronunciation: {
        focus: 'Vocabulario de tendencias',
        tip: 'Aunque Task 1 es escrito, pronunciar estas palabras te ayuda a fijarlas y a usarlas en el Speaking. Fíjate en el acento de los adverbios largos.',
        words: [
          { word: 'fluctuate', sounds: '/ˈflʌktʃueɪt/ — "FLAK-chu-eit"' },
          { word: 'plateau', sounds: '/plæˈtoʊ/ — "pla-TOU"' },
          { word: 'dramatically', sounds: '/drəˈmætɪkli/ — "dra-MA-ti-kli"' },
          { word: 'steadily', sounds: '/ˈstedɪli/ — "STE-di-li"' },
          { word: 'proportion', sounds: '/prəˈpɔːrʃən/ — "pro-POR-shon"' },
        ],
      },
      reading: {
        title: 'Model answer: coffee consumption (band 8 style)',
        paragraphs: [
          "The line graph compares average coffee consumption per person, in kilograms per year, in three countries — Finland, Brazil and Colombia — between 2000 and 2020.",
          "Overall, consumption rose in all three countries over the period, although Finland remained by far the largest consumer throughout. The most striking change was in Colombia, where the figure more than doubled.",
          "In 2000, Finns consumed approximately 11 kilograms per person, compared to around 5 kilograms in Brazil and just 2 in Colombia. Finnish consumption fluctuated slightly over the following decade before reaching a peak of 12.5 kilograms in 2015, after which it plateaued.",
          "Brazilian consumption increased steadily throughout the period, reaching about 6.5 kilograms in 2020. In contrast, Colombian consumption remained relatively stable until 2010 but then rose sharply, ending the period at roughly 4.5 kilograms per person.",
        ],
        glossary: [
          { en: 'by far', es: 'por mucho' },
          { en: 'throughout', es: 'durante todo (el periodo)' },
          { en: 'striking', es: 'llamativo' },
          { en: 'figure', es: 'cifra' },
        ],
        questions: [
          { q: 'Which paragraph is the overview?', options: ['The first', 'The second', 'The last'], answer: 1 },
          { q: 'What happened to Colombian consumption?', options: ['It more than doubled', 'It fell sharply', 'It remained stable'], answer: 0 },
          { q: 'What did Finnish consumption do after 2015?', options: ['It rose sharply', 'It plateaued', 'It fell'], answer: 1 },
          { q: 'Why is there no opinion or explanation of causes?', options: ['The writer forgot', 'Task 1 should only describe the data', 'It was too long'], answer: 1 },
        ],
      },
      culture: {
        title: 'La estructura de 4 párrafos',
        body: 'Una estructura confiable para Task 1: (1) Introducción: parafrasea la pregunta en una frase. (2) Overview: 2 tendencias principales, sin números. (3) Detalle 1: un grupo de datos con cifras. (4) Detalle 2: el otro grupo y comparaciones. Con 160-190 palabras y 20 minutos, esta estructura te deja tiempo para revisar.',
      },
      mission: {
        title: 'Escribe un Task 1 completo',
        task: 'Busca una gráfica real (por ejemplo, en Our World in Data o el DANE) y escribe un Task 1 de 150-190 palabras en 20 minutos, con la estructura de 4 párrafos.',
        steps: ['Parafrasea la pregunta', 'Overview sin números', '2 párrafos de detalle con comparaciones', 'Revisa: by/to/of, artículos y tiempos verbales'],
        model: 'The bar chart compares the percentage of households with internet access in four Colombian regions in 2015 and 2023. Overall, access increased in every region, although the gap between urban and rural areas remained significant…',
      },
      exercises: [
        { type: 'fix', sentence: 'The graph shows information about the sales.', answers: ['The graph illustrates the number of sales.', 'The graph illustrates changes in sales.', 'The line graph illustrates changes in sales.', 'The chart compares sales.'], explanation: 'Parafrasea y sé específico.' },
        { type: 'dictation', audio: 'Overall, sales increased steadily over the period.', translation: 'En general, las ventas aumentaron de manera constante durante el periodo.' },
        { type: 'choice', prompt: '¿Qué frase es un buen overview?', options: ['In 2010, sales were 200 units.', 'Overall, sales rose in all regions, while costs remained stable.', 'I think sales increased because of marketing.'], answer: 1 },
        { type: 'fix', sentence: 'There was an increase by 20% in 2015.', answers: ['There was an increase of 20% in 2015.'], explanation: 'Sustantivo → increase OF.' },
        { type: 'match', prompt: 'Une el verbo con su significado', pairs: [['plateau', 'estabilizarse'], ['peak', 'alcanzar el máximo'], ['fluctuate', 'fluctuar'], ['plummet', 'desplomarse']] },
        { type: 'listen', audio: 'The figure more than doubled.', options: ['La cifra se duplicó con creces.', 'La cifra bajó a la mitad.', 'La cifra se mantuvo.'], answer: 0 },
        { type: 'dictation', audio: 'In contrast, the number of cars fell sharply.', translation: 'En contraste, el número de carros cayó bruscamente.' },
        { type: 'fill', sentence: 'Sales rose ___ 100 to 150 units.', answers: ['from'], hint: 'de… a…' },
        { type: 'truefalse', statement: 'En Task 1 Academic debes explicar las causas de las tendencias.', answer: false, explanation: 'Solo describe y compara.' },
        { type: 'order', words: ['Finland', 'remained', 'by', 'far', 'the', 'largest', 'consumer'], translation: 'Finlandia siguió siendo, por mucho, el mayor consumidor.' },
      ],
    },
    // M3L2 · Task 2
    {
      vocabulary: [
        { en: 'Thesis statement', es: 'Tesis (postura principal)', example: 'State your position in the thesis statement.', emoji: '📌' },
        { en: 'Counterargument', es: 'Contraargumento', example: 'Address a counterargument to show balance.', emoji: '⚖️' },
        { en: 'It could be argued that', es: 'Podría argumentarse que', example: 'It could be argued that technology isolates people.', emoji: '🗣️' },
        { en: 'A case in point', es: 'Un ejemplo claro', example: 'Finland is a case in point.', emoji: '📍' },
        { en: 'Detrimental', es: 'Perjudicial', example: 'Excessive screen time is detrimental to sleep.', emoji: '⚠️' },
        { en: 'Outweigh', es: 'Pesar más que', example: 'The benefits outweigh the drawbacks.', emoji: '🏋️' },
      ],
      mistakes: [
        { wrong: 'Escribir sin postura clara en una pregunta "To what extent do you agree?".', right: 'State your position in the introduction and keep it consistent.', why: 'Las preguntas de opinión exigen una postura clara desde la introducción hasta la conclusión.' },
        { wrong: 'Memorizar frases como "In this day and age, it is a controversial issue…".', right: 'Write a specific introduction that paraphrases the question.', why: 'Los examinadores detectan frases memorizadas y no las cuentan como lenguaje propio.' },
        { wrong: 'Peoples, informations, advices, researches.', right: 'people, information, advice, research', why: 'Estos sustantivos son incontables (o ya plurales). Son de los errores más castigados en Grammatical Range and Accuracy.' },
        { wrong: 'Usar contracciones: don\'t, can\'t, it\'s.', right: 'do not, cannot, it is', why: 'En el ensayo académico se prefieren las formas completas.' },
        { wrong: 'Ideas sin ejemplos: "Technology is good for education."', right: 'Explain + example: "…for instance, online platforms allow rural students to access university lectures."', why: 'Cada párrafo de desarrollo necesita idea, explicación y ejemplo concreto.' },
      ],
      pronunciation: {
        focus: 'Palabras académicas con acento difícil',
        tip: 'Estas palabras de ensayo también suben tu nota de Lexical Resource en Speaking si las pronuncias bien. Ojo con el acento: los hispanohablantes tienden a ponerlo en la penúltima sílaba.',
        words: [
          { word: 'controversial', sounds: '/ˌkɑːntrəˈvɜːrʃəl/ — "kan-tro-VER-shal"' },
          { word: 'detrimental', sounds: '/ˌdetrɪˈmentl/ — "de-tri-MEN-tal"' },
          { word: 'individual', sounds: '/ˌɪndɪˈvɪdʒuəl/ — "in-di-VI-chual"' },
          { word: 'environment', sounds: '/ɪnˈvaɪrənmənt/ — "in-VAI-ron-ment"' },
          { word: 'technology', sounds: '/tekˈnɑːlədʒi/ — "tek-NA-lo-chi"' },
        ],
      },
      reading: {
        title: 'Model body paragraph (band 8 style)',
        paragraphs: [
          "Question: Some people believe that university education should be free for all students. To what extent do you agree or disagree?",
          "Body paragraph: The most compelling argument for free tuition is that it promotes social mobility. When higher education depends on a family's ability to pay, talented students from low-income backgrounds are often excluded, regardless of their potential. Removing fees allows admission to be based on merit rather than wealth. Germany is a case in point: since abolishing tuition fees at public universities in 2014, the country has maintained high enrolment rates while attracting large numbers of international students.",
          "Counterargument paragraph: It could be argued, however, that free education places an unfair burden on taxpayers, many of whom never attend university themselves. While this concern is understandable, it overlooks the wider benefits of a highly educated population, such as increased tax revenue and innovation, which ultimately benefit society as a whole.",
        ],
        glossary: [
          { en: 'compelling', es: 'convincente' },
          { en: 'regardless of', es: 'sin importar' },
          { en: 'abolishing', es: 'abolir, eliminar' },
          { en: 'overlooks', es: 'pasa por alto' },
        ],
        questions: [
          { q: 'What is the main idea of the body paragraph?', options: ['Free tuition promotes social mobility', 'Germany has good universities', 'Taxpayers pay too much'], answer: 0 },
          { q: 'What is the function of the Germany example?', options: ['To introduce a counterargument', 'To support the main idea with evidence', 'To conclude the essay'], answer: 1 },
          { q: 'How does the writer deal with the counterargument?', options: ['Ignores it', 'Accepts it completely', 'Acknowledges it and then refutes it'], answer: 2 },
          { q: 'Which phrase introduces the opposing view?', options: ['A case in point', 'It could be argued, however', 'As a whole'], answer: 1 },
        ],
      },
      culture: {
        title: 'Los 4 tipos de pregunta de Task 2',
        body: 'Casi todas las preguntas de Task 2 encajan en uno de estos tipos: (1) Opinión: "To what extent do you agree?". (2) Discusión: "Discuss both views and give your opinion". (3) Problema-solución: "What are the causes and what solutions…?". (4) Ventajas-desventajas: "Do the advantages outweigh the disadvantages?". Identificar el tipo en los primeros 30 segundos define tu estructura.',
      },
      mission: {
        title: 'Ensayo de 40 minutos',
        task: 'Escribe un ensayo completo de Task 2 (260-300 palabras, 40 minutos) para esta pregunta: "Some people think that governments should invest more in public transport than in building new roads. To what extent do you agree or disagree?"',
        steps: ['5 min: planea postura, 2 ideas y ejemplos', '30 min: introducción, 2 párrafos de desarrollo, conclusión', '5 min: revisa artículos, plurales y concordancia'],
        model: 'Introduction: "Whether public money should be spent on transport networks or on road construction is a widely debated issue. In my view, prioritising public transport is the more sustainable option, although some road investment remains necessary." …',
      },
      exercises: [
        { type: 'fix', sentence: 'The government should give more informations to peoples.', answers: ['The government should give more information to people.'], explanation: 'information y people no llevan -s.' },
        { type: 'dictation', audio: 'It could be argued that technology isolates people.', translation: 'Podría argumentarse que la tecnología aísla a las personas.' },
        { type: 'choice', prompt: '"Discuss both views and give your own opinion." ¿Qué tipo de pregunta es?', options: ['Opinion', 'Discussion', 'Problem-solution'], answer: 1 },
        { type: 'fix', sentence: "Governments can't ignore this problem.", answers: ['Governments cannot ignore this problem.'], explanation: 'Sin contracciones en el ensayo.' },
        { type: 'match', prompt: 'Une la frase con su función en el ensayo', pairs: [['In my view,', 'Dar tu postura'], ['A case in point is', 'Dar un ejemplo'], ['It could be argued that', 'Presentar la otra postura'], ['In conclusion,', 'Cerrar']] },
        { type: 'listen', audio: 'The benefits clearly outweigh the drawbacks.', options: ['Los beneficios claramente superan las desventajas.', 'Los beneficios son iguales a las desventajas.', 'Las desventajas son más claras.'], answer: 0 },
        { type: 'dictation', audio: 'Excessive screen time is detrimental to sleep.', translation: 'El exceso de pantallas es perjudicial para el sueño.' },
        { type: 'fill', sentence: 'Many students are excluded, regardless ___ their potential.', answers: ['of'], hint: 'sin importar' },
        { type: 'truefalse', statement: 'Usar frases de introducción memorizadas sube la banda en Lexical Resource.', answer: false, explanation: 'Los examinadores las detectan y no cuentan.' },
        { type: 'order', words: ['This', 'essay', 'will', 'argue', 'that', 'education', 'should', 'be', 'free'], translation: 'Este ensayo argumentará que la educación debería ser gratuita.' },
      ],
    },
    // M3L3 · Speaking Part 2
    {
      vocabulary: [
        { en: 'I\'d like to talk about', es: 'Me gustaría hablar de', example: "I'd like to talk about a teacher who inspired me.", emoji: '🎤' },
        { en: 'It dates back to', es: 'Se remonta a', example: 'It dates back to when I was twelve.', emoji: '⏳' },
        { en: 'What struck me most', es: 'Lo que más me impactó', example: 'What struck me most was her patience.', emoji: '⚡' },
        { en: 'I\'ll never forget', es: 'Nunca olvidaré', example: "I'll never forget the view from the top.", emoji: '💭' },
        { en: 'Looking back', es: 'En retrospectiva', example: 'Looking back, it was the best decision I made.', emoji: '🔙' },
        { en: 'Off the beaten track', es: 'Fuera de lo turístico', example: 'It is a village off the beaten track.', emoji: '🗺️' },
      ],
      mistakes: [
        { wrong: 'Dejar de hablar al minuto porque "ya respondí todo".', right: 'Extend each bullet point with details, feelings and examples.', why: 'Tienes que hablar hasta 2 minutos. Desarrolla cada punto con: qué, cuándo, cómo te sentiste y por qué.' },
        { wrong: 'Escribir frases completas durante el minuto de preparación.', right: 'Write keywords only, one line per bullet point.', why: 'No alcanzas a escribir frases y luego te pones a leer. Las palabras clave te dan estructura y flexibilidad.' },
        { wrong: 'Usar solo presente simple en toda la respuesta.', right: 'Mix tenses: past simple, past continuous, present perfect and conditionals.', why: 'Grammatical Range premia la variedad de estructuras usadas con precisión.' },
        { wrong: 'Very good, very nice, very beautiful…', right: 'breathtaking, fascinating, incredibly rewarding', why: 'Variar adjetivos y adverbios es clave para Lexical Resource.' },
      ],
      pronunciation: {
        focus: 'Acento de frase y chunks para sonar fluido',
        tip: 'El criterio de pronunciación evalúa también el ritmo. Agrupa las palabras en bloques con una pausa breve entre ellos y acentúa la palabra que lleva la información nueva: "I\'d like to talk about | a TRIP | I took to the AMAZON | about two years AGO."',
        words: [
          { word: "I'd like to talk about…", sounds: '"aid-LAIK-tu-TOK-a-baut"' },
          { word: 'What struck me most was…', sounds: '"uat-STRAK-mi-MOUST-uas"' },
          { word: "I'll never forget…", sounds: '"ail-NE-ver-for-GUET"' },
          { word: 'Looking back,', sounds: '"LU-king-BAK" + pausa' },
        ],
      },
      reading: {
        title: 'Model answer: describe a place you visited that impressed you',
        paragraphs: [
          "I'd like to talk about Caño Cristales, a river in the Serranía de la Macarena, in central Colombia. I went there about three years ago with two close friends from university, just after we'd finished our final exams, so it was a kind of celebration trip.",
          "Getting there was an adventure in itself. We took a small plane to a town called La Macarena, and then we hiked for about two hours with a local guide. What struck me most was the colour of the water: between July and November, a plant that grows on the riverbed turns bright red, so the river looks like a rainbow — red, yellow, green and blue all at once.",
          "I'll never forget swimming in one of the natural pools while the guide told us legends about the area. It impressed me not only because it was breathtaking, but also because the local community protects it so carefully: visitors can't wear sunscreen in the water, for example. Looking back, it made me realise how many incredible places we have in Colombia that most people have never heard of.",
        ],
        glossary: [
          { en: 'riverbed', es: 'lecho del río' },
          { en: 'in itself', es: 'en sí misma' },
          { en: 'breathtaking', es: 'impresionante, que deja sin aliento' },
          { en: 'realise', es: 'darse cuenta (UK)' },
        ],
        questions: [
          { q: 'Why did the speaker go on this trip?', options: ['For work', 'To celebrate finishing exams', 'To visit family'], answer: 1 },
          { q: 'What makes the river colourful?', options: ['Minerals in the rocks', 'A plant on the riverbed', 'The reflection of the sky'], answer: 1 },
          { q: 'Which tense does "we\'d finished" show?', options: ['Past perfect', 'Present perfect', 'Future'], answer: 0, explanation: 'Variedad de tiempos: un plus en Grammatical Range.' },
          { q: 'What is the function of the last sentence?', options: ['A reflection that closes the answer', 'A new bullet point', 'A question for the examiner'], answer: 0 },
        ],
      },
      culture: {
        title: 'El examinador no evalúa si tu historia es verdad',
        body: 'En la Parte 2 no te califican por el contenido ni por la veracidad, sino por el idioma: fluidez, vocabulario, gramática y pronunciación. Si te sale un tema sobre el que no tienes experiencia, adapta una historia real o invéntala con naturalidad. Prepara 5-6 historias versátiles (una persona, un lugar, un objeto, un evento, una habilidad) que puedas adaptar.',
      },
      mission: {
        title: 'Cue card cronometrada',
        task: 'Cue card: "Describe a skill you learned that you are proud of. You should say: what the skill is, when and how you learned it, what difficulties you faced, and explain why you are proud of it." Prepara 1 minuto con palabras clave y habla 2 minutos. Grábate.',
        steps: ['1 min de notas: 4 líneas de palabras clave', 'Abre con "I\'d like to talk about…"', 'Usa al menos 3 tiempos verbales', 'Cierra con una reflexión ("Looking back…")'],
        model: "I'd like to talk about learning to swim, which I did surprisingly late — when I was twenty-five. I'd always been afraid of deep water, so… What struck me most was how quickly I improved once I stopped panicking… Looking back, I'm proud of it because it taught me that fear is often bigger than the actual challenge.",
      },
      exercises: [
        { type: 'choice', prompt: '¿Qué escribes en el minuto de preparación?', options: ['El discurso completo', 'Palabras clave por cada punto', 'Nada, es mejor improvisar'], answer: 1 },
        { type: 'dictation', audio: "I'd like to talk about a trip I took last year.", translation: 'Me gustaría hablar de un viaje que hice el año pasado.' },
        { type: 'fix', sentence: 'The place was very very beautiful.', answers: ['The place was breathtaking.', 'The place was absolutely stunning.', 'The place was stunning.', 'The place was incredibly beautiful.'], explanation: 'Usa un adjetivo más preciso.' },
        { type: 'listen', audio: 'What struck me most was the silence.', options: ['Lo que más me impactó fue el silencio.', 'El silencio me golpeó.', 'Lo que más me molestó fue el ruido.'], answer: 0 },
        { type: 'match', prompt: 'Une la expresión con su uso', pairs: [["I'd like to talk about…", 'Abrir'], ['What struck me most…', 'Destacar un detalle'], ['Looking back,', 'Reflexionar'], ['It dates back to…', 'Situar en el tiempo']] },
        { type: 'dictation', audio: "Looking back, it was the best decision I've ever made.", translation: 'En retrospectiva, fue la mejor decisión que he tomado.' },
        { type: 'fix', sentence: 'When I arrived, they already left.', answers: ['When I arrived, they had already left.'], explanation: 'Acción anterior a otra en el pasado: past perfect.' },
        { type: 'fill', sentence: "I'll never ___ the view from the top.", answers: ['forget'], hint: 'nunca olvidaré' },
        { type: 'truefalse', statement: 'En la Parte 2 te bajan la nota si la historia no es real.', answer: false, explanation: 'Se evalúa el idioma, no la veracidad.' },
        { type: 'order', words: ['It', 'was', 'an', 'adventure', 'in', 'itself'], translation: 'Fue una aventura en sí misma.' },
      ],
    },
  ],
];
