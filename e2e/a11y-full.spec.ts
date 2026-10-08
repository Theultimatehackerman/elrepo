import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { DYNAMIC_ROUTES, loginDemo, STATIC_ROUTES, THEMES, waitHydrated } from "./helpers";

// axe completo (WCAG 2.0/2.1 A e AA), SEM `color-contrast`: contraste já é verificado em a11y.spec.ts.
// (Rodar contraste aqui também deu falso positivo intermitente na landing no claro, em plena animação de entrada.)
// Defeitos PRÉ-EXISTENTES, idênticos nos dois temas e sem relação com tema, ficam em KNOWN por
// "rota|regra" com motivo (nunca por regra inteira). Cada um está listado em ACTION-PLAN §8 (Achados).
// Corrigir um item aqui = remover a linha; o teste passa a exigir que ele continue limpo.
const KNOWN: Record<string, string> = {};

for (const theme of THEMES) {
  test.describe(`axe wcag2a/2aa — tema ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await loginDemo(page, theme);
    });
    for (const route of [...STATIC_ROUTES, ...DYNAMIC_ROUTES]) {
      test(`${route}`, async ({ page }) => {
        await page.goto(route);
        await waitHydrated(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).disableRules(["color-contrast"]).analyze();
        const found = results.violations.filter((v) => !(`${route}|${v.id}` in KNOWN));
        const summary = found.flatMap((v) => v.nodes.slice(0, 3).map((n) => `[${v.id}] ${n.target.join(" ")}`));
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  });
}
