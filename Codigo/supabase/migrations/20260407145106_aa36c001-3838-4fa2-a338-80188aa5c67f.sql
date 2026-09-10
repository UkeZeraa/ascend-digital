
-- Drop the old permissive policy
DROP POLICY "Anyone can submit a briefing" ON public.briefings;

-- Create a validated INSERT policy
CREATE POLICY "Validated briefing submissions" ON public.briefings
FOR INSERT TO anon, authenticated
WITH CHECK (
  -- Email format check
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  -- Length limits
  AND char_length(name) BETWEEN 1 AND 255
  AND char_length(whatsapp) BETWEEN 8 AND 30
  AND char_length(email) BETWEEN 5 AND 255
  AND char_length(business_name) BETWEEN 1 AND 255
  AND char_length(segment) BETWEEN 1 AND 100
  AND (plan IS NULL OR char_length(plan) BETWEEN 1 AND 100)
  AND (description IS NULL OR char_length(description) <= 2000)
  -- Restrict segment to known values
  AND segment IN (
    'Alimentação / Delivery',
    'Beleza / Estética',
    'Saúde / Bem-estar',
    'Moda / Roupas',
    'Serviços Gerais',
    'Tecnologia',
    'Educação / Cursos',
    'Construção / Reforma',
    'Outro'
  )
  -- Restrict plan to known values
  AND (plan IS NULL OR plan IN (
    'Starter — R$ 97',
    'Pro — R$ 197',
    'Premium — R$ 347',
    'Ainda não sei'
  ))
);
