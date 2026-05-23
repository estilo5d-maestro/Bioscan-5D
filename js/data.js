/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   data.js — Contenido editable: preguntas, opciones y perfiles
   ------------------------------------------------------------
   Este archivo contiene SOLO contenido (texto y puntajes).
   La lógica de cálculo vive protegida en la Netlify Function.
   Carlos puede editar textos aquí sin tocar la lógica.
   ============================================================ */

/* ------------------------------------------------------------
   LAS 12 PREGUNTAS
   Cada opción tiene "puntos" que suman a los ejes:
   eje1 = Presencia Somática
   eje2 = Regulación bajo presión
   eje3 = Influencia no verbal
   eje4 = Consciencia corporal
   ------------------------------------------------------------ */
const PREGUNTAS = [
  // ---------- BLOQUE 1 · PRESENCIA SOMÁTICA ----------
  {
    id: "p1",
    bloque: "PRESENCIA SOMÁTICA",
    tipo: "single",
    texto: "Imagina que estás en tu puesto de trabajo, frente a tu computadora, leyendo este diagnóstico. ¿Cómo estaría tu columna en ese momento?",
    opciones: [
      { txt: "Encorvada, con la cabeza adelantada hacia la pantalla", p: { eje1: -2, eje4: 1 } },
      { txt: "Apoyada, pero con los hombros caídos hacia adelante", p: { eje1: -1, eje4: 0 } },
      { txt: "No lo había notado hasta esta pregunta", p: { eje1: 0, eje4: -2 } },
      { txt: "Recta, pero tensa, con los hombros levantados", p: { eje1: 1, eje4: 1 } },
      { txt: "Alargada, hombros abiertos, respirando con espacio", p: { eje1: 2, eje4: 2 } }
    ]
  },
  {
    id: "p2",
    bloque: "PRESENCIA SOMÁTICA",
    tipo: "single",
    texto: "Al final de un día normal de trabajo, ¿dónde sientes más tensión?",
    opciones: [
      { txt: "Cuello, hombros y trapecios", p: { eje1: -1, eje2: -1 } },
      { txt: "Espalda baja", p: { eje1: 0, eje2: -1 } },
      { txt: "Mandíbula apretada o cabeza pesada", p: { eje1: -1, eje2: -2 } },
      { txt: "Una sensación difusa, no logro ubicarla", p: { eje1: 0, eje2: 0 } },
      { txt: "No siento tensión particular", p: { eje1: 2, eje2: 1 } }
    ]
  },
  {
    id: "p3",
    bloque: "PRESENCIA SOMÁTICA",
    tipo: "single",
    texto: "¿Mantienes una postura firme y estable, con los pies bien apoyados en el piso y la espalda completamente apoyada en el respaldo de tu silla de trabajo?",
    opciones: [
      { txt: "Siento mi postura inestable y sin apoyo adecuado", p: { eje1: -2, eje2: -2, eje4: 0 } },
      { txt: "Apoyo con firmeza los pies, pero mi espalda no", p: { eje1: -1, eje2: -1, eje4: 1 } },
      { txt: "Apoyo los pies y mi espalda está parcialmente apoyada", p: { eje1: 0, eje2: 0, eje4: 1 } },
      { txt: "Apoyo los pies y mi espalda está completamente apoyada en el respaldo", p: { eje1: 1, eje2: 1, eje4: 2 } },
      { txt: "Me siento absolutamente estable; mi silla es como una extensión de mi cuerpo", p: { eje1: 2, eje2: 2, eje4: 2 } }
    ]
  },
  // ---------- BLOQUE 2 · REGULACIÓN BAJO PRESIÓN ----------
  {
    id: "p4",
    bloque: "REGULACIÓN BAJO PRESIÓN",
    tipo: "single",
    texto: "Antes de una reunión importante o una conversación difícil, ¿qué le pasa a tu cuerpo en los minutos previos?",
    opciones: [
      { txt: "Se contrae: hombros encogidos, respiración corta", p: { eje2: -2, eje1: -1 } },
      { txt: "Se tensa: mandíbula apretada, postura rígida", p: { eje2: -1, eje1: 0 } },
      { txt: "Se desconecta: no siento mi cuerpo, estoy en mi cabeza", p: { eje2: -2, eje1: 0 } },
      { txt: "Se prepara: respiro profundo, ocupo más espacio", p: { eje2: 2, eje1: 1 } },
      { txt: "No estoy seguro, no le presto atención", p: { eje2: -1, eje1: 0 } }
    ]
  },
  {
    id: "p5",
    bloque: "REGULACIÓN BAJO PRESIÓN",
    tipo: "single",
    texto: "Cuando alguien te interrumpe o desafía en una reunión, ¿qué haces con tu cuerpo en los siguientes 30 segundos?",
    opciones: [
      { txt: "Me hago más pequeño, retrocedo, bajo la mirada", p: { eje2: -2, eje3: -2 } },
      { txt: "Me tenso, me cierro, cruzo brazos o piernas", p: { eje2: -1, eje3: -1 } },
      { txt: "No noto qué hago con mi cuerpo", p: { eje2: -1, eje3: 0 } },
      { txt: "Mantengo mi postura y respiro profundo", p: { eje2: 1, eje3: 1 } },
      { txt: "Me expando, ocupo mi espacio, sostengo la mirada", p: { eje2: 2, eje3: 2 } }
    ]
  },
  {
    id: "p6",
    bloque: "REGULACIÓN BAJO PRESIÓN",
    tipo: "single",
    texto: "En situaciones de alta exigencia, ¿cómo describirías tu respiración?",
    opciones: [
      { txt: "Corta y alta, en el pecho", p: { eje2: -2, eje4: 0 } },
      { txt: "Contenida (a veces aguanto la respiración sin darme cuenta)", p: { eje2: -2, eje4: -1 } },
      { txt: "No la noto", p: { eje2: -1, eje4: -2 } },
      { txt: "Profunda y diafragmática", p: { eje2: 2, eje4: 2 } },
      { txt: "Variable según el momento, pero suelo notarla", p: { eje2: 1, eje4: 2 } }
    ]
  },
  // ---------- BLOQUE 3 · INFLUENCIA NO VERBAL ----------
  {
    id: "p7",
    bloque: "INFLUENCIA NO VERBAL",
    tipo: "single",
    texto: "Cuando das tu opinión en una reunión, ¿qué pasa con más frecuencia?",
    opciones: [
      { txt: "Hablo, pero siento que no me escuchan o me pasan por encima", p: { eje3: -2 } },
      { txt: "Espero a que me pregunten, no me ofrezco", p: { eje3: -2 } },
      { txt: "Soy escuchado, pero la conversación no cambia de dirección", p: { eje3: -1 } },
      { txt: "Hablo y la conversación se mueve hacia donde propongo", p: { eje3: 2 } },
      { txt: "Modulo según la audiencia; a veces influyo, a veces no", p: { eje3: 0 } }
    ]
  },
  {
    id: "p8",
    bloque: "INFLUENCIA NO VERBAL",
    tipo: "single",
    texto: "¿Cuál de estas frases describe mejor cómo te percibe la gente que recién te conoce profesionalmente?",
    opciones: [
      { txt: "\"Parece muy capaz, pero introvertido o callado\"", p: { eje3: -1, eje1: -1 } },
      { txt: "\"Tiene mucha energía, a veces demasiada\"", p: { eje3: 0, eje1: 0 } },
      { txt: "\"No estoy seguro qué pensar\"", p: { eje3: -2, eje1: 0 } },
      { txt: "\"Tiene presencia, transmite seguridad\"", p: { eje3: 2, eje1: 2 } },
      { txt: "\"Parece serio o un poco tenso\"", p: { eje3: 0, eje1: -1 } }
    ]
  },
  {
    id: "p9",
    bloque: "INFLUENCIA NO VERBAL",
    tipo: "single",
    texto: "En una negociación o conversación de alto impacto, ¿qué haces con más frecuencia?",
    opciones: [
      { txt: "Suavizo mi posición para evitar el conflicto", p: { eje3: -2, eje2: -1 } },
      { txt: "Defiendo mi posición con firmeza, pero con rigidez corporal", p: { eje3: 0, eje2: -1 } },
      { txt: "Pierdo el hilo, me distraigo, me cuesta sostener", p: { eje3: -1, eje2: -2 } },
      { txt: "Sostengo mi posición desde la calma corporal", p: { eje3: 2, eje2: 2 } },
      { txt: "Me adapto sin perder el centro", p: { eje3: 1, eje2: 1 } }
    ]
  },
  // ---------- BLOQUE 4 · CONSCIENCIA CORPORAL ----------
  {
    id: "p10",
    bloque: "CONSCIENCIA CORPORAL",
    tipo: "single",
    texto: "¿Con qué frecuencia notas tu respiración durante el día sin que te lo recuerden?",
    opciones: [
      { txt: "Nunca (0 veces)", p: { eje4: -2 } },
      { txt: "Rara vez (1-2 veces)", p: { eje4: -1 } },
      { txt: "A veces (3-5 veces)", p: { eje4: 0 } },
      { txt: "Con frecuencia (6-10 veces)", p: { eje4: 1 } },
      { txt: "Constantemente (más de 10 veces)", p: { eje4: 2 } }
    ]
  },
  {
    id: "p11",
    bloque: "CONSCIENCIA CORPORAL",
    tipo: "single",
    texto: "¿Haces alguna pausa consciente entre tareas para reconectar con tu cuerpo?",
    opciones: [
      { txt: "Nunca, voy de tarea en tarea sin pausa", p: { eje4: -2 } },
      { txt: "Solo cuando algo me duele o me agoto", p: { eje4: -1 } },
      { txt: "A veces, sin método ni regularidad", p: { eje4: 0 } },
      { txt: "Sí, con técnica (respiración, micropausa, estiramiento)", p: { eje4: 1 } },
      { txt: "Sí, como ritual diario integrado", p: { eje4: 2 } }
    ]
  },
  // ---------- BLOQUE 5 · CONTEXTO (define perfil destino) ----------
  {
    id: "p12",
    bloque: "CONTEXTO",
    tipo: "multi",
    maxSelecciones: 3,
    texto: "¿Cuáles de estos retos estás atravesando ahora mismo? Selecciona hasta 3.",
    opciones: [
      { txt: "Una entrevista, negociación salarial o decisión laboral importante", reto: "entrevista_negociacion" },
      { txt: "Una presentación pública, exposición o transmisión en vivo", reto: "presentacion_publica" },
      { txt: "Una conversación difícil con colaborador, jefe o cliente", reto: "conversacion_dificil" },
      { txt: "Liderazgo de equipo o gestión de personas bajo presión", reto: "liderazgo_equipo" },
      { txt: "Una conversación trascendental en mi vida personal", reto: "conversacion_personal" },
      { txt: "Decisiones complejas que involucran a otros", reto: "decisiones_complejas" },
      { txt: "Una etapa de alta exigencia sostenida", reto: "alta_exigencia" },
      { txt: "Nada particular ahora, busco crecimiento general", reto: "crecimiento_general" }
    ]
  }
];

