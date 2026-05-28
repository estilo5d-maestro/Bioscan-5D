/* ============================================================
   BIOSCAN 5D — iconos.js  (v4 PRO PREMIUM)
   Iconos mas elaborados: gradiente dual (dorado→naranja),
   glow neon real (feGaussianBlur), trazo duendecillo + detalles
   internos, nodos luminosos. Diseñados como instrumentos de
   tecnologia, no como pictogramas simples.
   ============================================================ */

function ico(id, inner, extraDefs = "") {
  return `<svg class="bp-ico" viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="g_${id}" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFCf6A"/><stop offset="0.45" stop-color="#EF5036"/><stop offset="1" stop-color="#C9A227"/>
      </linearGradient>
      <radialGradient id="n_${id}" cx="0.5" cy="0.5" r="0.5">
        <stop stop-color="#FFE3A8"/><stop offset="1" stop-color="#EF5036"/>
      </radialGradient>
      <filter id="f_${id}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="0.7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      ${extraDefs}
    </defs>
    <g stroke="url(#g_${id})" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#f_${id})">
      ${inner}
    </g>
  </svg>`;
}
// nodo luminoso (puntito de energia)
const nodo = (id,x,y,r=1.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#n_${id})" stroke="none"/>`;

const ICONOS_RESULTADO = {
  // PATRÓN — onda de señal con nodos de medición (tipo osciloscopio)
  patron: ico("pat",
    '<path d="M3 16c2 0 2.2-7 4-7s2 10 4 10 2.2-13 4-13 2 8 4 8 2-4 4-4"/>' +
    '<path d="M3 22h22" opacity="0.3"/>' + nodo("pat",9,9) + nodo("pat",15,6) + nodo("pat",23,12)),

  // QUIÉN ERES — figura con aura concéntrica (presencia irradiando)
  quien: ico("qui",
    '<circle cx="14" cy="9" r="3.6"/>' +
    '<path d="M6.5 23c0-4.1 3.4-7.2 7.5-7.2s7.5 3.1 7.5 7.2"/>' +
    '<path d="M3.5 6.5C2 9 2 13 3.5 15.5M24.5 6.5C26 9 26 13 24.5 15.5" opacity="0.45" stroke-width="1"/>' + nodo("qui",14,9,1.1)),

  // CUERPO DICE — onda de voz dentro de globo (comunicación somática)
  dice: ico("dic",
    '<path d="M4 7.5h20v10H12l-5 4v-4H4z"/>' +
    '<path d="M9 12.5v2M13 10.5v6M17 11.5v4M21 12.5v2"/>'),

  // EN JUEGO — escudo con núcleo de alerta luminoso (lo que está en riesgo)
  juego: ico("jue",
    '<path d="M14 3l8.5 3.3v6.4c0 5.2-3.6 9.2-8.5 11.3C9.1 21.9 5.5 17.9 5.5 12.7V6.3z"/>' +
    '<path d="M14 9.5v5" stroke-width="1.7"/>' + nodo("jue",14,18,1.2),
    ''),

  // FORTALEZA — gema facetada con brillo interior (valor que permanece)
  fortaleza: ico("for",
    '<path d="M6 10.5l3.2-5h9.6L22 10.5 14 22.5z"/>' +
    '<path d="M6 10.5h16M9.2 5.5L11 10.5l3 12M18.8 5.5L17 10.5l-3 12" opacity="0.55" stroke-width="1"/>' + nodo("for",14,10.5,1)),

  // HACIA DÓNDE VAS — flecha ascendente con estela (evolución dirigida)
  hacia: ico("hac",
    '<path d="M14 23V8" stroke-width="1.7"/><path d="M7.5 13.5L14 6.5l6.5 7"/>' +
    '<path d="M9 23h10" opacity="0.4"/>' + nodo("hac",14,6.5,1.1)),

  // VAS A LOGRAR — estrella con núcleo radiante (logro alcanzado)
  lograr: ico("log",
    '<path d="M14 3.5l3 6.1 6.8 1-4.9 4.8 1.2 6.7L14 19l-6.1 3.1 1.2-6.7L4.2 10.6l6.8-1z"/>' + nodo("log",14,13,1.4))
};

window.BIOSCAN_ICONOS_RESULTADO = ICONOS_RESULTADO;

