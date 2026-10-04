import type { LessonContentInput } from '../../src/lessonContent/schema.js';

/** Inglés para Negocios (B2). [módulo][lección], en el mismo orden que el seed. */
export const inglesParaNegocios: LessonContentInput[][] = [
  // ─── Módulo 1: Entrevistas de trabajo ───────────────────────────────────
  [
    {
      objective: 'Responder "Tell me about yourself" en 60-90 segundos con una estructura clara.',
      slides: [
        { en: 'Present: what you do now.', es: 'Presente: qué haces hoy.' },
        { en: 'Past: how you got here.', es: 'Pasado: cómo llegaste aquí.' },
        { en: 'Future: why this role.', es: 'Futuro: por qué este cargo.' },
        { en: "I'm a data analyst with five years of experience in fintech.", es: 'Soy analista de datos con cinco años de experiencia en fintech.' },
        { en: "That's why I'm excited about this position.", es: 'Por eso me entusiasma este cargo.' },
      ],
      vocabulary: [
        { en: 'Background', es: 'Trayectoria / formación', example: 'My background is in engineering.', emoji: '🎓' },
        { en: 'Track record', es: 'Historial comprobado', example: 'I have a track record of hitting targets.', emoji: '📈' },
        { en: 'Skill set', es: 'Conjunto de habilidades', example: 'My skill set includes SQL and Python.', emoji: '🛠️' },
        { en: 'Role', es: 'Cargo / rol', example: "I'm applying for the marketing role.", emoji: '💼' },
        { en: 'Lead', es: 'Liderar', example: 'I led a team of six people.', emoji: '🧭' },
        { en: 'Achieve', es: 'Lograr', example: 'We achieved a 30% increase in sales.', emoji: '🏆' },
        { en: 'Eager to', es: 'Con muchas ganas de', example: "I'm eager to take on new challenges.", emoji: '🔥' },
      ],
      grammar: {
        title: 'Presente, pasado y presente perfecto en tu pitch',
        explanation:
          'Usa presente simple para tu rol actual ("I manage…"), presente perfecto para tu experiencia acumulada ("I\'ve worked in…for five years"), pasado simple para logros concretos con fecha o contexto cerrado ("In 2023, I led…") y "I\'m looking for / I\'d love to" para el futuro.',
        examples: [
          { en: 'I currently manage the customer success team.', es: 'Actualmente lidero el equipo de customer success.' },
          { en: "I've worked in logistics for six years.", es: 'He trabajado en logística durante seis años.' },
          { en: 'Last year, I reduced delivery times by 20%.', es: 'El año pasado reduje los tiempos de entrega un 20%.' },
          { en: "I'm looking for a role where I can grow internationally.", es: 'Busco un cargo donde pueda crecer a nivel internacional.' },
        ],
        tip: 'No recites tu hoja de vida. Elige 2 logros con números y conéctalos con lo que la empresa necesita.',
      },
      dialogue: {
        title: 'Inicio de la entrevista',
        lines: [
          { speaker: 'Recruiter', en: 'So, tell me a little about yourself.', es: 'Bueno, cuéntame un poco sobre ti.' },
          { speaker: 'Camilo', en: "Sure. I'm a software developer with four years of experience building web apps.", es: 'Claro. Soy desarrollador con cuatro años de experiencia creando aplicaciones web.' },
          { speaker: 'Camilo', en: 'At my current company, I led the migration to a new payment system.', es: 'En mi empresa actual lideré la migración a un nuevo sistema de pagos.' },
          { speaker: 'Camilo', en: 'It cut transaction errors by forty percent.', es: 'Redujo los errores de transacción en un cuarenta por ciento.' },
          { speaker: 'Camilo', en: "Now I'm eager to work on products with a global audience, which is why this role caught my attention.", es: 'Ahora tengo muchas ganas de trabajar en productos con audiencia global, por eso este cargo me llamó la atención.' },
          { speaker: 'Recruiter', en: 'Great, that sounds very relevant.', es: 'Excelente, suena muy relevante.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuál es el mejor orden para "Tell me about yourself"?', options: ['Infancia → estudios → hobbies', 'Presente → pasado → futuro', 'Salario → horario → beneficios'], answer: 1 },
        { type: 'choice', prompt: "I ___ in marketing for seven years. (y sigo)", options: ['worked', "'ve worked", 'am working'], answer: 1 },
        { type: 'fill', sentence: 'Last year, I ___ a team of five designers.', answers: ['led', 'managed'] },
        { type: 'match', pairs: [['Background', 'Trayectoria'], ['Track record', 'Historial comprobado'], ['Achieve', 'Lograr'], ['Role', 'Cargo']] },
        { type: 'truefalse', statement: 'Camilo menciona un logro con un número concreto.', answer: true, explanation: 'Redujo los errores en un 40%.' },
        { type: 'order', words: ["I'm", 'eager', 'to', 'take', 'on', 'new', 'challenges'], translation: 'Tengo muchas ganas de asumir nuevos retos.' },
        { type: 'listen', audio: 'I have a track record of exceeding sales targets.', options: ['Tengo un historial superando metas de ventas.', 'Tengo que rastrear las ventas.', 'Quiero vender más que antes.'], answer: 0 },
        { type: 'speak', phrase: "I'm a project manager with five years of experience in tech.", translation: 'Soy gerente de proyectos con cinco años de experiencia en tecnología.' },
      ],
    },
    {
      objective: 'Responder preguntas de comportamiento con el método STAR.',
      slides: [
        { en: 'S — Situation', es: 'Situación: el contexto, breve.' },
        { en: 'T — Task', es: 'Tarea: tu responsabilidad.' },
        { en: 'A — Action', es: 'Acción: lo que TÚ hiciste (usa "I", no "we").' },
        { en: 'R — Result', es: 'Resultado: con números si es posible.' },
        { en: 'Tell me about a time you solved a problem.', es: 'Cuéntame de una vez en que resolviste un problema.' },
      ],
      vocabulary: [
        { en: 'Deadline', es: 'Fecha límite', example: 'We had a tight deadline.', emoji: '⏰' },
        { en: 'Stakeholder', es: 'Parte interesada', example: 'I updated stakeholders weekly.', emoji: '👥' },
        { en: 'Handle', es: 'Manejar', example: 'I handled the client complaint.', emoji: '🤲' },
        { en: 'Outcome', es: 'Resultado', example: 'The outcome was very positive.', emoji: '🎯' },
        { en: 'Prioritize', es: 'Priorizar', example: 'I prioritized the urgent tasks.', emoji: '📋' },
        { en: 'Overcome', es: 'Superar', example: 'We overcame the budget issue.', emoji: '🧗' },
      ],
      grammar: {
        title: 'Verbos de acción en pasado',
        explanation:
          'Las respuestas STAR se cuentan en pasado simple, con verbos de acción fuertes y en primera persona. Cambia "we did" por lo que tú hiciste: "I analyzed", "I proposed", "I negotiated". Cierra con el resultado medible.',
        examples: [
          { en: 'I noticed that clients were leaving after the first month.', es: 'Noté que los clientes se iban después del primer mes.' },
          { en: 'I proposed a new onboarding process.', es: 'Propuse un nuevo proceso de bienvenida.' },
          { en: 'As a result, retention increased by 25%.', es: 'Como resultado, la retención aumentó un 25%.' },
        ],
        tip: 'Prepara 4 historias STAR antes de cualquier entrevista: un conflicto, un error, un logro y un liderazgo. Sirven para casi todas las preguntas.',
      },
      dialogue: {
        title: 'Pregunta de comportamiento',
        lines: [
          { speaker: 'Interviewer', en: 'Tell me about a time you had to meet a tight deadline.', es: 'Cuéntame de una vez en que tuviste que cumplir una fecha límite ajustada.' },
          { speaker: 'Natalia', en: 'Last year, a key client moved their launch two weeks earlier.', es: 'El año pasado, un cliente clave adelantó su lanzamiento dos semanas.' },
          { speaker: 'Natalia', en: 'My task was to deliver the campaign assets on time.', es: 'Mi tarea era entregar las piezas de la campaña a tiempo.' },
          { speaker: 'Natalia', en: 'I prioritized the essential pieces and reorganized the team’s schedule.', es: 'Prioricé las piezas esenciales y reorganicé el cronograma del equipo.' },
          { speaker: 'Natalia', en: 'As a result, we delivered on time and the client renewed their contract.', es: 'Como resultado, entregamos a tiempo y el cliente renovó el contrato.' },
        ],
      },
      exercises: [
        { type: 'match', prompt: 'Une cada letra de STAR', pairs: [['S', 'Situation'], ['T', 'Task'], ['A', 'Action'], ['R', 'Result']] },
        { type: 'choice', prompt: 'En la parte de "Action" es mejor decir:', options: ['We worked hard.', 'I reorganized the schedule and assigned new priorities.', 'The team did everything.'], answer: 1 },
        { type: 'fill', sentence: 'As a ___, sales increased by 15%.', answers: ['result'] },
        { type: 'choice', prompt: '¿Qué tiempo verbal usas para contar una historia STAR?', options: ['Presente continuo', 'Pasado simple', 'Futuro'], answer: 1 },
        { type: 'truefalse', statement: 'En el resultado de Natalia, el cliente renovó el contrato.', answer: true },
        { type: 'order', words: ['I', 'prioritized', 'the', 'most', 'urgent', 'tasks'], translation: 'Prioricé las tareas más urgentes.' },
        { type: 'listen', audio: 'We overcame the problem by working closely with the client.', options: ['Superamos el problema trabajando de cerca con el cliente.', 'El cliente creó el problema.', 'Trabajamos lejos del cliente.'], answer: 0 },
        { type: 'speak', phrase: 'As a result, customer satisfaction increased by twenty percent.', translation: 'Como resultado, la satisfacción del cliente aumentó un veinte por ciento.' },
      ],
    },
    {
      objective: 'Hablar de expectativas salariales y negociar con seguridad y diplomacia.',
      slides: [
        { en: 'What are your salary expectations?', es: '¿Cuáles son tus expectativas salariales?' },
        { en: "Based on my research, I'm looking for a range of…", es: 'Según mi investigación, busco un rango de…' },
        { en: "I'm very excited about the role. Is there any flexibility?", es: 'Me entusiasma mucho el cargo. ¿Hay algo de flexibilidad?' },
        { en: 'Could we discuss the benefits package?', es: '¿Podemos hablar del paquete de beneficios?' },
      ],
      vocabulary: [
        { en: 'Salary range', es: 'Rango salarial', example: 'The salary range is $3,000 to $3,500.', emoji: '💵' },
        { en: 'Benefits package', es: 'Paquete de beneficios', example: 'The benefits package includes health insurance.', emoji: '🎁' },
        { en: 'Counteroffer', es: 'Contraoferta', example: 'I made a counteroffer.', emoji: '🔁' },
        { en: 'Flexible', es: 'Flexible', example: 'Is the start date flexible?', emoji: '🤸' },
        { en: 'Raise', es: 'Aumento', example: 'I asked for a raise.', emoji: '⬆️' },
        { en: 'Market rate', es: 'Tarifa de mercado', example: 'That is below the market rate.', emoji: '📊' },
      ],
      grammar: {
        title: 'Condicionales y modales para sonar diplomático',
        explanation:
          'En una negociación, "would" y "could" suavizan tus peticiones sin perder firmeza. "I want more money" suena agresivo; "Would there be any room to adjust the base salary?" es firme y profesional. Usa el segundo condicional para proponer: "If you could…, I would…".',
        examples: [
          { en: 'Would there be any flexibility on the base salary?', es: '¿Habría algo de flexibilidad en el salario base?' },
          { en: 'If you could increase the offer to $4,000, I would be ready to sign.', es: 'Si pudieran subir la oferta a USD 4.000, estaría listo para firmar.' },
          { en: 'Could we revisit this after six months?', es: '¿Podríamos revisarlo después de seis meses?' },
        ],
        tip: 'Antes de la entrevista, investiga el rango en Glassdoor o LinkedIn Salary y da un rango cuyo mínimo ya te parezca bien.',
      },
      dialogue: {
        title: 'La oferta',
        lines: [
          { speaker: 'HR', en: "We'd like to offer you the position with a salary of 3,200 dollars per month.", es: 'Queremos ofrecerte el cargo con un salario de 3.200 dólares al mes.' },
          { speaker: 'Diana', en: "Thank you! I'm really excited about joining the team.", es: '¡Gracias! Me entusiasma mucho unirme al equipo.' },
          { speaker: 'Diana', en: "Based on my experience and the market rate, I was expecting something closer to 3,600.", es: 'Según mi experiencia y la tarifa de mercado, esperaba algo más cercano a 3.600.' },
          { speaker: 'Diana', en: 'Would there be any flexibility on that?', es: '¿Habría algo de flexibilidad en eso?' },
          { speaker: 'HR', en: 'I can check. We could probably offer 3,450 plus an extra week of vacation.', es: 'Puedo revisar. Probablemente podríamos ofrecer 3.450 más una semana extra de vacaciones.' },
          { speaker: 'Diana', en: 'That sounds fair. Thank you for considering it.', es: 'Me parece justo. Gracias por considerarlo.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuál suena más profesional?', options: ['I want more money.', 'Would there be any flexibility on the salary?', 'Pay me more or I leave.'], answer: 1 },
        { type: 'fill', sentence: 'If you could raise the offer, I ___ accept today.', answers: ['would', "'d"] },
        { type: 'match', pairs: [['Raise', 'Aumento'], ['Counteroffer', 'Contraoferta'], ['Benefits package', 'Paquete de beneficios'], ['Market rate', 'Tarifa de mercado']] },
        { type: 'truefalse', statement: 'Diana aceptó la primera oferta sin negociar.', answer: false },
        { type: 'truefalse', statement: 'La empresa ofreció una semana extra de vacaciones.', answer: true },
        { type: 'order', words: ['Could', 'we', 'discuss', 'the', 'benefits', 'package?'], translation: '¿Podemos hablar del paquete de beneficios?' },
        { type: 'listen', audio: 'Based on my research, I am looking for a range of four to five thousand dollars.', options: ['Busco entre 4.000 y 5.000 dólares.', 'Busco entre 40.000 y 50.000 dólares.', 'Busco 4.500 dólares exactos.'], answer: 0 },
        { type: 'speak', phrase: 'Would there be any flexibility on the base salary?', translation: '¿Habría algo de flexibilidad en el salario base?' },
      ],
    },
  ],
  // ─── Módulo 2: Comunicación escrita ─────────────────────────────────────
  [
    {
      objective: 'Escribir emails profesionales claros, breves y que obtienen respuesta.',
      slides: [
        { en: 'Subject: clear and specific.', es: 'Asunto: claro y específico.' },
        { en: 'Hi Sarah, I hope you’re well.', es: 'Hola Sarah, espero que estés bien.' },
        { en: 'I’m writing to follow up on…', es: 'Te escribo para hacer seguimiento a…' },
        { en: 'Could you send me the file by Friday?', es: '¿Me puedes enviar el archivo antes del viernes?', note: 'Una petición clara con fecha.' },
        { en: 'Best regards, Andrés', es: 'Saludos, Andrés' },
      ],
      vocabulary: [
        { en: 'Follow up', es: 'Hacer seguimiento', example: "I'm following up on my last email.", emoji: '🔁' },
        { en: 'Attached', es: 'Adjunto', example: 'Please find the report attached.', emoji: '📎' },
        { en: 'At your earliest convenience', es: 'Lo antes que puedas', example: 'Please reply at your earliest convenience.', emoji: '⏩' },
        { en: 'Let me know', es: 'Avísame', example: 'Let me know if you have questions.', emoji: '🗣️' },
        { en: 'Reach out', es: 'Contactar', example: 'Feel free to reach out anytime.', emoji: '📞' },
        { en: 'Regarding', es: 'Con respecto a', example: 'Regarding the invoice, ...', emoji: '📌' },
      ],
      grammar: {
        title: 'Peticiones claras con "Could you…?"',
        explanation:
          'Un buen email tiene un solo objetivo, una petición clara y una fecha. "Could you…" y "Would you mind + -ing" son las formas más naturales de pedir algo. Evita traducir fórmulas largas del español ("Por medio de la presente…"): en inglés se valora ir al grano.',
        examples: [
          { en: 'Could you confirm the meeting time?', es: '¿Puedes confirmar la hora de la reunión?' },
          { en: 'Would you mind reviewing the draft by Thursday?', es: '¿Te molestaría revisar el borrador antes del jueves?' },
          { en: "Please find attached the updated proposal.", es: 'Adjunto la propuesta actualizada.' },
        ],
        tip: 'Pon la petición en las dos primeras líneas. Mucha gente lee emails desde el celular y no hace scroll.',
      },
      dialogue: {
        title: 'Email de seguimiento',
        lines: [
          { speaker: 'Subject', en: 'Follow-up: Q3 budget approval', es: 'Asunto: Seguimiento — aprobación del presupuesto Q3' },
          { speaker: 'Email', en: 'Hi Mark, I hope you had a great weekend.', es: 'Hola Mark, espero que hayas tenido un gran fin de semana.' },
          { speaker: 'Email', en: "I'm following up on the Q3 budget I sent last Tuesday.", es: 'Te escribo para hacer seguimiento al presupuesto del Q3 que te envié el martes pasado.' },
          { speaker: 'Email', en: 'Could you approve it by Thursday so we can start the campaign on time?', es: '¿Podrías aprobarlo antes del jueves para que podamos iniciar la campaña a tiempo?' },
          { speaker: 'Email', en: 'Let me know if you need any changes. Best regards, Valeria', es: 'Avísame si necesitas cambios. Saludos, Valeria' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuál es el mejor asunto?', options: ['Hello', 'Question', 'Approval needed: March invoice by Friday'], answer: 2 },
        { type: 'fill', sentence: 'Please find the report ___.', answers: ['attached'] },
        { type: 'choice', prompt: 'Forma natural de pedir algo:', options: ['I need that you send me the file.', 'Could you send me the file?', 'Send me the file now.'], answer: 1 },
        { type: 'match', pairs: [['Follow up', 'Hacer seguimiento'], ['Reach out', 'Contactar'], ['Regarding', 'Con respecto a'], ['Let me know', 'Avísame']] },
        { type: 'truefalse', statement: 'El email de Valeria incluye una fecha límite.', answer: true, explanation: 'Pide aprobarlo antes del jueves.' },
        { type: 'order', words: ['Would', 'you', 'mind', 'reviewing', 'the', 'draft?'], translation: '¿Te molestaría revisar el borrador?' },
        { type: 'listen', audio: 'Feel free to reach out if you have any questions.', options: ['No dudes en contactarme si tienes preguntas.', 'Siéntete libre de irte si quieres.', 'Pregúntale a otra persona.'], answer: 0 },
        { type: 'speak', phrase: "I'm writing to follow up on our last meeting.", translation: 'Te escribo para hacer seguimiento a nuestra última reunión.' },
      ],
    },
    {
      objective: 'Escribir mensajes cortos en Slack o Teams: claros, amables y sin sonar bruscos.',
      slides: [
        { en: 'Quick question: are we still on for 3 p.m.?', es: 'Pregunta rápida: ¿seguimos para las 3 p. m.?' },
        { en: 'Heads up: the client moved the call.', es: 'Aviso: el cliente movió la llamada.' },
        { en: 'No worries! I’ll take care of it.', es: '¡Tranqui! Yo me encargo.' },
        { en: 'FYI, the deck is in the shared folder.', es: 'Para tu información, la presentación está en la carpeta compartida.' },
        { en: 'Thanks so much! 🙌', es: '¡Mil gracias! 🙌' },
      ],
      vocabulary: [
        { en: 'Heads up', es: 'Aviso / ojo', example: "Heads up: the server will be down at 6.", emoji: '⚠️' },
        { en: 'FYI', es: 'Para tu información', example: 'FYI, I updated the doc.', emoji: 'ℹ️' },
        { en: 'ASAP', es: 'Lo antes posible', example: 'Please send it ASAP.', emoji: '🚨' },
        { en: 'EOD', es: 'Al final del día', example: "I'll have it ready by EOD.", emoji: '🌇' },
        { en: 'Ping', es: 'Escribirle a alguien', example: "I'll ping you when it's ready.", emoji: '📲' },
        { en: 'Loop in', es: 'Incluir a alguien', example: "Let me loop in Carlos.", emoji: '➰' },
        { en: 'OOO', es: 'Fuera de la oficina', example: "I'm OOO tomorrow.", emoji: '🏖️' },
      ],
      grammar: {
        title: 'Suavizar mensajes cortos',
        explanation:
          'En chat, los mensajes muy secos pueden sonar molestos. Agrega "just", "quick", "when you get a chance" o un emoji para suavizar. Ojo con "ASAP": úsalo solo si de verdad es urgente; puede sonar exigente.',
        examples: [
          { en: 'Just checking in on the report. 🙂', es: 'Solo reviso cómo va el reporte. 🙂' },
          { en: 'When you get a chance, could you review this?', es: 'Cuando puedas, ¿lo revisas?' },
          { en: 'Quick heads up: I’ll be 5 minutes late.', es: 'Aviso rápido: llego 5 minutos tarde.' },
        ],
        tip: 'No escribas solo "Hi" y esperes respuesta. Escribe el saludo y la pregunta completa en el mismo mensaje.',
      },
      dialogue: {
        title: 'Chat del equipo',
        lines: [
          { speaker: 'Laura', en: 'Hey team! Quick heads up: the client moved our call to 4 p.m.', es: '¡Hola equipo! Aviso rápido: el cliente movió nuestra llamada a las 4 p. m.' },
          { speaker: 'Daniel', en: "Thanks for the heads up! I'll update the invite.", es: '¡Gracias por avisar! Actualizo la invitación.' },
          { speaker: 'Laura', en: 'FYI, the latest deck is in the shared folder.', es: 'Para su información, la última presentación está en la carpeta compartida.' },
          { speaker: 'Sam', en: "I'm OOO this afternoon. Could you loop in Ana instead?", es: 'Estoy fuera de la oficina esta tarde. ¿Pueden incluir a Ana en mi lugar?' },
          { speaker: 'Laura', en: 'No worries, I’ll ping her now. 👍', es: 'Tranqui, le escribo ya. 👍' },
        ],
      },
      exercises: [
        { type: 'match', pairs: [['FYI', 'Para tu información'], ['EOD', 'Al final del día'], ['OOO', 'Fuera de la oficina'], ['ASAP', 'Lo antes posible']] },
        { type: 'choice', prompt: '¿Cuál mensaje suena más amable?', options: ['Send the report.', 'When you get a chance, could you send the report? 🙂', 'Report. Now.'], answer: 1 },
        { type: 'fill', sentence: "I'll ___ you when the file is ready.", answers: ['ping', 'message'] },
        { type: 'truefalse', statement: 'Sam va a estar en la llamada de las 4 p. m.', answer: false, explanation: 'Sam está OOO (fuera de la oficina).' },
        { type: 'order', words: ['Let', 'me', 'loop', 'in', 'our', 'manager'], translation: 'Déjame incluir a nuestro gerente.' },
        { type: 'listen', audio: "Thanks for the heads up! I'll update the invite.", options: ['¡Gracias por avisar! Actualizo la invitación.', '¡Gracias por la cabeza! Invito a todos.', 'Gracias, pero no puedo ir.'], answer: 0 },
        { type: 'speak', phrase: "Quick heads up: I'll be five minutes late.", translation: 'Aviso rápido: llego cinco minutos tarde.' },
      ],
    },
    {
      objective: 'Redactar reportes breves con datos: tendencias, comparaciones y recomendaciones.',
      slides: [
        { en: 'Sales increased by 12% in Q2.', es: 'Las ventas aumentaron un 12% en el Q2.' },
        { en: 'Costs remained stable.', es: 'Los costos se mantuvieron estables.' },
        { en: 'Compared to last year, churn dropped significantly.', es: 'Comparado con el año pasado, la deserción bajó significativamente.' },
        { en: 'We recommend investing in customer support.', es: 'Recomendamos invertir en soporte al cliente.' },
      ],
      vocabulary: [
        { en: 'Increase / rise', es: 'Aumentar', example: 'Revenue rose by 8%.', emoji: '📈' },
        { en: 'Decrease / drop', es: 'Disminuir', example: 'Costs dropped by 5%.', emoji: '📉' },
        { en: 'Remain stable', es: 'Mantenerse estable', example: 'Prices remained stable.', emoji: '➖' },
        { en: 'Significantly', es: 'Significativamente', example: 'Traffic grew significantly.', emoji: '❗' },
        { en: 'Slightly', es: 'Ligeramente', example: 'Margins fell slightly.', emoji: '🤏' },
        { en: 'Recommend', es: 'Recomendar', example: 'We recommend hiring two agents.', emoji: '👉' },
      ],
      grammar: {
        title: 'Describir cambios: by, to, from',
        explanation:
          '"By" indica cuánto cambió ("increased BY 10%"). "To" indica el valor final ("increased TO 2 million"). "From… to…" muestra el antes y el después. Combina el verbo con un adverbio para matizar: "slightly", "steadily", "sharply".',
        examples: [
          { en: 'Revenue increased by 15%.', es: 'Los ingresos aumentaron un 15%.' },
          { en: 'Users grew from 10,000 to 25,000.', es: 'Los usuarios crecieron de 10.000 a 25.000.' },
          { en: 'Costs fell sharply in March.', es: 'Los costos cayeron bruscamente en marzo.' },
        ],
        tip: 'Estructura de reporte: resumen (1 línea) → hallazgos clave (3 viñetas) → recomendación → próximo paso.',
      },
      dialogue: {
        title: 'Resumen mensual',
        lines: [
          { speaker: 'Report', en: 'Summary: June was our best month this year.', es: 'Resumen: junio fue nuestro mejor mes del año.' },
          { speaker: 'Report', en: 'Sales increased by 18% compared to May.', es: 'Las ventas aumentaron un 18% frente a mayo.' },
          { speaker: 'Report', en: 'Marketing costs remained stable, while support tickets rose slightly.', es: 'Los costos de marketing se mantuvieron estables, mientras que los tickets de soporte subieron ligeramente.' },
          { speaker: 'Report', en: 'We recommend hiring one more support agent before the holiday season.', es: 'Recomendamos contratar un agente de soporte más antes de la temporada de fiestas.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Revenue went from $1M to $1.2M. Revenue increased ___ 20%.', options: ['to', 'by', 'of'], answer: 1 },
        { type: 'choice', prompt: 'Users grew from 5,000 ___ 8,000.', options: ['to', 'by', 'in'], answer: 0 },
        { type: 'fill', sentence: 'Costs remained ___ during the quarter.', answers: ['stable', 'flat'] },
        { type: 'match', pairs: [['Rise', 'Aumentar'], ['Drop', 'Disminuir'], ['Slightly', 'Ligeramente'], ['Significantly', 'Significativamente']] },
        { type: 'truefalse', statement: 'Según el reporte, los costos de marketing subieron mucho.', answer: false, explanation: 'Se mantuvieron estables.' },
        { type: 'order', words: ['We', 'recommend', 'hiring', 'one', 'more', 'agent'], translation: 'Recomendamos contratar un agente más.' },
        { type: 'listen', audio: 'Sales fell sharply in the first week of January.', options: ['Las ventas cayeron bruscamente la primera semana de enero.', 'Las ventas subieron un poco en enero.', 'Las ventas se mantuvieron en enero.'], answer: 0 },
        { type: 'speak', phrase: 'Revenue increased by fifteen percent compared to last quarter.', translation: 'Los ingresos aumentaron un quince por ciento frente al trimestre anterior.' },
      ],
    },
  ],
  // ─── Módulo 3: Reuniones ────────────────────────────────────────────────
  [
    {
      objective: 'Abrir, moderar y cerrar una reunión en inglés manteniendo el control del tiempo.',
      slides: [
        { en: "Let's get started. Thanks for joining.", es: 'Empecemos. Gracias por conectarse.' },
        { en: 'The goal of today’s meeting is to…', es: 'El objetivo de la reunión de hoy es…' },
        { en: "Let's move on to the next point.", es: 'Pasemos al siguiente punto.' },
        { en: "Let's take this offline.", es: 'Hablemos de esto por fuera de la reunión.' },
        { en: 'To wrap up, the next steps are…', es: 'Para cerrar, los próximos pasos son…' },
      ],
      vocabulary: [
        { en: 'Agenda', es: 'Orden del día', example: 'There are three points on the agenda.', emoji: '🗒️' },
        { en: 'Move on', es: 'Pasar a otro tema', example: "Let's move on to the budget.", emoji: '⏭️' },
        { en: 'Take offline', es: 'Hablar aparte', example: "Let's take this offline.", emoji: '📴' },
        { en: 'Action item', es: 'Tarea asignada', example: 'Who owns this action item?', emoji: '✅' },
        { en: 'Wrap up', es: 'Cerrar / concluir', example: "Let's wrap up the meeting.", emoji: '🎁' },
        { en: 'On mute', es: 'En silencio (micrófono)', example: "I think you're on mute.", emoji: '🔇' },
      ],
      grammar: {
        title: '"Let\'s" para guiar al grupo',
        explanation:
          '"Let\'s + verbo" es la herramienta del moderador: propone sin ordenar. "Let\'s get started", "Let\'s hear from Ana", "Let\'s park this for now". Para dar la palabra: "Ana, what do you think?" o "Over to you, Ana".',
        examples: [
          { en: "Let's go around the table.", es: 'Hagamos una ronda.' },
          { en: "Let's park this topic for now.", es: 'Dejemos este tema para después.' },
          { en: 'Over to you, Juan.', es: 'Te cedo la palabra, Juan.' },
        ],
        tip: 'Termina siempre con: decisiones tomadas, responsables de cada tarea y fecha de seguimiento.',
      },
      dialogue: {
        title: 'Reunión semanal',
        lines: [
          { speaker: 'Andrea', en: "Okay, let's get started. Thanks for joining, everyone.", es: 'Bien, empecemos. Gracias a todos por conectarse.' },
          { speaker: 'Andrea', en: "We've got three points on the agenda. First, the launch date.", es: 'Tenemos tres puntos en la agenda. Primero, la fecha de lanzamiento.' },
          { speaker: 'Tom', en: "Sorry, I think Carlos is on mute.", es: 'Perdón, creo que Carlos tiene el micrófono apagado.' },
          { speaker: 'Andrea', en: "Thanks, Tom. Carlos, over to you.", es: 'Gracias, Tom. Carlos, te cedo la palabra.' },
          { speaker: 'Carlos', en: "Sorry about that! We're on track for May 10.", es: '¡Perdón! Vamos bien para el 10 de mayo.' },
          { speaker: 'Andrea', en: "Great. To wrap up: Carlos sends the plan on Friday. Let's meet again next Monday.", es: 'Excelente. Para cerrar: Carlos envía el plan el viernes. Nos vemos el próximo lunes.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Para empezar la reunión dices:', options: ["Let's wrap up.", "Let's get started.", "Let's take this offline."], answer: 1 },
        { type: 'choice', prompt: 'Un tema se está alargando y no es para todos. Dices:', options: ["Let's take this offline.", "Let's move on.", 'You are on mute.'], answer: 0 },
        { type: 'fill', sentence: 'I think you are on ___. We can’t hear you.', answers: ['mute'] },
        { type: 'match', pairs: [['Agenda', 'Orden del día'], ['Action item', 'Tarea asignada'], ['Wrap up', 'Concluir'], ['Move on', 'Pasar a otro tema']] },
        { type: 'truefalse', statement: 'Carlos debe enviar el plan el viernes.', answer: true },
        { type: 'order', words: ["Let's", 'move', 'on', 'to', 'the', 'next', 'point'], translation: 'Pasemos al siguiente punto.' },
        { type: 'listen', audio: 'To wrap up, here are the next steps.', options: ['Para cerrar, estos son los próximos pasos.', 'Para empezar, estos son los temas.', 'Para envolver, los pasos son difíciles.'], answer: 0 },
        { type: 'speak', phrase: "Let's get started. The goal of today's meeting is to agree on the budget.", translation: 'Empecemos. El objetivo de hoy es acordar el presupuesto.' },
      ],
    },
    {
      objective: 'Dar tu opinión, interrumpir y sugerir cambios con tacto profesional.',
      slides: [
        { en: 'Sorry to interrupt, but…', es: 'Perdón que interrumpa, pero…' },
        { en: 'I see it a bit differently.', es: 'Yo lo veo un poco distinto.' },
        { en: 'Have we considered…?', es: '¿Hemos considerado…?' },
        { en: 'That’s a great idea. Building on that…', es: 'Excelente idea. Sumando a eso…' },
      ],
      vocabulary: [
        { en: 'Interrupt', es: 'Interrumpir', example: 'Sorry to interrupt, but we’re out of time.', emoji: '✋' },
        { en: 'Concern', es: 'Preocupación', example: 'My main concern is the budget.', emoji: '😟' },
        { en: 'Suggest', es: 'Sugerir', example: 'I suggest we wait a week.', emoji: '💡' },
        { en: 'Build on', es: 'Ampliar / sumar a', example: "Building on Ana's point, ...", emoji: '🧱' },
        { en: 'Trade-off', es: 'Compensación / sacrificio', example: 'The trade-off is speed vs. quality.', emoji: '⚖️' },
        { en: 'Push back', es: 'Objetar / resistirse', example: 'The client pushed back on the price.', emoji: '🛑' },
      ],
      grammar: {
        title: 'Lenguaje indirecto (hedging)',
        explanation:
          'En reuniones internacionales se valora el lenguaje indirecto. En lugar de "That\'s wrong" usa "I\'m not sure that will work because…". Palabras como "might", "perhaps", "a bit" y preguntas como "Have we considered…?" hacen que tu crítica sea fácil de aceptar.',
        examples: [
          { en: 'That might be a bit risky.', es: 'Eso podría ser un poco arriesgado.' },
          { en: 'Perhaps we could test it with a small group first?', es: '¿Quizás podríamos probarlo primero con un grupo pequeño?' },
          { en: 'I have a slight concern about the timeline.', es: 'Tengo una pequeña preocupación sobre el cronograma.' },
        ],
        tip: 'Fórmula útil: reconoce + preocupación + propuesta. "Great idea. My only concern is X. What if we Y?"',
      },
      dialogue: {
        title: 'Desacuerdo con tacto',
        lines: [
          { speaker: 'Manager', en: "So the plan is to launch in all countries next month.", es: 'Entonces el plan es lanzar en todos los países el próximo mes.' },
          { speaker: 'Felipe', en: 'Sorry to interrupt. I think that’s a great goal, but I have a slight concern.', es: 'Perdón que interrumpa. Me parece una gran meta, pero tengo una pequeña preocupación.' },
          { speaker: 'Felipe', en: 'Our support team might not be ready for that volume.', es: 'Puede que nuestro equipo de soporte no esté listo para ese volumen.' },
          { speaker: 'Felipe', en: 'Have we considered launching in two countries first?', es: '¿Hemos considerado lanzar primero en dos países?' },
          { speaker: 'Manager', en: "Good point. What's the trade-off in terms of revenue?", es: 'Buen punto. ¿Cuál es el sacrificio en términos de ingresos?' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: '¿Cuál es la forma más diplomática?', options: ["That's a bad idea.", 'That might be a bit risky. Have we considered testing it first?', 'No.'], answer: 1 },
        { type: 'fill', sentence: "___ on Laura's idea, we could also add a discount.", answers: ['Building'] },
        { type: 'match', pairs: [['Concern', 'Preocupación'], ['Suggest', 'Sugerir'], ['Trade-off', 'Compensación'], ['Push back', 'Objetar']] },
        { type: 'truefalse', statement: 'Felipe propone lanzar primero en dos países.', answer: true },
        { type: 'order', words: ['Perhaps', 'we', 'could', 'test', 'it', 'first?'], translation: '¿Quizás podríamos probarlo primero?' },
        { type: 'listen', audio: 'I have a slight concern about the timeline.', options: ['Tengo una pequeña preocupación sobre el cronograma.', 'El cronograma está bien.', 'Tengo una idea para el cronograma.'], answer: 0 },
        { type: 'speak', phrase: "Sorry to interrupt, but I see it a bit differently.", translation: 'Perdón que interrumpa, pero lo veo un poco distinto.' },
      ],
    },
    {
      objective: 'Estructurar y dar una presentación efectiva con transiciones claras.',
      slides: [
        { en: "Today I'm going to talk about…", es: 'Hoy voy a hablar sobre…' },
        { en: "I've divided my presentation into three parts.", es: 'Dividí mi presentación en tres partes.' },
        { en: "Let's move on to the results.", es: 'Pasemos a los resultados.' },
        { en: 'As you can see on this slide…', es: 'Como pueden ver en esta diapositiva…' },
        { en: "Thank you. I'm happy to take any questions.", es: 'Gracias. Con gusto respondo preguntas.' },
      ],
      vocabulary: [
        { en: 'Overview', es: 'Panorama general', example: "Let me give you a quick overview.", emoji: '🗺️' },
        { en: 'Slide', es: 'Diapositiva', example: 'On the next slide...', emoji: '🖼️' },
        { en: 'Highlight', es: 'Destacar', example: 'I want to highlight two points.', emoji: '🔦' },
        { en: 'Key takeaway', es: 'Idea clave', example: 'The key takeaway is…', emoji: '🔑' },
        { en: 'Q&A', es: 'Preguntas y respuestas', example: "We'll have Q&A at the end.", emoji: '❓' },
        { en: 'Sum up', es: 'Resumir', example: 'To sum up, ...', emoji: '🧾' },
      ],
      grammar: {
        title: 'Lenguaje de señalización (signposting)',
        explanation:
          'Las transiciones le dicen a la audiencia dónde está: "First…", "Now let\'s look at…", "This brings me to…", "To sum up…". Son la diferencia entre una presentación confusa y una clara, sobre todo cuando no hablas en tu idioma nativo.',
        examples: [
          { en: 'First, I’ll give you an overview of the market.', es: 'Primero, les daré un panorama del mercado.' },
          { en: 'This brings me to my next point.', es: 'Esto me lleva a mi siguiente punto.' },
          { en: 'To sum up, we have three key takeaways.', es: 'En resumen, tenemos tres ideas clave.' },
        ],
        tip: 'Si te preguntan algo que no sabes: "That\'s a great question. Let me check and get back to you."',
      },
      dialogue: {
        title: 'Inicio y cierre de una presentación',
        lines: [
          { speaker: 'Presenter', en: "Good morning, everyone. Today I'm going to talk about our expansion to Mexico.", es: 'Buenos días a todos. Hoy voy a hablar de nuestra expansión a México.' },
          { speaker: 'Presenter', en: "I've divided my talk into three parts: the market, our plan, and the budget.", es: 'Dividí mi charla en tres partes: el mercado, nuestro plan y el presupuesto.' },
          { speaker: 'Presenter', en: 'As you can see on this slide, demand has doubled since 2023.', es: 'Como pueden ver en esta diapositiva, la demanda se duplicó desde 2023.' },
          { speaker: 'Presenter', en: 'To sum up, the key takeaway is that now is the right time.', es: 'En resumen, la idea clave es que este es el momento indicado.' },
          { speaker: 'Presenter', en: "Thank you for your attention. I'm happy to take any questions.", es: 'Gracias por su atención. Con gusto respondo preguntas.' },
        ],
      },
      exercises: [
        { type: 'choice', prompt: 'Para pasar a la siguiente sección dices:', options: ['This brings me to my next point.', 'I finish now.', 'Next thing is this.'], answer: 0 },
        { type: 'fill', sentence: 'To ___ up, there are three key takeaways.', answers: ['sum'] },
        { type: 'match', pairs: [['Overview', 'Panorama general'], ['Highlight', 'Destacar'], ['Key takeaway', 'Idea clave'], ['Slide', 'Diapositiva']] },
        { type: 'truefalse', statement: 'La presentación tiene cuatro partes.', answer: false, explanation: 'Tiene tres: mercado, plan y presupuesto.' },
        { type: 'order', words: ['As', 'you', 'can', 'see', 'on', 'this', 'slide'], translation: 'Como pueden ver en esta diapositiva' },
        { type: 'listen', audio: "That's a great question. Let me check and get back to you.", options: ['Buena pregunta. Déjame revisar y te respondo.', 'Excelente pregunta, la respondo ya.', 'No sé la respuesta.'], answer: 0 },
        { type: 'speak', phrase: "Today I'm going to talk about our results for this year.", translation: 'Hoy voy a hablar de nuestros resultados de este año.' },
      ],
    },
  ],
];