/* ------------------------------------------------------------
   LOS 8 PERFILES
   Cada uno con su descripción segmentada en 5 bloques.
   subtitulo, color (para el orbe), y los 5 bloques de copy.
   ------------------------------------------------------------ */
const PERFILES = {
  // ----- PERFILES ORIGEN -----
  SOSTENEDOR: {
    nombre: "EL SOSTENEDOR",
    subtitulo: "El profesional invisible que resuelve sin ser visto",
    color: "#D3AE37",
    patron: "Presencia somática baja · Influencia no verbal por desarrollar · Regulación interna estable",
    quien_eres: "Tu mente construye con precisión, pero tu cuerpo se ha vuelto invisible. Eres quien resuelve, sostiene y entrega, pero cuya postura no acompaña la magnitud de tu trabajo.",
    cuerpo_dice: "\"Necesito pasar desapercibido para producir tranquilo.\" Esa estrategia te dio resultados en lo individual, pero te cobra peaje en cada momento donde necesitas influir, pedir o liderar.",
    fortaleza: "Tu disciplina, tu profundidad analítica, tu confiabilidad. Nada de eso se pierde en tu próximo umbral. Lo que cambia es la arquitectura corporal con la que entregas todo eso.",
    proximo_umbral: "te enseña a habitar tu cuerpo de otra manera, empezando por la silla donde pasas más horas que en cualquier otra parte de tu vida."
  },
  CENTINELA: {
    nombre: "EL CENTINELA",
    subtitulo: "El vigilante en guardia permanente",
    color: "#D13F26",
    patron: "Regulación bajo presión comprometida · Presencia media-alta pero rígida",
    quien_eres: "Tu cuerpo vive en estado de alerta constante. Hombros levantados sin que lo notes, mandíbula apretada al final del día, respiración alta y corta. Eres eficaz, pero pagas un costo somático invisible.",
    cuerpo_dice: "\"El mundo es un terreno donde hay que estar siempre listo para defenderse.\" Eso te da resultados, pero también tensión cervical crónica, fatiga inesperada y comunicación que se percibe rígida aunque no sea tu intención.",
    fortaleza: "Tu capacidad de respuesta rápida, tu compromiso, tu nivel de estándar. Eres quien sostiene cuando otros se caen. Eso es valioso, pero está costando demasiado.",
    proximo_umbral: "te enseña que la verdadera autoridad no necesita tensión muscular para sostenerse. La respiración consciente reduce los marcadores de alerta sin perder capacidad ejecutiva."
  },
  NOMADA: {
    nombre: "EL NÓMADA",
    subtitulo: "El presente sin centro corporal",
    color: "#8B7BD8",
    patron: "Consciencia corporal baja · Presencia y regulación inconsistentes",
    quien_eres: "Tu cuerpo y tu mente no están sincronizados. Estás en una reunión y mentalmente ya estás en la siguiente. Sientes el cuerpo solo cuando algo duele. No es que tu postura sea mala: es que no la habitas.",
    cuerpo_dice: "\"Hay tanto que hacer que no puedo perder tiempo escuchándome.\" El problema es que esa estrategia produce dispersión cognitiva, decisiones reactivas y una sensación creciente de estar presente sin estar.",
    fortaleza: "Tu agilidad, tu adaptabilidad, tu capacidad de manejar múltiples frentes. Eso es real. Pero sin un centro corporal, esa agilidad se vuelve dispersión sin destino.",
    proximo_umbral: "te pide reaprender el gesto más antiguo del cuerpo humano: notar que tienes cuerpo. Con micro-rituales de 2 minutos que se integran entre tareas, sin agregar tiempo al día."
  },
  HABITADO: {
    nombre: "EL HABITADO",
    subtitulo: "El consciente en evolución activa",
    color: "#4ECDC4",
    patron: "Acceso corporal desarrollado · Base somática presente · Margen de refinamiento",
    quien_eres: "Ya hiciste trabajo somático en algún momento. Tu cuerpo y tu mensaje suelen estar alineados, tu respiración es accesible, tu postura tiende a ser presente más que colapsada. Tienes un acceso al cuerpo que la mayoría no tiene.",
    cuerpo_dice: "Tu cuerpo ya aprendió que es un aliado, no un problema. Pero todos tenemos micro-asimetrías, y la sostenibilidad bajo máxima exigencia siempre tiene margen de mejora.",
    fortaleza: "No es oculta: es la responsabilidad de profundizar y, eventualmente, enseñar. Tu cuerpo es ya una herramienta de presencia.",
    proximo_umbral: "no es de corrección, es de refinamiento y especialización, en función del reto específico que enfrentas en este momento."
  },
  // ----- PERFILES AVANZADOS (también destino) -----
  MAGNETICO: {
    nombre: "EL MAGNÉTICO",
    subtitulo: "La presencia que mueve sin forzar",
    color: "#FFB627",
    patron: "Presencia e influencia integradas · Comunicación encarnada",
    quien_eres: "Tu cuerpo amplifica tu mensaje en lugar de sabotearlo. Cuando entras a una sala, se nota antes de que digas una palabra. Hablas con pausas intencionales, no defensivas. La audiencia te sigue porque tu cuerpo está congruente con lo que dices.",
    cuerpo_dice: "Tu presencia precede a tu argumento. Esto no es carisma de nacimiento: es la integración consciente de presencia somática y comunicación.",
    fortaleza: "La capacidad de aparecer plenamente en momentos de alta exigencia. Lo que Amy Cuddy llama presencia.",
    proximo_umbral: "te lleva a desarrollar esta cualidad a nivel maestría: cómo preparar tu cuerpo antes de cualquier momento donde tu voz debe tener peso."
  },
  EJE: {
    nombre: "EL EJE",
    subtitulo: "El líder sereno desde el centro",
    color: "#06A77D",
    patron: "Regulación parasimpática bajo demanda · Liderazgo desde la calma",
    quien_eres: "Tomas decisiones desde un centro corporal estable, no desde la reacción. Cuando lideras, tu equipo percibe firmeza sin rigidez, claridad sin presión, dirección sin urgencia. Tu calma es contagiosa, no postiza.",
    cuerpo_dice: "Tu cuerpo sostiene tu pensamiento sin tensarlo. Logras ser firme sin tensarte, exigente sin asfixiar.",
    fortaleza: "La regulación parasimpática bajo demanda: mantener acceso al sistema nervioso de calma incluso en momentos de máxima exigencia ejecutiva.",
    proximo_umbral: "profundiza tu capacidad de liderar desde el centro y de transmitir esa regulación a tu equipo."
  },
  PUENTE: {
    nombre: "EL PUENTE",
    subtitulo: "La firmeza que no rompe el vínculo",
    color: "#5B8DEF",
    patron: "Presencia colaborativa · Firmeza relacional sin agresión",
    quien_eres: "Tu cuerpo sostiene posiciones firmes con empatía abierta. En una negociación o conversación difícil, no te endureces ni te derrites. Tu postura comunica \"estoy aquí, no me muevo de lo que necesito\" y \"estoy contigo, no contra ti\" al mismo tiempo.",
    cuerpo_dice: "Habitas la paradoja somática más difícil y valiosa: ser inamovible y receptivo simultáneamente.",
    fortaleza: "La presencia colaborativa: firmeza relacional sin agresión, la postura más valiosa en cualquier interacción de alto impacto.",
    proximo_umbral: "refina tu capacidad de sostener esa paradoja en las conversaciones más cargadas de tu vida profesional y personal."
  },
  INALTERABLE: {
    nombre: "EL INALTERABLE",
    subtitulo: "La calma sostenida bajo el fuego",
    color: "#E63946",
    patron: "Resistencia somática inteligente · Sostenibilidad bajo exigencia prolongada",
    quien_eres: "Tu cuerpo es un instrumento de resistencia inteligente. No te quemas, no colapsas, no explotas. Sostienes períodos largos de exigencia sin perder claridad ni presencia. Aprendiste a respirar, moverte, pausar y recuperar en medio del fuego, no después de él.",
    cuerpo_dice: "Tu cuerpo entendió que la resistencia no es aguantar, es regular. Recuperas en medio de la exigencia, no al final.",
    fortaleza: "La ergonomía dinámica: configurar tu día, tu puesto y tus rituales para que la alta exigencia sostenida no se convierta en costo somático acumulado.",
    proximo_umbral: "lleva tu resistencia inteligente al nivel donde puedes sostener escalamiento prolongado sin sacrificar tu bienestar."
  }
};

/* Exportar al scope global para que app.js los use */
window.BIOSCAN_DATA = { PREGUNTAS, PERFILES };
