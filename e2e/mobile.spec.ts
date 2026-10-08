import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { loginDemo, STATIC_ROUTES, THEMES, waitHydrated } from "./helpers";

// Viewport Pixel 7 (412×915). Rotas autenticadas + MobileNav aberta, nos 2 temas.
// `color-contrast` roda separado (axe completo dá falso positivo em animação, ver ACTION-PLAN A6).
const ROUTES = STATIC_ROUTES.filter((r) => !["/", "/login", "/register"].includes(r));
const KNOWN: Record<string, string> = {
  "/content|button-name": "A1: SelectTrigger sem nome (pré-existente)",
  "/calendar|button-name": "A1: SelectTrigger sem nome (pré-existente)",
  "/calendar|aria-valid-attr-value": "A2: aria-controls inválido (pré-existente)",
  "/settings|label": "A3: input sem label (pré-existente)",
};

for (const theme of THEMES) {
  test.describe(`mobile — tema ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await loginDemo(page, theme);
    });

    for (const route of ROUTES) {
      test(`${route}: sem overflow horizontal, axe e contraste`, async ({ page }) => {
        await page.goto(route);
        await waitHydrated(page);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, "scroll horizontal na página").toBeLessThanOrEqual(0);
        const full = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).disableRules(["color-contrast"]).analyze();
        const found = full.violations.filter((v) => !(`${route}|${v.id}` in KNOWN));
        const s1 = found.flatMap((v) => v.nodes.slice(0, 3).map((n) => `[${v.id}] ${n.target.join(" ")}`));
        expect(s1, s1.join("\n")).toEqual([]);
        const c = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
        const s2 = c.violations.flatMap((v) => v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1] ?? ""}`));
        expect(s2, s2.join("\n")).toEqual([]);
      });
    }

    test("MobileNav abre, tem contraste e navega", async ({ page }) => {
      await page.goto("/dashboard");
      await waitHydrated(page);
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const c = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
      const s = c.violations.flatMap((v) => v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1] ?? ""}`));
      expect(s, s.join("\n")).toEqual([]);
      await dialog.getByRole("link", { name: "Calendar" }).click();
      await page.waitForURL(/calendar/);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    });
  });
}
