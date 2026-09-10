-- Reposicionamento: briefings deixa de ser sobre identidade visual e passa a
-- ser sobre projetos digitais (automação / dashboard / site).
-- Tabela com 0 linhas — sem migração de dados.

ALTER TABLE public.briefings
  DROP COLUMN IF EXISTS segment,
  DROP COLUMN IF EXISTS style,
  DROP COLUMN IF EXISTS color_pref,
  DROP COLUMN IF EXISTS reference,
  DROP COLUMN IF EXISTS slogan,
  DROP COLUMN IF EXISTS has_logo,
  DROP COLUMN IF EXISTS ideal_client,
  DROP COLUMN IF EXISTS expectations;

ALTER TABLE public.briefings
  ADD COLUMN IF NOT EXISTS project_type  TEXT,
  ADD COLUMN IF NOT EXISTS current_tools TEXT,
  ADD COLUMN IF NOT EXISTS kpis          TEXT,
  ADD COLUMN IF NOT EXISTS deadline      TEXT;

-- Colunas mantidas: name, whatsapp, email, business_name (NOT NULL);
-- plan (nullable, repurposado); description (nullable); published; timestamps.
-- Modelo de acesso inalterado: RLS on, insert só via edge function; admin lê/edita.
