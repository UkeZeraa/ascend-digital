/**
 * Validadores puros e testáveis, compartilhados pela UI.
 * Espelham as regras aplicadas server-side em
 * `supabase/functions/_shared/validate.ts` — mantenha os dois em sincronia.
 */

import { PROJECT_TYPES, DEADLINES, PLANS } from "@/lib/briefing-options";

export const LIMITS = {
  name: 120,
  whatsappMin: 8,
  whatsappMax: 20,
  email: 255,
  businessName: 160,
  shortText: 280,
  longText: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): boolean {
  const v = value.trim();
  return v.length >= 5 && v.length <= LIMITS.email && EMAIL_RE.test(v);
}

export function validateWhatsapp(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return (
    digits.length >= 10 &&
    digits.length <= 13 &&
    value.trim().length >= LIMITS.whatsappMin &&
    value.trim().length <= LIMITS.whatsappMax
  );
}

export type BriefingInput = {
  name?: string;
  whatsapp?: string;
  email?: string;
  business_name?: string;
  project_type?: string;
  plan?: string | null;
  description?: string | null;
  current_tools?: string | null;
  kpis?: string | null;
  deadline?: string | null;
  /** honeypot — deve vir vazio */
  company_website?: string | null;
};

export type ValidationResult = { valid: boolean; errors: Record<string, string> };

function reqText(errors: Record<string, string>, key: string, value: unknown, label: string, max: number) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) errors[key] = `${label} é obrigatório.`;
  else if (v.length > max) errors[key] = `${label} é muito longo (máx ${max}).`;
}

function optText(errors: Record<string, string>, key: string, value: unknown, label: string, max: number) {
  const v = typeof value === "string" ? value.trim() : "";
  if (v && v.length > max) errors[key] = `${label} é muito longo (máx ${max}).`;
}

function oneOf(
  errors: Record<string, string>,
  key: string,
  value: unknown,
  allowed: readonly string[],
  label: string,
  required = false,
) {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    if (required) errors[key] = `Selecione ${label}.`;
    return;
  }
  if (!allowed.includes(v)) errors[key] = `${label} inválido.`;
}

export function validateBriefing(input: BriefingInput): ValidationResult {
  const errors: Record<string, string> = {};

  reqText(errors, "name", input.name, "Nome", LIMITS.name);
  reqText(errors, "business_name", input.business_name, "Nome da empresa", LIMITS.businessName);

  if (!input.whatsapp?.trim()) errors.whatsapp = "WhatsApp é obrigatório.";
  else if (!validateWhatsapp(input.whatsapp)) errors.whatsapp = "WhatsApp inválido. Use DDD + número.";

  if (!input.email?.trim()) errors.email = "E-mail é obrigatório.";
  else if (!validateEmail(input.email)) errors.email = "Formato de e-mail inválido.";

  oneOf(errors, "project_type", input.project_type, PROJECT_TYPES, "o tipo de projeto", true);
  oneOf(errors, "deadline", input.deadline, DEADLINES, "o prazo");
  oneOf(errors, "plan", input.plan, PLANS, "o plano");

  optText(errors, "description", input.description, "A descrição", LIMITS.longText);
  optText(errors, "current_tools", input.current_tools, "As ferramentas atuais", LIMITS.shortText);
  optText(errors, "kpis", input.kpis, "Os indicadores", LIMITS.shortText);

  return { valid: Object.keys(errors).length === 0, errors };
}

export type TestimonialInput = {
  name?: string;
  role?: string | null;
  rating?: number;
  text?: string;
  company_website?: string | null; // honeypot
};

export function validateTestimonial(input: TestimonialInput): ValidationResult {
  const errors: Record<string, string> = {};

  reqText(errors, "name", input.name, "Nome", LIMITS.name);
  reqText(errors, "text", input.text, "Depoimento", LIMITS.longText);
  optText(errors, "role", input.role, "A função", LIMITS.shortText);

  const r = Number(input.rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) errors.rating = "Selecione de 1 a 5 estrelas.";

  const t = (input.text ?? "").trim();
  if (t && t.length < 10) errors.text = "Conte um pouco mais (mín. 10 caracteres).";

  return { valid: Object.keys(errors).length === 0, errors };
}

/** true = provável bot (honeypot preenchido) */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
