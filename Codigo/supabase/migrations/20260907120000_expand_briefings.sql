-- Expande a tabela briefings para os 13 campos do formulário completo
-- (public/briefing-identidade-mei.html). Campos novos são todos opcionais.

ALTER TABLE public.briefings
  ADD COLUMN IF NOT EXISTS ideal_client TEXT,
  ADD COLUMN IF NOT EXISTS style        TEXT,
  ADD COLUMN IF NOT EXISTS color_pref   TEXT,
  ADD COLUMN IF NOT EXISTS reference    TEXT,
  ADD COLUMN IF NOT EXISTS slogan       TEXT,
  ADD COLUMN IF NOT EXISTS has_logo     TEXT,
  ADD COLUMN IF NOT EXISTS expectations TEXT;

-- Índice para a listagem do painel admin (mais recentes primeiro).
CREATE INDEX IF NOT EXISTS briefings_created_at_idx
  ON public.briefings (created_at DESC);

-- Modelo de acesso mantido: RLS ligado, nenhuma policy de INSERT anônimo.
-- Os envios entram apenas via edge function submit-briefing (service role).
