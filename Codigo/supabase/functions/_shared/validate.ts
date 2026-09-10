// Validação de payload server-side (Ascend Digital). Espelha src/lib/validators.ts.

import { PROJECT_TYPES, DEADLINES, PLANS } from "./options.ts";

export const LIMITS = {
  name: 120,
  whatsappMin: 8,
  whatsappMax: 20,
  email: 255,
  businessName: 160,
  shortText: 280,
  longText: 2000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export type Cleaned = Record<string, string | null>;

export type ValidateOutcome =
  | { ok: true; data: Cleaned }
  | { ok: false; error: string };

function checkReq(errors: string[], value: string, label: string, max: number) {
  if (!value) errors.push(`${label} é obrigatório.`);
  else if (value.length > max) errors.push(`${label} excede ${max} caracteres.`);
}

function checkOpt(errors: string[], value: string, label: string, max: number) {
  if (value && value.length > max) errors.push(`${label} excede ${max} caracteres.`);
}

function checkEnum(errors: string[], value: string, allowed: string[], label: string, required = false) {
  if (!value) {
    if (required) errors.push(`${label} é obrigatório.`);
    return;
  }
  if (!allowed.includes(value)) errors.push(`${label} inválido.`);
}

export function validateBriefing(body: Record<string, unknown>): ValidateOutcome {
  const errors: string[] = [];

  const name = str(body.name);
  const whatsapp = str(body.whatsapp);
  const email = str(body.email);
  const business_name = str(body.business_name);
  const project_type = str(body.project_type);
  const plan = str(body.plan);
  const description = str(body.description);
  const current_tools = str(body.current_tools);
  const kpis = str(body.kpis);
  const deadline = str(body.deadline);

  checkReq(errors, name, "Nome", LIMITS.name);
  checkReq(errors, business_name, "Nome da empresa", LIMITS.businessName);

  const digits = whatsapp.replace(/\D/g, "");
  if (!whatsapp) errors.push("WhatsApp é obrigatório.");
  else if (
    digits.length < 10 ||
    digits.length > 13 ||
    whatsapp.length < LIMITS.whatsappMin ||
    whatsapp.length > LIMITS.whatsappMax
  )
    errors.push("WhatsApp inválido.");

  if (!email) errors.push("E-mail é obrigatório.");
  else if (email.length < 5 || email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.push("Formato de e-mail inválido.");

  checkEnum(errors, project_type, PROJECT_TYPES, "Tipo de projeto", true);
  checkEnum(errors, deadline, DEADLINES, "Prazo");
  checkEnum(errors, plan, PLANS, "Plano");

  checkOpt(errors, description, "Descrição", LIMITS.longText);
  checkOpt(errors, current_tools, "Ferramentas atuais", LIMITS.shortText);
  checkOpt(errors, kpis, "Indicadores", LIMITS.shortText);

  if (errors.length) return { ok: false, error: errors[0] };

  return {
    ok: true,
    data: {
      name,
      whatsapp,
      email,
      business_name,
      project_type,
      plan: plan || null,
      description: description || null,
      current_tools: current_tools || null,
      kpis: kpis || null,
      deadline: deadline || null,
    },
  };
}

export function validateTestimonial(body: Record<string, unknown>): ValidateOutcome {
  const errors: string[] = [];

  const name = str(body.name);
  const role = str(body.role);
  const text = str(body.text);
  const rating = Number(body.rating);

  checkReq(errors, name, "Nome", LIMITS.name);
  checkReq(errors, text, "Depoimento", LIMITS.longText);
  checkOpt(errors, role, "Função", LIMITS.shortText);
  if (text && text.length < 10) errors.push("Depoimento muito curto.");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.push("Avaliação inválida.");

  if (errors.length) return { ok: false, error: errors[0] };

  return { ok: true, data: { name, role: role || null, text, rating: String(rating) } };
}
