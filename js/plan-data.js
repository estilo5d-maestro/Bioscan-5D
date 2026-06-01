/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — plan-data.js  (v2 · MATRIZ 16 CAMINOS)
   ------------------------------------------------------------
   MOTOR DE CONTENIDO POR CAPAS. El plan de cada persona se
   COMPONE en runtime leyendo perfil_actual + perfil_destino:

     PLAN = NUCLEO[dia]
          + LENTE_ORIGEN[origen][dia]
          + LENTE_DESTINO[destino][dia]
          + VIAJE[origen>destino]

   AUDIOS: editables por Carlos. Pega la URL en core.audio.url y
   pon disponible:true. Mientras false, se muestra texto guiado.

   Perfiles: SOSTENEDOR CENTINELA NOMADA HABITADO (origen)
             MAGNETICO EJE PUENTE INALTERABLE (destino/avanzado)
   ============================================================ */

window.BIOSCAN_PLAN = {

  UI: {
    marca: "BIOSCAN 5D", proTag: "PRO",
    selloTemporada: "TEMPORADA 1 · ACCESO FUNDADOR",
    activar: {
      kicker: "EL PORTAL", titulo: "Activa tu transformación",
      parrafo: "Ingresa el correo con el que compraste y tu código. Tu viaje de 7 días te espera del otro lado.",
      phEmail: "tu@correo.com", phCodigo: "BIOSCAN-XXXX-XXXX",
      boton: "Cruzar el umbral",
      nota: "Tu código es único e intransferible. Es tu llave personal.",
      errorNoCoincide: "El correo y el código no coinciden. Revisa el correo de tu compra.",
      errorExpirado: "Tu acceso de 30 días llegó a su fin. Pronto podrás renovarlo.",
      errorGenerico: "No pudimos validar tu acceso. Intenta de nuevo en un momento."
    },
    bloqueoFecha: {
      kicker: "4 DE JUNIO · 6:00 PM", titulo: "Tu portal se abre en el Umbral",
      parrafo: "El plan de transformación se desbloquea el 4 de junio, durante Umbral 5D #01. Guarda tu código: ese día comienza tu viaje.",
      boton: "Ir al Umbral"
    },
    home: {
      saludo: "Hola", huellaLabel: "TU HUELLA DE CRECIMIENTO",
      huellaDia0: "Día 0", huellaHoy: "Hoy",
      diasLabel: "TU CAMINO DE 7 DÍAS", rachaLabel: "racha", rachaUnidad: "días",
      diaHoyTag: "HOY", diaBloqueadoMsg: "Completa el día anterior",
      diaEsperaTag: "Tu próximo paso se abre mañana · 5:00 am",
      diaEsperaSub: "El ritual es de uno por día. Mañana continúa tu viaje.",
      seguimientoLabel: "SEGUIMIENTO · 23 DÍAS",
      seguimientoTexto: "Sostén tu hábito clave. Tu huella sigue expandiéndose.",
      btnGuia: "Mi guía en PDF", btnSalir: "Cerrar sesión", progresoSello: "% del camino"
    },
    dia: {
      volver: "Mi camino", conceptoLabel: "EL CONCEPTO", anchorLabel: "TU MOMENTO ANCLA",
      tinyLabel: "LA MICRO-PRÁCTICA", coreLabel: "PRÁCTICA PROFUNDA", retoLabel: "TU RETO DE HOY",
      journalLabel: "CHECKPOINT", plusLabel: "CAPA MAESTRÍA",
      audioProximamente: "Audio guiado · muy pronto. Por ahora, sigue los pasos a tu ritmo.",
      btnComenzar: "Comenzar", btnHiceLo: "Ya lo hice", btnCoreOk: "Práctica completada",
      btnRetoOk: "Acepto el reto", btnCompletar: "Sellar mi día", celebraTitulo: "Día sellado",
      btnVolverHome: "Ver mi evolución",
      pasoLabels: ["Concepto", "Práctica", "Profundo", "Reto", "Checkpoint"]
    },
    expirado: {
      kicker: "VIAJE COMPLETADO", titulo: "Recorriste un camino que pocos completan",
      parrafo: "Tu huella cambió. Y esto es apenas el comienzo. Pronto abriremos la puerta para que sigas profundizando.",
      boton: "Quiero seguir"
    }
  },

  DIAS: [
    {
      numero: 1, tema: "DESPERTAR", ejeFoco: "eje4",
      subtitulo: "Tu primera conversación consciente con tu cuerpo en años.",
      concepto: "Llevas años habitando tu cuerpo sin escucharlo. Hoy aprendes a oír lo que te dice antes de que se vuelva tensión, fatiga o una decisión reactiva. Esto no es meditación: es inteligencia somática operativa. La meditación busca silencio; esto busca información. Tu cuerpo lleva años acumulando datos que tu mente nunca consultó.",
      anchor: "Después de sentarte en tu silla de trabajo por primera vez en el día, antes de tocar el teclado.",
      tiny: { titulo: "El chequeo de 90 segundos", pasos: ["Cierra los ojos 10 segundos.", "Pregúntate: «¿Cómo está mi cuerpo ahora mismo?»", "Recorre cuello, hombros, espalda, mandíbula y respiración.", "Nombra lo que encuentras sin juzgarlo: «tenso», «cómodo», «neutro».", "Toma una respiración profunda."] },
      celebracion: "Di internamente: «Acabo de hacer algo que casi nadie hace». Sonríe levemente. Esa pequeña emoción es lo que graba el hábito en tu cerebro.",
      core: { titulo: "El Inventario Corporal Completo", duracionMin: 8, descripcion: "Un escaneo guiado de la coronilla a los pies. Ponte audífonos, busca un lugar tranquilo y déjate llevar por la voz.", pasos: ["Ubicación corporal en el espacio.", "Escaneo descendente: cabeza, cuello, hombros, brazos.", "Tronco, abdomen, espalda baja.", "Piernas, pies, contacto con el piso.", "Respiración integral y cierre."], audio: { url: "", disponible: false } },
      journal: ["¿Qué encontraste en tu cuerpo que no sabías que estaba ahí?", "¿Hubo un momento donde te sorprendiste habitándote?", "¿Qué fue más difícil: notar la tensión o nombrarla sin juzgarla?"],
      scoring: { tiny: { eje4: 0.3 }, core: { eje4: 0.5 }, reto: { eje4: 0.2 } }
    },
    {
      numero: 2, tema: "CALIBRACIÓN", ejeFoco: "eje1",
      subtitulo: "Tu puesto es el aliado o el saboteador de tu próxima década.",
      concepto: "Tu cuerpo no te traiciona: tu silla, tu monitor y tu mesa moldean tu postura 40 horas a la semana. Hoy auditas tu entorno físico y haces ajustes reales. La transformación no se construye solo con consciencia: se construye con un entorno que apoya tu cuerpo en lugar de combatirlo. La investigación de Erik Peper es clara: una postura erguida cambia tu acceso a estados de energía y a pensamientos más positivos.",
      anchor: "Después de prender tu computadora del día.",
      tiny: { titulo: "El reset postural de 60 segundos", pasos: ["Apoya completamente la espalda en el respaldo.", "Planta ambos pies firmes en el piso o en un reposapiés.", "Verifica que tus codos formen 90° sobre la mesa.", "El borde superior de tu pantalla, a la altura de tus ojos."] },
      celebracion: "Pon ambas manos sobre tu pecho un segundo. Es co-regulación: refuerza la sensación de «estoy bien posicionado para hoy».",
      core: { titulo: "Auditoría de Puesto 5D", duracionMin: 10, descripcion: "Recorre este checklist con tu propio puesto. Cada ítem que falle es una palanca directa de bienestar y rendimiento.", pasos: ["Pantalla: ¿borde superior a la altura de tus ojos?", "Distancia: ¿pantalla a un brazo extendido?", "Iluminación: ¿luz desde un costado, no detrás?", "Silla: ¿el lumbar apoya la curva de tu espalda?", "Codos a 90°, muñecas planas.", "Pies completamente apoyados.", "Movimiento: ¿te paras cada ~20 minutos? (Peper)"], audio: { url: "", disponible: false } },
      journal: ["¿Qué ajuste hiciste hoy que ya sientes en tu cuerpo?", "¿Qué resistencia interna sentiste? («no tengo tiempo», «ya me acostumbré»…)", "¿Cuál es la inversión más urgente que necesita tu puesto?"],
      scoring: { tiny: { eje1: 0.4 }, core: { eje1: 0.3 }, reto: { eje1: 0.3, eje4: 0.2 } }
    },
    {
      numero: 3, tema: "RESPIRACIÓN ESTRATÉGICA", ejeFoco: "eje2",
      subtitulo: "El único sistema autónomo que también manejas a voluntad.",
      concepto: "Cuando llega un momento crítico, el cuerpo tiende a contraer el pecho y respirar hacia arriba. Eso activa la alerta y empeora cada decisión de los siguientes minutos. Hoy aprendes lo opuesto: activar tu sistema de calma en 90 segundos, justo cuando más lo necesitas. No es relajación genérica: es bioingeniería de tu sistema nervioso. La exhalación larga activa tu vago ventral (Porges).",
      anchor: "Al sentir el primer momento de tensión del día (mandíbula apretada, hombros, respiración corta).",
      tiny: { titulo: "La respiración de 90 segundos", pasos: ["Inhala por la nariz contando 4.", "Pausa con el aire dentro contando 4.", "Exhala por la boca, lento, contando 8.", "Repite 3 ciclos. La exhalación larga es la que enciende tu calma."] },
      celebracion: "Al terminar el tercer ciclo, di: «Acabo de cambiar mi estado en 90 segundos». Porque es exactamente lo que ocurrió.",
      core: { titulo: "Suspiro Fisiológico + Coherencia Cardíaca", duracionMin: 10, descripcion: "Tres técnicas encadenadas que llevan tu sistema nervioso del modo alerta al modo claridad.", pasos: ["Suspiro fisiológico: doble inhalación nasal + exhalación larga ×5.", "Respiración 4-7-8 con visualización.", "Coherencia cardíaca: 6 respiraciones por minuto.", "Cierre: una exhalación que suelte los hombros."], audio: { url: "", disponible: false } },
      journal: ["¿En qué momento del día funcionó mejor la técnica?", "¿Qué notaste DESPUÉS de respirar que no estaba antes?", "¿Hubo una situación donde no te ayudó? ¿Qué pasó?"],
      scoring: { tiny: { eje2: 0.4 }, core: { eje2: 0.5, eje4: 0.3 }, reto: { eje2: 0.5 } }
    },
    {
      numero: 4, tema: "PREPARACIÓN", ejeFoco: "eje1",
      subtitulo: "Dos minutos antes del momento. Recalibras tu estado, no tu imagen.",
      concepto: "Hoy usas una práctica respaldada por decenas de estudios: adoptar una postura expansiva durante dos minutos te hace sentir más presente y seguro antes de un momento clave. No cambia tu química: cambia tu estado psicológico, y eso ya es enorme. La clave: lo haces a solas, antes del momento, para recalibrarte por dentro. Peper añade un detalle poderoso: una mirada ligeramente hacia arriba facilita el acceso a tus recuerdos y estados más fuertes.",
      anchor: "Cuando veas en tu calendario un momento importante en los próximos 5 minutos.",
      tiny: { titulo: "El ritual de los 2 minutos", pasos: ["Ve a un lugar privado (baño, oficina, tu carro, una esquina).", "Pies al ancho de tus caderas, firmes.", "Columna larga, hombros abiertos hacia atrás.", "Manos en la cintura o brazos en alto formando una V.", "Mira ligeramente hacia arriba. Respira lento. Sostén 2 minutos."] },
      celebracion: "Al salir, di internamente: «Llego de otro lugar». Esa frase ancla el estado. Cada vez que la repitas, tu cuerpo lo recordará.",
      core: { titulo: "Anclaje de Estado de Recursos", duracionMin: 8, descripcion: "Una técnica para guardar un estado de presencia plena y poder evocarlo cuando lo necesites.", pasos: ["Recuerda un momento donde te sentiste absolutamente presente y capaz.", "Revívelo con todos los detalles: qué viste, oíste, sentiste.", "En el pico del recuerdo, junta pulgar e índice con firmeza.", "Sostén 30 segundos. Suelta. Repite 3 veces.", "Después, en momentos críticos, junta pulgar e índice: tu cuerpo recuerda."], audio: { url: "", disponible: false } },
      journal: ["¿En qué momento aplicaste el ritual de 2 minutos? ¿Qué cambió?", "¿Pudiste activar el anclaje (pulgar + índice)? ¿Funcionó?", "¿Qué resistencia sentiste al hacer la postura expansiva en privado?"],
      scoring: { tiny: { eje2: 0.5, eje1: 0.3 }, core: { eje2: 0.4 }, reto: { eje3: 0.6 } }
    },
    {
      numero: 5, tema: "COMUNICACIÓN ENCARNADA", ejeFoco: "eje3",
      subtitulo: "Tu cuerpo habla antes que tu boca. Hoy alineas los dos.",
      concepto: "Cuando hay incongruencia entre tu cuerpo y tus palabras, la gente le cree a tu cuerpo. La primera impresión se forma en segundos, antes de que digas una palabra: tu lenguaje corporal genera el marco dentro del cual el otro interpreta lo que dices. Hoy alineas cuerpo y mensaje para que tu presencia trabaje a tu favor.",
      anchor: "Antes de hablar en una reunión, llamada o conversación.",
      tiny: { titulo: "Los 15 segundos antes de hablar", pasos: ["Endereza la columna desde la coronilla, como si te estiraran un hilo.", "Abre los hombros hacia atrás.", "Inhala por la nariz, exhala suave por la boca.", "Habla en la exhalación, no en la inhalación."] },
      celebracion: "Al terminar, nota: «Hablé desde el cuerpo, no desde la garganta». No importa cómo respondieron. Importa desde dónde hablaste.",
      core: { titulo: "Voz Anclada", duracionMin: 10, descripcion: "Una práctica vocal somática para que tu presencia acompañe a tus palabras.", pasos: ["Lee un párrafo en voz alta con postura colapsada. Nota tu voz.", "Léelo con postura expansiva. Nota la diferencia.", "Practica pausas intencionales, no defensivas.", "Contacto visual directo + respiración diafragmática."], audio: { url: "", disponible: false } },
      journal: ["¿Notaste alguna diferencia en cómo te respondieron hoy?", "¿Qué hábito vocal o postural saboteaba antes tu comunicación?", "¿Qué fue más difícil: las pausas, el contacto visual o la postura?"],
      scoring: { tiny: { eje3: 0.5 }, core: { eje3: 0.4, eje1: 0.2 }, reto: { eje3: 0.6 } }
    },
    {
      numero: 6, tema: "INTEGRACIÓN BAJO PRESIÓN", ejeFoco: "eje2",
      subtitulo: "La prueba no es practicar en calma. Es sostener en el caos.",
      concepto: "Hasta hoy practicaste en condiciones controladas. Hoy aprendes lo más valioso: mantener tu estado bajo presión real. La diferencia entre el novato y el avanzado no es la ausencia de tensión: es la velocidad de recuperación. Vas a usar pendulación somática (Levine): oscilar la atención entre la zona tensa y una zona neutra hasta que la carga se libera sola.",
      anchor: "Después de un momento donde notaste que tu cuerpo se contrajo (te interrumpieron, criticaron, presionaron).",
      tiny: { titulo: "Contraerse Y volver", pasos: ["Reconoce que tu cuerpo se contrajo. No luches contra eso.", "Haz un suspiro fisiológico audible (doble inhalación + exhalación larga).", "Alarga la columna desde la coronilla.", "Continúa con lo que hacías, pero desde un cuerpo distinto."] },
      celebracion: "Di: «Mi cuerpo se contrajo Y volví». El «Y» es lo importante. No «pero». La contracción es parte del proceso, no un fracaso.",
      core: { titulo: "Pendulación Somática", duracionMin: 12, descripcion: "La práctica más profunda del plan. Procesa la tensión acumulada sin revivir lo que la causó.", pasos: ["Recuerda el contexto de algo que te tensó (sin revivir la emoción).", "Nota la zona del cuerpo con tensión residual.", "Lleva tu atención a una zona neutra o agradable.", "Pendula la atención entre la zona tensa y la neutra, cada 30 segundos.", "Permite que la tensión se libere sola. No la fuerces."], audio: { url: "", disponible: false } },
      journal: ["¿En qué momento real aplicaste la micro-práctica?", "¿Pudiste «volver» después de contraerte?", "¿Qué hiciste hoy que ayer todavía no habrías hecho?"],
      scoring: { tiny: { eje2: 0.7 }, core: { eje4: 0.5, eje2: 0.3 }, reto: { eje3: 0.8, eje2: 0.4 } }
    },
    {
      numero: 7, tema: "CIERRE Y COMPROMISO", ejeFoco: "integracion",
      subtitulo: "No termina aquí. Apenas empieza. Hoy diseñas lo que sigue.",
      concepto: "Siete días no te transforman, pero abren la puerta. Lo que viene —los días de seguimiento— es donde la transformación se consolida. Hoy revisas tu evolución, ves cuánto cambió tu huella, y eliges UN solo hábito para mantener. No intentes mantener los siete: eso falla siempre. Mantén uno. El que más resonó. Ese se queda y se vuelve parte de quién eres.",
      anchor: "Hoy no hay ancla. Date 30 minutos sin interrupciones. Es tu ritual de cierre.",
      tiny: { titulo: "Revisión de tu huella", pasos: ["Abre tu huella de crecimiento.", "Compara tu Día 0 con tu Día 7.", "Identifica el eje donde más creciste.", "Identifica el que todavía tiene margen."] },
      celebracion: "Tómate un selfie con una postura expansiva y guárdalo. Es un anclaje visual que te servirá cuando sientas que se te olvidan las prácticas.",
      core: { titulo: "Compromiso Somático", duracionMin: 15, descripcion: "El ritual que convierte 7 días en un cambio permanente.", pasos: ["Revisa los 6 días: qué fue lo más difícil, qué lo más fácil.", "Visualiza 3 momentos del próximo mes donde necesitarás tu nuevo perfil (con fechas).", "De pie, postura expansiva, di en voz alta tu compromiso.", "Elige UNA práctica para mantener como hábito permanente."], audio: { url: "", disponible: false } },
      journal: ["¿Cuál fue el insight más importante de estos 7 días?", "¿Qué práctica vas a mantener como hábito permanente?", "¿Qué cambió en cómo te ves tú y en cómo te ven los demás?"],
      scoring: { tiny: { eje4: 0.4 }, core: { eje1: 0.3, eje2: 0.3, eje3: 0.3, eje4: 0.3 }, reto: { eje3: 0.4 } }
    }
  ],

  LENTE_ORIGEN: {
    SOSTENEDOR: {
      nombre: "EL SOSTENEDOR", subtitulo: "El cuerpo que resuelve en silencio",
      fortaleza: "Tu disciplina, tu profundidad, tu confiabilidad. Nada de eso se pierde — cambia la arquitectura corporal desde la que lo entregas.",
      desarrollo: "Tu cuerpo aprendió a ocupar el menor espacio posible. Tu trabajo: ocupar el espacio que tu talento ya merece.",
      matiz: { 1: "Hoy nota algo específico: los momentos donde tu cuerpo se hace pequeño sin que lo decidas — hombros que entran, voz que baja. No para juzgarlo. Para verlo.", 2: "Este día es clave para ti: tu puesto probablemente refuerza el encogimiento. Conviértelo en un entorno que te invite a abrirte.", 4: "Tu día bisagra. Tu cuerpo por defecto se colapsa antes de los momentos importantes. Hoy inviertes el patrón.", 5: "La influencia es tu segundo punto de desarrollo. Hoy tu cuerpo aprende a que tu presencia llegue antes que tu argumento.", 6: "Bajo presión, tu cuerpo va a querer encogerse de nuevo. Hoy entrenas la velocidad para volver a tu presencia." }
    },
    CENTINELA: {
      nombre: "EL CENTINELA", subtitulo: "El cuerpo en guardia permanente",
      fortaleza: "Tu capacidad de respuesta, tu estándar, tu compromiso. Eres quien sostiene cuando otros se caen. Solo necesita dejar de costarte tanto.",
      desarrollo: "Tu cuerpo vive listo para responder. Tu trabajo: sostener tu nivel sin pagar el peaje de la tensión permanente.",
      matiz: { 1: "Hoy nota dónde guardas la alerta: hombros elevados, mandíbula apretada, respiración alta. Tu cuerpo lleva la guardia puesta aunque no haya amenaza.", 3: "Este es tu día más importante. Aquí aprendes a soltar la activación que te agota sin que lo notes. La regulación se entrena.", 4: "Cuidado con tu patrón: tiendes a prepararte tensándote más. Hoy aprendes a prepararte sin endurecerte.", 6: "Tu reto no es resistir más: es recuperarte más rápido. Soltar la contracción en vez de acumularla." }
    },
    NOMADA: {
      nombre: "EL NÓMADA", subtitulo: "El cuerpo presente sin centro",
      fortaleza: "Tu agilidad, tu adaptabilidad, tu capacidad de manejar muchos frentes. Con un centro corporal, esa agilidad deja de ser dispersión y se vuelve dirección.",
      desarrollo: "Tu cuerpo y tu mente no siempre están en el mismo lugar. Tu trabajo: reconectar con tu centro para que tu agilidad tenga dónde anclarse.",
      matiz: { 1: "Este es tu día fundacional. Sientes el cuerpo solo cuando algo duele. Hoy empiezas a habitarlo con consciencia, no con dolor.", 3: "La respiración es tu ancla más rápida al presente. Cada vez que respiras consciente, vuelves a tu cuerpo.", 4: "Para ti, el ritual de 2 minutos es un ancla de presencia: te trae de vuelta antes de un momento que ibas a vivir en piloto automático.", 6: "Bajo presión te dispersas o reaccionas. Hoy aprendes a quedarte, a recuperar el centro en medio del movimiento." }
    },
    HABITADO: {
      nombre: "EL HABITADO", subtitulo: "El cuerpo consciente en evolución",
      fortaleza: "Tu base somática ya es sólida — la mayoría no la tiene. Es desde donde puedes profundizar y, eventualmente, inspirar a otros.",
      desarrollo: "Ya hiciste trabajo con tu cuerpo. Tu reto no es corregir: es no estancarte y especializar tu desarrollo según el momento que vives.",
      matiz: { 1: "Tú ya tienes acceso a tu cuerpo. Hoy afinas la escucha: las micro-señales que antes pasabas por alto.", 4: "Para ti, esto es refinamiento: encadenar tu preparación con tu respiración hasta tener un ritual pre-momento impecable.", 7: "Tu cierre incluye algo extra: define el segundo eje que vas a desarrollar para no estancarte." }
    }
  },

  LENTE_DESTINO: {
    MAGNETICO: {
      nombre: "EL MAGNÉTICO", subtitulo: "La presencia que mueve sin forzar",
      competencia: "Que tu presencia preceda a tu argumento. Que la sala te note antes de que hables.",
      llegada: "Tu presencia ahora precede a tu palabra.", diasFuertes: [4, 5],
      retoSesgo: { 1: "Hazlo en un momento donde quieras influir o que te tomen en cuenta.", 2: "Prioriza la altura de cámara y pantalla: que en cada videollamada tu presencia se vea, no se esconda.", 3: "Úsala antes de cada momento donde tu voz deba tener peso.", 4: "Aplícalo antes de una presentación, una venta o un escenario.", 5: "Tu objetivo: que tu presencia preceda a tu argumento.", 6: "Elige un momento donde debas sostener atención —un público, una cámara— y vuelve a tu presencia cada vez que te repliegues.", 7: "Comparte tu transformación con alguien ante quien quieras proyectar tu mejor presencia." }
    },
    EJE: {
      nombre: "EL EJE", subtitulo: "El liderazgo sereno desde el centro",
      competencia: "Liderar y decidir desde un centro estable. Que tu calma sea contagiosa y real.",
      llegada: "Ahora lideras desde el centro, no desde la tensión.", diasFuertes: [3, 6],
      retoSesgo: { 1: "Hazlo mientras das una instrucción o tomas una decisión con tu equipo.", 2: "Prioriza el respaldo lumbar: un centro físico estable sostiene un liderazgo sereno.", 3: "Úsala antes de cada decisión importante, para decidir desde el centro y no desde la reacción.", 4: "Aplícalo antes de dirigir una reunión difícil con tu equipo.", 5: "Tu objetivo: transmitir calma y dirección, sin urgencia.", 6: "Elige una decisión difícil que has postergado y tómala desde tu centro.", 7: "Comparte tu transformación con alguien de tu equipo: tu cambio inspira al grupo." }
    },
    PUENTE: {
      nombre: "EL PUENTE", subtitulo: "La firmeza que no rompe el vínculo",
      competencia: "Sostener tus posiciones más importantes sin quebrar el vínculo con el otro. Inamovible y receptivo a la vez.",
      llegada: "Ahora eres inamovible y receptivo a la vez.", diasFuertes: [5, 6],
      retoSesgo: { 1: "Hazlo en una conversación donde necesites sostener una posición.", 2: "Prioriza distancia y apertura del espacio: un puesto abierto invita a conversaciones abiertas.", 3: "Úsala antes de cada conversación tensa, para entrar firme y abierto a la vez.", 4: "Aplícalo antes de una negociación o una conversación donde no puedes ceder.", 5: "Tu objetivo: sostener tu posición sin endurecer el tono.", 6: "Elige esa conversación pendiente que has evitado. Hoy es el día.", 7: "Comparte tu transformación con esa persona con quien quieres una mejor relación." }
    },
    INALTERABLE: {
      nombre: "EL INALTERABLE", subtitulo: "La calma sostenida bajo el fuego",
      competencia: "Resistir sin desgastarte. Regular en lugar de aguantar, incluso en períodos largos de exigencia.",
      llegada: "Ahora regulas en lugar de aguantar.", diasFuertes: [2, 3, 6],
      retoSesgo: { 1: "Hazlo en el momento más exigente de tu día.", 2: "Prioriza todo lo que reduzca carga acumulada: tu puesto es tu primera línea contra el desgaste.", 3: "Úsala cada vez que sientas que la exigencia empieza a acumularse.", 4: "Aplícalo antes del bloque más demandante de tu jornada.", 5: "Tu objetivo: comunicar claridad incluso cuando estás bajo presión.", 6: "Elige el reto más demandante y atraviésalo regulándote, no aguantando.", 7: "Comparte tu transformación con quien comparte tu carga: la regulación se contagia." }
    }
  },

  VIAJE: {
    "SOSTENEDOR>MAGNETICO": "Tu cuerpo aprendió a ocupar el menor espacio posible para producir tranquilo. Funcionó: eres confiable, profundo, disciplinado. Pero el mundo recibe menos de lo que vales. En 7 días vas a aprender a ocupar el espacio que tu talento ya merece — que tu presencia llegue antes que tu palabra.",
    "SOSTENEDOR>EJE": "Resuelves en silencio, con un centro interno estable que pocos tienen. En 7 días vas a llevar esa estabilidad hacia afuera: de sostener callado a liderar desde el centro, con una presencia que serena al resto.",
    "SOSTENEDOR>PUENTE": "Tu cuerpo eligió no ocupar espacio. Pero hay conversaciones donde necesitas sostener tu posición sin romper el vínculo. En 7 días vas a aprender a estar presente y firme, sin dejar de ser receptivo.",
    "SOSTENEDOR>INALTERABLE": "Entregas con disciplina, incluso bajo carga. En 7 días vas a transformar esa resistencia silenciosa en una calma sostenida y consciente: resistir regulándote, no encogiéndote.",
    "CENTINELA>MAGNETICO": "Tu cuerpo vive en guardia, siempre listo. Esa energía, liberada de la tensión, es magnetismo puro. En 7 días vas a soltar la rigidez que te frena para que tu presencia brille sin esfuerzo.",
    "CENTINELA>EJE": "Tu compromiso te mantiene en alerta permanente, y eso agota. En 7 días vas a convertir esa vigilancia en serenidad: de estar tenso a liderar desde la calma — tu camino más natural y más necesario.",
    "CENTINELA>PUENTE": "Tu firmeza a veces se vuelve rigidez, y la rigidez rompe vínculos. En 7 días vas a aprender a ser firme sin endurecerte: sostener tu posición manteniendo la puerta abierta al otro.",
    "CENTINELA>INALTERABLE": "Aguantas mucho, pero a un costo alto. En 7 días vas a cambiar el aguante por la regulación: la misma resistencia, sin el desgaste que hoy pagas en tensión y fatiga.",
    "NOMADA>MAGNETICO": "Tu agilidad te lleva a todas partes, pero tu presencia se diluye. En 7 días vas a darle un centro a esa energía: un foco que, en vez de dispersarse, irradia y mueve a otros.",
    "NOMADA>EJE": "Tu mente va más rápido que tu cuerpo, y eso te dispersa. En 7 días vas a encontrar tu centro: de estar en todas partes a estar plenamente en una — liderando desde la presencia, no desde la prisa.",
    "NOMADA>PUENTE": "Estás presente sin estar del todo, y eso se siente en tus vínculos. En 7 días vas a aprender a habitar la conversación completa: presente, firme y conectado al otro al mismo tiempo.",
    "NOMADA>INALTERABLE": "Tu reactividad te hace gastar energía sin darte cuenta. En 7 días vas a transformar esa reacción en sostén: un cuerpo que se regula y se queda, incluso cuando la exigencia aprieta.",
    "HABITADO>MAGNETICO": "Tu base somática ya es sólida. En 7 días la vas a especializar hacia el magnetismo: refinar tu presencia hasta que se vuelva tu sello inconfundible en cada sala.",
    "HABITADO>EJE": "Ya habitas tu cuerpo con consciencia. En 7 días vas a dirigir ese dominio hacia el liderazgo sereno: profundizar tu centro hasta que estabilice a quienes te rodean.",
    "HABITADO>PUENTE": "Tienes un acceso a tu cuerpo que pocos tienen. En 7 días vas a afinar ese dominio hacia el vínculo: firmeza y receptividad en las conversaciones que más importan.",
    "HABITADO>INALTERABLE": "Tu cuerpo ya es un aliado. En 7 días vas a especializarlo en la resistencia inteligente: sostener máxima exigencia sin perder un gramo de tu bienestar."
  },

  MAESTRIA: {
    MAGNETICO: { encuadre: "Tu cuerpo ya cruzó el umbral del magnetismo. Esto no es corrección: es maestría. En 7 días vas a llevar tu presencia al punto donde se vuelve tu sello inconfundible.", retoPlus: "Nivel maestría: hoy no solo aplicas la práctica — obsérvate desde afuera. ¿Qué hace tu presencia en los demás cuando entras en ese estado?" },
    EJE: { encuadre: "Tu cuerpo ya lidera desde la calma. Esto es maestría: profundizar tu serenidad hasta que se vuelva el ancla que estabiliza a todo tu entorno, incluso en la tormenta.", retoPlus: "Nivel maestría: hoy transmite tu estado a otra persona. La regulación de un líder se contagia: pruébalo conscientemente." },
    PUENTE: { encuadre: "Tu cuerpo ya sostiene la firmeza sin romper vínculos. Esto es maestría: navegar las conversaciones más cargadas de tu vida manteniendo ese equilibrio intacto.", retoPlus: "Nivel maestría: busca hoy la conversación más difícil que has evitado y sostén firmeza + vínculo a la vez." },
    INALTERABLE: { encuadre: "Tu cuerpo ya resiste sin quemarse. Esto es maestría: sostener escalamientos prolongados sin sacrificar tu bienestar, y diseñar tu vida para que sea sostenible.", retoPlus: "Nivel maestría: hoy diseña tu protocolo personal de recuperación para tu disparador de carga más frecuente." }
  },

  RAMIFICACION: {
    intro: "Tu cuerpo ya domina un perfil avanzado. Este viaje te abre un segundo: vas a llevar tu maestría a un territorio nuevo.",
    plantilla: "Desde tu dominio como {actual}, vas a desarrollar las cualidades de {destino}. No partes de cero: partes de la excelencia."
  },

  BADGES: {
    dia1:   { icono: "◈", titulo: "Despertar",         cond: "Completas el Día 1" },
    dia3:   { icono: "≈", titulo: "Respiración",       cond: "Completas el Día 3" },
    dia4:   { icono: "△", titulo: "Preparación",       cond: "Completas el Día 4" },
    semana: { icono: "✦", titulo: "Semana Completa",   cond: "Completas los 7 días" },
    racha3: { icono: "✧", titulo: "3 Días Firmes",     cond: "Racha de 3 días" },
    racha7: { icono: "❖", titulo: "Constancia",        cond: "Racha de 7 días" },
    umbral: { icono: "⟡", titulo: "Cruzaste el Umbral", cond: "Terminas el plan" }
  }
};

