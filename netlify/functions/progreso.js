/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — netlify/functions/progreso.js
   ------------------------------------------------------------
   Carga y guarda el progreso del plan. Server-side con service
   key: el cliente nunca toca la tabla. Cada operacion exige que
   email + codigo coincidan con una compra valida (auth simple).

   Variables de entorno (Netlify):
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY

   Body:
   { action: "cargar", email, codigo }
   { action: "guardar", email, codigo, dia, tiny, core, reto, journal, scores }
   ============================================================ */

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
async function sbUpsert(table, row, onConflict) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: sbHeaders({ "Prefer": "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`Supabase UPSERT ${r.status}: ${await r.text()}`);
  return r.json();
}
const enc = (v) => encodeURIComponent(v);

async function validarAcceso(email, codigo) {
  const filas = await sbGet(`compradores_pro?email=eq.${enc(email)}&codigo=eq.${enc(codigo)}&select=email,fecha_expiracion`);
  if (!filas || filas.length === 0) return { ok: false };
  const compra = filas[0];
  if (compra.fecha_expiracion && new Date() > new Date(compra.fecha_expiracion)) return { ok: false, expirado: true };
  return { ok: true };
}

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ ok: false }) };
  if (!SB_URL || !SB_KEY) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "config" }) };

  try {
    const b = JSON.parse(event.body || "{}");
    const email = (b.email || "").toLowerCase().trim();
    const codigo = (b.codigo || "").toUpperCase().trim();
    if (!email || !codigo) return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "faltan-datos" }) };

    const acceso = await validarAcceso(email, codigo);
    if (!acceso.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: acceso.expirado ? "expirado" : "no-coincide" }) };

    if (b.action === "cargar") {
      const rows = await sbGet(`progreso_plan?codigo=eq.${enc(codigo)}&select=*&order=dia_numero.asc`);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, progreso: rows || [] }) };
    }

    if (b.action === "guardar") {
      const dia = parseInt(b.dia, 10);
      if (!dia || dia < 1 || dia > 30) return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "dia-invalido" }) };
      const row = {
        codigo,
        email,
        dia_numero: dia,
        tiny_completado: !!b.tiny,
        core_completado: !!b.core,
        reto_completado: !!b.reto,
        journal: b.journal || null,
        scores_dia: b.scores || null,
        fecha_completado: new Date().toISOString()
      };
      const saved = await sbUpsert("progreso_plan", row, "codigo,dia_numero");
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, fila: saved && saved[0] }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "accion-invalida" }) };
  } catch (err) {
    console.error("progreso error:", err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "error", detalle: err.message }) };
  }
};

