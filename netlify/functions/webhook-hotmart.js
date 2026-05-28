/* ============================================================
   BIOSCAN 5D · Sub-mensaje 2.3
   webhook-hotmart.js — Netlify Function
   ------------------------------------------------------------
   Recibe el webhook de Hotmart cuando hay una "compra aprobada"
   del producto BioScan 5D Pro. Genera codigo unico intransferible,
   lo guarda en compradores_pro y notifica a RD Station.

   Variables de entorno necesarias (Netlify Dashboard):
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY  (NO la anon, necesita bypassar RLS)
   - RD_STATION_TOKEN
   - HOTMART_HOTTOK  (opcional pero recomendado: valida firma)

   Configurar en Hotmart:
   Herramientas → Webhook → Registrar Webhook
   URL: https://[tu-dominio].com/api/webhook-hotmart
   Producto: BioScan 5D Pro (ID 7795514)
   Eventos: Compra aprobada (PURCHASE_APPROVED)
   Version: 2.0.0
   ============================================================ */

const HOTMART_PRODUCT_ID = 7795514;
const RD_ENDPOINT = "https://www.rdstation.com.br/api/1.3/conversions";

/* Generar codigo legible: BIOSCAN-XXXX-XXXX
   Sin O/0, I/1, etc. para evitar confusion al transcribir */
function generarCodigo() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n) => Array.from({ length: n }, () => A[Math.floor(Math.random() * A.length)]).join("");
  return `BIOSCAN-${seg(4)}-${seg(4)}`;
}

async function supabaseInsert(table, row) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify(row)
  });
  const txt = await r.text();
  if (!r.ok) {
    const err = new Error(`Supabase ${r.status}: ${txt}`);
    err.status = r.status;
    err.body = txt;
    throw err;
  }
  return JSON.parse(txt);
}

async function rdConversion(payload) {
  const token = process.env.RD_STATION_TOKEN;
  if (!token) { console.warn("RD_STATION_TOKEN no configurado, omitiendo conversion"); return; }
  try {
    await fetch(RD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_rdstation: token, ...payload })
    });
  } catch (e) {
    console.error("RD Station fallo en webhook:", e.message);
  }
}

exports.handler = async function (event) {
  // 1. Validar metodo
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // 2. Validar firma de Hotmart (si se configuro HOTTOK)
  const hottokConfigurado = process.env.HOTMART_HOTTOK;
  if (hottokConfigurado) {
    const hottokRecibido = event.headers["x-hotmart-hottok"] || event.headers["X-Hotmart-Hottok"];
    if (hottokRecibido !== hottokConfigurado) {
      console.warn("Webhook Hotmart con HOTTOK invalido");
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // 3. Solo procesar compras APROBADAS
    const eventName = body.event || body.event_name;
    if (eventName !== "PURCHASE_APPROVED") {
      return { statusCode: 200, body: JSON.stringify({ ignored: true, reason: "no-aprobada", event: eventName }) };
    }

    // 4. Solo procesar el producto BioScan 5D Pro
    const data = body.data || {};
    const productId = data.product && data.product.id;
    if (productId && Number(productId) !== HOTMART_PRODUCT_ID) {
      return { statusCode: 200, body: JSON.stringify({ ignored: true, reason: "otro-producto", productId }) };
    }

    // 5. Extraer datos del comprador
    const buyer = data.buyer || {};
    const purchase = data.purchase || {};
    const email = (buyer.email || "").toLowerCase().trim();
    const nombre = buyer.name || "";
    const transaction = purchase.transaction || purchase.order_ref || "";

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email del comprador no recibido" }) };
    }

    // 6. Generar codigo unico (reintenta si hay colision con UNIQUE constraint)
    let codigo, registro;
    let intentos = 0;
    while (intentos < 5) {
      codigo = generarCodigo();
      try {
        const res = await supabaseInsert("compradores_pro", {
          email,
          codigo,
          codigo_usado: false,
          hotmart_transaction: transaction
        });
        registro = res[0];
        break;
      } catch (e) {
        // 23505 = unique_violation. Si es por el codigo, reintentar. Si es por email, ya esta registrado.
        intentos++;
        if (e.status === 409 || /23505|duplicate/i.test(e.body || "")) {
          if (/email/i.test(e.body || "")) {
            // Ya tenia codigo: lo recuperamos en vez de duplicar
            console.warn("Comprador ya tenia codigo:", email);
            return { statusCode: 200, body: JSON.stringify({ ok: true, reused: true, email }) };
          }
          // Colision de codigo: reintentar
          if (intentos >= 5) throw e;
          continue;
        }
        throw e;
      }
    }

    // 7. Notificar a RD Station: este lead es ahora comprador
    await rdConversion({
      identificador: "bioscan-5d-comprador-pro",
      email,
      name: nombre,
      tags: "comprador-umbral-01,bioscan-pro",
      cf_codigo_bioscan: codigo
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, codigo, email })
    };

  } catch (err) {
    console.error("webhook-hotmart error:", err);
    // Retornar 500 para que Hotmart reintente (errores transitorios)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

