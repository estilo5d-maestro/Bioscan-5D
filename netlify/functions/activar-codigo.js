/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — netlify/functions/activar-codigo.js
   ------------------------------------------------------------
   Valida la activacion del modulo PRO 100% en el SERVIDOR.
   El cliente NUNCA lee la tabla compradores_pro directamente.
   Esto es el blindaje anti-pirateria: sin el email + codigo
   exactos del comprador, no hay acceso.

   Variables de entorno (Netlify):
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY   (service_role, bypassa RLS)

   Logica:
   1) email + codigo deben coincidir en compradores_pro
   2) compuerta de fecha: antes del Umbral -> bloqueado
   3) expiracion: > 30 dias desde activacion -> expirado
   4) primera activacion -> marca usado + fija expiracion (+30d)
   5) devuelve perfil (de su diagnostico) + dias completados
   ============================================================ */

const FECHA_UMBRAL = "2026-06-04T18:00:00-05:00"; // ⚠️ DEBE coincidir con FECHA_UMBRAL de /js/config.js
const DIAS_ACCESO = 30;

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

function sbHeaders(extra) {
  return Object.assign({
    "Content-Type": "application/json",
    "apikey": SB_KEY,
    "Authorization": `Bearer ${SB_KEY}`
  }, extra || {});
}

async function sbGet(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Supabase GET ${r.status}: ${await r.text()}`);
  return r.json();
}

async function sbPatch(path, body) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: sbHeaders({ "Prefer": "return=representation" }),
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Supabase PATCH ${r.status}: ${await r.text()}`);
  return r.json();
}

const enc = (v) => encodeURIComponent(v);

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "Método no permitido" }) };

  if (!SB_URL || !SB_KEY) {
    console.error("Faltan SUPABASE_URL / SUPABASE_SERVICE_KEY");
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "config" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = (body.email || "").toLowerCase().trim();
    const codigo = (body.codigo || "").toUpperCase().trim();
    const dispositivo = (body.dispositivo || "").substring(0, 120);

    if (!email || !codigo) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "faltan-datos" }) };
    }

    // 1) Buscar la compra que coincida email + codigo
    const filas = await sbGet(
      `compradores_pro?email=eq.${enc(email)}&codigo=eq.${enc(codigo)}&select=*`
    );
    if (!filas || filas.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "no-coincide" }) };
    }
    const compra = filas[0];

    // 2) Compuerta de fecha del Umbral
    const ahora = new Date();
    if (ahora < new Date(FECHA_UMBRAL)) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "antes-de-fecha", fecha: FECHA_UMBRAL }) };
    }

    // 3) Primera activacion -> fijar expiracion. Si ya estaba activo, usar la existente.
    let expira = compra.fecha_expiracion ? new Date(compra.fecha_expiracion) : null;
    if (!compra.codigo_usado || !expira) {
      expira = new Date(ahora.getTime() + DIAS_ACCESO * 86400000);
      await sbPatch(`compradores_pro?codigo=eq.${enc(codigo)}`, {
        codigo_usado: true,
        fecha_activacion: ahora.toISOString(),
        fecha_expiracion: expira.toISOString(),
        dispositivo: dispositivo
      });
    }

    // 4) Expiracion (acceso de 30 dias)
    if (ahora > expira) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "expirado", expiraAt: expira.toISOString() }) };
    }

    // 5) Perfil del comprador. PRIORIDAD: el CONGELADO en compradores_pro (coherencia).
    //    Solo si la compra es vieja (sin congelar), se cae al último diagnóstico.
    let perfil = { perfilActual: null, perfilDestino: null, esMaestria: false, scoresDia0: null, nombre: compra.nombre || "" };

    if (compra.perfil_actual && compra.perfil_destino) {
      // Perfil congelado al comprar — la verdad inmutable del comprador
      perfil.perfilActual = compra.perfil_actual;
      perfil.perfilDestino = compra.perfil_destino;
      perfil.esMaestria = !!compra.es_maestria;
      if (compra.score_eje1 != null) {
        perfil.scoresDia0 = { eje1: compra.score_eje1, eje2: compra.score_eje2, eje3: compra.score_eje3, eje4: compra.score_eje4 };
      }
    }

    // Fallback: compra vieja sin perfil congelado → leer del diagnóstico
    if (!perfil.perfilActual || !perfil.scoresDia0) {
      try {
        const users = await sbGet(`users?email=eq.${enc(email)}&select=id,nombre&limit=1`);
        if (users && users.length) {
          if (!perfil.nombre) perfil.nombre = users[0].nombre || "";
          const diag = await sbGet(
            `diagnosticos?user_id=eq.${enc(users[0].id)}&select=perfil_actual,perfil_destino,es_maestria,score_eje1,score_eje2,score_eje3,score_eje4&order=completado_at.desc&limit=1`
          );
          if (diag && diag.length) {
            const d = diag[0];
            if (!perfil.perfilActual) { perfil.perfilActual = d.perfil_actual; perfil.perfilDestino = d.perfil_destino; perfil.esMaestria = !!d.es_maestria; }
            if (!perfil.scoresDia0) perfil.scoresDia0 = { eje1: d.score_eje1, eje2: d.score_eje2, eje3: d.score_eje3, eje4: d.score_eje4 };
          }
        }
      } catch (e) {
        console.warn("No se pudo recuperar diagnostico (fallback):", e.message);
      }
    }

    // 6) Recuperar dias ya completados
    let progreso = [];
    try {
      progreso = await sbGet(`progreso_plan?codigo=eq.${enc(codigo)}&select=dia_numero,tiny_completado,core_completado,reto_completado,scores_dia,fecha_completado&order=dia_numero.asc`);
    } catch (e) { console.warn("Sin progreso aun:", e.message); }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        nombre: perfil.nombre,
        perfilActual: perfil.perfilActual,
        perfilDestino: perfil.perfilDestino,
        esMaestria: perfil.esMaestria,
        scoresDia0: perfil.scoresDia0,
        expiraAt: expira.toISOString(),
        progreso: progreso || []
      })
    };
  } catch (err) {
    console.error("activar-codigo error:", err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "error", detalle: err.message }) };
  }
};


