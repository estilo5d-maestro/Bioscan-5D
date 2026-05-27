/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   calcular-perfil.js — ALGORITMO PROTEGIDO (Netlify Function)
   ------------------------------------------------------------
   Corre en el SERVIDOR. El algoritmo jamas es visible al cliente.
   Esta es la proteccion de IP central del producto.

   v2: P2 ahora es multi-select (6 opciones). La cantidad de zonas
   de tension es un INPUT de scoring (mas tensiones = mayor carga
   somatica). P6 sigue single. Logica de Nivel Maestria incluida.
   ============================================================ */

/* ------------------------------------------------------------
   PESOS por eje. Indices corresponden a la opcion elegida.
   eje1=Presencia · eje2=Regulacion · eje3=Influencia · eje4=Consciencia
   ------------------------------------------------------------ */
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

/* P2 multi-select. Cada zona marcada resta a presencia/regulacion.
   Indices: 0=cuello/hombros 1=lumbar 2=mandibula 3=difusa 4=piernas/rodillas 5=ninguna */
const PESOS_P2 = [
  { eje1: -1, eje2: -1 },   // cuello/hombros/trapecios
  { eje1: -1, eje2: -1 },   // lumbar
  { eje1: -1, eje2: -2 },   // mandibula/cabeza
  { eje1: 0,  eje2: -1 },   // difusa
  { eje1: -1, eje2: -1 },   // piernas/rodillas
  { eje1: 2,  eje2: 1 }     // ninguna (suma)
];

const RANGOS = {
  eje1: { min: -10, max: 10 },
  eje2: { min: -11, max: 10 },
  eje3: { min: -7, max: 8 },
  eje4: { min: -10, max: 10 }
};

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

function normalizar(valor, min, max) {
  const n = ((valor - min) / (max - min)) * 10;
  return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
}

function calcularScores(respuestas, tensiones) {
  const bruto = { eje1: 0, eje2: 0, eje3: 0, eje4: 0 };

  // Preguntas single
  for (const pid in PESOS_SINGLE) {
    const idx = respuestas[pid];
    if (idx === undefined || idx === null) continue;
    const peso = PESOS_SINGLE[pid][idx];
    if (!peso) continue;
    for (const eje in peso) bruto[eje] += peso[eje];
  }

  // P2 multi-select: sumar el peso de cada tension marcada
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

function clasificarOrigen(s) {
  if (s.eje1 >= 6.5 && s.eje2 >= 6.5 && s.eje3 >= 6.5 && s.eje4 >= 6.5) return "HABITADO";
  if (s.eje4 <= 4 && s.eje4 <= s.eje1 && s.eje4 <= s.eje2 && s.eje4 <= s.eje3) return "NOMADA";
  if (s.eje2 <= 4.5 && (s.eje1 - s.eje2) >= 2) return "CENTINELA";
  if (s.eje1 <= 5.5 && s.eje3 <= 5.5) return "SOSTENEDOR";
  const ejes = [
    { v: s.eje1, perfil: "SOSTENEDOR" },
    { v: s.eje2, perfil: "CENTINELA" },
    { v: s.eje3, perfil: "SOSTENEDOR" },
    { v: s.eje4, perfil: "NOMADA" }
  ];
  ejes.sort((a, b) => a.v - b.v);
  return ejes[0].perfil;
}

function clasificarAvanzado(s) {
  const ejes = [
    { v: s.eje3, perfil: "MAGNETICO" },
    { v: s.eje2, perfil: "EJE" },
    { v: s.eje1, perfil: "INALTERABLE" },
    { v: s.eje4, perfil: "PUENTE" }
  ];
  ejes.sort((a, b) => b.v - a.v);
  return ejes[0].perfil;
}

function determinarDestino(retos, perfilActual) {
  if (!retos || retos.length === 0) return "MAGNETICO";
  const votos = {};
  retos.forEach((r) => {
    const d = MAPEO_RETOS[r];
    if (d) votos[d] = (votos[d] || 0) + 1;
  });
  let ordenados = Object.entries(votos).sort((a, b) => b[1] - a[1]);
  if (ordenados.length === 0) return "MAGNETICO";
  let destino = ordenados[0][0];
  if (destino === perfilActual && ordenados.length > 1) destino = ordenados[1][0];
  return destino;
}

function clasificarUsuario(respuestas, retos, tensiones) {
  const scores = calcularScores(respuestas, tensiones);
  const promedio = (scores.eje1 + scores.eje2 + scores.eje3 + scores.eje4) / 4;
  let r = { scores, promedio: Math.round(promedio * 10) / 10 };

  if (promedio < 6.5) {
    const actual = clasificarOrigen(scores);
    r.tipo = "ORIGEN";
    r.perfil_actual = actual;
    r.perfil_destino = determinarDestino(retos, actual);
    r.es_maestria = false;
  } else {
    const avanzado = clasificarAvanzado(scores);
    const destinoReto = determinarDestino(retos, avanzado);
    r.perfil_actual = avanzado;
    // Si su reto apunta al mismo perfil avanzado -> Nivel Maestria
    if (destinoReto === avanzado) {
      r.tipo = "MAESTRIA";
      r.perfil_destino = avanzado;
      r.es_maestria = true;
    } else {
      r.tipo = "AVANZADO";
      r.perfil_destino = destinoReto;
      r.es_maestria = false;
    }
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

