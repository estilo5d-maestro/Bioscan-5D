/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   calcular-perfil.js — ALGORITMO PROTEGIDO (Netlify Function)
   ------------------------------------------------------------
   Este código corre en el SERVIDOR de Netlify, NUNCA en el
   navegador del usuario. El algoritmo de clasificacion jamas
   es visible para nadie. Esta es la proteccion de IP central.

   El frontend envia las respuestas crudas; esta funcion calcula
   los scores, clasifica el perfil y devuelve solo el resultado.
   ============================================================ */

/* ------------------------------------------------------------
   PESOS DE CADA RESPUESTA POR EJE
   Replica de los puntajes de data.js, pero en el servidor.
   Estructura: { idPregunta: [ {eje1,eje2,eje3,eje4}, ... ] }
   El indice del array corresponde al indice de la opcion elegida.
   ------------------------------------------------------------ */
const PESOS = {
  p1: [
    { eje1: -2, eje4: 1 }, { eje1: -1, eje4: 0 }, { eje1: 0, eje4: -2 },
    { eje1: 1, eje4: 1 }, { eje1: 2, eje4: 2 }
  ],
  p2: [
    { eje1: -1, eje2: -1 }, { eje1: 0, eje2: -1 }, { eje1: -1, eje2: -2 },
    { eje1: 0, eje2: 0 }, { eje1: 2, eje2: 1 }
  ],
  p3: [
    { eje1: -2, eje2: -2, eje4: 0 }, { eje1: -1, eje2: -1, eje4: 1 },
    { eje1: 0, eje2: 0, eje4: 1 }, { eje1: 1, eje2: 1, eje4: 2 },
    { eje1: 2, eje2: 2, eje4: 2 }
  ],
  p4: [
    { eje2: -2, eje1: -1 }, { eje2: -1, eje1: 0 }, { eje2: -2, eje1: 0 },
    { eje2: 2, eje1: 1 }, { eje2: -1, eje1: 0 }
  ],
  p5: [
    { eje2: -2, eje3: -2 }, { eje2: -1, eje3: -1 }, { eje2: -1, eje3: 0 },
    { eje2: 1, eje3: 1 }, { eje2: 2, eje3: 2 }
  ],
  p6: [
    { eje2: -2, eje4: 0 }, { eje2: -2, eje4: -1 }, { eje2: -1, eje4: -2 },
    { eje2: 2, eje4: 2 }, { eje2: 1, eje4: 2 }
  ],
  p7: [
    { eje3: -2 }, { eje3: -2 }, { eje3: -1 }, { eje3: 2 }, { eje3: 0 }
  ],
  p8: [
    { eje3: -1, eje1: -1 }, { eje3: 0, eje1: 0 }, { eje3: -2, eje1: 0 },
    { eje3: 2, eje1: 2 }, { eje3: 0, eje1: -1 }
  ],
  p9: [
    { eje3: -2, eje2: -1 }, { eje3: 0, eje2: -1 }, { eje3: -1, eje2: -2 },
    { eje3: 2, eje2: 2 }, { eje3: 1, eje2: 1 }
  ],
  p10: [
    { eje4: -2 }, { eje4: -1 }, { eje4: 0 }, { eje4: 1 }, { eje4: 2 }
  ],
  p11: [
    { eje4: -2 }, { eje4: -1 }, { eje4: 0 }, { eje4: 1 }, { eje4: 2 }
  ]
};

/* Rangos brutos teoricos por eje (min, max) para normalizar a 0-10 */
const RANGOS = {
  eje1: { min: -8, max: 9 },
  eje2: { min: -9, max: 9 },
  eje3: { min: -7, max: 8 },
  eje4: { min: -10, max: 10 }
};

/* Mapeo de retos (P12) a perfil destino */
const MAPEO_RETOS = {
  entrevista_negociacion: "DIPLOMATICO_O_PUENTE",
  presentacion_publica:   "MAGNETICO",
  conversacion_dificil:   "PUENTE",
  liderazgo_equipo:       "EJE",
  conversacion_personal:  "PUENTE",
  decisiones_complejas:   "EJE",
  alta_exigencia:         "INALTERABLE",
  crecimiento_general:    "MAGNETICO"
};

/* ------------------------------------------------------------
   Normalizar un valor bruto a escala 0-10
   ------------------------------------------------------------ */
function normalizar(valor, min, max) {
  const n = ((valor - min) / (max - min)) * 10;
  return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
}

/* ------------------------------------------------------------
   Calcular scores 0-10 a partir de las respuestas
   respuestas = { p1: indiceOpcion, p2: indiceOpcion, ... }
   ------------------------------------------------------------ */
function calcularScores(respuestas) {
  const bruto = { eje1: 0, eje2: 0, eje3: 0, eje4: 0 };

  for (const pid in PESOS) {
    const idx = respuestas[pid];
    if (idx === undefined || idx === null) continue;
    const peso = PESOS[pid][idx];
    if (!peso) continue;
    for (const eje in peso) {
      bruto[eje] += peso[eje];
    }
  }

  return {
    eje1: normalizar(bruto.eje1, RANGOS.eje1.min, RANGOS.eje1.max),
    eje2: normalizar(bruto.eje2, RANGOS.eje2.min, RANGOS.eje2.max),
    eje3: normalizar(bruto.eje3, RANGOS.eje3.min, RANGOS.eje3.max),
    eje4: normalizar(bruto.eje4, RANGOS.eje4.min, RANGOS.eje4.max)
  };
}

