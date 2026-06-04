/* ============================================================
   BIOSCAN 5D · netlify/functions/estado-diagnostico.js
   ------------------------------------------------------------
   Dado un email, devuelve el estado para controlar repeticiones:
   - cuantos diagnósticos tiene (para el límite de la Regla 3)
   - si ya es comprador (para la Regla 2: ocultar repetir)

   Server-side con service key.
   Devuelve: { ok, diagnosticos, esComprador, limite, puedeRepetir }
   ============================================================ */

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const LIMITE_DIAGNOSTICOS = 2; // original + 1 repetición

function sbHeaders(extra) {
  return Object.assign({ "Content-Type": "application/json", "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }, extra || {});
}
async function sbGet(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Supabase GET ${r.status}: ${await r.text()}`);
  return r.json();
}
// Cuenta filas trayendo solo los ids (simple y robusto; sin header Range que puede fallar)
async function sbContar(path) {
  try {
    const filas = await sbGet(path);
    return Array.isArray(filas) ? filas.length : 0;
  } catch (e) {
    console.warn("sbContar:", e.message);
    return 0;
  }
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
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ ok: false }) };

  if (!SB_URL || !SB_KEY) {
    // Sin config: no bloquear el diagnóstico, devolver permisivo
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "config", puedeRepetir: true, esComprador: false }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = (body.email || "").toLowerCase().trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "email-invalido", puedeRepetir: true, esComprador: false }) };
    }

    // 1) ¿Es comprador? (Regla 2)
    let esComprador = false;
    try {
      const comp = await sbGet(`compradores_pro?email=eq.${enc(email)}&select=email&limit=1`);
      esComprador = !!(comp && comp.length);
    } catch (e) { console.warn("check comprador:", e.message); }

    // 2) ¿Cuántos diagnósticos tiene? (Regla 3)
    let diagnosticos = 0;
    try {
      const users = await sbGet(`users?email=eq.${enc(email)}&select=id&limit=1`);
      if (users && users.length) {
        diagnosticos = await sbContar(`diagnosticos?user_id=eq.${enc(users[0].id)}&select=id`);
      }
    } catch (e) { console.warn("count diagnosticos:", e.message); }

    // Puede repetir si NO es comprador Y no ha llegado al límite
    const puedeRepetir = !esComprador && diagnosticos < LIMITE_DIAGNOSTICOS;

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true,
        diagnosticos: diagnosticos,
        esComprador: esComprador,
        limite: LIMITE_DIAGNOSTICOS,
        puedeRepetir: puedeRepetir
      })
    };
  } catch (err) {
    console.error("estado-diagnostico error:", err);
    // En error, permisivo (no bloquear al usuario legítimo)
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "error", puedeRepetir: true, esComprador: false }) };
  }
};

