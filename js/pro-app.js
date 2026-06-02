/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — pro-app.js  (v2 · MATRIZ + WOW)
   ------------------------------------------------------------
   Lógica Alpine. Compone el plan por capas (origen+destino+viaje),
   maneja desbloqueo por checkpoint, racha con freeze, huella radar
   evolutiva y micro-interacciones de behavioral design.
   ============================================================ */
function bioscanPro() {
  const CFG = window.BIOSCAN_CONFIG || window.CONFIG || {};
  const EP_ACTIVAR = CFG.ENDPOINT_ACTIVAR || "/api/activar-codigo";
  const EP_PROGRESO = CFG.ENDPOINT_PROGRESO || "/api/progreso";
  const URL_UMBRAL = CFG.URL_UMBRAL || "https://www.5d.com.co/umbral-5d-01/";
  const LS_KEY = "bioscan_pro_v1";
  const NOMBRES = { MAGNETICO:"EL MAGNÉTICO", EJE:"EL EJE", PUENTE:"EL PUENTE", INALTERABLE:"EL INALTERABLE",
                    SOSTENEDOR:"EL SOSTENEDOR", CENTINELA:"EL CENTINELA", NOMADA:"EL NÓMADA", HABITADO:"EL HABITADO" };

  return {
    estado: "cargando", cargando: false, error: null,
    PLAN: window.BIOSCAN_PLAN, UI: window.BIOSCAN_PLAN.UI,

    sesion: { email:"", codigo:"", nombre:"", perfilActual:null, perfilDestino:null, esMaestria:false, tipo:null, scoresDia0:null, expiraAt:null },
    progreso: [],
    formEmail: "", formCodigo: "",

    diaActivo: null, pasoDia: "concepto",
    tinyCheck: false, coreCheck: false, retoCheck: false,
    journalResp: ["","",""], badgesNuevos: [],
    timerSeg: 0, timerActivo: false, _timerInt: null,
    confetti: false,

    /* ---------- INIT ---------- */
    async init() {
      const params = new URLSearchParams(window.location.search);
      const e = params.get("email"); if (e) this.formEmail = decodeURIComponent(e);
      const c = params.get("codigo"); if (c) this.formCodigo = decodeURIComponent(c).toUpperCase();
      const g = this.leerSesion();
      // 1) Si ya hay sesión guardada (entró antes), activar con ella.
      if (g && g.email && g.codigo) { this.formEmail = g.email; this.formCodigo = g.codigo; await this.activar(true); }
      // 2) Si viene email+código por la URL (desde gracias o correo), activar de UN CLIC.
      else if (e && c) { await this.activar(true); }
      // 3) Si no, mostrar la pantalla de activación (con lo que se haya podido precargar).
      else this.estado = "activacion";
    },

    async _post(url, payload) {
      const r = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      return r.json();
    },

    /* ---------- ACTIVACIÓN ---------- */
    async activar(silencioso) {
      this.error = null;
      const email = (this.formEmail||"").toLowerCase().trim();
      const codigo = (this.formCodigo||"").toUpperCase().trim();
      if (!silencioso) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.error = "Escribe un correo válido."; return; }
        if (codigo.length < 6) { this.error = "Escribe tu código de activación."; return; }
      }
      this.cargando = true;
      try {
        const res = await this._post(EP_ACTIVAR, { email, codigo, dispositivo: navigator.userAgent });
        this.cargando = false;
        if (!res || !res.ok) {
          if (res && res.reason === "antes-de-fecha") { this.estado = "bloqueoFecha"; this.guardarSesion(email,codigo); return; }
          if (res && res.reason === "expirado") { this.estado = "expirado"; return; }
          if (silencioso) { this.borrarSesion(); this.estado = "activacion"; return; }
          this.error = (res && res.reason === "no-coincide") ? this.UI.activar.errorNoCoincide : this.UI.activar.errorGenerico;
          return;
        }
        this.sesion = {
          email, codigo, nombre: res.nombre || "",
          perfilActual: res.perfilActual || null,
          perfilDestino: res.perfilDestino || "MAGNETICO",
          esMaestria: !!res.esMaestria, tipo: res.tipo || null,
          scoresDia0: res.scoresDia0 || { eje1:5, eje2:5, eje3:5, eje4:5 },
          expiraAt: res.expiraAt || null
        };
        this.progreso = res.progreso || [];
        this.guardarSesion(email, codigo);
        this.estado = "home";
        this.$nextTick(() => this.dibujarRadar());
      } catch (err) {
        this.cargando = false;
        if (silencioso) { this.estado = "activacion"; return; }
        this.error = this.UI.activar.errorGenerico; console.error(err);
      }
    },

    leerSesion(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||"null"); }catch(e){ return null; } },
    guardarSesion(email,codigo){ try{ localStorage.setItem(LS_KEY, JSON.stringify({email,codigo})); }catch(e){} },
    borrarSesion(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} },
    salir(){ this.borrarSesion(); this.sesion={email:"",codigo:"",nombre:"",perfilActual:null,perfilDestino:null,esMaestria:false,tipo:null,scoresDia0:null,expiraAt:null}; this.progreso=[]; this.estado="activacion"; },

    /* ---------- PERFILES / VIAJE (composición de capas) ---------- */
    get origen(){ return this.sesion.perfilActual || "SOSTENEDOR"; },
    get destino(){ return this.sesion.perfilDestino || "MAGNETICO"; },
    get esAvanzado(){ return ["MAGNETICO","EJE","PUENTE","INALTERABLE"].includes(this.origen); },
    get origenNombre(){ return NOMBRES[this.origen] || this.origen; },
    get destinoNombre(){ return NOMBRES[this.destino] || this.destino; },
    get lenteOrigen(){ return this.PLAN.LENTE_ORIGEN[this.origen] || null; },
    get lenteDestino(){ return this.PLAN.LENTE_DESTINO[this.destino] || this.PLAN.LENTE_DESTINO.MAGNETICO; },
    get narrativaViaje(){
      if (this.esAvanzado && this.sesion.esMaestria) return (this.PLAN.MAESTRIA[this.origen]||{}).encuadre || "";
      const k = this.origen + ">" + this.destino;
      return this.PLAN.VIAJE[k] || this.PLAN.VIAJE["SOSTENEDOR>MAGNETICO"];
    },
    get viajeTitulo(){
      if (this.esAvanzado && this.sesion.esMaestria) return this.origenNombre + " · MAESTRÍA";
      return this.origenNombre + "  →  " + this.destinoNombre;
    },
    get llegada(){ return this.lenteDestino.llegada || ""; },

    /* ---------- COMPUTED progreso ---------- */
    get diasCompletados(){ return this.progreso.filter(p=>p.tiny_completado).map(p=>p.dia_numero); },
    get ultimoCompletado(){ const d=this.diasCompletados; return d.length?Math.max(...d):0; },

    /* Fecha en que se completó el último día (para el ritual de 1 día/jornada) */
    get fechaUltimoCompletado(){
      const u=this.ultimoCompletado; if(!u) return null;
      const fila=this.progreso.find(p=>p.dia_numero===u && p.fecha_completado);
      return fila?new Date(fila.fecha_completado):null;
    },
    /* "Jornada 5am": una jornada va de las 5:00am de un día a las 4:59am del siguiente.
       Restamos 5h y tomamos el día calendario local: así 4:30am pertenece a la
       jornada anterior y 5:30am a la nueva, de forma natural. */
    jornada5am(fecha){
      const f=new Date(new Date(fecha).getTime()-5*3600000);
      return f.getFullYear()*10000 + (f.getMonth()+1)*100 + f.getDate();
    },
    /* El siguiente día se habilita SOLO en una jornada posterior a la del último completado.
       Si completaste el Día 1 hoy, el Día 2 aparece mañana a las 5:00am. */
    get diaDisponible(){
      const u=this.ultimoCompletado;
      if(u>=7) return 7;                 // plan terminado
      if(u===0) return 1;                // nadie ha completado nada: Día 1 disponible
      const fc=this.fechaUltimoCompletado;
      if(!fc) return u;                  // sin fecha: mantén el último (no adelanta)
      const jHoy=this.jornada5am(new Date());
      const jUlt=this.jornada5am(fc);
      return jHoy>jUlt ? Math.min(u+1,7) : u; // nueva jornada -> libera el siguiente
    },
    /* ¿El próximo día está esperando a una jornada futura? (para el mensaje "vuelve mañana") */
    get esperandoProximaJornada(){
      const u=this.ultimoCompletado;
      return u>0 && u<7 && this.diaDisponible===u;
    },
    get progresoGeneral(){ return Math.round((this.diasCompletados.filter(d=>d<=7).length/7)*100); },

    get scoresHoy(){
      const b = this.sesion.scoresDia0 || {eje1:5,eje2:5,eje3:5,eje4:5};
      const acc = {eje1:b.eje1,eje2:b.eje2,eje3:b.eje3,eje4:b.eje4};
      this.progreso.forEach(p=>{ const s=p.scores_dia||{}; ["eje1","eje2","eje3","eje4"].forEach(k=>{ if(s[k]) acc[k]=Math.min(10,acc[k]+s[k]); }); });
      return acc;
    },

    get racha(){ return this.calcularRacha(); },
    calcularRacha(){
      const fechas = this.progreso.filter(p=>p.fecha_completado).map(p=>new Date(p.fecha_completado).toDateString());
      const dias = [...new Set(fechas)].map(d=>new Date(d)).sort((a,b)=>b-a);
      if(!dias.length) return 0;
      const unDia=86400000, hoy=new Date(); hoy.setHours(0,0,0,0);
      if(Math.round((hoy-dias[0])/unDia)>1) return 0;
      let racha=1, freeze=true;
      for(let i=1;i<dias.length;i++){ const gap=Math.round((dias[i-1]-dias[i])/unDia); if(gap===1)racha++; else if(gap===2&&freeze){racha++;freeze=false;} else break; }
      return racha;
    },

    diaData(n){ return this.PLAN.DIAS.find(x=>x.numero===n) || null; },
    estadoDia(n){
      if(this.diasCompletados.includes(n)) return "completado";
      if(n===this.diaDisponible) return "hoy";
      if(n===this.ultimoCompletado+1 && this.esperandoProximaJornada) return "espera";
      return "bloqueado";
    },

    /* texto del concepto compuesto: núcleo + matiz de origen */
    conceptoCompuesto(d){
      const base = d.concepto;
      const m = this.lenteOrigen && this.lenteOrigen.matiz ? this.lenteOrigen.matiz[d.numero] : null;
      return { base, matiz: m };
    },
    /* reto compuesto: sesgo de destino (+ plus si maestría) */
    retoDelDia(d){ return (this.lenteDestino.retoSesgo && this.lenteDestino.retoSesgo[d.numero]) || ""; },
    retoPlus(){ if(!this.sesion.esMaestria) return null; const m=this.PLAN.MAESTRIA[this.origen]; return m?m.retoPlus:null; },

    /* ---------- BADGES ---------- */
    badgesObtenidos(){
      const B=this.PLAN.BADGES, out=[], c=this.diasCompletados;
      if(c.includes(1))out.push(B.dia1);
      if(c.includes(3))out.push(B.dia3);
      if(c.includes(4))out.push(B.dia4);
      if(this.racha>=3)out.push(B.racha3);
      if(this.racha>=7)out.push(B.racha7);
      if([1,2,3,4,5,6,7].every(d=>c.includes(d))){ out.push(B.semana); out.push(B.umbral); }
      return out;
    },

    /* ---------- FLUJO DEL DÍA ---------- */
    pasos: ["concepto","tiny","core","reto","journal","celebracion"],
    abrirDia(n){
      const e=this.estadoDia(n);
      if(e==="bloqueado" || e==="espera") return;
      this.diaActivo=n; this.pasoDia="concepto";
      const y=this.progreso.find(p=>p.dia_numero===n);
      this.tinyCheck=y?!!y.tiny_completado:false;
      this.coreCheck=y?!!y.core_completado:false;
      this.retoCheck=y?!!y.reto_completado:false;
      this.journalResp=(y&&y.journal)?y.journal.slice(0,3).concat(["","",""]).slice(0,3):["","",""];
      this.resetTimer(); this.estado="dia"; window.scrollTo(0,0);
    },
    get diaActual(){ return this.diaData(this.diaActivo); },
    avanzarPaso(){ const i=this.pasos.indexOf(this.pasoDia); if(i<this.pasos.length-1){this.pasoDia=this.pasos[i+1];window.scrollTo(0,0);} },
    get journalRespondido(){ return this.journalResp.filter(r=>(r||"").trim().length>2).length; },
    get puedeCompletar(){ return this.tinyCheck && this.journalRespondido>=2; },

    scoresDelDia(d){
      const s={eje1:0,eje2:0,eje3:0,eje4:0}; const add=o=>{ if(o)for(const k in o)s[k]=(s[k]||0)+o[k]; };
      if(this.tinyCheck)add(d.scoring.tiny); if(this.coreCheck)add(d.scoring.core); if(this.retoCheck)add(d.scoring.reto);
      return s;
    },

    async completarDia(){
      if(!this.puedeCompletar) return;
      const d=this.diaActual, scores=this.scoresDelDia(d);
      this.cargando=true;
      try{ await this._post(EP_PROGRESO,{ action:"guardar", email:this.sesion.email, codigo:this.sesion.codigo, dia:d.numero, tiny:this.tinyCheck, core:this.coreCheck, reto:this.retoCheck, journal:this.journalResp, scores }); }catch(e){ console.warn("guardar:",e.message); }
      this.cargando=false;
      const ex=this.progreso.find(p=>p.dia_numero===d.numero);
      const fila={ dia_numero:d.numero, tiny_completado:this.tinyCheck, core_completado:this.coreCheck, reto_completado:this.retoCheck, journal:this.journalResp, scores_dia:scores, fecha_completado:new Date().toISOString() };
      if(ex)Object.assign(ex,fila); else this.progreso.push(fila);
      this.badgesNuevos=this.badgesObtenidos();
      this.confetti=true; setTimeout(()=>this.confetti=false, 2600);
      this.pasoDia="celebracion"; window.scrollTo(0,0);
    },

    volverHome(){ this.estado="home"; this.diaActivo=null; this.$nextTick(()=>this.dibujarRadar()); window.scrollTo(0,0); },

    /* ---------- TIMER ---------- */
    resetTimer(){ this.pararTimer(); this.timerSeg=0; },
    iniciarTimer(min){ this.pararTimer(); this.timerSeg=min*60; this.timerActivo=true; this._timerInt=setInterval(()=>{ if(this.timerSeg>0)this.timerSeg--; else{this.pararTimer();this.coreCheck=true;} },1000); },
    pararTimer(){ if(this._timerInt){clearInterval(this._timerInt);this._timerInt=null;} this.timerActivo=false; },
    get timerTexto(){ const m=Math.floor(this.timerSeg/60),s=this.timerSeg%60; return `${m}:${s<10?"0":""}${s}`; },
    get timerPct(){ const d=this.diaActual; if(!d)return 0; const tot=d.core.duracionMin*60; return tot?((tot-this.timerSeg)/tot)*100:0; },

    /* ---------- RADAR (huella evolutiva) ---------- */
    dibujarRadar(){
      const ctx=document.getElementById("radarPro"); if(!ctx||!window.Chart) return;
      if(this._chart)this._chart.destroy();
      const d0=this.sesion.scoresDia0||{eje1:5,eje2:5,eje3:5,eje4:5}, hoy=this.scoresHoy;
      this._chart=new window.Chart(ctx,{ type:"radar",
        data:{ labels:["Presencia","Regulación","Influencia","Consciencia"],
          datasets:[
            { label:"Día 0", data:[d0.eje1,d0.eje2,d0.eje3,d0.eje4], backgroundColor:"rgba(201,162,39,0.10)", borderColor:"rgba(201,162,39,0.5)", borderWidth:1, pointRadius:2, pointBackgroundColor:"#C9A227" },
            { label:"Hoy", data:[hoy.eje1,hoy.eje2,hoy.eje3,hoy.eje4], backgroundColor:"rgba(239,80,54,0.22)", borderColor:"#EF5036", borderWidth:2.5, pointRadius:3.5, pointBackgroundColor:"#EF5036", pointBorderColor:"#fff", pointBorderWidth:1 }
          ]},
        options:{ responsive:true, maintainAspectRatio:true,
          plugins:{ legend:{ labels:{ color:"#C8C8CC", font:{size:11,family:"Inter"}, boxWidth:10, padding:14 } } },
          scales:{ r:{ beginAtZero:true, max:10, ticks:{ stepSize:2, color:"#666", backdropColor:"transparent", font:{size:9} }, grid:{ color:"rgba(255,255,255,0.08)" }, angleLines:{ color:"rgba(255,255,255,0.08)" }, pointLabels:{ color:"#E8E8EC", font:{size:11.5,family:"Inter",weight:"600"} } } },
          animation:{ duration:900, easing:"easeOutQuart" } }
      });
    },

    descargarInstructivo(){
      // Enlaza al PDF hermoso correcto (los 32 caminos en /guias-pro/), consistente con la página de gracias
      var o = (this.origen || "").toLowerCase();
      var d = (this.destino || "").toLowerCase();
      if(!o || !d){ return; }
      var url = "/guias-pro/guia-" + o + "-" + d + ".pdf";
      window.open(url, "_blank");
    },
    irAlUmbral(){ window.open(URL_UMBRAL, "_blank"); }
  };
}
window.bioscanPro = bioscanPro;



