/* ============================================================
   BIOSCAN 5D · MODO UMBRAL — EDICIÓN TEMPORADA 1
   data.js — Contenido editable: pantallas, preguntas y perfiles
   ------------------------------------------------------------
   Copy Deck v2 APROBADO por Carlos. Todo el texto que ve el
   usuario vive aqui. La logica de calculo vive protegida en la
   Netlify Function (calcular-perfil.js).
   ============================================================ */

/* ------------------------------------------------------------
   TEXTOS DE PANTALLAS (UI copy)
   ------------------------------------------------------------ */
const UI = {
  bienvenida: {
    sello: "BIOSCAN 5D · MODO UMBRAL · EDICIÓN TEMPORADA 1",
    titulo: "Tu cuerpo lleva años hablando de ti al mundo",
    parrafo1: "En los próximos 4 minutos, BioScan 5D va a leer cómo tu cuerpo se comporta cuando trabajas, te comunicas y enfrentas la presión del día a día.",
    parrafo2: "Vas a descubrir tu <strong>perfil postural actual</strong> — la forma en que tu cuerpo habla por ti — y hacia dónde necesita evolucionar para que tu presencia esté a la altura de lo que deseas lograr.",
    parrafo3: "No es un test de personalidad. Es un espejo de tu cuerpo.",
    boton: "Iniciar mi BioScan",
    respaldo: "Basado en investigación de Harvard y San Francisco State University sobre postura, presencia y comunicación no verbal."
  },
  registro: {
    sello: "PASO 1 DE 2",
    titulo: "Tu perfil viaja contigo",
    parrafo: "Tu correo es la llave única de tu BioScan. Ahí recibirás tu diagnóstico completo y tu acceso a lo que sigue.",
    placeholderNombre: "¿Cómo te llamamos?",
    placeholderEmail: "tu@correo.com",
    consentimiento: "Acepto recibir mi diagnóstico y las novedades del Umbral 5D #01.",
    boton: "Activar mi BioScan",
    confianza: "Tus datos están seguros. No los compartimos con nadie."
  },
  preparacion: {
    sello: "ANTES DE COMENZAR",
    titulo: "Esto es un ejercicio de consciencia",
    texto1: "Lo que descubras aquí dependerá de qué tan honesto seas contigo mismo.",
    texto2: "Porque tu cuerpo expresa lo que sientes — para bien o para mal — y es lo que el mundo percibe de ti. La consciencia corporal te permite tomar el control.",
    texto3: "Responde con tu cuerpo, no con tu mente. La primera sensación que llegue es la verdadera. No hay respuestas malas, solo información valiosa sobre ti.",
    respira1: "Toma una respiración profunda.",
    respira2: "Cuando exhales, comienza.",
    boton: "Estoy listo"
  },
  calculo: {
    titulo: "Escaneando tu cuerpo...",
    textos: [
      "Mapeando tu presencia somática...",
      "Leyendo tu regulación bajo presión...",
      "Detectando tu patrón de influencia...",
      "Midiendo tu consciencia corporal...",
      "Cruzando tu perfil con tu reto actual..."
    ],
    final: "Tu perfil postural ha sido identificado."
  },
  revision: {
    sello: "ÚLTIMO PASO",
    titulo: "Antes de revelar tu perfil",
    texto: "Tómate un momento. Si alguna respuesta no refleja lo que tu cuerpo realmente siente, puedes ajustarla ahora. Cuando estés en paz con lo que respondiste, descubramos tu perfil.",
    boton: "Revelar mi perfil postural",
    nota: "Podrás repetir tu BioScan una vez más si lo necesitas."
  },
  resultado: {
    revelacion1: ", tu cuerpo ha hablado.",
    revelacion2: "Tu perfil postural es...",
    labelActual: "TU PERFIL POSTURAL ACTUAL",
    labelHuella: "TU HUELLA POSTURAL · DÍA 0",
    huellaTexto: "Esta es la huella de tu cuerpo hoy. Cada eje muestra una dimensión de tu presencia. Durante el Umbral 5D #01 vas a entender qué significa cada uno y cómo transformarlo.",
    destinoIntro: "De acuerdo a tus retos actuales, BioScan 5D indica que tu cuerpo debe moverse hacia:",
    cierreTitulo: "Conocer tu perfil es apenas el primer paso.",
    cierreParrafo: "El <strong>4 de junio</strong>, en <strong>Umbral 5D #01 — \"Como te sientas, te sientes\"</strong>, una sesión inmersiva de 60 minutos, vas a descubrir cómo ser más saludable y más persuasivo a través de tu postura, todos los días.",
    cierreParrafo2: "Ahí vas a entender por qué tu cuerpo se comporta así, y vas a recibir las herramientas para transformar este conocimiento en poder real: para estar a la altura de tus desafíos, en equilibrio, y expandiendo tu salud corporal y mental.",
    botonUmbral: "Reservar mi lugar en el Umbral",
    botonPDF: "Descargar mi diagnóstico",
    botonRepetir: "Repetir mi BioScan",
    acceso: "Acceso abierto · 4 de junio · 6:00 PM Colombia · Online en vivo",
    accesoPDF: "En los próximos minutos recibirás tu diagnóstico completo en tu correo.",
    firma: "BioScan 5D · una creación de 5D Diseñadores"
  },
  transiciones: {
    bloque2: { l1: "Tu cuerpo ya te mostró cómo se sostiene cada día.", l2: "Ahora veamos qué pasa cuando la presión aparece." },
    bloque3: { l1: "Hasta aquí, tu cuerpo en silencio.", l2: "Ahora descubramos qué dice tu cuerpo cuando estás frente a otros." },
    bloque4: { l1: "Vas más profundo de lo que crees.", l2: "Las siguientes preguntas miden algo invisible: cuánto escuchas a tu propio cuerpo." },
    bloque5: { l1: "Tu escaneo está casi completo.", l2: "Una última pregunta. La que define hacia dónde vas." },
    boton: "Continuar"
  }
};

