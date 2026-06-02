/* ============================================================
   BIOSCAN 5D · netlify/functions/obtener-codigo.js
   ------------------------------------------------------------
   Dado un email de comprador, devuelve su código de activación
   (generado por el webhook de Hotmart) + su perfil de diagnóstico.
   Sirve para la PÁGINA DE GRACIAS: activación con un clic, sin
   que la persona copie nada.

   Server-side con service key (mismo patrón blindado).
   Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_KEY

   Devuelve: { ok, encontrado, codigo, nombre, perfil_actual,
               perfil_destino } o { ok, encontrado:false }
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
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "config" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = (body.email || "").toLowerCase().trim();
    const transaction = (body.transaction || "").trim();

    // Debe venir al menos uno de los dos identificadores
    if (!email && !transaction) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "faltan-datos" }) };
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, reason: "email-invalido" }) };
    }

    // 1) Buscar la compra: por transaction (viene de Hotmart) O por email (viene del correo)
    let filtro;
    if (transaction) filtro = `hotmart_transaction=eq.${enc(transaction)}`;
    else filtro = `email=eq.${enc(email)}`;
    const compras = await sbGet(
      `compradores_pro?${filtro}&select=codigo,nombre,email,perfil_actual,perfil_destino,es_maestria,fecha_compra&order=fecha_compra.desc&limit=1`
    );
    if (!compras || compras.length === 0) {
      // Aún no hay código (el webhook puede tardar unos segundos)
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, encontrado: false }) };
    }
    const compra = compras[0];

    // 2) El perfil CONGELADO vive en la propia compra (Regla 1: coherencia).
    //    Si por alguna razón no se congeló (compra vieja), caer al diagnóstico.
    let perfil_actual = compra.perfil_actual || null;
    let perfil_destino = compra.perfil_destino || null;
    let nombre = compra.nombre || "";
    const emailReal = compra.email || email;

    if (!perfil_actual || !perfil_destino) {
      try {
        const users = await sbGet(`users?email=eq.${enc(emailReal)}&select=id,nombre&limit=1`);
        if (users && users.length) {
          if (!nombre) nombre = users[0].nombre || "";
          const diag = await sbGet(
            `diagnosticos?user_id=eq.${enc(users[0].id)}&select=perfil_actual,perfil_destino&order=completado_at.desc&limit=1`
          );
          if (diag && diag.length) {
            perfil_actual = diag[0].perfil_actual;
            perfil_destino = diag[0].perfil_destino;
          }
        }
      } catch (e) { console.warn("perfil no recuperado:", e.message); }
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        ok: true, encontrado: true,
        codigo: compra.codigo,
        nombre: nombre,
        email: emailReal,
        perfil_actual: perfil_actual,
        perfil_destino: perfil_destino
      })
    };
  } catch (err) {
    console.error("obtener-codigo error:", err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "error", detalle: err.message }) };
  }
};


