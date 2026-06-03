/* ============================================================
   BIOSCAN 5D · MODO UMBRAL
   config.js — Configuracion publica del frontend
   ------------------------------------------------------------
   IMPORTANTE sobre seguridad:
   - SUPABASE_ANON_KEY es PUBLICA por diseno (Supabase la protege
     con Row Level Security). Es seguro tenerla aqui.
   - El TOKEN de RD Station NO va aqui. Va en la Netlify Function
     (variable de entorno del servidor), nunca en el cliente.
   - El algoritmo NO va aqui. Va en la Netlify Function.

   Carlos: reemplaza los valores TU_... con tus credenciales reales
   de Supabase (Project Settings -> API).
   ============================================================ */

window.BIOSCAN_CONFIG = {
  // --- Supabase (publico, protegido por RLS) ---
  SUPABASE_URL: "https://eiugtjmjkojuatliooql.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWd0am1qa29qdWF0bGlvb3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzg3MjcsImV4cCI6MjA5NDYxNDcyN30.2LNqBbBFb4qGeX_SpEd32e2l8qv7B2ncC9f9BfVY-r4",

  // --- Endpoint de la Netlify Function del algoritmo ---
  // En produccion Netlify lo sirve automaticamente en esta ruta:
  ENDPOINT_CALCULAR: "/.netlify/functions/calcular-perfil",

  // --- Endpoint de la Netlify Function que envia a RD Station ---
  // (se construye en el Sub-mensaje 2.3; por ahora dejamos la ruta lista)
  ENDPOINT_RDSTATION: "/.netlify/functions/enviar-rdstation",

  ENDPOINT_ESTADO: "/api/estado-diagnostico",

  // --- Fecha del Umbral (para logica de fechas del modulo PRO) ---
  FECHA_UMBRAL: "2026-05-30T18:00:00-05:00",

  // --- URL de inscripcion al Umbral (acceso abierto) ---
  URL_UMBRAL: "https://www.5d.com.co/umbral-5d-01/",

  // ============================================================
  // MODULO PRO (Sub-mensaje 2.4) — endpoints de activacion y progreso
  // Coinciden con los redirects de netlify.toml.
  // ============================================================
  ENDPOINT_ACTIVAR: "/api/activar-codigo",
  ENDPOINT_RECUPERAR: "/api/recuperar-diagnostico",
  ENDPOINT_PROGRESO: "/api/progreso"
};

