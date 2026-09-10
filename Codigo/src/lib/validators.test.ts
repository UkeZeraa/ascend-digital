import { describe, expect, it } from "vitest";

import {
  validateEmail,
  validateWhatsapp,
  validateBriefing,
  validateTestimonial,
  isHoneypotTripped,
} from "@/lib/validators";

describe("validateEmail", () => {
  it("aceita e-mails válidos", () => {
    expect(validateEmail("ana@empresa.com")).toBe(true);
    expect(validateEmail("  ana.lima@dominio.com.br ")).toBe(true);
  });
  it("rejeita inválidos", () => {
    expect(validateEmail("ana@")).toBe(false);
    expect(validateEmail("ana empresa.com")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });
});

describe("validateWhatsapp", () => {
  it("aceita número com DDD", () => {
    expect(validateWhatsapp("(11) 99999-9999")).toBe(true);
    expect(validateWhatsapp("11999999999")).toBe(true);
  });
  it("rejeita curto demais", () => {
    expect(validateWhatsapp("9999")).toBe(false);
  });
});

describe("validateBriefing", () => {
  const base = {
    name: "Ana Lima",
    whatsapp: "(11) 99999-9999",
    email: "ana@empresa.com",
    business_name: "Loja da Bela",
    project_type: "Automação de processo",
  };

  it("passa com os obrigatórios", () => {
    expect(validateBriefing(base).valid).toBe(true);
  });

  it("acusa tipo de projeto fora da lista", () => {
    const r = validateBriefing({ ...base, project_type: "Inventado" });
    expect(r.valid).toBe(false);
    expect(r.errors.project_type).toBeTruthy();
  });

  it("acusa e-mail e whatsapp inválidos", () => {
    const r = validateBriefing({ ...base, email: "x", whatsapp: "1" });
    expect(r.errors.email).toBeTruthy();
    expect(r.errors.whatsapp).toBeTruthy();
  });

  it("valida enums opcionais quando presentes", () => {
    expect(validateBriefing({ ...base, deadline: "2 a 4 semanas" }).valid).toBe(true);
    expect(validateBriefing({ ...base, deadline: "amanhã cedo" }).errors.deadline).toBeTruthy();
  });

  it("limita o tamanho dos campos livres", () => {
    const r = validateBriefing({ ...base, current_tools: "x".repeat(400) });
    expect(r.errors.current_tools).toBeTruthy();
  });
});

describe("validateTestimonial", () => {
  it("exige nome, texto de 10+ e nota 1-5", () => {
    expect(validateTestimonial({ name: "Ana", text: "Automatizou tudo, virou outra empresa!", rating: 5 }).valid).toBe(true);
    expect(validateTestimonial({ name: "Ana", text: "curto", rating: 5 }).errors.text).toBeTruthy();
    expect(validateTestimonial({ name: "Ana", text: "Depoimento ok aqui", rating: 0 }).errors.rating).toBeTruthy();
  });
});

describe("isHoneypotTripped", () => {
  it("true só quando há conteúdo", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped("http://spam")).toBe(true);
  });
});
