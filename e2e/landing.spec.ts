import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { THEMES, waitHydrated } from "./helpers";

// L15: cada seção da landing, nos 2 temas: contraste por seção (rolando até ela) + screenshot em
// test-results/landing/ para revisão visual (não é gate de pixel; isso é N2).
for (const theme of THEMES) {
  test(`landing por seção — tema ${theme}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript(([t]) => localStorage.setItem("content-os-theme", t), [theme]);
    await page.goto("/");
    await waitHydrated(page);
    const sections = page.locator("main > *");
    const n = await sections.count();
    expect(n).toBeGreaterThanOrEqual(7);
    fs.mkdirSync("test-results/landing", { recursive: true });
    const problems: string[] = [];
    for (let i = 0; i < n; i++) {
      const sec = sections.nth(i);
      await sec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600); // deixa a animação de entrada (framer-motion) terminar
      await sec.screenshot({ path: `test-results/landing/${theme}-${String(i).padStart(2, "0")}.png`, animations: "disabled" });
      const r = await new AxeBuilder({ page }).include(`main > *:nth-child(${i + 1})`).withRules(["color-contrast"]).analyze();
      for (const v of r.violations) for (const nd of v.nodes.slice(0, 5)) problems.push(`seção ${i}: ${nd.target.join(" ")} :: ${nd.failureSummary?.split("\n")[1] ?? ""}`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
}
