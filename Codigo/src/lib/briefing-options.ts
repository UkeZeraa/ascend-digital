/**
 * Fonte única das listas do briefing (Ascend Digital).
 * Usada pelo formulário React (`BriefingForm`), pelo formulário estático
 * (`public/js/briefing.js`) e espelhada em `supabase/functions/_shared/options.ts`
 * para a validação server-side. Mantenha os três em sincronia.
 */

export const PROJECT_TYPES = [
  "Automação de processo",
  "Dashboard de KPIs",
  "Site institucional / landing page",
  "Site + Automação",
  "Integração entre sistemas",
  "Ainda não sei",
] as const;

export const DEADLINES = [
  "Pra ontem",
  "2 a 4 semanas",
  "1 a 2 meses",
  "Sem pressa",
] as const;

export const PLANS = [
  "Automação — a partir de R$ 900",
  "Dashboard de KPIs — a partir de R$ 1.200",
  "Operação completa — sob consulta",
  "Ainda não sei",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Deadline = (typeof DEADLINES)[number];
export type Plan = (typeof PLANS)[number];
