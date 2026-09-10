import { describe, expect, it } from "vitest";

import { PROJECT_TYPES, DEADLINES, PLANS } from "@/lib/briefing-options";

describe("briefing-options", () => {
  it("tipos de projeto: lista não vazia, única, com a saída 'Ainda não sei'", () => {
    expect(PROJECT_TYPES.length).toBeGreaterThan(3);
    expect(new Set(PROJECT_TYPES).size).toBe(PROJECT_TYPES.length);
    expect(PROJECT_TYPES).toContain("Automação de processo");
    expect(PROJECT_TYPES).toContain("Dashboard de KPIs");
    expect(PROJECT_TYPES).toContain("Ainda não sei");
  });

  it("prazos cobrem de urgente a sem pressa", () => {
    expect(DEADLINES).toContain("Pra ontem");
    expect(DEADLINES).toContain("Sem pressa");
    expect(new Set(DEADLINES).size).toBe(DEADLINES.length);
  });

  it("planos: 4 opções únicas", () => {
    expect(PLANS).toHaveLength(4);
    expect(new Set(PLANS).size).toBe(PLANS.length);
    expect(PLANS.some((p) => p.startsWith("Automação"))).toBe(true);
    expect(PLANS.some((p) => p.startsWith("Dashboard de KPIs"))).toBe(true);
  });
});
