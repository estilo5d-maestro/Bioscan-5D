/* ============================================================
   BIOSCAN 5D — supabase-client.js v3
   Cambio: crearUsuario detecta correo ya registrado y devuelve
   {yaExiste:true} para mensaje claro (punto 7b).
   ============================================================ */
(function () {
  const cfg = window.BIOSCAN_CONFIG;
  let sb = null;
  try {
    if (window.supabase && cfg.SUPABASE_URL.indexOf("TU_") === -1) {
      sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    }
  } catch (e) { console.warn("Supabase no inicializado:", e.message); }

  const BioScanAPI = {
    async crearUsuario(nombre, email, consentimiento) {
      if (!sb) return null;
      const correo = email.toLowerCase().trim();
      // 1) Verificar si ya existe
      const { data: existente } = await sb.from("users").select("id").eq("email", correo).maybeSingle();
      if (existente) return { id: existente.id, yaExiste: true };
      // 2) Crear
      const { data, error } = await sb.from("users").insert(
        { email: correo, nombre: nombre.trim(), consentimiento_marketing: !!consentimiento, fuente: "bioscan_organico" }
      ).select().single();
      if (error) {
        if (error.code === "23505") return { yaExiste: true };  // unique violation
        throw error;
      }
      return data;
    },

    async calcularPerfil(respuestas, retos, tensiones) {
      const res = await fetch(cfg.ENDPOINT_CALCULAR, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas, retos, tensiones })
      });
      if (!res.ok) throw new Error("No se pudo calcular el perfil");
      return await res.json();
    },

    async guardarDiagnostico(userId, payload, retos, resultado) {
      if (!sb || !userId) return null;
      const { data, error } = await sb.from("diagnosticos").insert({
        user_id: userId, respuestas_json: payload,
        score_eje1: resultado.scores.eje1, score_eje2: resultado.scores.eje2,
        score_eje3: resultado.scores.eje3, score_eje4: resultado.scores.eje4,
        perfil_actual: resultado.perfil_actual, perfil_destino: resultado.perfil_destino,
        es_maestria: resultado.es_maestria, retos_seleccionados: retos
      }).select().single();
      if (error) throw error;
      return data;
    },

    async notificarRDStation(payload) {
      try {
        await fetch(cfg.ENDPOINT_RDSTATION, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
      } catch (e) { console.warn("RD Station no respondio:", e.message); }
    }
  };
  window.BioScanAPI = BioScanAPI;
})();

