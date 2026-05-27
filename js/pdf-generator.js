/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   pdf-generator.js — PDF v2: ficha BLANCA, 2 paginas, premium
   ------------------------------------------------------------
   Cambio mayor (feedback): fondo blanco estilo Apple/Mindvalley
   (el negro cansa en lectura larga), 2 paginas, ambos logos,
   referencias academicas (uso legitimo de citas).
   ============================================================ */
(function () {
  const TINTA = [20, 20, 22];       // casi negro para texto
  const SUAVE = [110, 110, 118];    // gris medio
  const ORANGE = [209, 63, 38];
  const GOLD = [176, 141, 41];

  const PDFGenerator = {
    async generar(datos) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const M = 56; // margen

      const PERFILES = window.BIOSCAN_DATA.PERFILES;
      const pa = PERFILES[datos.perfilActual] || {};
      const pd = PERFILES[datos.perfilDestino] || {};

      const fondoBlanco = () => { doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F"); };
      const lineaSuave = (y) => { doc.setDrawColor(225,225,228); doc.setLineWidth(0.8); doc.line(M,y,W-M,y); };

      /* ===== PAGINA 1 ===== */
      fondoBlanco();

      // Encabezado de marca
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","bold"); doc.setFontSize(10);
      doc.text("BIOSCAN 5D", M, 60);
      doc.setFont("helvetica","normal");
      doc.text("MODO UMBRAL · TEMPORADA 1", W-M, 60, { align:"right" });
      doc.setDrawColor(...ORANGE); doc.setLineWidth(2); doc.line(M, 70, M+34, 70);

      // Saludo
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(12);
      doc.text(`Diagnóstico de ${datos.nombre}`, M, 110);

      // Perfil actual
      doc.setTextColor(...SUAVE); doc.setFontSize(9);
      doc.text("TU PERFIL POSTURAL ACTUAL", M, 142);
      doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(30);
      doc.text(pa.nombre || "", M, 174);
      doc.setTextColor(...GOLD); doc.setFont("helvetica","italic"); doc.setFontSize(13);
      doc.text(pa.subtitulo || "", M, 196);

      // Felicitacion si el perfil actual es avanzado (destino)
      let y = 224;
      if (pa.es_destino) {
        doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(10);
        doc.text(`Felicitaciones, ${datos.nombre}.`, M, y); y += 15;
        doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(10);
        const ftxt = datos.esMaestria
          ? (pa.maestria || "")
          : "A diferencia de la mayoría, tu cuerpo ya habita un perfil avanzado.";
        const fl = doc.splitTextToSize(ftxt, W - M*2);
        doc.text(fl, M, y); y += fl.length * 13 + 14;
      } else {
        y = 232;
      }

      // Bloques del perfil
      const bloque = (titulo, texto) => {
        if (!texto) return;
        doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
        doc.text(titulo, M, y); y += 15;
        doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
        const lines = doc.splitTextToSize(texto, W - M*2);
        doc.text(lines, M, y); y += lines.length * 13.5 + 16;
      };
      if (pa.es_destino) {
        bloque("QUIÉN ERES", pa.quien_es);
        bloque("LO QUE VAS A LOGRAR", pa.vas_a_lograr);
      } else {
        bloque("PATRÓN CARACTERÍSTICO", pa.patron);
        bloque("QUIÉN ERES", pa.quien_eres);
        bloque("LO QUE TU CUERPO ESTÁ DICIENDO", pa.cuerpo_dice);
        bloque("LO QUE ESTÁ EN JUEGO", pa.en_juego);
      }

      // Huella postural (barras)
      if (y > H - 200) { doc.addPage(); fondoBlanco(); y = 70; }
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text("TU HUELLA POSTURAL · DÍA 0", M, y); y += 20;
      const ejes = [
        ["Presencia Somática", datos.scores.eje1],
        ["Regulación bajo presión", datos.scores.eje2],
        ["Influencia no verbal", datos.scores.eje3],
        ["Consciencia corporal", datos.scores.eje4]
      ];
      ejes.forEach(([n,v]) => {
        doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10);
        doc.text(n, M, y);
        doc.setTextColor(...GOLD); doc.text(v.toFixed(1)+" / 10", W-M, y, { align:"right" });
        doc.setFillColor(235,235,238); doc.roundedRect(M, y+5, W-M*2, 7, 2, 2, "F");
        doc.setFillColor(...ORANGE); doc.roundedRect(M, y+5, (W-M*2)*v/10, 7, 2, 2, "F");
        y += 30;
      });

      /* ===== PAGINA 2 ===== */
      doc.addPage(); fondoBlanco();
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","bold"); doc.setFontSize(10);
      doc.text("TU PRÓXIMO PASO", M, 60);
      doc.setDrawColor(...ORANGE); doc.setLineWidth(2); doc.line(M, 70, M+34, 70);

      y = 110;
      if (datos.esMaestria) {
        doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(22);
        doc.text(pa.nombre || "", M, y); y += 24;
        doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(12);
        doc.text("· NIVEL MAESTRÍA ·", M, y); y += 28;
        doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(11);
        let l = doc.splitTextToSize(pa.maestria || "", W-M*2); doc.text(l, M, y); y += l.length*14+20;
      } else {
        doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
        doc.text("Tu cuerpo debe moverse hacia:", M, y); y += 24;
        doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(24);
        doc.text(pd.nombre || "", M, y); y += 22;
        doc.setTextColor(...GOLD); doc.setFont("helvetica","italic"); doc.setFontSize(12);
        doc.text(pd.subtitulo || "", M, y); y += 26;
        doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
        doc.text("HACIA DÓNDE VAS", M, y); y += 14;
        doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
        let l1 = doc.splitTextToSize(pd.quien_es || "", W-M*2); doc.text(l1, M, y); y += l1.length*13.5+16;
        doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
        doc.text("LO QUE VAS A LOGRAR", M, y); y += 14;
        doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
        let l2 = doc.splitTextToSize(pd.vas_a_lograr || "", W-M*2); doc.text(l2, M, y); y += l2.length*13.5+20;
      }

      // Invitacion sesion
      lineaSuave(y); y += 26;
      doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(14);
      doc.text("Umbral 5D #01", M, y); y += 18;
      doc.setTextColor(...GOLD); doc.setFont("helvetica","italic"); doc.setFontSize(11);
      doc.text("\"Como te sientas, te sientes\"", M, y); y += 22;
      doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
      doc.text("4 de junio · 6:00 PM Colombia · Online en vivo · Acceso abierto", M, y); y += 28;

      // Referencias academicas (uso legitimo de citas)
      if (y > H - 150) { doc.addPage(); fondoBlanco(); y = 70; }
      lineaSuave(y); y += 22;
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
      doc.text("FUNDAMENTO CIENTÍFICO", M, y); y += 14;
      doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...SUAVE);
      const refs = [
        "Este diagnóstico se apoya en investigación sobre:",
        "· Postura, respiración y su efecto en el ánimo y la cognición (biofeedback, San Francisco State University).",
        "· Presencia, lenguaje corporal y percepción social (comportamiento organizacional, Harvard Business School).",
        "· Diseño de hábitos sostenibles y cambio de comportamiento (diseño conductual, Stanford).",
        "· Regulación del sistema nervioso y respiración (neurofisiología aplicada)."
      ];
      refs.forEach(r => { const l = doc.splitTextToSize(r, W-M*2); doc.text(l, M, y); y += l.length*11+3; });

      // Pie de marca
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(8);
      doc.text("BioScan 5D · una creación de 5D Diseñadores · 23 años de ergonomía y diseño de comportamiento", M, H-50);
      doc.text("www.5d.com.co", M, H-38);
      doc.text("© 2026 5D Diseñadores Asociados SAS", W-M, H-38, { align:"right" });

      const base64 = doc.output("datauristring");
      return { base64, doc };
    },

    async descargar(datos) {
      const { doc } = await this.generar(datos);
      doc.save(`BioScan-5D-${(datos.nombre||"perfil").replace(/\s+/g,"-")}.pdf`);
    }
  };
  window.PDFGenerator = PDFGenerator;
})();

