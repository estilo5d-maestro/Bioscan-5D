/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — pro-pdf.js (v2)
   PDF instructivo: ficha blanca premium. Personalizado por el
   VIAJE origen→destino. Mapa de 7 días + cómo usar + CTA.
   ============================================================ */
(function () {
  const TINTA=[20,20,22], SUAVE=[110,110,118], ORANGE=[209,63,38], GOLD=[176,141,41];
  const LOGO_URL="https://cdn.shopify.com/s/files/1/0952/6060/6762/files/Logo_-_5D_-_Con_Borde_Redondo_Blanco.png?v=1774043494";
  const NOMBRES={ MAGNETICO:"EL MAGNÉTICO", EJE:"EL EJE", PUENTE:"EL PUENTE", INALTERABLE:"EL INALTERABLE", SOSTENEDOR:"EL SOSTENEDOR", CENTINELA:"EL CENTINELA", NOMADA:"EL NÓMADA", HABITADO:"EL HABITADO" };
  let _logo=null;
  async function cargarLogo(){ if(_logo)return _logo; try{ const r=await fetch(LOGO_URL,{mode:"cors"}); const b=await r.blob(); _logo=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(b);}); return _logo; }catch(e){ return null; } }

  const ProPDF = {
    async generar(datos){
      const { jsPDF }=window.jspdf;
      const doc=new jsPDF({unit:"pt",format:"a4"});
      const W=doc.internal.pageSize.getWidth(), H=doc.internal.pageSize.getHeight(), M=56;
      const PLAN=window.BIOSCAN_PLAN;
      const origen=datos.origen||"SOSTENEDOR", destino=datos.destino||"MAGNETICO";
      const esMaestria=!!datos.esMaestria;
      const logo=await cargarLogo();
      const fondo=()=>{ doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F"); };
      fondo();

      if(logo){ try{ doc.addImage(logo,"PNG",M,42,26,26); }catch(e){} }
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","bold"); doc.setFontSize(10);
      doc.text("BIOSCAN 5D · PRO", logo?M+34:M, 60);
      doc.setFont("helvetica","normal"); doc.text("PLAN DE 7 DÍAS · TEMPORADA 1", W-M, 60, {align:"right"});
      doc.setDrawColor(...ORANGE); doc.setLineWidth(2); doc.line(M,74,M+34,74);

      doc.setTextColor(...SUAVE); doc.setFontSize(12); doc.text(`Tu guía, ${datos.nombre||"BioScanner"}`, M, 112);
      doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(25);
      doc.text("Tu transformación", M, 145); doc.text("comienza hoy", M, 173);

      let y=206;
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(10);
      doc.text("TU CAMINO", M, y); y+=20;
      doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(18);
      if(esMaestria){ doc.text(`${NOMBRES[origen]} · MAESTRÍA`, M, y); }
      else { doc.text(`${NOMBRES[origen]}  →  ${NOMBRES[destino]}`, M, y); }
      y+=24;

      // narrativa de viaje
      doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
      const viaje = esMaestria ? ((PLAN.MAESTRIA[origen]||{}).encuadre||"") : (PLAN.VIAJE[origen+">"+destino] || PLAN.VIAJE["SOSTENEDOR>MAGNETICO"]);
      const vL=doc.splitTextToSize(viaje, W-M*2); doc.text(vL, M, y); y+=vL.length*14+20;

      doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
      doc.text("CÓMO VIVIR TU PLAN", M, y); y+=16;
      doc.setTextColor(...TINTA); doc.setFont("helvetica","normal"); doc.setFontSize(10.5);
      const como="Cada día se desbloquea cuando completas el anterior. No corras: una práctica por día construye el hábito. Marca tu micro-práctica, haz la práctica profunda con audio, acepta el reto del día y responde tu checkpoint. Tu huella de crecimiento evoluciona en vivo y tu racha crece con cada día que avanzas.";
      const cL=doc.splitTextToSize(como, W-M*2); doc.text(cL, M, y); y+=cL.length*14+18;

      doc.setTextColor(...ORANGE); doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
      doc.text("TU MAPA DE 7 DÍAS", M, y); y+=16;
      PLAN.DIAS.forEach(d=>{
        doc.setTextColor(...GOLD); doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text(`Día ${d.numero}`, M, y);
        doc.setTextColor(...TINTA); doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text(d.tema, M+48, y);
        doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(9.5);
        const sub=doc.splitTextToSize(d.subtitulo, W-M*2-48); doc.text(sub, M+48, y+13); y+=13+sub.length*11+9;
      });

      if(y>H-150){ doc.addPage(); fondo(); y=70; }
      y+=6;
      const btnW=W-M*2, btnH=40;
      doc.setFillColor(...ORANGE); doc.roundedRect(M,y,btnW,btnH,20,20,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(12);
      doc.text("ENTRAR A MI MÓDULO PRO", W/2, y+25, {align:"center"});
      doc.link(M,y,btnW,btnH,{url:"https://bioscan.5d.com.co/activar"}); y+=btnH+14;
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(9);
      doc.text("Ingresa con tu correo y tu código de activación.", W/2, y, {align:"center"});

      if(logo){ try{ doc.addImage(logo,"PNG",M,H-70,28,28); }catch(e){} }
      doc.setTextColor(...SUAVE); doc.setFont("helvetica","normal"); doc.setFontSize(8);
      doc.text("BioScan 5D · una creación de 5D Diseñadores", logo?M+38:M, H-50);
      doc.text("© 2026 5D Diseñadores Asociados SAS", W-M, H-50, {align:"right"});

      try{ const blob=doc.output("blob"); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`BioScan-PRO-Guia-${(datos.nombre||"plan").replace(/\s+/g,"-")}.pdf`; document.body.appendChild(a); a.click(); setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},1500); }catch(e){ doc.save("BioScan-PRO-Guia.pdf"); }
    }
  };
  window.ProPDF=ProPDF;
})();

