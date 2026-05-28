/* ============================================================
   BIOSCAN 5D · Sub-mensaje 2.3
   enviar-rdstation.js — Netlify Function
   ------------------------------------------------------------
   Envia conversiones a RD Station API v1.3 (Conversions API).
   El token vive en process.env.RD_STATION_TOKEN (variable de
   entorno del servidor, NUNCA en el cliente).

   Llamada desde supabase-client.js → notificarRDStation()
   ============================================================ */

const RD_ENDPOINT = "https://www.rdstation.com.br/api/1.3/conversions";

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método no permitido" }) };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { identificador, email, name, tags } = data;

    if (!identificador || !email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Faltan identificador o email" }) };
    }

    const token = process.env.RD_STATION_TOKEN;
    if (!token) {
      console.error("RD_STATION_TOKEN no configurado en variables de entorno");
      // No reventar la experiencia del usuario si falta el token; loggear y seguir
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "token-missing" }) };
    }

    // Construir payload: campos base + cualquier cf_* que venga del cliente
    const payload = {
      token_rdstation: token,
      identificador,
      email: email.toLowerCase().trim()
    };
    if (name) payload.name = name;
    if (tags) payload.tags = tags;
    // Campos personalizados (cf_perfil_actual, cf_perfil_destino, cf_codigo_bioscan, cf_link_pdf)
    Object.keys(data).forEach(k => {
      if (k.startsWith("cf_") && data[k] !== undefined && data[k] !== null && data[k] !== "") {
        payload[k] = data[k];
      }
    });

    const r = await fetch(RD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const txt = await r.text();
    if (!r.ok) {
      console.error("RD Station devolvió error:", r.status, txt);
      // Aun con error, devolver 200 al cliente para no romper la UX
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, rdStatus: r.status, detalle: txt.substring(0, 200) }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("enviar-rdstation error:", err);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};

