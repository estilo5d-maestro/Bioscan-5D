/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   bioscan-app.js — Logica del flujo (componente Alpine.js)
   ------------------------------------------------------------
   Maneja los estados: bienvenida -> registro -> preparacion ->
   cuestionario (12) -> calculo -> resultado.
   Recoge respuestas, llama al algoritmo protegido, guarda en
   Supabase, genera PDF y muestra resultado con CTA.
   ============================================================ */

function bioscanApp() {
  return {
    // ---------- ESTADO GLOBAL ----------
    estado: "bienvenida", // bienvenida | registro | preparacion | cuestionario | calculo | resultado
    cargando: false,
    error: null,

    // datos de usuario
    usuario: { nombre: "", email: "", consentimiento: false },
    userId: null,

    // cuestionario
    preguntas: window.BIOSCAN_DATA.PREGUNTAS,
    perfiles: window.BIOSCAN_DATA.PERFILES,
    indiceActual: 0,            // que pregunta estamos viendo
    respuestas: {},             // { p1: indiceOpcion, ... }
    retosSeleccionados: [],     // de P12
    mostrarTransicion: false,
    textoTransicion: "",

    // resultado
    resultado: null,
    perfilActualData: null,
    perfilDestinoData: null,

    // calculo dramatizado
    textoCalculo: "Analizando tu cuerpo...",

    // ---------- COMPUTED ----------
    get preguntaActual() {
      return this.preguntas[this.indiceActual];
    },
    get progreso() {
      return Math.round(((this.indiceActual) / this.preguntas.length) * 100);
    },
    get totalPreguntas() {
      return this.preguntas.length;
    },
    get esUltimaPregunta() {
      return this.indiceActual === this.preguntas.length - 1;
    },
    get puedeAvanzar() {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        return this.retosSeleccionados.length > 0;
      }
      return this.respuestas[p.id] !== undefined;
    },

    // ---------- INICIALIZACION ----------
    init() {
      // Pre-cargar email si viene por URL (?email=...)
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        this.usuario.email = decodeURIComponent(emailParam);
      }
    },

    // ---------- NAVEGACION DE ESTADOS ----------
    irARegistro() {
      this.estado = "registro";
    },

    async enviarRegistro() {
      this.error = null;
      if (!this.usuario.nombre.trim()) {
        this.error = "Por favor escribe tu nombre.";
        return;
      }
      if (!this.validarEmail(this.usuario.email)) {
        this.error = "Por favor escribe un correo válido.";
        return;
      }
      if (!this.usuario.consentimiento) {
        this.error = "Necesitamos tu autorización para enviarte tu plan.";
        return;
      }

      this.cargando = true;
      try {
        // 1. Crear usuario en Supabase
        const user = await window.BioScanAPI.crearUsuario(
          this.usuario.nombre,
          this.usuario.email,
          this.usuario.consentimiento
        );
        this.userId = user.id;

        // 2. Notificar a RD Station (registro inicial) - no bloqueante
        window.BioScanAPI.notificarRDStation({
          identificador: "bioscan-5d-registro-inicial",
          email: this.usuario.email,
          name: this.usuario.nombre,
          tags: "bioscan-completado"
        });

        // 3. Avanzar a preparacion
        this.cargando = false;
        this.estado = "preparacion";
      } catch (e) {
        this.cargando = false;
        this.error = "Hubo un problema al registrarte. Intenta de nuevo.";
        console.error(e);
      }
    },

    empezarCuestionario() {
      this.estado = "cuestionario";
      this.indiceActual = 0;
    },

    // ---------- RESPONDER PREGUNTAS ----------
    seleccionar(indiceOpcion) {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        this.toggleReto(indiceOpcion);
      } else {
        this.respuestas[p.id] = indiceOpcion;
      }
    },

    estaSeleccionada(indiceOpcion) {
      const p = this.preguntaActual;
      if (p.tipo === "multi") {
        const reto = p.opciones[indiceOpcion].reto;
        return this.retosSeleccionados.includes(reto);
      }
      return this.respuestas[p.id] === indiceOpcion;
    },

    toggleReto(indiceOpcion) {
      const reto = this.preguntaActual.opciones[indiceOpcion].reto;
      const idx = this.retosSeleccionados.indexOf(reto);
      if (idx >= 0) {
        this.retosSeleccionados.splice(idx, 1);
      } else {
        const max = this.preguntaActual.maxSelecciones || 3;
        if (this.retosSeleccionados.length < max) {
          this.retosSeleccionados.push(reto);
        }
      }
    },

    siguiente() {
      if (!this.puedeAvanzar) return;

      if (this.esUltimaPregunta) {
        this.calcular();
        return;
      }

      // Detectar cambio de bloque para mostrar transicion
      const bloqueActual = this.preguntaActual.bloque;
      const bloqueSiguiente = this.preguntas[this.indiceActual + 1].bloque;

      if (bloqueActual !== bloqueSiguiente) {
        this.mostrarTransicionBloque(bloqueSiguiente);
      } else {
        this.indiceActual++;
      }
    },

    anterior() {
      if (this.indiceActual > 0) this.indiceActual--;
    },

    mostrarTransicionBloque(nuevoBloque) {
      const textos = {
        "REGULACIÓN BAJO PRESIÓN": "Hasta aquí hablamos de tu postura cotidiana. Ahora exploremos cómo responde tu cuerpo bajo presión.",
        "INFLUENCIA NO VERBAL": "Ahora veamos qué pasa cuando interactúas con otros. Tu cuerpo comunica antes que tus palabras.",
        "CONSCIENCIA CORPORAL": "Casi listo. Las últimas preguntas miden algo invisible pero crítico: tu consciencia corporal.",
        "CONTEXTO": "Una última pregunta. Esta define tu trayectoria personal de los próximos 30 días."
      };
      this.textoTransicion = textos[nuevoBloque] || "";
      this.mostrarTransicion = true;
      setTimeout(() => {
        this.mostrarTransicion = false;
        this.indiceActual++;
      }, 2600);
    },

    // ---------- CALCULO ----------
    async calcular() {
      this.estado = "calculo";
      this.animarCalculo();

      try {
        // 1. Llamar al algoritmo protegido (Netlify Function)
        const resultado = await window.BioScanAPI.calcularPerfil(
          this.respuestas,
          this.retosSeleccionados
        );
        this.resultado = resultado;

        // 2. Resolver datos de los perfiles para mostrar
        this.perfilActualData = this.perfiles[resultado.perfil_actual];
        const destinoKey = resultado.perfil_destino.replace("_PLUS", "");
        this.perfilDestinoData = this.perfiles[destinoKey];

        // 3. Guardar diagnostico en Supabase
        if (this.userId) {
          await window.BioScanAPI.guardarDiagnostico(
            this.userId,
            this.respuestas,
            this.retosSeleccionados,
            resultado
          );
        }

        // 4. Generar PDF
        const pdf = await window.PDFGenerator.generar({
          nombre: this.usuario.nombre,
          perfilActual: resultado.perfil_actual,
          perfilDestino: resultado.perfil_destino,
          scores: resultado.scores
        });

        // 5. Notificar a RD Station (diagnostico completado, con identificador por destino)
        const destinoLower = destinoKey.toLowerCase();
        const idDestino = resultado.necesita_plus
          ? `bioscan-5d-completado-${resultado.perfil_actual.toLowerCase()}-plus`
          : `bioscan-5d-completado-${destinoLower}`;

        window.BioScanAPI.notificarRDStation({
          identificador: idDestino,
          email: this.usuario.email,
          name: this.usuario.nombre,
          tags: `bioscan-completado,bioscan-perfil-${resultado.perfil_actual.toLowerCase()},bioscan-destino-${destinoLower}`,
          cf_perfil_actual: resultado.perfil_actual,
          cf_perfil_destino: resultado.perfil_destino,
          pdf_base64: pdf.base64
        });

        // 6. Esperar a que termine la animacion y mostrar resultado
        setTimeout(() => {
          this.estado = "resultado";
        }, 4500);
      } catch (e) {
        this.error = "Hubo un problema al calcular tu perfil. Intenta de nuevo.";
        console.error(e);
        setTimeout(() => { this.estado = "cuestionario"; }, 2000);
      }
    },

    animarCalculo() {
      const textos = [
        "Mapeando tu Presencia Somática...",
        "Calculando tu Regulación bajo presión...",
        "Detectando tu patrón de Influencia no verbal...",
        "Midiendo tu Consciencia corporal...",
        "Cruzando tus retos con tu trayectoria..."
      ];
      let i = 0;
      this.textoCalculo = textos[0];
      const intervalo = setInterval(() => {
        i++;
        if (i >= textos.length) {
          clearInterval(intervalo);
          this.textoCalculo = "Tu Modo Postural ha sido identificado.";
          return;
        }
        this.textoCalculo = textos[i];
      }, 800);
    },

    // ---------- RESULTADO: dibujar radar ----------
    dibujarRadar() {
      const ctx = document.getElementById("radarChart");
      if (!ctx || !this.resultado) return;

      new window.Chart(ctx, {
        type: "radar",
        data: {
          labels: ["Presencia", "Regulación", "Influencia", "Consciencia"],
          datasets: [{
            label: "Tu huella · Día 0",
            data: [
              this.resultado.scores.eje1,
              this.resultado.scores.eje2,
              this.resultado.scores.eje3,
              this.resultado.scores.eje4
            ],
            backgroundColor: "rgba(209, 63, 38, 0.25)",
            borderColor: "rgba(209, 63, 38, 1)",
            borderWidth: 2,
            pointBackgroundColor: "#D3AE37"
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: "#aaa" } } },
          scales: {
            r: {
              beginAtZero: true, max: 10,
              ticks: { stepSize: 2, color: "#666", backdropColor: "transparent" },
              grid: { color: "rgba(255,255,255,0.1)" },
              angleLines: { color: "rgba(255,255,255,0.1)" },
              pointLabels: { color: "#ccc", font: { size: 12 } }
            }
          }
        }
      });
    },

    // ---------- CTA segun fecha y URL del Umbral ----------
    irAlUmbral() {
      window.open(window.BIOSCAN_CONFIG.URL_UMBRAL, "_blank");
    },

    descargarPDF() {
      window.PDFGenerator.descargar({
        nombre: this.usuario.nombre,
        perfilActual: this.resultado.perfil_actual,
        perfilDestino: this.resultado.perfil_destino,
        scores: this.resultado.scores
      });
    },

    // ---------- UTILIDADES ----------
    validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  };
}

window.bioscanApp = bioscanApp;
