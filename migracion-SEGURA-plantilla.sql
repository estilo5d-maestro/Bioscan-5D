-- ============================================================
-- BIOSCAN 5D · MÓDULO PRO — PLANTILLA DE MIGRACIÓN SEGURA
-- ------------------------------------------------------------
-- USA ESTE MÉTODO de aquí en adelante para CUALQUIER cambio.
--
-- REGLA DE ORO:
--   • NUNCA uses DROP TABLE una vez haya usuarios con progreso.
--   • Esta plantilla es IDEMPOTENTE: puedes correrla varias veces
--     sin daño. Solo agrega/ajusta lo que falte; conserva los datos.
--
-- Cómo usarla: copia el bloque que necesites, ajústalo y dale Run.
-- ============================================================


-- ─────────────────────────────────────────────────────────
-- BLOQUE A · AGREGAR UNA COLUMNA NUEVA (lo más común)
-- Ej: guardar una nota de voz, una preferencia, un campo nuevo.
-- Seguro: si la columna ya existe, no hace nada.
-- ─────────────────────────────────────────────────────────
ALTER TABLE public.progreso_plan
  ADD COLUMN IF NOT EXISTS nota_personal TEXT;

ALTER TABLE public.compradores_pro
  ADD COLUMN IF NOT EXISTS ejemplo_campo_nuevo TEXT;


-- ─────────────────────────────────────────────────────────
-- BLOQUE B · CAMBIAR UN VALOR POR DEFECTO o ampliar un límite
-- Ej: el día sube de 1–30 a 1–60. NO borra datos.
-- (Quita el check viejo y pon el nuevo; los datos quedan intactos.)
-- ─────────────────────────────────────────────────────────
-- ALTER TABLE public.progreso_plan DROP CONSTRAINT IF EXISTS progreso_plan_dia_numero_check;
-- ALTER TABLE public.progreso_plan ADD CONSTRAINT progreso_plan_dia_numero_check
--   CHECK (dia_numero >= 1 AND dia_numero <= 60);


-- ─────────────────────────────────────────────────────────
-- BLOQUE C · CREAR UNA TABLA NUEVA (sin tocar las existentes)
-- Ej: una tabla para guardar logros, suscripciones, etc.
-- Seguro: IF NOT EXISTS no la recrea si ya está.
-- ─────────────────────────────────────────────────────────
-- CREATE TABLE IF NOT EXISTS public.ejemplo_nueva_tabla (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   codigo TEXT NOT NULL,
--   creado_at TIMESTAMPTZ DEFAULT NOW()
-- );


-- ─────────────────────────────────────────────────────────
-- BLOQUE D · AÑADIR UN ÍNDICE (acelerar consultas) — seguro
-- ─────────────────────────────────────────────────────────
-- CREATE INDEX IF NOT EXISTS idx_ejemplo ON public.progreso_plan(email);


-- ============================================================
-- ❌ LO QUE NUNCA DEBES HACER con usuarios reales:
--    DROP TABLE ...            (borra toda la tabla y su data)
--    TRUNCATE ...              (vacía la tabla)
--    DELETE FROM ... sin WHERE (borra todas las filas)
--    DROP COLUMN ...           (borra una columna y sus datos)
-- Si crees necesitar uno de estos, primero exporta un respaldo
-- (Supabase → Database → Backups) y consúltalo antes.
-- ============================================================