/* ------------------------------------------------------------
   TITULOS DE BLOQUE (dorados, fijos durante cada bloque)
   ------------------------------------------------------------ */
const BLOQUES = {
  "PRESENCIA": "TU PRESENCIA SOMÁTICA DIARIA",
  "REGULACION": "TU REGULACIÓN BAJO PRESIÓN",
  "INFLUENCIA": "TU INFLUENCIA NO VERBAL",
  "CONSCIENCIA": "TU CONSCIENCIA CORPORAL",
  "RETO": "TU PRÓXIMO RETO A LOGRAR"
};

/* ------------------------------------------------------------
   LAS 12 PREGUNTAS (Copy Deck v2 aprobado)
   tipo: "single" | "multi"
   ------------------------------------------------------------ */
const PREGUNTAS = [
  // ---- BLOQUE 1 · PRESENCIA ----
  {
    id: "p1", bloque: "PRESENCIA", tipo: "single", icono: "columna",
    texto: "Imagina que estás en tu lugar de trabajo o estudio, frente a tu computadora, leyendo este diagnóstico. ¿Cómo estaría tu columna en ese momento?",
    opciones: [
      "Encorvada hacia adelante, con la mirada hacia abajo mirando la pantalla",
      "Apoyada en el respaldo de la silla, pero con los hombros caídos y la cabeza flexionada hacia adelante",
      "No lo había notado hasta esta pregunta",
      "Recta, con la mirada al frente, pero tensa, con los hombros levantados",
      "Bien apoyada, hombros abiertos, pecho expandido, respirando con espacio"
    ]
  },
  {
    id: "p2", bloque: "PRESENCIA", tipo: "multi", maxSel: 5, icono: "tension",
    texto: "Al final de un día normal de trabajo, ¿dónde sientes tensión? Puedes elegir varias.",
    opciones: [
      "Cuello, hombros y trapecios",
      "Espalda baja (zona lumbar)",
      "Mandíbula apretada o cabeza pesada",
      "Una sensación difusa, no logro ubicarla",
      "Piernas o rodillas",
      "No siento tensión particular"
    ],
    exclusiva: 5
  },
  {
    id: "p3", bloque: "PRESENCIA", tipo: "single", icono: "silla",
    texto: "¿Mantienes una postura firme y estable, con los pies bien apoyados en el piso y la espalda completamente apoyada en el respaldo de tu silla?",
    opciones: [
      "Siento mi postura inestable y sin apoyo adecuado",
      "Apoyo con firmeza los pies, pero mi espalda no",
      "Apoyo los pies y mi espalda está parcialmente apoyada",
      "Apoyo los pies y mi espalda está completamente apoyada en el respaldo",
      "Me siento absolutamente estable; mi silla es como una extensión de mi cuerpo"
    ]
  },
  // ---- BLOQUE 2 · REGULACION ----
  {
    id: "p4", bloque: "REGULACION", tipo: "single", icono: "presion",
    texto: "Antes de una reunión importante o una conversación difícil, ¿qué le pasa a tu cuerpo en los minutos previos?",
    opciones: [
      "Se contrae: hombros encogidos, respiración corta",
      "Se tensa: mandíbula apretada, postura rígida",
      "Se desconecta: no siento mi cuerpo, estoy en mi cabeza",
      "Se prepara: respiro profundo, me expando y ocupo más espacio",
      "No estoy seguro, no le presto atención"
    ]
  },
  {
    id: "p5", bloque: "REGULACION", tipo: "single", icono: "desafio",
    texto: "Cuando alguien te interrumpe o desafía en una reunión, ¿qué haces con tu cuerpo en los siguientes 30 segundos?",
    opciones: [
      "Me hago más pequeño, retrocedo, bajo la mirada",
      "Me tenso, me cierro, cruzo brazos o piernas",
      "No noto qué hago con mi cuerpo",
      "Mantengo mi postura y respiro profundo",
      "Me expando, ocupo mi espacio, sostengo la mirada"
    ]
  },
  {
    id: "p6", bloque: "REGULACION", tipo: "single", icono: "respiracion",
    texto: "En situaciones de alta exigencia —una negociación, una presentación, una entrevista, dar una instrucción a un grupo— ¿cómo describirías tu respiración?",
    opciones: [
      "Corta y superficial, a la altura del pecho",
      "Contenida (a veces aguanto la respiración sin darme cuenta)",
      "No lo recuerdo",
      "Profunda y desde el abdomen",
      "Variable según el momento, pero suelo notarla"
    ]
  },
  // ---- BLOQUE 3 · INFLUENCIA ----
  {
    id: "p7", bloque: "INFLUENCIA", tipo: "single", icono: "voz",
    texto: "Cuando das tu opinión en una reunión, ¿qué pasa con más frecuencia?",
    opciones: [
      "Hablo, pero siento que no me escuchan o me pasan por encima",
      "Espero a que me pregunten, no me ofrezco",
      "Me escuchan, pero la conversación no cambia de dirección",
      "Hablo y la conversación se mueve hacia donde propongo",
      "Modulo según la audiencia; a veces influyo, a veces no"
    ]
  },
  {
    id: "p8", bloque: "INFLUENCIA", tipo: "single", icono: "percepcion",
    texto: "¿Cuál de estas frases describe mejor cómo te percibe la gente que recién te conoce en lo profesional?",
    opciones: [
      "\"Parece muy capaz, pero reservado o callado\"",
      "\"Tiene mucha energía, a veces demasiada\"",
      "\"No estoy seguro qué pensar\"",
      "\"Tiene presencia, transmite seguridad\"",
      "\"Parece serio o un poco tenso\""
    ]
  },
  {
    id: "p9", bloque: "INFLUENCIA", tipo: "single", icono: "negociacion",
    texto: "En una negociación o conversación de alto impacto, ¿qué haces con más frecuencia?",
    opciones: [
      "Suavizo mi posición para evitar el conflicto",
      "Defiendo mi posición con firmeza, pero con el cuerpo rígido",
      "Pierdo el hilo, me distraigo, me cuesta sostener",
      "Sostengo mi posición desde la calma corporal",
      "Me adapto sin perder el enfoque"
    ]
  },
  // ---- BLOQUE 4 · CONSCIENCIA ----
  {
    id: "p10", bloque: "CONSCIENCIA", tipo: "single", icono: "atencion",
    texto: "¿Con qué frecuencia notas tu respiración durante el día sin que te lo recuerden?",
    opciones: [
      "Nunca",
      "Rara vez (1-2 veces)",
      "A veces (3-5 veces)",
      "Con frecuencia (6-10 veces)",
      "Constantemente (más de 10 veces)"
    ]
  },
  {
    id: "p11", bloque: "CONSCIENCIA", tipo: "single", icono: "pausa",
    texto: "¿Haces alguna pausa consciente entre tareas para reconectar con tu cuerpo?",
    opciones: [
      "Nunca, voy de tarea en tarea sin pausa",
      "Solo cuando algo me duele o me agoto",
      "A veces, sin método ni regularidad",
      "Sí, con técnica (respiración, micropausa, estiramiento)",
      "Sí, como ritual diario integrado"
    ]
  },
  // ---- BLOQUE 5 · RETO (define destino) ----
  {
    id: "p12", bloque: "RETO", tipo: "multi", maxSel: 3, icono: "reto",
    texto: "¿Cuál de estos retos estás enfrentando ahora mismo? Elige hasta 3.",
    opciones: [
      "Una entrevista, negociación salarial o decisión laboral importante",
      "Una presentación pública, exposición o transmisión en vivo",
      "Una conversación difícil con un colaborador, jefe o cliente",
      "Liderar un equipo o gestionar personas bajo presión",
      "Una conversación trascendental en mi vida personal",
      "Decisiones complejas que involucran a otros",
      "Una etapa de alta exigencia sostenida",
      "Nada particular ahora, busco crecimiento general"
    ],
    retos: [
      "entrevista_negociacion", "presentacion_publica", "conversacion_dificil",
      "liderazgo_equipo", "conversacion_personal", "decisiones_complejas",
      "alta_exigencia", "crecimiento_general"
    ]
  }
];

