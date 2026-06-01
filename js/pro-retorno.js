/* ============================================================
   BIOSCAN 5D · pro-retorno.js
   ------------------------------------------------------------
   Añade el "Modo PRO" al diagnóstico SIN tocar bioscan-app.js:
   - Pantalla de retorno ("ya hice mi BioScan, ver mi resultado")
   - Cambia el botón final del resultado: Umbral -> Transformación PRO
   - Bullets teaser del PRO bajo el botón

   ACTIVACIÓN: solo se enciende con ?pro=1 en la URL (o cuando
   MODO_PRO_SIEMPRE = true, que activaremos el 4 de junio).
   Mientras tanto, el sitio se comporta EXACTAMENTE como hoy.
   ============================================================ */
(function () {
  // ⚙️ El 4 de junio: cambiar a true para encender el modo PRO para todos.
  const MODO_PRO_SIEMPRE = false;

  // URL de la página de venta (ajustar cuando se publique)
  const URL_VENTA_PRO = "/transformacion-pro";

  function modoProActivo() {
    if (MODO_PRO_SIEMPRE) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get("pro") === "1";
  }

  const cfg = window.BIOSCAN_CONFIG || {};
  const ENDPOINT_RECUPERAR = cfg.ENDPOINT_RECUPERAR || "/api/recuperar-diagnostico";

  // Extiende la fábrica bioscanApp con las capacidades PRO
  const baseFactory = window.bioscanApp;
  if (typeof baseFactory !== "function") {
    console.warn("pro-retorno: bioscanApp no encontrado");
    return;
  }

  window.bioscanApp = function () {
    const app = baseFactory();

    // ----- estado PRO -----
    app.modoPro = modoProActivo();
    app.urlVentaPro = URL_VENTA_PRO;
    app.retornoEmail = "";
    app.retornoCargando = false;
    app.retornoError = null;

    // ----- ir a la pantalla de retorno desde bienvenida -----
    app.irARetorno = function () {
      this.estado = "retorno";
      this.error = null;
      this.retornoError = null;
    };
    app.volverABienvenida = function () {
      this.estado = "bienvenida";
      this.retornoError = null;
    };

    // ----- recuperar diagnóstico por email -----
    app.recuperarPorEmail = async function () {
      this.retornoError = null;
      const email = (this.retornoEmail || "").toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.retornoError = "Por favor escribe un correo válido.";
        return;
      }
      this.retornoCargando = true;
      try {
        const r = await fetch(ENDPOINT_RECUPERAR, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await r.json();
        this.retornoCargando = false;

        if (!data || !data.ok) {
          this.retornoError = "No pudimos buscar tu diagnóstico. Intenta de nuevo en un momento.";
          return;
        }
        if (!data.existe) {
          this.retornoError = "No encontramos un BioScan con ese correo. ¿Quieres hacerlo ahora?";
          return;
        }
        // Reconstruir el estado de resultado con los datos recuperados
        this.usuario.nombre = data.nombre || this.usuario.nombre || "";
        this.usuario.email = email;
        this.resultado = {
          perfil_actual: data.perfil_actual,
          perfil_destino: data.perfil_destino,
          es_maestria: data.es_maestria,
          scores: data.scores
        };
        this.perfilActualData = this.perfiles[data.perfil_actual];
        this.perfilDestinoData = this.perfiles[data.perfil_destino];
        this.estado = "resultado";
        // Redibujar el radar cuando el DOM esté listo
        this.$nextTick(() => { if (this.dibujarRadar) this.dibujarRadar(); });
      } catch (e) {
        this.retornoCargando = false;
        this.retornoError = "Hubo un problema. Intenta de nuevo.";
        console.error(e);
      }
    };

    // ----- el botón final: PRO o Umbral según el modo -----
    app.accionBotonFinal = function () {
      if (this.modoPro) {
        // lleva a la página de venta, pasando el correo para prellenar el checkout luego
        const sep = this.urlVentaPro.indexOf("?") >= 0 ? "&" : "?";
        const url = this.usuario.email
          ? `${this.urlVentaPro}${sep}email=${encodeURIComponent(this.usuario.email)}`
          : this.urlVentaPro;
        window.location.href = url;
      } else {
        this.irAlUmbral();
      }
    };

    return app;
  };
})();

