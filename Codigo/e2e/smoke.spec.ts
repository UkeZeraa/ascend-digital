import { test, expect } from "@playwright/test";

test("home carrega sem erros de console e sem violação de CSP", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("/");
  await expect(page).toHaveTitle(/Ascend Digital/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // seções âncora presentes
  for (const id of ["#como-funciona", "#casos", "#depoimentos", "#planos", "#briefing"]) {
    await expect(page.locator(id)).toHaveCount(1);
  }

  expect(errors, `console/page errors: ${errors.join("\n")}`).toEqual([]);
});

test("menu mobile abre e navega", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no projeto mobile");
  await page.goto("/");

  await page.getByRole("button", { name: /abrir menu/i }).click();
  const link = page.getByRole("link", { name: "Planos" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.locator("#planos")).toBeInViewport({ ratio: 0.1 });
});

test("/admin exige login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Painel Ascend Digital/i })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
});
