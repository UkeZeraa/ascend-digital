-- Tabela de depoimentos com moderação (flag published), espelhando o padrão
-- da tabela briefings: RLS ligado, sem INSERT anônimo (só via edge function),
-- leitura pública restrita aos aprovados.

CREATE TABLE IF NOT EXISTS public.testimonials (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text       TEXT NOT NULL,
  avatar_url TEXT,
  published  BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante lê apenas os depoimentos aprovados.
DROP POLICY IF EXISTS "Public reads published testimonials" ON public.testimonials;
CREATE POLICY "Public reads published testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Sem policy de INSERT: envios entram só pela edge function submit-testimonial.

CREATE INDEX IF NOT EXISTS testimonials_published_created_idx
  ON public.testimonials (published, created_at DESC);

-- Reaproveita a função de timestamp criada na migration inicial de briefings.
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: os 5 depoimentos que antes eram hardcoded no front-end.
INSERT INTO public.testimonials (name, role, rating, text, avatar_url, published)
VALUES
  ('Lucas Mendes', 'Barbearia · Rio de Janeiro', 5,
   'Antes do kit eu tinha vergonha de mandar meu número pro cliente. Depois da Ascend Visual passei a cobrar 30% a mais e ninguém reclamou. Valeu demais!',
   '/testimonials/lucas-mendes.jpg', true),
  ('Camila Oliveira', 'Estética · Belo Horizonte', 5,
   'Profissionalismo total. Meus clientes elogiam demais a nova identidade. Melhor investimento que fiz pro meu MEI!',
   '/testimonials/camila-oliveira.jpg', true),
  ('Juliana Ramos', 'Maquiadora · São Paulo', 5,
   'Fiz o Plano Premium e escolhi o site como bônus. Ficou incrível! Agora tenho uma página profissional.',
   '/testimonials/juliana-ramos.jpg', true),
  ('Fernanda Costa', 'Loja de Acessórios · Curitiba', 5,
   'Minha loja de acessórios ganhou outra cara. As clientes pedem até o cartão digital agora. Recomendo muito!',
   '/testimonials/fernanda-costa.jpg', true),
  ('Rafael Souza', 'Hamburgueria · Salvador', 5,
   'Recebi tudo em menos de 48h, como prometido. A logo ficou exatamente do jeito que eu imaginava. Top demais!',
   '/testimonials/rafael-souza.jpg', true)
ON CONFLICT DO NOTHING;
