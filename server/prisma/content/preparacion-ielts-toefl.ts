import type { LessonContentInput } from '../../src/lessonContent/schema.js';

/**
 * Preparación IELTS / TOEFL (C1). [módulo][lección], en el mismo orden que el seed.
 * Los datos de formato corresponden al IELTS Academic. El TOEFL cambió de formato en 2026:
 * verifica los detalles actualizados en ets.org antes de agregar contenido específico.
 */
export const preparacionIeltsToefl: LessonContentInput[][] = [
  // ─── Módulo 1: Diagnóstico y estrategia ─────────────────────────────────
  [
    {
      objective: 'Conocer el formato del IELTS Academic: secciones, tiempos y cómo se califica.',
      slides: [
        { en: 'Listening: about 30 minutes, 4 parts, 40 questions.', es: 'Listening: unos 30 minutos, 4 partes, 40 preguntas.' },
        { en: 'Reading: 60 minutes, 3 passages, 40 questions.', es: 'Reading: 60 minutos, 3 textos, 40 preguntas.' },
        { en: 'Writing: 60 minutes, Task 1 and Task 2.', es: 'Writing: 60 minutos, Task 1 y Task 2.', note: 'Task 2 vale el doble que Task 1.' },
        { en: 'Speaking: 11 to 14 minutes, 3 parts.', es: 'Speaking: de 11 a 14 minutos, 3 partes.' },
        { en: 'Scores go from band 0 to band 9.', es: 'El puntaje va de la banda 0 a la 9.' },
      ],
      vocabulary: [
        { en: 'Band score', es: 'Puntaje por banda', example: 'I need an overall band score of 7.', emoji: '🎯' },
        { en: 'Overall', es: 'General / global', example: 'Her overall score was 7.5.', emoji: '📊' },
        { en: 'Passage', es: 'Texto (de lectura)', example: 'The third passage is the hardest.', emoji: '📄' },
        { en: 'Assessment criteria', es: 'Criterios de evaluación', example: 'Read the assessment criteria carefully.', emoji: '📏' },
        { en: 'Examiner', es: 'Examinador', example: 'The examiner asks three types of questions.', emoji: '🧑‍⚖️' },
        { en: 'Requirement', es: 'Requisito', example: 'The university requirement is band 6.5.', emoji: '📌' },
      ],
      grammar: {
        title: 'Los cuatro criterios de Writing y Speaking',
        explanation:
          'Writing se califica con: Task Achievement/Response (responder exactamente lo que piden), Coherence and Cohesion (organización y conectores), Lexical Resource (vocabulario) y Grammatical Range and Accuracy (variedad y precisión gramatical). Speaking cambia el primero por Fluency and Coherence y agrega Pronunciation. Cada criterio pesa lo mismo.',
        examples: [
          { en: 'Task Response: answer every part of the question.', es: 'Task Response: responde cada parte de la pregunta.' },
          { en: 'Coherence and Cohesion: use clear paragraphs and linkers.', es: 'Coherencia y cohesión: párrafos claros y conectores.' },
          { en: 'Lexical Resource: show a wide and precise vocabulary.', es: 'Vocabulario: amplio y preciso.' },
        ],
        tip: 'Antes de estudiar, confirma qué banda pide tu universidad o proceso migratorio: tu plan depende de ese número.',
      },
      dialogue: {
        title: 'Consulta con el profe',
        lines: [
          { speaker: 'Student', en: "I need a 7 overall for my master's in Canada. Where should I start?", es: 'Necesito 7 general para mi maestría en Canadá. ¿Por dónde empiezo?' },
          { speaker: 'Teacher', en: 'First, check if they also require a minimum in each section.', es: 'Primero, revisa si también exigen un mínimo en cada sección.' },
          { speaker: 'Student', en: 'They ask for no band lower than 6.5.', es: 'Piden que ninguna banda sea menor a 6.5.' },
          { speaker: 'Teacher', en: "Then we'll take a diagnostic test and focus on your weakest skill.", es: 'Entonces haremos un examen diagnóstico y nos enfocaremos en tu habilidad más débil.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuánto dura la sección de Reading?', options: ['30 minutos', '60 minutos', '90 minutos'], answer: 1 },
        { type: 'choice', prompt: 'En Writing, ¿qué tarea pesa más?', options: ['Task 1', 'Task 2', 'Pesan igual'], answer: 1 },
        { type: 'match', pairs: [['Listening', '4 partes, 40 preguntas'], ['Reading', '3 textos, 40 preguntas'], ['Writing', 'Task 1 y Task 2'], ['Speaking', '3 partes']] },
        { type: 'truefalse', statement: 'Pronunciation es un criterio de evaluación en Writing.', answer: false, explanation: 'Pronunciation solo se evalúa en Speaking.' },
        { type: 'fill', sentence: 'I need an overall band ___ of 7.', answers: ['score'] },
        { type: 'truefalse', statement: 'La universidad del estudiante exige mínimo 6.5 en cada sección.', answer: true },
        { type: 'listen', audio: 'The university requires no band lower than six point five.', options: ['Ninguna banda puede ser menor a 6.5.', 'La banda general debe ser 6.5.', 'Solo Writing debe ser 6.5.'], answer: 0 },
        { type: 'speak', phrase: 'I need an overall band score of seven for my master’s degree.', translation: 'Necesito una banda general de 7 para mi maestría.' },
      ],
    },
    {
      objective: 'Hacer un diagnóstico realista de tu nivel con preguntas tipo examen.',
      slides: [
        { en: 'A diagnostic shows your starting point.', es: 'El diagnóstico muestra tu punto de partida.' },
        { en: 'Identify your weakest skill.', es: 'Identifica tu habilidad más débil.' },
        { en: 'Time yourself as in the real test.', es: 'Mide el tiempo como en el examen real.' },
        { en: 'Analyze every mistake.', es: 'Analiza cada error: ¿vocabulario, lectura rápida o distracción?' },
      ],
      vocabulary: [
        { en: 'Diagnostic', es: 'Diagnóstico', example: 'Take a diagnostic before you start.', emoji: '🩺' },
        { en: 'Weakness', es: 'Debilidad', example: 'My main weakness is listening.', emoji: '🔧' },
        { en: 'Strength', es: 'Fortaleza', example: 'Reading is my strength.', emoji: '💪' },
        { en: 'Accuracy', es: 'Precisión', example: 'Accuracy matters more than speed at first.', emoji: '🎯' },
        { en: 'Paraphrase', es: 'Parafrasear', example: 'The question paraphrases the text.', emoji: '🔄' },
        { en: 'Distractor', es: 'Opción trampa', example: 'Option B is a distractor.', emoji: '🪤' },
      ],
      grammar: {
        title: 'Las preguntas parafrasean el texto',
        explanation:
          'Casi nunca encontrarás las mismas palabras de la pregunta en el texto o el audio: el examen usa sinónimos y paráfrasis. Por eso el vocabulario de sinónimos es la habilidad más rentable. Ejemplo: la pregunta dice "rose sharply" y el texto dice "increased dramatically".',
        examples: [
          { en: 'Text: "The population doubled." → Question: "The population grew by 100%."', es: 'Texto: "la población se duplicó" → pregunta: "creció un 100%".' },
          { en: 'Text: "It is not uncommon." → Meaning: "It is quite common."', es: '"No es poco común" = "es bastante común".' },
          { en: 'Text: "Researchers were unable to confirm…" → "It was not proven."', es: '"No pudieron confirmar" = "no se comprobó".' },
        ],
        tip: 'Crea una lista de sinónimos por tema (educación, medio ambiente, tecnología, salud) y repásala a diario.',
      },
      dialogue: {
        title: 'Texto de práctica',
        lines: [
          { speaker: 'Passage', en: 'Urban bee populations have grown steadily over the past decade, largely due to rooftop gardens.', es: 'Las poblaciones urbanas de abejas han crecido de forma constante en la última década, en gran parte gracias a los jardines en terrazas.' },
          { speaker: 'Passage', en: 'However, scientists warn that rural populations continue to decline.', es: 'Sin embargo, los científicos advierten que las poblaciones rurales siguen disminuyendo.' },
          { speaker: 'Passage', en: 'Pesticide use remains the main factor behind this decline.', es: 'El uso de pesticidas sigue siendo el factor principal de esta disminución.' },
        ],
      },
      exercises: [
        { type: 'truefalse', statement: 'Según el texto, las abejas urbanas han aumentado.', answer: true },
        { type: 'truefalse', statement: 'Según el texto, las abejas rurales también han aumentado.', answer: false, explanation: '"Rural populations continue to decline."' },
        { type: 'choice', prompt: '¿Cuál es el principal factor de la disminución rural?', options: ['Rooftop gardens', 'Pesticide use', 'Climate change'], answer: 1, explanation: '"Climate change" no se menciona: es un distractor.' },
        { type: 'choice', prompt: '"Grown steadily" es una paráfrasis de:', options: ['Increased gradually', 'Fell sharply', 'Stayed the same'], answer: 0 },
        { type: 'match', prompt: 'Une cada palabra con su sinónimo', pairs: [['Decline', 'Decrease'], ['Largely', 'Mainly'], ['Warn', 'Caution'], ['Steadily', 'Gradually']] },
        { type: 'fill', sentence: 'Option C is a ___: it looks correct but it is not in the text.', answers: ['distractor'] },
        { type: 'listen', audio: 'It is not uncommon for students to improve one full band in three months.', options: ['Es bastante común mejorar una banda en tres meses.', 'Es imposible mejorar una banda en tres meses.', 'Muy pocos mejoran en tres meses.'], answer: 0 },
      ],
    },
    {
      objective: 'Armar un plan de estudio semanal realista para alcanzar tu banda objetivo.',
      slides: [
        { en: 'Set a target band and a test date.', es: 'Define una banda objetivo y una fecha de examen.' },
        { en: 'Study a little every day, not a lot once a week.', es: 'Estudia un poco cada día, no mucho una vez a la semana.' },
        { en: 'Spend most of your time on your weakest skill.', es: 'Dedica la mayor parte del tiempo a tu habilidad más débil.' },
        { en: 'Take a full mock test every two weeks.', es: 'Haz un simulacro completo cada dos semanas.' },
      ],
      vocabulary: [
        { en: 'Target', es: 'Objetivo / meta', example: 'My target is band 7.', emoji: '🎯' },
        { en: 'Mock test', es: 'Simulacro', example: 'I took a mock test on Saturday.', emoji: '📝' },
        { en: 'Schedule', es: 'Horario / cronograma', example: 'Stick to your schedule.', emoji: '🗓️' },
        { en: 'Consistent', es: 'Constante', example: 'Consistent practice beats cramming.', emoji: '🔁' },
        { en: 'Cram', es: 'Estudiar a última hora', example: "Don't cram the night before.", emoji: '😵' },
        { en: 'Track progress', es: 'Medir el progreso', example: 'Track your progress in a spreadsheet.', emoji: '📈' },
      ],
      grammar: {
        title: 'Hablar de planes: "going to" vs "will"',
        explanation:
          '"Going to" expresa planes ya decididos ("I\'m going to take the test in June"). "Will" se usa para decisiones en el momento o predicciones ("I think I\'ll pass"). En Speaking, usar ambos correctamente demuestra rango gramatical.',
        examples: [
          { en: "I'm going to study for one hour every morning.", es: 'Voy a estudiar una hora todas las mañanas.' },
          { en: "I think I'll improve faster with a teacher.", es: 'Creo que mejoraré más rápido con un profesor.' },
          { en: "By June, I will have completed six mock tests.", es: 'Para junio habré completado seis simulacros.' },
        ],
        tip: 'Ejemplo de semana: lunes Reading, martes Listening, miércoles Writing Task 1, jueves Writing Task 2, viernes Speaking, sábado vocabulario y domingo descanso.',
      },
      dialogue: {
        title: 'Plan de estudio',
        lines: [
          { speaker: 'Teacher', en: 'How many hours a week can you study?', es: '¿Cuántas horas a la semana puedes estudiar?' },
          { speaker: 'Student', en: 'About eight. I work full-time.', es: 'Unas ocho. Trabajo tiempo completo.' },
          { speaker: 'Teacher', en: "Then let's do one hour a day and a mock test every other Saturday.", es: 'Entonces hagamos una hora diaria y un simulacro cada dos sábados.' },
          { speaker: 'Student', en: "I'm going to start tomorrow. Writing is my weakest skill.", es: 'Voy a empezar mañana. Writing es mi habilidad más débil.' },
          { speaker: 'Teacher', en: "Perfect. We'll spend half of your time on writing.", es: 'Perfecto. Dedicaremos la mitad de tu tiempo a writing.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Qué estrategia es mejor?', options: ['Estudiar 8 horas el domingo', 'Estudiar una hora cada día', 'Estudiar solo la semana antes'], answer: 1 },
        { type: 'choice', prompt: "I've already booked the test. I ___ take it in May.", options: ["'ll", "'m going to", 'will be'], answer: 1, explanation: 'Plan ya decidido: "going to".' },
        { type: 'fill', sentence: "Don't ___ the night before the exam.", answers: ['cram'] },
        { type: 'match', pairs: [['Mock test', 'Simulacro'], ['Target', 'Meta'], ['Consistent', 'Constante'], ['Track progress', 'Medir el progreso']] },
        { type: 'truefalse', statement: 'El estudiante puede estudiar unas ocho horas por semana.', answer: true },
        { type: 'order', words: ['By', 'June,', 'I', 'will', 'have', 'completed', 'six', 'mock', 'tests'], translation: 'Para junio habré completado seis simulacros.' },
        { type: 'speak', phrase: "I'm going to study for one hour every day until the test.", translation: 'Voy a estudiar una hora diaria hasta el examen.' },
      ],
    },
  ],
  // ─── Módulo 2: Reading & Listening ──────────────────────────────────────
  [
    {
      objective: 'Usar skimming y scanning para encontrar respuestas sin leer todo palabra por palabra.',
      slides: [
        { en: 'Skimming: read fast for the main idea.', es: 'Skimming: leer rápido para captar la idea principal.' },
        { en: 'Scanning: search for specific details.', es: 'Scanning: buscar un dato puntual (fechas, nombres, cifras).' },
        { en: 'Read the questions before the passage.', es: 'Lee las preguntas antes del texto.' },
        { en: 'Underline keywords in each question.', es: 'Subraya las palabras clave de cada pregunta.' },
      ],
      vocabulary: [
        { en: 'Skim', es: 'Leer por encima', example: 'Skim the passage in two minutes.', emoji: '🏃' },
        { en: 'Scan', es: 'Escanear / buscar un dato', example: 'Scan for dates and numbers.', emoji: '🔎' },
        { en: 'Keyword', es: 'Palabra clave', example: 'Underline the keywords.', emoji: '🔑' },
        { en: 'Main idea', es: 'Idea principal', example: 'What is the main idea of paragraph B?', emoji: '💡' },
        { en: 'Topic sentence', es: 'Oración principal', example: 'The topic sentence is usually first.', emoji: '🧭' },
        { en: 'Infer', es: 'Inferir', example: 'What can we infer from the text?', emoji: '🧠' },
      ],
      grammar: {
        title: 'Oraciones principales y conectores de contraste',
        explanation:
          'En textos académicos, la idea principal de cada párrafo suele estar en la primera o la última oración. Presta atención a conectores de contraste ("however", "nevertheless", "whereas"): lo que viene después suele ser la idea importante y la respuesta de muchas preguntas.',
        examples: [
          { en: 'Many believe X. However, recent studies show Y.', es: 'Muchos creen X. Sin embargo, estudios recientes muestran Y.' },
          { en: 'Whereas older adults prefer print, teenagers read online.', es: 'Mientras los adultos mayores prefieren el impreso, los adolescentes leen en línea.' },
          { en: 'Nevertheless, the results remain inconclusive.', es: 'No obstante, los resultados siguen sin ser concluyentes.' },
        ],
        tip: 'Si una pregunta te toma más de 90 segundos, márcala y sigue. Vuelve al final.',
      },
      dialogue: {
        title: 'Párrafo para practicar',
        lines: [
          { speaker: 'Paragraph A', en: 'For decades, scientists assumed that sleep was mainly a period of rest for the body.', es: 'Durante décadas, los científicos asumieron que el sueño era principalmente un descanso para el cuerpo.' },
          { speaker: 'Paragraph A', en: 'However, research published in 2013 revealed that the brain clears toxic waste during sleep.', es: 'Sin embargo, una investigación publicada en 2013 reveló que el cerebro elimina desechos tóxicos durante el sueño.' },
          { speaker: 'Paragraph A', en: 'This process is up to ten times more active than when we are awake.', es: 'Este proceso es hasta diez veces más activo que cuando estamos despiertos.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Para encontrar el año de la investigación usas:', options: ['Skimming', 'Scanning', 'Leer todo despacio'], answer: 1 },
        { type: 'choice', prompt: '¿Cuál es la idea principal del párrafo?', options: ['El sueño es solo descanso físico.', 'El cerebro hace una limpieza importante durante el sueño.', 'Los científicos duermen poco.'], answer: 1, explanation: 'La idea clave viene después de "However".' },
        { type: 'fill', sentence: 'The research was published in ___.', answers: ['2013'] },
        { type: 'truefalse', statement: 'El proceso de limpieza es más activo cuando estamos despiertos.', answer: false },
        { type: 'match', pairs: [['However', 'Sin embargo'], ['Whereas', 'Mientras que'], ['Nevertheless', 'No obstante'], ['Infer', 'Inferir']] },
        { type: 'order', words: ['Read', 'the', 'questions', 'before', 'the', 'passage'], translation: 'Lee las preguntas antes del texto.' },
        { type: 'listen', audio: 'However, recent studies have shown the opposite.', options: ['Sin embargo, estudios recientes muestran lo contrario.', 'Además, los estudios lo confirman.', 'Por lo tanto, no hay estudios.'], answer: 0 },
      ],
    },
    {
      objective: 'Dominar los tipos de pregunta más difíciles: True / False / Not Given y Matching Headings.',
      slides: [
        { en: 'TRUE: the text confirms the statement.', es: 'TRUE: el texto confirma la afirmación.' },
        { en: 'FALSE: the text contradicts it.', es: 'FALSE: el texto dice lo contrario.' },
        { en: "NOT GIVEN: the text doesn't say.", es: 'NOT GIVEN: el texto no lo menciona.' },
        { en: 'Matching headings: choose the main idea, not a detail.', es: 'Matching headings: elige la idea principal, no un detalle.' },
      ],
      vocabulary: [
        { en: 'Not given', es: 'No se menciona', example: 'The answer is Not Given.', emoji: '🤐' },
        { en: 'Contradict', es: 'Contradecir', example: 'The statement contradicts the text.', emoji: '↔️' },
        { en: 'Heading', es: 'Título / encabezado', example: 'Choose the correct heading for paragraph C.', emoji: '🏷️' },
        { en: 'Claim', es: 'Afirmación', example: 'The writer claims that…', emoji: '📣' },
        { en: 'Assume', es: 'Suponer', example: "Don't assume; check the text.", emoji: '❗' },
        { en: 'Evidence', es: 'Evidencia', example: 'There is no evidence for this.', emoji: '🔬' },
      ],
      grammar: {
        title: 'Palabras que cambian todo: all, some, only, always',
        explanation:
          'En True/False/Not Given, una sola palabra cambia la respuesta. Si el texto dice "some students" y la afirmación dice "all students", es FALSE. Si el texto no da información para confirmar ni negar, es NOT GIVEN, aunque en la vida real sea verdad. Responde solo con lo que dice el texto.',
        examples: [
          { en: 'Text: "Some experts agree." Statement: "All experts agree." → FALSE', es: '"Algunos" ≠ "todos": FALSE.' },
          { en: 'Text: "The museum opened in 1990." Statement: "It was popular." → NOT GIVEN', es: 'El texto no dice si fue popular.' },
          { en: 'Text: "Only adults may enter." Statement: "Children cannot enter." → TRUE', es: '"Solo adultos" implica que los niños no pueden.' },
        ],
        tip: 'Tu conocimiento general es una trampa: si el texto no lo dice, es NOT GIVEN.',
      },
      dialogue: {
        title: 'Texto de práctica',
        lines: [
          { speaker: 'Passage', en: 'The Amazon rainforest produces about 20 percent of the oxygen generated by land plants.', es: 'La selva amazónica produce cerca del 20% del oxígeno generado por las plantas terrestres.' },
          { speaker: 'Passage', en: 'Some researchers argue that this figure is overestimated.', es: 'Algunos investigadores sostienen que esta cifra está sobreestimada.' },
          { speaker: 'Passage', en: 'Deforestation increased in several years of the last decade.', es: 'La deforestación aumentó en varios años de la última década.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '"All researchers agree on the 20% figure."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 1, explanation: 'El texto dice que algunos creen que está sobreestimada.' },
        { type: 'choice', prompt: '"The Amazon is the largest rainforest in the world."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 2, explanation: 'Es cierto en la vida real, pero el texto no lo dice.' },
        { type: 'choice', prompt: '"Deforestation rose in some recent years."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 0 },
        { type: 'choice', prompt: 'El mejor título (heading) para el texto es:', options: ['Why the Amazon is beautiful', "Debate about the Amazon's oxygen production", 'History of Brazil'], answer: 1 },
        { type: 'match', pairs: [['Claim', 'Afirmación'], ['Evidence', 'Evidencia'], ['Contradict', 'Contradecir'], ['Assume', 'Suponer']] },
        { type: 'truefalse', statement: 'En NOT GIVEN puedes usar tu conocimiento general para responder.', answer: false },
        { type: 'listen', audio: 'Only students with a valid ID may enter the library.', options: ['Sin carné válido no se puede entrar.', 'Todos pueden entrar a la biblioteca.', 'Los profesores no pueden entrar.'], answer: 0 },
      ],
    },
    {
      objective: 'Practicar con tiempo como en el examen y manejar la presión del reloj.',
      slides: [
        { en: 'Reading: 20 minutes per passage.', es: 'Reading: 20 minutos por texto.' },
        { en: 'Passage 3 is the hardest: protect your time.', es: 'El texto 3 es el más difícil: cuida tu tiempo.' },
        { en: 'Listening: use the reading time to predict answers.', es: 'Listening: usa el tiempo de lectura para predecir respuestas.' },
        { en: 'Never leave an answer blank.', es: 'Nunca dejes respuestas en blanco: no se resta por error.' },
      ],
      vocabulary: [
        { en: 'Time management', es: 'Manejo del tiempo', example: 'Time management is key in Reading.', emoji: '⏱️' },
        { en: 'Predict', es: 'Predecir', example: 'Predict the type of answer: a number, a name…', emoji: '🔮' },
        { en: 'Spelling', es: 'Ortografía', example: 'Spelling mistakes cost points.', emoji: '✍️' },
        { en: 'Word limit', es: 'Límite de palabras', example: 'NO MORE THAN TWO WORDS.', emoji: '🔢' },
        { en: 'Guess', es: 'Adivinar', example: 'If you don’t know, make an educated guess.', emoji: '🎲' },
        { en: 'Under pressure', es: 'Bajo presión', example: 'Practice reading under pressure.', emoji: '😤' },
      ],
      grammar: {
        title: 'Respetar el límite de palabras',
        explanation:
          'Instrucciones como "NO MORE THAN TWO WORDS AND/OR A NUMBER" son estrictas: si escribes tres palabras, la respuesta es incorrecta aunque sea la idea correcta. Copia las palabras exactas del texto o el audio, con la ortografía correcta. Los números pueden ir en cifras.',
        examples: [
          { en: 'Answer: "public transport" (2 words) ✓', es: 'Dos palabras: válida.' },
          { en: 'Answer: "the public transport" (3 words) ✗', es: 'Tres palabras: incorrecta.' },
          { en: 'Answer: "15 June" (1 word + number) ✓', es: 'Una palabra y un número: válida.' },
        ],
        tip: 'En Listening, la ortografía cuenta: practica deletrear nombres de meses, días y lugares comunes.',
      },
      dialogue: {
        title: 'Audio de práctica (Listening parte 1)',
        lines: [
          { speaker: 'Receptionist', en: 'Good morning, City Sports Centre. How can I help you?', es: 'Buenos días, Centro Deportivo de la Ciudad. ¿En qué puedo ayudarle?' },
          { speaker: 'Caller', en: "I'd like to join the swimming class on Thursday evenings.", es: 'Quisiera inscribirme en la clase de natación de los jueves en la noche.' },
          { speaker: 'Receptionist', en: 'Sure. The class starts at seven fifteen and costs forty-five pounds a month.', es: 'Claro. La clase empieza a las 7:15 y cuesta 45 libras al mes.' },
          { speaker: 'Caller', en: 'Do I need to bring anything?', es: '¿Necesito llevar algo?' },
          { speaker: 'Receptionist', en: 'Just a swimming cap and your membership card.', es: 'Solo un gorro de natación y su tarjeta de afiliación.' },
        ],
      },
      exercises: [
        { type: 'fill', sentence: 'The class is on ___ evenings.', answers: ['Thursday'] },
        { type: 'fill', sentence: 'The class starts at ___.', answers: ['7:15', '7.15', 'seven fifteen'] },
        { type: 'fill', sentence: 'Monthly cost: £___', answers: ['45', 'forty-five', 'forty five'] },
        { type: 'choice', prompt: 'NO MORE THAN TWO WORDS. What should the caller bring?', options: ['a swimming cap', 'a new swimming cap', 'cap'], answer: 0 },
        { type: 'choice', prompt: 'Si no sabes una respuesta en Reading, debes:', options: ['Dejarla en blanco', 'Hacer un intento informado', 'Escribir "not sure"'], answer: 1 },
        { type: 'listen', audio: 'The course costs forty-five pounds a month.', options: ['£45 al mes', '£54 al mes', '£4.50 al mes'], answer: 0 },
        { type: 'listen', audio: 'The deadline is the fifteenth of June.', options: ['15 de junio', '50 de junio', '5 de junio'], answer: 0 },
        { type: 'truefalse', statement: 'La persona que llama debe llevar una toalla.', answer: false, explanation: 'Solo un gorro de natación y la tarjeta de afiliación.' },
        { type: 'match', pairs: [['Predict', 'Predecir'], ['Spelling', 'Ortografía'], ['Word limit', 'Límite de palabras'], ['Guess', 'Adivinar']] },
      ],
    },
  ],
  // ─── Módulo 3: Writing & Speaking ───────────────────────────────────────
  [
    {
      objective: 'Escribir Task 1 Academic: describir gráficas con estructura y vocabulario de tendencias.',
      slides: [
        { en: 'Minimum 150 words in about 20 minutes.', es: 'Mínimo 150 palabras en unos 20 minutos.' },
        { en: 'Introduction: paraphrase the question.', es: 'Introducción: parafrasea el enunciado.' },
        { en: 'Overview: the two most important trends.', es: 'Overview: las dos tendencias más importantes (¡obligatorio!).' },
        { en: 'Body: details with numbers.', es: 'Cuerpo: detalles con cifras.' },
        { en: "No opinion in Task 1.", es: 'Sin opiniones en Task 1.' },
      ],
      vocabulary: [
        { en: 'Overview', es: 'Visión general', example: 'Overall, sales rose over the period.', emoji: '🗺️' },
        { en: 'Peak', es: 'Pico / alcanzar el máximo', example: 'Sales peaked in July.', emoji: '⛰️' },
        { en: 'Fluctuate', es: 'Fluctuar', example: 'Prices fluctuated throughout the year.', emoji: '〰️' },
        { en: 'Plateau', es: 'Estancarse', example: 'Numbers plateaued at 500.', emoji: '➖' },
        { en: 'Account for', es: 'Representar (un %)', example: 'Cars accounted for 60% of trips.', emoji: '🥧' },
        { en: 'Respectively', es: 'Respectivamente', example: 'A and B rose to 10% and 15% respectively.', emoji: '🔢' },
      ],
      grammar: {
        title: 'Sustantivo vs. verbo para describir tendencias',
        explanation:
          'Varía tu estructura para mostrar rango gramatical: con verbo + adverbio ("Sales increased dramatically") o con "there was" + adjetivo + sustantivo ("There was a dramatic increase in sales"). Usa pasado si la gráfica es de años pasados y futuro ("is expected to") si es una proyección.',
        examples: [
          { en: 'The number of tourists rose sharply between 2010 and 2015.', es: 'El número de turistas subió bruscamente entre 2010 y 2015.' },
          { en: 'There was a sharp rise in the number of tourists.', es: 'Hubo un aumento brusco en el número de turistas.' },
          { en: 'Overall, car use declined while cycling became more popular.', es: 'En general, el uso del carro bajó mientras la bicicleta se volvió más popular.' },
        ],
        tip: 'El error más común que baja la banda: olvidar el overview. Empiézalo con "Overall,".',
      },
      dialogue: {
        title: 'Respuesta modelo (fragmento)',
        lines: [
          { speaker: 'Intro', en: 'The line graph illustrates how many people used three types of transport in a European city between 2000 and 2020.', es: 'La gráfica de líneas muestra cuántas personas usaron tres tipos de transporte en una ciudad europea entre 2000 y 2020.' },
          { speaker: 'Overview', en: 'Overall, car use fell significantly, whereas cycling saw the most dramatic growth.', es: 'En general, el uso del carro cayó significativamente, mientras que la bicicleta tuvo el crecimiento más drástico.' },
          { speaker: 'Body', en: 'In 2000, cars accounted for around 60% of journeys, but this figure dropped to 35% by 2020.', es: 'En 2000 los carros representaban cerca del 60% de los viajes, pero esta cifra bajó al 35% en 2020.' },
          { speaker: 'Body', en: 'Cycling, by contrast, rose steadily from 10% to 30%, peaking in the final year.', es: 'La bicicleta, en cambio, subió de forma constante del 10% al 30%, alcanzando su pico en el último año.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Qué NO debe incluir Task 1?', options: ['Un overview', 'Tu opinión personal', 'Cifras de la gráfica'], answer: 1 },
        { type: 'choice', prompt: 'Forma con sustantivo correcta:', options: ['There was a sharp rise in sales.', 'There was a sharply rise in sales.', 'There rose sharp sales.'], answer: 0 },
        { type: 'fill', sentence: '___, car use declined over the period.', answers: ['Overall'], hint: 'Palabra para empezar el overview' },
        { type: 'match', pairs: [['Peak', 'Alcanzar el máximo'], ['Fluctuate', 'Fluctuar'], ['Plateau', 'Estancarse'], ['Account for', 'Representar']] },
        { type: 'truefalse', statement: 'En el modelo, el uso de la bicicleta bajó.', answer: false },
        { type: 'order', words: ['Cars', 'accounted', 'for', 'sixty', 'percent', 'of', 'journeys'], translation: 'Los carros representaron el sesenta por ciento de los viajes.' },
        { type: 'listen', audio: 'Prices fluctuated throughout the year before reaching a peak in December.', options: ['Los precios fluctuaron y alcanzaron su pico en diciembre.', 'Los precios bajaron todo el año.', 'Los precios se mantuvieron estables hasta diciembre.'], answer: 0 },
        { type: 'speak', phrase: 'Overall, cycling saw the most dramatic growth over the period.', translation: 'En general, la bicicleta tuvo el crecimiento más drástico en el período.' },
      ],
    },
    {
      objective: 'Planear y escribir un ensayo de Task 2 de banda 7+ en 40 minutos.',
      slides: [
        { en: 'Minimum 250 words in about 40 minutes.', es: 'Mínimo 250 palabras en unos 40 minutos.' },
        { en: 'Plan for 5 minutes before writing.', es: 'Planea 5 minutos antes de escribir.' },
        { en: 'Introduction: paraphrase + your position.', es: 'Introducción: paráfrasis + tu postura.' },
        { en: 'Two body paragraphs: idea, explanation, example.', es: 'Dos párrafos: idea, explicación y ejemplo.' },
        { en: 'Conclusion: restate your position.', es: 'Conclusión: reafirma tu postura.' },
      ],
      vocabulary: [
        { en: 'To what extent', es: 'Hasta qué punto', example: 'To what extent do you agree?', emoji: '📏' },
        { en: 'Furthermore', es: 'Además', example: 'Furthermore, it reduces costs.', emoji: '➕' },
        { en: 'Consequently', es: 'En consecuencia', example: 'Consequently, crime rates fell.', emoji: '➡️' },
        { en: 'Undeniable', es: 'Innegable', example: 'It is undeniable that technology helps.', emoji: '✔️' },
        { en: 'Drawback', es: 'Desventaja', example: 'The main drawback is the cost.', emoji: '⚠️' },
        { en: 'In conclusion', es: 'En conclusión', example: 'In conclusion, I firmly believe…', emoji: '🏁' },
      ],
      grammar: {
        title: 'Estructuras de banda alta',
        explanation:
          'Para subir en Grammatical Range usa estructuras variadas con naturalidad: oraciones relativas ("which…"), condicionales ("If governments invested…, …would…"), voz pasiva ("It is often argued that…") y oraciones con "Not only… but also…". No fuerces todas: la precisión pesa tanto como la variedad.',
        examples: [
          { en: 'It is often argued that university education should be free.', es: 'A menudo se argumenta que la educación universitaria debería ser gratuita.' },
          { en: 'If governments invested more in public transport, traffic would decrease.', es: 'Si los gobiernos invirtieran más en transporte público, el tráfico disminuiría.' },
          { en: 'Not only does remote work save time, but it also reduces pollution.', es: 'El trabajo remoto no solo ahorra tiempo, sino que también reduce la contaminación.' },
        ],
        tip: 'Responde exactamente el tipo de pregunta: "agree/disagree", "discuss both views", "advantages/disadvantages" o "problem/solution".',
      },
      dialogue: {
        title: 'Introducción modelo',
        lines: [
          { speaker: 'Question', en: 'Some people believe that children should learn a foreign language from primary school. To what extent do you agree?', es: 'Algunos creen que los niños deberían aprender un idioma extranjero desde primaria. ¿Hasta qué punto estás de acuerdo?' },
          { speaker: 'Intro', en: 'It is often argued that foreign languages should be taught from the first years of school.', es: 'A menudo se argumenta que los idiomas extranjeros deberían enseñarse desde los primeros años de colegio.' },
          { speaker: 'Intro', en: 'I completely agree with this view, as young learners acquire pronunciation more easily and gain long-term cultural benefits.', es: 'Estoy totalmente de acuerdo, ya que los niños adquieren la pronunciación con más facilidad y obtienen beneficios culturales a largo plazo.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuántas palabras mínimo pide Task 2?', options: ['150', '250', '350'], answer: 1 },
        { type: 'choice', prompt: '¿Qué debe incluir la introducción?', options: ['Solo la pregunta copiada', 'Paráfrasis de la pregunta y tu postura', 'Un ejemplo personal largo'], answer: 1 },
        { type: 'fill', sentence: 'Not only does it save time, but it ___ reduces costs.', answers: ['also'] },
        { type: 'choice', prompt: 'If governments ___ more, traffic would decrease.', options: ['invest', 'invested', 'will invest'], answer: 1 },
        { type: 'match', pairs: [['Furthermore', 'Además'], ['Consequently', 'En consecuencia'], ['Drawback', 'Desventaja'], ['Undeniable', 'Innegable']] },
        { type: 'order', words: ['It', 'is', 'often', 'argued', 'that', 'homework', 'is', 'unnecessary'], translation: 'A menudo se argumenta que las tareas son innecesarias.' },
        { type: 'truefalse', statement: 'En la introducción modelo, el escritor está parcialmente de acuerdo.', answer: false, explanation: '"I completely agree".' },
        { type: 'speak', phrase: 'In conclusion, I firmly believe that the benefits outweigh the drawbacks.', translation: 'En conclusión, creo firmemente que los beneficios superan las desventajas.' },
      ],
    },
    {
      objective: 'Hablar 2 minutos seguidos en Speaking Parte 2 (cue card) con fluidez y estructura.',
      slides: [
        { en: 'You get a topic card and 1 minute to prepare.', es: 'Recibes una tarjeta con un tema y 1 minuto para preparar.' },
        { en: 'Then you speak for 1 to 2 minutes.', es: 'Luego hablas entre 1 y 2 minutos.' },
        { en: 'Cover every point on the card.', es: 'Cubre todos los puntos de la tarjeta.' },
        { en: 'Tell a story: past tenses, details, feelings.', es: 'Cuenta una historia: tiempos pasados, detalles y emociones.' },
      ],
      vocabulary: [
        { en: 'Cue card', es: 'Tarjeta con el tema', example: 'Read the cue card carefully.', emoji: '🃏' },
        { en: 'Vivid', es: 'Vívido', example: 'I have a vivid memory of that day.', emoji: '🌈' },
        { en: 'Memorable', es: 'Memorable', example: 'It was the most memorable trip of my life.', emoji: '⭐' },
        { en: 'Look back on', es: 'Recordar (mirando atrás)', example: 'When I look back on it, I smile.', emoji: '🔙' },
        { en: 'To be honest', es: 'Para ser honesto', example: 'To be honest, I was terrified.', emoji: '🙈' },
        { en: 'Stand out', es: 'Destacar', example: 'What stood out was the kindness of people.', emoji: '✨' },
      ],
      grammar: {
        title: 'Narrar con variedad de tiempos',
        explanation:
          'Para una banda alta, combina: pasado simple (lo que pasó), pasado continuo (el contexto), pasado perfecto (algo anterior: "I had never seen…") y "would" para hábitos del pasado. Cierra con una reflexión en presente: "Looking back, I realize…".',
        examples: [
          { en: 'I had never seen the sea before that trip.', es: 'Nunca había visto el mar antes de ese viaje.' },
          { en: 'While we were walking along the beach, it started to rain.', es: 'Mientras caminábamos por la playa, empezó a llover.' },
          { en: 'Looking back, I realize how lucky I was.', es: 'Mirando atrás, me doy cuenta de lo afortunado que fui.' },
        ],
        tip: 'En el minuto de preparación, escribe solo palabras clave en cuatro líneas (qué, cuándo, con quién, por qué es importante), no oraciones completas.',
      },
      dialogue: {
        title: 'Respuesta modelo (fragmento)',
        lines: [
          { speaker: 'Card', en: 'Describe a trip you remember well. Say where you went, who you went with, what you did, and why it was memorable.', es: 'Describe un viaje que recuerdes bien: a dónde fuiste, con quién, qué hiciste y por qué fue memorable.' },
          { speaker: 'Candidate', en: "I'd like to talk about a trip I took to Santa Marta with my grandparents when I was twelve.", es: 'Me gustaría hablar de un viaje que hice a Santa Marta con mis abuelos cuando tenía doce años.' },
          { speaker: 'Candidate', en: "To be honest, I had never seen the sea before, so I was incredibly excited.", es: 'Para ser honesto, nunca había visto el mar, así que estaba increíblemente emocionado.' },
          { speaker: 'Candidate', en: 'What really stood out was watching the sunset with my grandfather.', es: 'Lo que más destacó fue ver el atardecer con mi abuelo.' },
          { speaker: 'Candidate', en: "Looking back, I realize it was one of the happiest moments of my childhood.", es: 'Mirando atrás, me doy cuenta de que fue uno de los momentos más felices de mi infancia.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuánto tiempo tienes para preparar la Parte 2?', options: ['30 segundos', '1 minuto', '3 minutos'], answer: 1 },
        { type: 'choice', prompt: 'I ___ the sea before that trip. (nunca lo había visto)', options: ['never saw', 'had never seen', 'have never seen'], answer: 1 },
        { type: 'fill', sentence: '___ back, I realize it was a great decision.', answers: ['Looking'] },
        { type: 'match', pairs: [['Vivid', 'Vívido'], ['Stand out', 'Destacar'], ['Cue card', 'Tarjeta con el tema'], ['Look back on', 'Recordar']] },
        { type: 'truefalse', statement: 'El candidato viajó con sus padres.', answer: false, explanation: 'Viajó con sus abuelos.' },
        { type: 'order', words: ["I'd", 'like', 'to', 'talk', 'about', 'a', 'trip', 'I', 'took'], translation: 'Me gustaría hablar de un viaje que hice.' },
        { type: 'listen', audio: 'What really stood out was the kindness of the people.', options: ['Lo que más destacó fue la amabilidad de la gente.', 'La gente se quedó afuera.', 'Lo peor fue la gente.'], answer: 0 },
        { type: 'speak', phrase: "I'd like to talk about a trip that I'll never forget.", translation: 'Me gustaría hablar de un viaje que nunca olvidaré.' },
      ],
    },
  ],
];
