import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { DYNAMIC_ROUTES, loginDemo, STATIC_ROUTES, THEMES, waitHydrated } from "./helpers";

const ROUTES = [...STATIC_ROUTES.filter((r) => r !== "/register"), ...DYNAMIC_ROUTES];

for (const theme of THEMES) {
  test.describe(`axe — tema ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await loginDemo(page, theme);
    });

    for (const route of ROUTES) {
      test(`${route} sem violações de contraste`, async ({ page }) => {
        await page.goto(route);
        await waitHydrated(page);
        const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
        const summary = results.violations.flatMap((v) =>
          v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1] ?? ""}`),
        );
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  });
}
