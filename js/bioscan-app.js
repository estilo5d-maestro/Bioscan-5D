/* ============================================================
   BIOSCAN 5D · MODO UMBRAL — EDICIÓN TEMPORADA 1
   bioscan-app.js — Lógica del flujo (Alpine.js) v2
   ------------------------------------------------------------
   Flujo: bienvenida → registro → preparacion → cuestionario(12)
   → revision previa (A3) → calculo → resultado.
   Soporta: multi-select (P2 6 opc, P12), transiciones con boton
   Continuar, 1 repeticion, Nivel Maestria.
   ============================================================ */

function bioscanApp() {
  return {
    estado: "bienvenida",   // bienvenida|registro|preparacion|cuestionario|revision|calculo|resultado
    cargando: false,
    error: null,

    // datos
    UI: window.BIOSCAN_DATA.UI,
    BLOQUES: window.BIOSCAN_DATA.BLOQUES,
    preguntas: window.BIOSCAN_DATA.PREGUNTAS,
    perfiles: window.BIOSCAN_DATA.PERFILES,

    // usuario
    usuario: { nombre: "", email: "", consentimiento: false },
    userId: null,

    // cuestionario
    indiceActual: 0,
    respuestas: {},          // { p1: idx, p3: idx, ... }  (single)
    tensiones: [],           // P2 multi
    retosSeleccionados: [],  // P12 multi (indices)
    mostrarTransicion: false,
    transicionData: null,

    // calculo / resultado
    textoCalculo: "",
    resultado: null,
    perfilActualData: null,
    perfilDestinoData: null,
    vecesRepetido: 0,
    modoRevisionEdit: false,

    // ---------- COMPUTED ----------
    get preguntaActual() { return this.preguntas[this.indiceActual]; },
    get totalPreguntas() { return this.preguntas.length; },
    get esUltima() { return this.indiceActual === this.preguntas.length - 1; },
    get bloqueTitulo() { return this.BLOQUES[this.preguntaActual.bloque]; },
    get progresoTicks() {
      // 12 ticks que se encienden segun pregunta respondida
      const respondidas = this.indiceActual;
      return Array.from({ length: 12 }, (_, i) => i < respondidas);
    },
    get progresoRing() {
      return Math.round((this.indiceActual / this.preguntas.length) * 100);
    },
    get puedeAvanzar() {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        if (p.id === "p2") return this.tensiones.length > 0;
        if (p.id === "p12") return this.retosSeleccionados.length > 0;
      }
      return this.respuestas[p.id] !== undefined;
    },

    init() {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) this.usuario.email = decodeURIComponent(emailParam);
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
        const user = await window.BioScanAPI.crearUsuario(this.usuario.nombre, this.usuario.email, this.usuario.consentimiento);
        this.userId = user ? user.id : null;
        window.BioScanAPI.notificarRDStation({
          identificador: "bioscan-5d-registro-inicial",
          email: this.usuario.email, name: this.usuario.nombre, tags: "bioscan-completado"
        });
        this.cargando = false;
        this.estado = "preparacion";
      } catch (e) {
        this.cargando = false;
        this.error = "Hubo un problema al registrarte. Intenta de nuevo.";
        console.error(e);
      }
    },

    empezarCuestionario() { this.estado = "cuestionario"; this.indiceActual = 0; },

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
      // opcion exclusiva "no siento tension"
      if (idx === p.exclusiva) { this.tensiones = this.tensiones.includes(idx) ? [] : [idx]; return; }
      // si habia exclusiva marcada, quitarla
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

    siguiente() {
      if (!this.puedeAvanzar) return;
      if (this.esUltima) { this.irARevision(); return; }
      const actual = this.preguntaActual.bloque;
      const sig = this.preguntas[this.indiceActual + 1].bloque;
      if (actual !== sig) this.lanzarTransicion(sig);
      else this.indiceActual++;
    },
    anterior() { if (this.indiceActual > 0) this.indiceActual--; },

    lanzarTransicion(nuevoBloque) {
      const map = { "REGULACION": "bloque2", "INFLUENCIA": "bloque3", "CONSCIENCIA": "bloque4", "RETO": "bloque5" };
      this.transicionData = this.UI.transiciones[map[nuevoBloque]];
      this.mostrarTransicion = true;
    },
    continuarTransicion() {
      this.mostrarTransicion = false;
      this.indiceActual++;
    },

    // ---------- REVISION PREVIA (A3) ----------
    irARevision() { this.estado = "revision"; },
    textoRespuesta(p) {
      if (p.id === "p2") {
        if (this.tensiones.length === 0) return "—";
        return this.tensiones.map(i => p.opciones[i]).join(", ");
      }
      if (p.id === "p12") {
        if (this.retosSeleccionados.length === 0) return "—";
        return this.retosSeleccionados.map(i => p.opciones[i]).join(", ");
      }
      const idx = this.respuestas[p.id];
      return idx !== undefined ? p.opciones[idx] : "—";
    },
    editarPregunta(indice) {
      this.estado = "cuestionario";
      this.indiceActual = indice;
      this.modoRevisionEdit = true;
    },

    // ---------- CALCULO ----------
    async calcular() {
      this.estado = "calculo";
      this.animarCalculo();
      try {
        const resultado = await window.BioScanAPI.calcularPerfil(this.respuestas, this.retosReales(), this.tensiones);
        this.resultado = resultado;
        this.perfilActualData = this.perfiles[resultado.perfil_actual];
        this.perfilDestinoData = this.perfiles[resultado.perfil_destino];

        if (this.userId) {
          await window.BioScanAPI.guardarDiagnostico(this.userId, { respuestas: this.respuestas, tensiones: this.tensiones }, this.retosReales(), resultado);
        }

        const pdf = await window.PDFGenerator.generar({
          nombre: this.usuario.nombre,
          perfilActual: resultado.perfil_actual,
          perfilDestino: resultado.perfil_destino,
          esMaestria: resultado.es_maestria,
          scores: resultado.scores
        });

        const destinoLower = resultado.perfil_destino.toLowerCase();
        const idDestino = resultado.es_maestria
          ? `bioscan-5d-completado-${resultado.perfil_actual.toLowerCase()}-plus`
          : `bioscan-5d-completado-${destinoLower}`;
        window.BioScanAPI.notificarRDStation({
          identificador: idDestino, email: this.usuario.email, name: this.usuario.nombre,
          tags: `bioscan-completado,bioscan-perfil-${resultado.perfil_actual.toLowerCase()},bioscan-destino-${destinoLower}`,
          cf_perfil_actual: resultado.perfil_actual, cf_perfil_destino: resultado.perfil_destino,
          pdf_base64: pdf ? pdf.base64 : ""
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
      const textos = this.UI.calculo.textos;
      let i = 0; this.textoCalculo = textos[0];
      const intv = setInterval(() => {
        i++;
        if (i >= textos.length) { clearInterval(intv); this.textoCalculo = this.UI.calculo.final; return; }
        this.textoCalculo = textos[i];
      }, 780);
    },

    // ---------- RESULTADO ----------
    get accentColor() { return this.perfilActualData ? this.perfilActualData.color : "#D13F26"; },
    dibujarRadar() {
      const ctx = document.getElementById("radarChart");
      if (!ctx || !this.resultado || !window.Chart) return;
      const c = this.accentColor;
      new window.Chart(ctx, {
        type: "radar",
        data: {
          labels: ["Presencia", "Regulación", "Influencia", "Consciencia"],
          datasets: [{
            label: "Tu huella · Día 0",
            data: [this.resultado.scores.eje1, this.resultado.scores.eje2, this.resultado.scores.eje3, this.resultado.scores.eje4],
            backgroundColor: this.hexToRgba(c, 0.22), borderColor: c, borderWidth: 2, pointBackgroundColor: "#D3AE37", pointRadius: 3
          }]
        },
        options: {
          responsive: true, plugins: { legend: { labels: { color: "#C8C8CC", font: { size: 11 } } } },
          scales: { r: {
            beginAtZero: true, max: 10, ticks: { stepSize: 2, color: "#777", backdropColor: "transparent", font: { size: 9 } },
            grid: { color: "rgba(255,255,255,0.1)" }, angleLines: { color: "rgba(255,255,255,0.1)" },
            pointLabels: { color: "#E0E0E0", font: { size: 11.5 } }
          } }
        }
      });
    },
    irAlUmbral() { window.open(window.BIOSCAN_CONFIG.URL_UMBRAL, "_blank"); },
    descargarPDF() {
      window.PDFGenerator.descargar({
        nombre: this.usuario.nombre, perfilActual: this.resultado.perfil_actual,
        perfilDestino: this.resultado.perfil_destino, esMaestria: this.resultado.es_maestria, scores: this.resultado.scores
      });
    },
    puedeRepetir() { return this.vecesRepetido < 1; },
    repetirBioScan() {
      if (!this.puedeRepetir()) return;
      this.vecesRepetido++;
      this.respuestas = {}; this.tensiones = []; this.retosSeleccionados = [];
      this.resultado = null; this.indiceActual = 0; this.estado = "cuestionario";
    },

    // ---------- UTILES ----------
    iconoSVG(nombre) {
      return (window.BIOSCAN_ICONOS && window.BIOSCAN_ICONOS[nombre]) || "";
    },
    validarEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); },
    hexToRgba(hex, a) {
      const n = hex.replace("#", "");
      const r = parseInt(n.substring(0,2),16), g = parseInt(n.substring(2,4),16), b = parseInt(n.substring(4,6),16);
      return `rgba(${r},${g},${b},${a})`;
    }
  };
}
window.bioscanApp = bioscanApp;

