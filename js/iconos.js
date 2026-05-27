/* ============================================================
   BIOSCAN 5D — iconos.js  (v3 PRO)
   Iconos premium con gradiente laser + doble trazo + glow.
   Solo se usan en el RESULTADO (los bloques del perfil).
   Las preguntas YA NO usan iconos (feedback Carlos).
   ============================================================ */

/* Cada icono trae su propio <defs> con gradiente y un filtro glow.
   id unicos por icono para no colisionar. Tamaño 22x22 fino. */
function ico(id, inner) {
  return `<svg class="bp-ico" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="g_${id}" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFB627"/><stop offset="0.5" stop-color="#D13F26"/><stop offset="1" stop-color="#EF5036"/>
      </linearGradient>
      <filter id="f_${id}" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="0.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <g stroke="url(#g_${id})" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#f_${id})">
      ${inner}
    </g>
  </svg>`;
}

const ICONOS_RESULTADO = {
  // Patron caracteristico — huella/onda de patron
  patron: ico("pat", '<path d="M3 14c1.5 0 1.5-5 3-5s1.5 7 3 7 1.5-9 3-9 1.5 6 3 6 1.5-3 3-3"/><circle cx="21" cy="10" r="0.5" fill="url(#g_pat)"/>'),
  // Quien eres — figura/identidad con aura
  quien: ico("qui", '<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><path d="M12 2.5v1.2M19 7l-.9.7M5 7l.9.7" opacity="0.7"/>'),
  // Lo que tu cuerpo dice — globo de voz somatico
  dice: ico("dic", '<path d="M4 6.5h16v9H9l-4 3.5v-3.5H4z"/><path d="M8.5 11h7M8.5 8.5h4" opacity="0.85"/>'),
  // Lo que esta en juego — alerta elegante (escudo + signo)
  juego: ico("jue", '<path d="M12 2.5l7.5 3v6c0 4.5-3.2 8-7.5 10C7.7 19.5 4.5 16 4.5 11.5v-6z"/><path d="M12 8v4M12 15v.3" opacity="0.95"/>'),
  // Tu fortaleza — diamante/gema
  fortaleza: ico("for", '<path d="M5 9l3-4.5h8L19 9l-7 11z"/><path d="M5 9h14M9.5 4.5L8 9l4 11M14.5 4.5L16 9l-4 11" opacity="0.7"/>'),
  // Hacia donde vas — flecha ascendente/portal
  hacia: ico("hac", '<path d="M12 20V6"/><path d="M6 11l6-6 6 6"/><path d="M7 20h10" opacity="0.6"/>'),
  // Lo que vas a lograr — estrella/logro
  lograr: ico("log", '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z"/>')
};

window.BIOSCAN_ICONOS_RESULTADO = ICONOS_RESULTADO;