/* ------------------------------------------------------------
   Clasificar perfil ORIGEN (cuando promedio < 6.5)
   ------------------------------------------------------------ */
function clasificarOrigen(s) {
  // Habitado: todos los ejes razonablemente altos
  if (s.eje1 >= 6.5 && s.eje2 >= 6.5 && s.eje3 >= 6.5 && s.eje4 >= 6.5) return "HABITADO";

  // Nomada: consciencia es el punto mas debil y notablemente bajo
  if (s.eje4 <= 4 && s.eje4 <= s.eje1 && s.eje4 <= s.eje2 && s.eje4 <= s.eje3) return "NOMADA";

  // Centinela: regulacion baja PERO presencia sostenida (cuerpo tenso que mantiene forma)
  // El patron clave es la BRECHA: presencia notablemente mayor que regulacion
  if (s.eje2 <= 4.5 && (s.eje1 - s.eje2) >= 2) return "CENTINELA";

  // Sostenedor: presencia e influencia bajas (colapso + invisibilidad)
  if (s.eje1 <= 5.5 && s.eje3 <= 5.5) return "SOSTENEDOR";

  // Caso intermedio: clasifica por el eje mas debil
  const ejes = [
    { v: s.eje1, perfil: "SOSTENEDOR" },
    { v: s.eje2, perfil: "CENTINELA" },
    { v: s.eje3, perfil: "SOSTENEDOR" },
    { v: s.eje4, perfil: "NOMADA" }
  ];
  ejes.sort((a, b) => a.v - b.v);
  return ejes[0].perfil;
}

/* ------------------------------------------------------------
   Clasificar perfil AVANZADO (cuando promedio >= 6.5)
   Se diferencia por el eje dominante.
   ------------------------------------------------------------ */
function clasificarAvanzado(s) {
  // El eje mas alto define la naturaleza del perfil avanzado
  const ejes = [
    { v: s.eje3, perfil: "MAGNETICO" },   // influencia dominante
    { v: s.eje2, perfil: "EJE" },         // regulacion dominante
    { v: s.eje1, perfil: "INALTERABLE" }, // presencia/resistencia dominante
    { v: s.eje4, perfil: "PUENTE" }       // consciencia dominante
  ];
  ejes.sort((a, b) => b.v - a.v);
  return ejes[0].perfil;
}

/* ------------------------------------------------------------
   Determinar perfil destino segun retos (P12)
   ------------------------------------------------------------ */
function determinarDestino(retos, perfilActual) {
  if (!retos || retos.length === 0) return "MAGNETICO";

  const votos = {};
  retos.forEach((r) => {
    let destino = MAPEO_RETOS[r];
    if (destino === "DIPLOMATICO_O_PUENTE") destino = "PUENTE";
    if (destino) votos[destino] = (votos[destino] || 0) + 1;
  });

  // Si el destino coincide con el perfil actual avanzado, elegimos otro
  let ordenados = Object.entries(votos).sort((a, b) => b[1] - a[1]);
  if (ordenados.length === 0) return "MAGNETICO";

  let destino = ordenados[0][0];
  if (destino === perfilActual && ordenados.length > 1) {
    destino = ordenados[1][0];
  }
  return destino;
}

/* ------------------------------------------------------------
   Clasificacion completa del usuario
   ------------------------------------------------------------ */
function clasificarUsuario(respuestas, retos) {
  const scores = calcularScores(respuestas);
  const promedio = (scores.eje1 + scores.eje2 + scores.eje3 + scores.eje4) / 4;

  let resultado = { scores, promedio: Math.round(promedio * 10) / 10 };

  if (promedio < 6.5) {
    // RAMA ORIGEN
    const perfilActual = clasificarOrigen(scores);
    resultado.tipo = "ORIGEN";
    resultado.perfil_actual = perfilActual;
    resultado.perfil_destino = determinarDestino(retos, perfilActual);
    resultado.necesita_plus = false;
  } else {
    // RAMA AVANZADO
    const perfilAvanzado = clasificarAvanzado(scores);
    const todosAltos = scores.eje1 >= 7.5 && scores.eje2 >= 7.5 &&
                       scores.eje3 >= 7.5 && scores.eje4 >= 7.5;

    resultado.perfil_actual = perfilAvanzado;
    if (todosAltos) {
      resultado.tipo = "AVANZADO_PLUS";
      resultado.perfil_destino = perfilAvanzado + "_PLUS";
      resultado.ramificacion = determinarDestino(retos, perfilAvanzado);
      resultado.necesita_plus = true;
    } else {
      resultado.tipo = "AVANZADO_BASE";
      resultado.perfil_destino = perfilAvanzado + "_PLUS";
      resultado.ramificacion = null;
      resultado.necesita_plus = false;
    }
  }

  return resultado;
}

/* ------------------------------------------------------------
   HANDLER de la Netlify Function
   ------------------------------------------------------------ */
exports.handler = async function (event) {
  // CORS basico
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Metodo no permitido" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { respuestas, retos } = body;

    if (!respuestas) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Faltan respuestas" }) };
    }

    const resultado = clasificarUsuario(respuestas, retos || []);

    return { statusCode: 200, headers, body: JSON.stringify(resultado) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Error al calcular el perfil", detalle: err.message })
    };
  }
};
