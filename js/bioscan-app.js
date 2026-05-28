/* ============================================================
   BIOSCAN 5D · MODO UMBRAL — bioscan-app.js v3
   Cambios: felicitacion para TODO perfil avanzado (no solo
   maestria), transicion animada entre preguntas, error de
   correo duplicado claro, revision como desplegable que regresa
   al resumen tras editar, anillo segun estado.
   ============================================================ */
function bioscanApp() {
  return {
    estado: "bienvenida",
    cargando: false,
    error: null,

    UI: window.BIOSCAN_DATA.UI,
    BLOQUES: window.BIOSCAN_DATA.BLOQUES,
    preguntas: window.BIOSCAN_DATA.PREGUNTAS,
    perfiles: window.BIOSCAN_DATA.PERFILES,
    iconosRes: window.BIOSCAN_ICONOS_RESULTADO,

    usuario: { nombre: "", email: "", consentimiento: false },
    userId: null,

    indiceActual: 0,
    respuestas: {},
    tensiones: [],
    retosSeleccionados: [],
    mostrarTransicion: false,
    transicionData: null,
    qAnim: "enter",          // estado de animacion de la pregunta

    revisionAbierta: false,
    volverARevision: false,  // si edita desde revision, regresa al resumen

    textoCalculo: "",
    resultado: null,
    perfilActualData: null,
    perfilDestinoData: null,
    vecesRepetido: 0,

    // ---------- COMPUTED ----------
    get preguntaActual() { return this.preguntas[this.indiceActual]; },
    get totalPreguntas() { return this.preguntas.length; },
    get esUltima() { return this.indiceActual === this.preguntas.length - 1; },
    get bloqueTitulo() { return this.BLOQUES[this.preguntaActual.bloque]; },
    get progresoRing() { return Math.round((this.indiceActual / this.preguntas.length) * 100); },
    // El anillo se enciende contando la pregunta actual como "en curso" (+1),
    // asi el usuario VE el progreso encenderse desde la primera pregunta (feedback #1)
    get progresoAnillo() { return Math.round(((this.indiceActual + 1) / this.preguntas.length) * 100); },
    get ringOffset() { return 364.4 - (364.4 * this.progresoAnillo / 100); },
    // perfil avanzado actual => merece felicitacion (punto 10)
    get esAvanzado() { return this.perfilActualData && this.perfilActualData.es_destino; },
    get puedeAvanzar() {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        if (p.id === "p2") return this.tensiones.length > 0;
        if (p.id === "p12") return this.retosSeleccionados.length > 0;
      }
      return this.respuestas[p.id] !== undefined;
    },
    get accentColor() { return this.perfilActualData ? this.perfilActualData.color : "#D13F26"; },

    init() {
      const params = new URLSearchParams(window.location.search);
      const e = params.get("email");
      if (e) this.usuario.email = decodeURIComponent(e);
    },

    // ---------- NAVEGACION ----------
    irARegistro() { this.estado = "registro"; this.error = null; },

    async enviarRegistro() {
      this.error = null;
      if (!this.usuario.nombre.trim()) { this.error = "Por favor escribe tu nombre."; return; }
      if (!this.validarEmail(this.usuario.email)) { this.error = "Por favor escribe un correo válido."; return; }
      if (!this.usuario.consentimiento) { this.error = "Necesitamos tu autorización para enviarte tu diagnóstico."; return; }
      this.cargando = true;
      try {
        const r = await window.BioScanAPI.crearUsuario(this.usuario.nombre, this.usuario.email, this.usuario.consentimiento);
        // Manejo de correo ya registrado (punto 7b)
        if (r && r.yaExiste) {
          this.cargando = false;
          this.error = "Este correo ya está registrado. Intenta con otro o continúa tu BioScan anterior.";
          return;
        }
        this.userId = r ? r.id : null;
        window.BioScanAPI.notificarRDStation({
          identificador: "bioscan-5d-registro-inicial",
          email: this.usuario.email, name: this.usuario.nombre, tags: "bioscan-iniciado"
        });
        this.cargando = false;
        this.estado = "preparacion";
      } catch (e) {
        this.cargando = false;
        // Si el error es de duplicado (unique violation), mensaje claro
        if (e && (e.code === "23505" || /duplicate|unique/i.test(e.message || ""))) {
          this.error = "Este correo ya está registrado. Intenta con otro.";
        } else {
          this.error = "Hubo un problema al registrarte. Intenta de nuevo.";
        }
        console.error(e);
      }
    },

    empezarCuestionario() { this.estado = "cuestionario"; this.indiceActual = 0; this.qAnim = "enter"; },

    // ---------- RESPONDER ----------
    seleccionar(idx) {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        if (p.id === "p2") this.toggleTension(idx);
        else if (p.id === "p12") this.toggleReto(idx);
      } else {
        this.respuestas[p.id] = idx;
      }
    },
    estaSel(idx) {
      const p = this.preguntaActual;
      if (p.id === "p2") return this.tensiones.includes(idx);
      if (p.id === "p12") return this.retosSeleccionados.includes(idx);
      return this.respuestas[p.id] === idx;
    },
    toggleTension(idx) {
      const p = this.preguntaActual;
      if (idx === p.exclusiva) { this.tensiones = this.tensiones.includes(idx) ? [] : [idx]; return; }
      this.tensiones = this.tensiones.filter(t => t !== p.exclusiva);
      const i = this.tensiones.indexOf(idx);
      if (i >= 0) this.tensiones.splice(i, 1);
      else if (this.tensiones.length < p.maxSel) this.tensiones.push(idx);
    },
    toggleReto(idx) {
      const i = this.retosSeleccionados.indexOf(idx);
      if (i >= 0) this.retosSeleccionados.splice(i, 1);
      else if (this.retosSeleccionados.length < this.preguntaActual.maxSel) this.retosSeleccionados.push(idx);
    },

    // Transicion animada entre preguntas (punto 1)
    cambiarPregunta(nuevoIndice, cb) {
      this.qAnim = "leave";
      setTimeout(() => {
        this.indiceActual = nuevoIndice;
        if (cb) cb();
        this.qAnim = "enter";
      }, 280);
    },

    siguiente() {
      if (!this.puedeAvanzar) return;
      // Si venia de editar desde revision, regresar al resumen (punto 4)
      if (this.volverARevision) { this.volverARevision = false; this.estado = "revision"; this.revisionAbierta = true; return; }
      if (this.esUltima) { this.irARevision(); return; }
      const actual = this.preguntaActual.bloque;
      const sig = this.preguntas[this.indiceActual + 1].bloque;
      if (actual !== sig) this.lanzarTransicion(sig);
      else this.cambiarPregunta(this.indiceActual + 1);
    },
    anterior() { if (this.indiceActual > 0) this.cambiarPregunta(this.indiceActual - 1); },

    lanzarTransicion(nuevoBloque) {
      const map = { "REGULACION": "bloque2", "INFLUENCIA": "bloque3", "CONSCIENCIA": "bloque4", "RETO": "bloque5" };
      this.transicionData = this.UI.transiciones[map[nuevoBloque]];
      this.mostrarTransicion = true;
    },
    continuarTransicion() {
      this.mostrarTransicion = false;
      this.cambiarPregunta(this.indiceActual + 1);
    },

    // ---------- REVISION (desplegable, punto 4) ----------
    irARevision() { this.estado = "revision"; this.revisionAbierta = false; },
    toggleRevision() { this.revisionAbierta = !this.revisionAbierta; },
    textoRespuesta(p) {
      if (p.id === "p2") return this.tensiones.length ? this.tensiones.map(i => p.opciones[i]).join(", ") : "—";
      if (p.id === "p12") return this.retosSeleccionados.length ? this.retosSeleccionados.map(i => p.opciones[i]).join(", ") : "—";
      const idx = this.respuestas[p.id];
      return idx !== undefined ? p.opciones[idx] : "—";
    },
    editarPregunta(indice) {
      this.volverARevision = true;       // al dar Siguiente, regresa al resumen
      this.estado = "cuestionario";
      this.indiceActual = indice;
      this.qAnim = "enter";
    },

    // ---------- CALCULO ----------
    async calcular() {
      this.estado = "calculo";
      this.animarCalculo();
      try {
        const res = await window.BioScanAPI.calcularPerfil(this.respuestas, this.retosReales(), this.tensiones);
        this.resultado = res;
        this.perfilActualData = this.perfiles[res.perfil_actual];
        this.perfilDestinoData = this.perfiles[res.perfil_destino];

        if (this.userId) {
          await window.BioScanAPI.guardarDiagnostico(this.userId, { respuestas: this.respuestas, tensiones: this.tensiones }, this.retosReales(), res);
        }
        const pdf = await window.PDFGenerator.generar({
          nombre: this.usuario.nombre, perfilActual: res.perfil_actual, perfilDestino: res.perfil_destino,
          esMaestria: res.es_maestria, esAvanzado: !!this.perfiles[res.perfil_actual].es_destino, scores: res.scores
        });
        const destinoLower = res.perfil_destino.toLowerCase();
        const idDestino = res.es_maestria
          ? `bioscan-5d-completado-${res.perfil_actual.toLowerCase()}-plus`
          : `bioscan-5d-completado-${destinoLower}`;
        window.BioScanAPI.notificarRDStation({
          identificador: idDestino, email: this.usuario.email, name: this.usuario.nombre,
          tags: `bioscan-completado,bioscan-perfil-${res.perfil_actual.toLowerCase()},bioscan-destino-${destinoLower}`,
          cf_perfil_actual: res.perfil_actual, cf_perfil_destino: res.perfil_destino        
        });
        setTimeout(() => { this.estado = "resultado"; }, 4400);
      } catch (e) {
        this.error = "Hubo un problema al calcular tu perfil. Intenta de nuevo.";
        console.error(e);
        setTimeout(() => { this.estado = "revision"; }, 1800);
      }
    },
    retosReales() {
      const p12 = this.preguntas.find(p => p.id === "p12");
      return this.retosSeleccionados.map(i => p12.retos[i]);
    },
    animarCalculo() {
      const t = this.UI.calculo.textos; let i = 0; this.textoCalculo = t[0];
      const intv = setInterval(() => {
        i++;
        if (i >= t.length) { clearInterval(intv); this.textoCalculo = this.UI.calculo.final; return; }
        this.textoCalculo = t[i];
      }, 780);
    },

    // ---------- RESULTADO ----------
    dibujarRadar() {
      const ctx = document.getElementById("radarChart");
      if (!ctx || !this.resultado || !window.Chart) return;
      const c = this.accentColor;
      new window.Chart(ctx, {
        type: "radar",
        data: { labels: ["Presencia","Regulación","Influencia","Consciencia"],
          datasets: [{ label: "Tu huella · Día 0",
            data: [this.resultado.scores.eje1,this.resultado.scores.eje2,this.resultado.scores.eje3,this.resultado.scores.eje4],
            backgroundColor: this.hexToRgba(c,0.22), borderColor: c, borderWidth: 2, pointBackgroundColor: "#D3AE37", pointRadius: 3 }] },
        options: { responsive: true, plugins: { legend: { labels: { color: "#C8C8CC", font: { size: 11 } } } },
          scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2, color: "#777", backdropColor: "transparent", font: { size: 9 } },
            grid: { color: "rgba(255,255,255,0.1)" }, angleLines: { color: "rgba(255,255,255,0.1)" },
            pointLabels: { color: "#E0E0E0", font: { size: 11.5 } } } } }
      });
    },
    icoRes(k) { return (this.iconosRes && this.iconosRes[k]) || ""; },
    irAlUmbral() { window.open(window.BIOSCAN_CONFIG.URL_UMBRAL, "_blank"); },
    descargarPDF() {
      window.PDFGenerator.descargar({
        nombre: this.usuario.nombre, perfilActual: this.resultado.perfil_actual,
        perfilDestino: this.resultado.perfil_destino, esMaestria: this.resultado.es_maestria,
        esAvanzado: this.esAvanzado, scores: this.resultado.scores
      });
    },
    puedeRepetir() { return this.vecesRepetido < 1; },
    repetirBioScan() {
      if (!this.puedeRepetir()) return;
      this.vecesRepetido++;
      this.respuestas = {}; this.tensiones = []; this.retosSeleccionados = [];
      this.resultado = null; this.indiceActual = 0; this.qAnim = "enter"; this.estado = "cuestionario";
    },

    // ---------- UTILES ----------
    validarEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); },
    hexToRgba(hex, a) {
      const n = hex.replace("#",""); const r = parseInt(n.substring(0,2),16), g = parseInt(n.substring(2,4),16), b = parseInt(n.substring(4,6),16);
      return `rgba(${r},${g},${b},${a})`;
    }
  };
}
window.bioscanApp = bioscanApp;

