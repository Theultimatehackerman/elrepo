import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/login", "/dashboard", "/content", "/calendar", "/clients", "/campaigns", "/approvals", "/settings"];

for (const theme of ["dark", "light"] as const) {
  test.describe(`axe — tema ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(([t]) => localStorage.setItem("content-os-theme", t), [theme]);
      await page.goto("/login");
      await page.getByRole("button", { name: /demonstra/i }).first().click();
      await page.waitForURL(/dashboard/);
    });

    for (const route of ROUTES) {
      test(`${route} sem violações de contraste`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
        const summary = results.violations.flatMap((v) =>
          v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1] ?? ""}`),
        );
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  });
}
