/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   calcular-perfil.js — ALGORITMO PROTEGIDO (Netlify Function)
   ------------------------------------------------------------
   Corre en el SERVIDOR. El algoritmo jamas es visible al cliente.
   Esta es la proteccion de IP central del producto.

   v3 (CLASIFICACION QUIRURGICA):
   - Origen vs Avanzado: por promedio Y consistencia (ningun eje
     colapsado). Marco transteorico (Prochaska & DiClemente).
   - Perfil avanzado: la P12 (reto) define la EXPRESION de
     excelencia (principio de especificidad). La firma de ejes
     valida y desempata (validez de constructo).
   - Maestria: cuando el reto pertenece al MISMO perfil que la
     forma del cuerpo ya domina -> profundizacion, no se mueve.
   - Origen: la P12 define el destino (hacia donde transformar).
   v2 mantiene: P2 multi-select como carga somatica.
   ============================================================ */

const PESOS_SINGLE = {
  p1: [
    { eje1: -2, eje4: 1 }, { eje1: -1, eje4: 0 }, { eje1: 0, eje4: -2 },
    { eje1: 1, eje4: 1 }, { eje1: 2, eje4: 2 }
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

const PESOS_P2 = [
  { eje1: -1, eje2: -1 },
  { eje1: -1, eje2: -1 },
  { eje1: -1, eje2: -2 },
  { eje1: 0,  eje2: -1 },
  { eje1: -1, eje2: -1 },
  { eje1: 2,  eje2: 1 }
];

const RANGOS = {
  eje1: { min: -10, max: 10 },
  eje2: { min: -11, max: 10 },
  eje3: { min: -7, max: 8 },
  eje4: { min: -10, max: 10 }
};

/* Mapa reto -> perfil avanzado (los 4 destinos son los 4 avanzados) */
const MAPEO_RETOS = {
  entrevista_negociacion: "PUENTE",
  presentacion_publica:   "MAGNETICO",
  conversacion_dificil:   "PUENTE",
  liderazgo_equipo:       "EJE",
  conversacion_personal:  "PUENTE",
  decisiones_complejas:   "EJE",
  alta_exigencia:         "INALTERABLE",
  crecimiento_general:    "MAGNETICO"
};

/* Firma de ejes por perfil avanzado (validez de constructo).
   Promedio de los 2 ejes que definen cada perfil segun Informe Maestro. */
const FIRMA_AVANZADO = {
  MAGNETICO:   (s) => (s.eje1 + s.eje3) / 2,   // presencia + influencia
  EJE:         (s) => (s.eje2 + s.eje4) / 2,   // regulacion + consciencia
  PUENTE:      (s) => (s.eje3 + s.eje2) / 2,   // influencia + regulacion (relacional)
  INALTERABLE: (s) => (s.eje2 + s.eje1) / 2    // regulacion + presencia sostenida
};

const UMBRAL_AVANZADO = 7.2;   // promedio para considerar dominio (avanzado)
const PISO_CONSISTENCIA = 6.5; // ningun eje por debajo de esto en avanzado
const UMBRAL_MAESTRIA = 8.5;   // firma del perfil para hablar de maestria plena

function normalizar(valor, min, max) {
  const n = ((valor - min) / (max - min)) * 10;
  return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
}

function calcularScores(respuestas, tensiones) {
  const bruto = { eje1: 0, eje2: 0, eje3: 0, eje4: 0 };
  for (const pid in PESOS_SINGLE) {
    const idx = respuestas[pid];
    if (idx === undefined || idx === null) continue;
    const peso = PESOS_SINGLE[pid][idx];
    if (!peso) continue;
    for (const eje in peso) bruto[eje] += peso[eje];
  }
  if (Array.isArray(tensiones)) {
    tensiones.forEach((i) => {
      const peso = PESOS_P2[i];
      if (peso) for (const eje in peso) bruto[eje] += peso[eje];
    });
  }
  return {
    eje1: normalizar(bruto.eje1, RANGOS.eje1.min, RANGOS.eje1.max),
    eje2: normalizar(bruto.eje2, RANGOS.eje2.min, RANGOS.eje2.max),
    eje3: normalizar(bruto.eje3, RANGOS.eje3.min, RANGOS.eje3.max),
    eje4: normalizar(bruto.eje4, RANGOS.eje4.min, RANGOS.eje4.max)
  };
}

/* ¿El cuerpo esta en DOMINIO (avanzado) o en CONSTRUCCION (origen)? 
   Criterio doble: promedio alto Y sin ejes colapsados (consistencia). */
function esAvanzado(s) {
  const prom = (s.eje1 + s.eje2 + s.eje3 + s.eje4) / 4;
  const minEje = Math.min(s.eje1, s.eje2, s.eje3, s.eje4);
  return prom >= UMBRAL_AVANZADO && minEje >= PISO_CONSISTENCIA;
}

function clasificarOrigen(s) {
  // HABITADO: base solida pero aun no dominio pleno
  if (s.eje1 >= 6 && s.eje2 >= 6 && s.eje3 >= 6 && s.eje4 >= 6) return "HABITADO";
  // NOMADA: consciencia es el eje mas debil y esta baja
  if (s.eje4 <= 4.5 && s.eje4 <= s.eje1 && s.eje4 <= s.eje2 && s.eje4 <= s.eje3) return "NOMADA";
  // CENTINELA: regulacion baja con presencia notablemente mayor (cuerpo rigido en alerta)
  if (s.eje2 <= 4.5 && (s.eje1 - s.eje2) >= 1.5) return "CENTINELA";
  // SOSTENEDOR: presencia e influencia bajas (cuerpo que se hace pequeno)
  if (s.eje1 <= 5.5 && s.eje3 <= 5.5) return "SOSTENEDOR";
  // Desempate por eje mas debil
  const ejes = [
    { v: s.eje1, perfil: "SOSTENEDOR" },
    { v: s.eje2, perfil: "CENTINELA" },
    { v: s.eje3, perfil: "SOSTENEDOR" },
    { v: s.eje4, perfil: "NOMADA" }
  ];
  ejes.sort((a, b) => a.v - b.v);
  return ejes[0].perfil;
}

/* Perfil avanzado ACTUAL = la FORMA del cuerpo (firma de ejes dominante).
   Quien eres AHORA lo dice tu cuerpo, no tu intencion. La P12 define el
   destino por separado (puede coincidir = profundizacion, o diferir = ramificacion). */
function clasificarAvanzado(s) {
  return mejorPorFirma(s);
}

function mejorPorFirma(s) {
  return Object.keys(FIRMA_AVANZADO)
    .sort((a, b) => FIRMA_AVANZADO[b](s) - FIRMA_AVANZADO[a](s))[0];
}

/* Ranking de perfiles avanzados segun los retos elegidos (P12).
   Devuelve [{perfil, votos}] ordenado desc. En caso de empate de votos,
   no rompe el orden aqui (se maneja arriba). */
function rankingRetos(retos) {
  const votos = {};
  (retos || []).forEach((r) => {
    const p = MAPEO_RETOS[r];
    if (p) votos[p] = (votos[p] || 0) + 1;
  });
  return Object.entries(votos)
    .map(([perfil, v]) => ({ perfil, votos: v }))
    .sort((a, b) => b.votos - a.votos);
}

/* Destino para perfiles de ORIGEN: la P12 define hacia donde transformar. */
function determinarDestinoOrigen(retos) {
  if (!retos || retos.length === 0) return "MAGNETICO";
  const votos = {};
  retos.forEach((r) => {
    const d = MAPEO_RETOS[r];
    if (d) votos[d] = (votos[d] || 0) + 1;
  });
  const ordenados = Object.entries(votos).sort((a, b) => b[1] - a[1]);
  return ordenados.length ? ordenados[0][0] : "MAGNETICO";
}

function clasificarUsuario(respuestas, retos, tensiones) {
  const scores = calcularScores(respuestas, tensiones);
  const promedio = (scores.eje1 + scores.eje2 + scores.eje3 + scores.eje4) / 4;
  let r = { scores, promedio: Math.round(promedio * 10) / 10 };

  if (!esAvanzado(scores)) {
    // ----- CUERPO EN CONSTRUCCION: perfil de ORIGEN -----
    const actual = clasificarOrigen(scores);
    r.tipo = "ORIGEN";
    r.perfil_actual = actual;
    r.perfil_destino = determinarDestinoOrigen(retos);
    r.es_maestria = false;
  } else {
    // ----- CUERPO EN DOMINIO: perfil AVANZADO -----
    // Cuando los 4 ejes son altos, la FORMA ya no discrimina (todos excelentes).
    // La senal mas confiable de COMO se expresa esa excelencia hoy es el RETO (P12).
    // - 1 reto (o varios del mismo perfil): ese es tu perfil actual -> PROFUNDIZACION/MAESTRIA.
    // - 2 retos de perfiles distintos: el dominante es tu perfil actual; el
    //   secundario es la RAMIFICACION (cross-development).
    const ranking = rankingRetos(retos); // [{perfil, votos}], orden desc
    let actual, destino, tipo, maestria = false;

    if (ranking.length === 0) {
      // Sin reto util: desempata la firma de ejes
      actual = mejorPorFirma(scores);
      destino = actual;
      tipo = "PROFUNDIZACION";
    } else if (ranking.length === 1) {
      // Un solo perfil en sus retos: profundiza en el
      actual = ranking[0].perfil;
      destino = actual;
      tipo = "PROFUNDIZACION";
    } else {
      // Varios perfiles en sus retos: actual = dominante, ramifica al segundo
      actual = ranking[0].perfil;
      destino = ranking[1].perfil;
      tipo = "RAMIFICACION";
    }

    // Maestria plena: cuando profundiza en su perfil Y su firma es muy alta
    const firmaPropia = FIRMA_AVANZADO[actual](scores);
    if (tipo === "PROFUNDIZACION" && firmaPropia >= UMBRAL_MAESTRIA) {
      tipo = "MAESTRIA";
      maestria = true;
    }

    r.perfil_actual = actual;
    r.perfil_destino = destino;
    r.tipo = tipo;
    r.es_maestria = maestria;
  }
  return r;
}

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Metodo no permitido" }) };
  try {
    const body = JSON.parse(event.body || "{}");
    const { respuestas, retos, tensiones } = body;
    if (!respuestas) return { statusCode: 400, headers, body: JSON.stringify({ error: "Faltan respuestas" }) };
    const resultado = clasificarUsuario(respuestas, retos || [], tensiones || []);
    return { statusCode: 200, headers, body: JSON.stringify(resultado) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Error al calcular el perfil", detalle: err.message }) };
  }
};



