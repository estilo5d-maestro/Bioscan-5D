/* ============================================================
   BIOSCAN 5D · netlify/functions/recuperar-diagnostico.js
   ------------------------------------------------------------
   Recupera el ULTIMO diagnostico de una persona por su email,
   para la "pantalla de retorno" (ya hice mi BioScan -> ver resultado).
   Server-side con service key (mismo patron que activar-codigo).

   Variables de entorno (Netlify):
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY

   Devuelve: { ok, existe, nombre, perfil_actual, perfil_destino,
               es_maestria, scores } o { ok, existe:false }
   ============================================================ */

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

function sbHeaders() {
  return { "Content-Type": "application/json", "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` };
}
async function sbGet(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders() });
  if (!r.ok) throw new Error(`Supabase GET ${r.status}: ${await r.text()}`);
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "email-invalido" }) };
    }

    // 1) Buscar el usuario por email
    const users = await sbGet(`users?email=eq.${enc(email)}&select=id,nombre&limit=1`);
    if (!users || users.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, existe: false }) };
    }
    const user = users[0];

    // 2) Buscar su ULTIMO diagnostico
    const diag = await sbGet(
      `diagnosticos?user_id=eq.${enc(user.id)}&select=perfil_actual,perfil_destino,es_maestria,score_eje1,score_eje2,score_eje3,score_eje4,completado_at&order=completado_at.desc&limit=1`
    );
    if (!diag || diag.length === 0) {
      // El usuario existe pero no completo diagnostico
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, existe: false, nombre: user.nombre || "" }) };
    }
    const d = diag[0];

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true, existe: true,
        nombre: user.nombre || "",
        perfil_actual: d.perfil_actual,
        perfil_destino: d.perfil_destino,
        es_maestria: !!d.es_maestria,
        scores: { eje1: d.score_eje1, eje2: d.score_eje2, eje3: d.score_eje3, eje4: d.score_eje4 }
      })
    };
  } catch (err) {
    console.error("recuperar-diagnostico error:", err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "error", detalle: err.message }) };
  }
};

