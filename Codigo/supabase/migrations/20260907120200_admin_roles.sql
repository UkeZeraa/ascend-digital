-- Papéis de usuário + função has_role() (padrão Supabase: tabela dedicada,
-- SECURITY DEFINER para evitar recursão de RLS) e as policies de admin
-- para briefings e testimonials.

-- Enum de papéis (guardado contra recriação).
DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id      UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Cada usuário enxerga só os próprios papéis. Concessão de papel é feita
-- via SQL/service role (nunca pelo cliente).
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ── briefings: acesso de admin ────────────────────────────────────────────
DROP POLICY IF EXISTS "Deny all selects on briefings" ON public.briefings;

DROP POLICY IF EXISTS "Admins read briefings" ON public.briefings;
CREATE POLICY "Admins read briefings"
  ON public.briefings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update briefings" ON public.briefings;
CREATE POLICY "Admins update briefings"
  ON public.briefings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ── testimonials: acesso de admin ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admins read all testimonials" ON public.testimonials;
CREATE POLICY "Admins read all testimonials"
  ON public.testimonials
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update testimonials" ON public.testimonials;
CREATE POLICY "Admins update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete testimonials" ON public.testimonials;
CREATE POLICY "Admins delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Depois de criar a conta em Supabase Studio ▸ Authentication, conceder o papel:
--   INSERT INTO public.user_roles (user_id, role)
--   SELECT id, 'admin' FROM auth.users WHERE email = 'news@cumbreagro.com'
--   ON CONFLICT DO NOTHING;
