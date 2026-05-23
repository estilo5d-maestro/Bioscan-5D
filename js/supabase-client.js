/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   supabase-client.js — Comunicacion con Supabase y backend
   ------------------------------------------------------------
   Usa el cliente oficial de Supabase (cargado por CDN en index.html).
   Maneja: crear usuario, guardar diagnostico, llamar al algoritmo,
   y notificar a RD Station via Netlify Function.
   ============================================================ */

(function () {
  const cfg = window.BIOSCAN_CONFIG;

  // Inicializar cliente Supabase (la libreria 'supabase' viene del CDN)
  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  const BioScanAPI = {
    /* ----------------------------------------------------------
       1. Crear o recuperar usuario por email
       ---------------------------------------------------------- */
    async crearUsuario(nombre, email, consentimiento) {
      // upsert: si el email ya existe, lo actualiza; si no, lo crea
      const { data, error } = await sb
        .from("users")
        .upsert(
          {
            email: email.toLowerCase().trim(),
            nombre: nombre.trim(),
            consentimiento_marketing: !!consentimiento,
            fuente: "bioscan_organico"
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    /* ----------------------------------------------------------
       2. Calcular perfil (llama a la Netlify Function protegida)
       ---------------------------------------------------------- */
    async calcularPerfil(respuestas, retos) {
      const res = await fetch(cfg.ENDPOINT_CALCULAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas, retos })
      });

      if (!res.ok) {
        throw new Error("No se pudo calcular el perfil");
      }
      return await res.json();
    },

    /* ----------------------------------------------------------
       3. Guardar diagnostico completo en Supabase
       ---------------------------------------------------------- */
    async guardarDiagnostico(userId, respuestas, retos, resultado) {
      const { data, error } = await sb
        .from("diagnosticos")
        .insert({
          user_id: userId,
          respuestas_json: respuestas,
          score_eje1: resultado.scores.eje1,
          score_eje2: resultado.scores.eje2,
          score_eje3: resultado.scores.eje3,
          score_eje4: resultado.scores.eje4,
          perfil_actual: resultado.perfil_actual,
          perfil_destino: resultado.perfil_destino,
          retos_seleccionados: retos
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    /* ----------------------------------------------------------
       4. Notificar a RD Station (via Netlify Function)
          identificador = registro inicial o diagnostico completado
       ---------------------------------------------------------- */
    async notificarRDStation(payload) {
      try {
        await fetch(cfg.ENDPOINT_RDSTATION, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // No bloqueamos al usuario si RD Station falla; solo registramos
        console.warn("RD Station no respondio:", e.message);
      }
    }
  };

  window.BioScanAPI = BioScanAPI;
})();
