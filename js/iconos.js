/* ============================================================
   BIOSCAN 5D — iconos.js
   Iconos SVG de linea fina, dibujados a medida (no emojis).
   Color via stroke heredado de CSS (.q-icono path { stroke }).
   ============================================================ */
const ICONOS = {
  // columna vertebral
  columna: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M12 3c0 2-1 3-1 5s1 3 1 5 1 3 0 5"/><path d="M10 5h4M9.5 9h4M10 13h4M11 17h3"/></svg>',
  // zonas de tension (cuerpo con puntos)
  tension: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V15M8 10l4-1 4 1M9 20l3-5 3 5"/></svg>',
  // silla / postura sentada
  silla: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M7 4v8M7 12h8M15 4v8M7 12l-1 7M15 12l1 7M6 9h9"/></svg>',
  // presion (reloj/tension previa)
  presion: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="13" r="7"/><path d="M12 13V9M12 4h0M9 4h6"/></svg>',
  // desafio (flechas opuestas)
  desafio: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M4 12h7M8 9l3 3-3 3M20 12h-7M16 9l-3 3 3 3"/></svg>',
  // respiracion (ondas)
  respiracion: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M3 10c2 0 2-2 4-2s2 4 4 4 2-4 4-4 2 2 4 2"/><path d="M3 15c2 0 2-1.5 4-1.5s2 3 4 3 2-3 4-3 2 1.5 4 1.5"/></svg>',
  // voz (ondas de sonido)
  voz: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M12 4v16M8 8v8M16 8v8M4 11v2M20 11v2"/></svg>',
  // percepcion (ojo)
  percepcion: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/></svg>',
  // negociacion (manos/balance)
  negociacion: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v18M5 7h14M5 7l-2 5h4zM19 7l-2 5h4z"/></svg>',
  // atencion (punto focal)
  atencion: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
  // pausa
  pausa: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M10 9v6M14 9v6"/></svg>',
  // reto (bandera/cima)
  reto: '<svg class="q-icono" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M6 21V4M6 4l10 3-10 3"/><path d="M6 4c3-1 6-1 9 0"/></svg>'
};

// Ilustraciones SVG de las 4 posturas clave (Decision B1)
const POSTURAS = {
  encorvada: '<svg viewBox="0 0 60 80" fill="none" stroke-width="2" stroke-linecap="round" stroke="currentColor"><circle cx="34" cy="14" r="7"/><path d="M34 21c-2 6-6 10-6 16M28 37c0 8 2 14 2 20M28 37h10M38 37c0 8 0 14 0 20"/><path d="M18 60h28"/></svg>',
  apoyada_caida: '<svg viewBox="0 0 60 80" fill="none" stroke-width="2" stroke-linecap="round" stroke="currentColor"><circle cx="28" cy="14" r="7"/><path d="M28 21c-1 5-3 8-3 14M25 35v22M25 35h11M36 35v22"/><path d="M16 57h30M40 18v40"/></svg>',
  recta_tensa: '<svg viewBox="0 0 60 80" fill="none" stroke-width="2" stroke-linecap="round" stroke="currentColor"><circle cx="30" cy="13" r="7"/><path d="M30 20v18M30 38h0M24 38v19M36 38v19M22 26h16"/><path d="M16 57h28"/></svg>',
  expandida: '<svg viewBox="0 0 60 80" fill="none" stroke-width="2" stroke-linecap="round" stroke="currentColor"><circle cx="30" cy="12" r="7"/><path d="M30 19v19M30 38h0M24 38v19M36 38v19M20 25c5-3 15-3 20 0"/><path d="M16 57h28"/></svg>'
};

window.BIOSCAN_ICONOS = ICONOS;
window.BIOSCAN_POSTURAS = POSTURAS;

