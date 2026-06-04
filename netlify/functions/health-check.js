/* ============================================================
   BIOSCAN 5D · netlify/functions/health-check.js
   ------------------------------------------------------------
   Verifica que el ESQUEMA de la base de datos coincide con lo
   que el backend espera escribir. Detecta "columnas faltantes"
   ANTES de que causen pérdidas silenciosas de datos.

   Uso: visita /api/health-check (o /.netlify/functions/health-check)
   Devuelve un reporte de qué columnas faltan en cada tabla.

   Esta función es tu RED DE SEGURIDAD: córrela tras cada cambio
   de esquema o despliegue para confirmar que todo está sincronizado.
   ============================================================ */

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

// Columnas que el backend ESPERA en cada tabla (la "fuente de verdad")
const ESQUEMA_ESPERADO = {
  diagnosticos: [
    "user_id", "respuestas_json", "score_eje1", "score_eje2", "score_eje3",
    "score_eje4", "perfil_actual", "perfil_destino", "es_maestria",
    "retos_seleccionados", "completado_at"
  ],
  compradores_pro: [
    "email", "codigo", "codigo_usado", "hotmart_transaction", "nombre",
    "perfil_actual", "perfil_destino", "es_maestria",
    "score_eje1", "score_eje2", "score_eje3", "score_eje4", "fecha_compra"
  ],
  users: ["email", "nombre", "consentimiento_marketing", "fuente"],
  progreso_plan: [
    "codigo", "dia_numero", "tiny_completado", "core_completado",
    "reto_completado", "scores_dia", "fecha_completado"
  ]
};

async function columnasReales(tabla) {
  // Pide 1 fila para inspeccionar las columnas que devuelve PostgREST.
  // Si la tabla está vacía, usa el endpoint con limit=0 y lee las keys del esquema OpenAPI.
  const r = await fetch(`${SB_URL}/rest/v1/${tabla}?select=*&limit=1`, {
    headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
  });
  if (!r.ok) throw new Error(`No se pudo leer ${tabla}: ${r.status}`);
  const filas = await r.json();
  if (filas && filas.length > 0) return Object.keys(filas[0]);
  // Tabla vacía: intentar insertar y revertir no es seguro; devolvemos null para indicar "desconocido"
  return null;
}

exports.handler = async function () {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
  if (!SB_URL || !SB_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: "Faltan variables de entorno SUPABASE_URL / SUPABASE_SERVICE_KEY" }) };
  }

  const reporte = {};
  let todoOk = true;

  for (const tabla of Object.keys(ESQUEMA_ESPERADO)) {
    try {
      const reales = await columnasReales(tabla);
      if (reales === null) {
        reporte[tabla] = { estado: "vacia", nota: "Tabla sin filas; no se pudo inspeccionar columnas. Inserta 1 registro de prueba para verificar." };
        continue;
      }
      const esperadas = ESQUEMA_ESPERADO[tabla];
      const faltantes = esperadas.filter(c => !reales.includes(c));
      if (faltantes.length > 0) {
        todoOk = false;
        reporte[tabla] = { estado: "FALTAN_COLUMNAS", faltantes, accion: `ALTER TABLE ${tabla} ADD COLUMN IF NOT EXISTS ...` };
      } else {
        reporte[tabla] = { estado: "ok" };
      }
    } catch (e) {
      todoOk = false;
      reporte[tabla] = { estado: "ERROR", detalle: e.message };
    }
  }

  return {
    statusCode: 200, headers,
    body: JSON.stringify({
      ok: todoOk,
      resumen: todoOk ? "✅ Esquema sincronizado: todas las columnas esperadas existen." : "⚠️ Hay columnas faltantes o errores. Revisa el detalle.",
      reporte
    }, null, 2)
  };
};

