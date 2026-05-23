/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   pdf-generator.js — Genera el PDF de resultados (6 paginas)
   ------------------------------------------------------------
   Usa jsPDF (cargado por CDN). Genera el PDF liviano en el
   navegador y devuelve un Blob/base64 para enviar por correo
   o descargar. El plan completo NO va en el PDF (vive en la app).
   ============================================================ */

(function () {
  const NEGRO = "#050505";
  const NARANJA = "#D13F26";
  const DORADO = "#D3AE37";
  const BLANCO = "#FFFFFF";
  const GRIS = "#8B8B93";

  const PDFGenerator = {
    /* ----------------------------------------------------------
       Genera el PDF y devuelve { blob, base64, dataUri }
       datos = { nombre, perfilActual, perfilDestino, scores }
       PERFILES = window.BIOSCAN_DATA.PERFILES
       ---------------------------------------------------------- */
    async generar(datos) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      const PERFILES = window.BIOSCAN_DATA.PERFILES;
      const pa = PERFILES[datos.perfilActual] || {};
      const pd = PERFILES[datos.perfilDestino.replace("_PLUS", "")] || {};

      const fondo = () => {
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, W, H, "F");
      };
      const linea = (y) => {
        doc.setDrawColor(211, 174, 55);
        doc.setLineWidth(1);
        doc.line(56, y, W - 56, y);
      };

      /* ---------- PAGINA 1 · PORTADA ---------- */
      fondo();
      doc.setTextColor(GRIS);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("BIOSCAN 5D  ·  MODO UMBRAL", W / 2, 180, { align: "center" });

      doc.setTextColor(BLANCO);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.text("TU DIAGNÓSTICO", W / 2, 320, { align: "center" });
      doc.text("POSTURAL PERSONAL", W / 2, 370, { align: "center" });

      linea(430);
      doc.setTextColor(DORADO);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(datos.nombre, W / 2, 480, { align: "center" });
      doc.setTextColor(GRIS);
      doc.setFontSize(10);
      doc.text(new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }), W / 2, 505, { align: "center" });

      doc.setTextColor(GRIS);
      doc.setFontSize(9);
      doc.text("5D Diseñadores  ·  Bogotá, Colombia", W / 2, H - 60, { align: "center" });

      /* ---------- PAGINA 2 · MODO ACTUAL + DESTINO ---------- */
      doc.addPage(); fondo();
      doc.setTextColor(GRIS); doc.setFontSize(11);
      doc.text("TU MODO POSTURAL ACTUAL", 56, 90);
      linea(105);

      doc.setTextColor(BLANCO); doc.setFont("helvetica", "bold"); doc.setFontSize(30);
      doc.text(pa.nombre || "", 56, 155);
      doc.setTextColor(DORADO); doc.setFont("helvetica", "italic"); doc.setFontSize(13);
      doc.text(doc.splitTextToSize(pa.subtitulo || "", W - 112), 56, 180);

      let y = 230;
      const bloque = (titulo, texto) => {
        doc.setTextColor(NARANJA); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.text(titulo, 56, y); y += 18;
        doc.setTextColor(BLANCO); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
        const lines = doc.splitTextToSize(texto, W - 112);
        doc.text(lines, 56, y); y += lines.length * 15 + 18;
      };
      bloque("PATRÓN CARACTERÍSTICO", pa.patron || "");
      bloque("QUIÉN ERES", pa.quien_eres || "");
      bloque("LO QUE TU CUERPO ESTÁ DICIENDO", pa.cuerpo_dice || "");
      bloque("TU FORTALEZA OCULTA", pa.fortaleza || "");

      /* ---------- PAGINA 3 · HUELLA POSTURAL ---------- */
      doc.addPage(); fondo();
      doc.setTextColor(GRIS); doc.setFontSize(11);
      doc.text("TU HUELLA POSTURAL  ·  DÍA 0", 56, 90);
      linea(105);

      const ejes = [
        { n: "Presencia Somática", v: datos.scores.eje1 },
        { n: "Regulación bajo presión", v: datos.scores.eje2 },
        { n: "Influencia no verbal", v: datos.scores.eje3 },
        { n: "Consciencia corporal", v: datos.scores.eje4 }
      ];
      let by = 180;
      ejes.forEach((e) => {
        doc.setTextColor(BLANCO); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
        doc.text(e.n, 56, by);
        // barra de fondo
        doc.setFillColor(40, 40, 40);
        doc.roundedRect(56, by + 8, W - 112, 12, 3, 3, "F");
        // barra de valor
        doc.setFillColor(209, 63, 38);
        const ancho = ((W - 112) * e.v) / 10;
        doc.roundedRect(56, by + 8, ancho, 12, 3, 3, "F");
        doc.setTextColor(DORADO); doc.setFontSize(10);
        doc.text(e.v.toFixed(1) + " / 10", W - 56, by, { align: "right" });
        by += 60;
      });

      doc.setTextColor(GRIS); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      const interp = "Esta es tu huella postural de hoy. Durante el Umbral 5D #01 vas a entender qué significa cada eje y cómo transformarlo.";
      doc.text(doc.splitTextToSize(interp, W - 112), 56, by + 20);

      /* ---------- PAGINA 4 · PROXIMO UMBRAL ---------- */
      doc.addPage(); fondo();
      doc.setTextColor(GRIS); doc.setFontSize(11);
      doc.text("TU PRÓXIMO UMBRAL", 56, 90);
      linea(105);

      doc.setTextColor(BLANCO); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
      doc.text(pa.nombre || "", 56, 150);
      doc.setTextColor(NARANJA); doc.setFontSize(20);
      doc.text("->", W / 2 - 12, 150);
      doc.setTextColor(DORADO); doc.setFontSize(16);
      doc.text(pd.nombre || "", W - 56, 150, { align: "right" });

      doc.setTextColor(GRIS); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text("Donde estás hoy", 56, 168);
      doc.text("Hacia dónde te llevamos", W - 56, 168, { align: "right" });

      y = 220;
      doc.setTextColor(NARANJA); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      doc.text("QUÉ SIGNIFICA " + (pd.nombre || ""), 56, y); y += 18;
      doc.setTextColor(BLANCO); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      let l = doc.splitTextToSize(pd.quien_eres || "", W - 112);
      doc.text(l, 56, y); y += l.length * 15 + 20;

      doc.setTextColor(NARANJA); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      doc.text("TU CAMINO", 56, y); y += 18;
      doc.setTextColor(BLANCO); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      l = doc.splitTextToSize("Tu plan de 7 días " + (pd.proximo_umbral || ""), W - 112);
      doc.text(l, 56, y);

      /* ---------- PAGINA 5 · LA SESION ---------- */
      doc.addPage(); fondo();
      doc.setTextColor(GRIS); doc.setFontSize(11);
      doc.text("LO QUE SIGUE", 56, 90);
      linea(105);

      doc.setTextColor(BLANCO); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
      doc.text("Umbral 5D #01", 56, 160);
      doc.setFont("helvetica", "normal"); doc.setFontSize(13);
      doc.setTextColor(DORADO);
      doc.text("\"Como te sientas, te sientes\"", 56, 186);

      doc.setTextColor(BLANCO); doc.setFontSize(11);
      const info = [
        "Jueves 4 de junio  ·  6:00 PM Colombia",
        "Online en vivo  ·  Acceso abierto",
        "",
        "Conocer tu perfil es apenas el primer umbral.",
        "En la sesión vas a entender por qué tu cuerpo se",
        "comporta así, y vas a vivir la experiencia que",
        "transforma ese conocimiento en poder real."
      ];
      doc.text(info, 56, 240, { lineHeightFactor: 1.6 });

      doc.setFillColor(209, 63, 38);
      doc.roundedRect(56, 400, W - 112, 44, 22, 22, "F");
      doc.setTextColor(BLANCO); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
      doc.text("RESERVA TU LUGAR EN EL UMBRAL", W / 2, 427, { align: "center" });
      doc.setTextColor(GRIS); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text("www.5d.com.co/umbral-5d-01", W / 2, 465, { align: "center" });

      /* ---------- PAGINA 6 · CIERRE Y CREDITOS ---------- */
      doc.addPage(); fondo();
      doc.setTextColor(GRIS); doc.setFontSize(11);
      doc.text("LA CIENCIA DETRÁS", 56, 90);
      linea(105);

      doc.setTextColor(BLANCO); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      const ciencia = [
        "Tu Modo Postural no es una etiqueta arbitraria.",
        "Está informado por tres líneas de investigación:",
        "",
        "Amy Cuddy (Harvard) — Presencia y comunicación no verbal.",
        "Erik Peper (SFSU) — Postura, respiración y cognición.",
        "BJ Fogg (Stanford) — Diseño de hábitos sostenibles.",
        "Stephen Porges — Regulación del sistema nervioso."
      ];
      doc.text(ciencia, 56, 160, { lineHeightFactor: 1.6 });

      linea(330);
      doc.setTextColor(DORADO); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
      doc.text("5D DISEÑADORES", 56, 370);
      doc.setTextColor(GRIS); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text("23 años transformando espacios de trabajo en", 56, 392);
      doc.text("arquitecturas de bienestar.", 56, 408);
      doc.text("www.5d.com.co", 56, 440);
      doc.setFontSize(8);
      doc.text("© 2026 5D Diseñadores Asociados SAS", 56, H - 50);

      /* ---------- SALIDA ---------- */
      const blob = doc.output("blob");
      const base64 = doc.output("datauristring");
      return { blob, base64, doc };
    },

    /* Descargar directamente (para pruebas) */
    async descargar(datos) {
      const { doc } = await this.generar(datos);
      doc.save(`BioScan-5D-${datos.nombre.replace(/\s+/g, "-")}.pdf`);
    }
  };

  window.PDFGenerator = PDFGenerator;
})();