/* ------------------------------------------------------------
   LOS 8 PERFILES (Copy Deck v2 aprobado)
   Estructura: subtitulo sobre el CUERPO + bloque "en juego"
   color = color del orbe/acentos para ese perfil
   ------------------------------------------------------------ */
const PERFILES = {
  // ===== ORIGEN =====
  SOSTENEDOR: {
    nombre: "EL SOSTENEDOR",
    subtitulo: "El cuerpo que resuelve en silencio",
    color: "#D3AE37",
    patron: "Presencia somática baja · Influencia no verbal por desarrollar · Regulación interna estable",
    quien_eres: "Tu mente trabaja con precisión, pero tu cuerpo aprendió a ocupar el menor espacio posible. No es timidez: es una estrategia corporal que adoptaste para producir tranquilo, sin llamar la atención. El problema es que esa misma estrategia hace que tu presencia no acompañe la magnitud de tu trabajo.",
    cuerpo_dice: "\"Puedo resolver sin que me vean.\" Y funciona para entregar. Pero en cada momento donde necesitas influir, pedir o liderar, tu cuerpo sigue en modo silencioso, y el mundo recibe menos de lo que realmente vales.",
    en_juego: "Mantener este patrón día tras día tiene un costo. A corto plazo: tu voz pesa menos de lo que debería en las decisiones. A largo plazo: la postura recogida sostenida tensiona cuello y espalda, reduce la capacidad respiratoria y, según la investigación sobre postura y estado de ánimo, refuerza estados de baja energía. Tu talento queda subvalorado, no por falta de capacidad, sino por falta de presencia corporal.",
    fortaleza: "Tu disciplina, tu profundidad, tu confiabilidad. Nada de eso se pierde en tu evolución. Lo que cambia es la arquitectura corporal desde la que entregas todo eso."
  },
  CENTINELA: {
    nombre: "EL CENTINELA",
    subtitulo: "El cuerpo en guardia permanente",
    color: "#D13F26",
    patron: "Regulación bajo presión comprometida · Presencia media-alta pero rígida",
    quien_eres: "Tu cuerpo vive listo para responder. Hombros que se elevan sin que lo notes, mandíbula apretada al final del día, respiración alta y corta. Eres eficaz y comprometido, pero tu cuerpo paga un peaje silencioso por estar siempre en alerta.",
    cuerpo_dice: "\"Hay que estar siempre preparado.\" Esa vigilancia te da capacidad de respuesta, pero también tensión cervical, fatiga inesperada, y una comunicación que se percibe rígida aunque no sea tu intención.",
    en_juego: "La activación constante del sistema de alerta no es gratis. A corto plazo: tensión muscular crónica y agotamiento al final del día. A largo plazo: la rigidez sostenida es uno de los principales factores de molestias osteomusculares en quienes trabajan sentados, y el estado de alerta permanente desgasta tu energía y tu claridad. La buena noticia: la regulación se entrena.",
    fortaleza: "Tu capacidad de respuesta, tu estándar, tu compromiso. Eres quien sostiene cuando otros se caen. Eso es valioso. Solo necesita dejar de costarte tanto."
  },
  NOMADA: {
    nombre: "EL NÓMADA",
    subtitulo: "El cuerpo presente sin centro",
    color: "#8B7BD8",
    patron: "Consciencia corporal baja · Presencia y regulación inconsistentes",
    quien_eres: "Tu cuerpo y tu mente no siempre están en el mismo lugar. Estás en una reunión y mentalmente ya vas en la siguiente. Sientes el cuerpo solo cuando algo duele. No es que tu postura sea mala: es que aún no la habitas con plena consciencia.",
    cuerpo_dice: "\"Hay tanto por hacer que no hay tiempo de escucharme.\" Esa velocidad te da agilidad, pero también dispersión, decisiones reactivas y una sensación creciente de estar presente sin estar del todo.",
    en_juego: "Operar desconectado del cuerpo tiene consecuencias. A corto plazo: fatiga que aparece \"de la nada\" porque no la viste venir, y decisiones tomadas en piloto automático. A largo plazo: la falta de pausas conscientes acelera el desgaste y dificulta reconocer las señales tempranas de tensión y estrés. Reconectar con el cuerpo es reconectar con tu mejor criterio.",
    fortaleza: "Tu agilidad, tu adaptabilidad, tu capacidad de manejar muchos frentes. Eso es real. Con un centro corporal, esa agilidad deja de ser dispersión y se vuelve dirección."
  },
  HABITADO: {
    nombre: "EL HABITADO",
    subtitulo: "El cuerpo consciente en evolución",
    color: "#4ECDC4",
    patron: "Acceso corporal desarrollado · Base somática presente · Margen de refinamiento",
    quien_eres: "Ya hiciste trabajo con tu cuerpo en algún momento. Tu postura tiende a ser presente más que recogida, tu respiración es accesible, tu mensaje y tu cuerpo suelen estar alineados. Tienes un acceso a tu cuerpo que la mayoría no tiene.",
    cuerpo_dice: "Tu cuerpo ya aprendió que es un aliado, no un problema. Pero todos tenemos micro-asimetrías, y la sostenibilidad bajo máxima exigencia siempre tiene margen de crecimiento.",
    en_juego: "Tu reto no es corregir, es no estancarte. El cuerpo que deja de refinarse pierde gradualmente lo ganado. Tu próximo nivel es la especialización según el reto que enfrentas hoy.",
    fortaleza: "No es oculta: es la base sólida desde la que puedes profundizar y, eventualmente, inspirar a otros. Tu cuerpo ya es una herramienta de presencia."
  },
  // ===== DESTINO (avanzados) =====
  MAGNETICO: {
    nombre: "EL MAGNÉTICO",
    subtitulo: "La presencia que mueve sin forzar",
    color: "#FFB627",
    es_destino: true,
    quien_es: "Cuando este cuerpo entra a una sala, se nota antes de decir una palabra. Habla con pausas intencionales, no defensivas. La audiencia lo sigue porque su cuerpo está en total congruencia con lo que dice. Su presencia precede a su argumento. Esto no es carisma de nacimiento: es la integración consciente de presencia y comunicación, y se entrena.",
    vas_a_lograr: "Aprender a preparar tu cuerpo antes de cualquier momento donde tu voz deba tener peso —una presentación, una venta, un escenario— para que tu presencia trabaje a tu favor desde el primer segundo.",
    maestria: "A diferencia de la mayoría, tu cuerpo ya cruzó el umbral del magnetismo. Tu próximo nivel no es de corrección, es de maestría: llevar tu presencia al punto donde se vuelve tu sello inconfundible."
  },
  EJE: {
    nombre: "EL EJE",
    subtitulo: "El liderazgo sereno desde el centro",
    color: "#06A77D",
    es_destino: true,
    quien_es: "Este cuerpo toma decisiones desde un centro estable, no desde la reacción. Cuando lidera, su equipo percibe firmeza sin rigidez, claridad sin presión, dirección sin urgencia. Su calma es contagiosa y real. Logra ser exigente sin asfixiar, firme sin tensarse.",
    vas_a_lograr: "Acceder a tu sistema nervioso de calma incluso en los momentos de máxima exigencia, y transmitir esa regulación a quienes lideras. Liderar desde el centro, no desde la tensión.",
    maestria: "A diferencia de la mayoría, tu cuerpo ya lidera desde la calma. Tu próximo nivel es la maestría: profundizar esa serenidad hasta que se vuelva el ancla que estabiliza a todo tu equipo, incluso en la tormenta."
  },
  PUENTE: {
    nombre: "EL PUENTE",
    subtitulo: "La firmeza que no rompe el vínculo",
    color: "#5B8DEF",
    es_destino: true,
    quien_es: "Este cuerpo sostiene posiciones firmes con empatía abierta. En una negociación difícil, no se endurece ni se derrite. Su postura comunica \"estoy aquí, no me muevo de lo que necesito\" y \"estoy contigo, no contra ti\" al mismo tiempo. Habita la paradoja más valiosa: ser inamovible y receptivo a la vez.",
    vas_a_lograr: "Sostener tus posiciones más importantes —en el trabajo y en tu vida personal— sin quebrar el vínculo con el otro. Firmeza relacional: la postura más poderosa en cualquier conversación que importa.",
    maestria: "A diferencia de la mayoría, tu cuerpo ya sostiene la firmeza sin romper vínculos. Tu próximo nivel es la maestría: navegar las conversaciones más cargadas de tu vida manteniendo ese equilibrio intacto."
  },
  INALTERABLE: {
    nombre: "EL INALTERABLE",
    subtitulo: "La calma sostenida bajo el fuego",
    color: "#E63946",
    es_destino: true,
    quien_es: "Este cuerpo es un instrumento de resistencia inteligente. No se quema, no colapsa, no explota. Sostiene períodos largos de exigencia sin perder claridad ni presencia. Aprendió a respirar, moverse, pausar y recuperar en medio del fuego, no después de él.",
    vas_a_lograr: "Configurar tu día, tu puesto y tus rituales para que la alta exigencia sostenida deje de acumularse como costo en tu cuerpo. Resistir sin desgastarte: regular en lugar de aguantar.",
    maestria: "A diferencia de la mayoría, tu cuerpo ya resiste sin quemarse. Tu próximo nivel es la maestría: sostener escalamientos prolongados sin sacrificar un gramo de tu bienestar."
  }
};

window.BIOSCAN_DATA = { UI, BLOQUES, PREGUNTAS, PERFILES };
