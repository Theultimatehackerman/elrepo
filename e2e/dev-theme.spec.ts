import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { THEMES, waitHydrated, type Theme } from "./helpers";

// L13: vitrine /dev/theme (só em desenvolvimento). L14: troca de tema sem transições animadas.
// No CI o e2e roda sobre `build + start` (produção, ver playwright.config.ts): lá a vitrine DEVE dar 404
// e os testes que dependem dela são pulados; local (`next dev`) acontece o contrário.
const PRODUCTION = !!process.env.CI;

test("em produção /dev/theme dá 404", async ({ page }) => {
  test.skip(!PRODUCTION, "só vale sobre build + start (CI)");
  const response = await page.goto("/dev/theme");
  expect(response?.status()).toBe(404);
});

test.describe("vitrine em desenvolvimento", () => {
test.skip(PRODUCTION, "vitrine não existe em produção");
async function open(page: import("@playwright/test").Page, theme: Theme) {
  await page.addInitScript(([t]) => localStorage.setItem("content-os-theme", t), [theme]);
  await page.goto("/dev/theme");
  await waitHydrated(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

for (const theme of THEMES) {
  test.describe(`/dev/theme — tema ${theme}`, () => {
    test("lista os tokens com razão de contraste AA", async ({ page }) => {
      await open(page, theme);
      await expect(page.getByTestId("token-table").getByText("--color-primary-text")).toBeVisible();
      await expect(page.getByTestId("ratio-foreground")).toBeVisible();
      const ratios = await page.locator('[data-testid^="ratio-"]').allTextContents();
      expect(ratios.length).toBeGreaterThanOrEqual(15);
      for (const text of ratios) {
        const value = Number(/([\d.]+):1/.exec(text)?.[1]);
        expect(value, text).toBeGreaterThanOrEqual(4.5);
      }
    });

    test("sem violações de contraste (axe)", async ({ page }) => {
      await open(page, theme);
      const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
      const summary = results.violations.flatMap((v) =>
        v.nodes.slice(0, 5).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1] ?? ""}`),
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  });
}

test("troca de tema suprime transições por um instante e depois as restaura (L14)", async ({ page }) => {
  await open(page, "dark");
  const probe = await page.evaluate(async () => {
    const button = document.querySelector("main button:not([disabled])") as HTMLElement;
    const before = getComputedStyle(button).transitionProperty;
    // Dispara a mesma via de uma troca real vinda de outra aba (evento `storage`).
    localStorage.setItem("content-os-theme", "light");
    window.dispatchEvent(new StorageEvent("storage", { key: "content-os-theme" }));
    const during = {
      theme: document.documentElement.getAttribute("data-theme"),
      styleTag: !!document.getElementById("theme-no-transition"),
      property: getComputedStyle(button).transitionProperty,
    };
    await new Promise((r) => setTimeout(r, 150));
    const after = {
      styleTag: !!document.getElementById("theme-no-transition"),
      property: getComputedStyle(button).transitionProperty,
    };
    return { before, during, after };
  });
  expect(probe.before).not.toBe("none");
  expect(probe.during).toEqual({ theme: "light", styleTag: true, property: "none" });
  expect(probe.after.styleTag).toBe(false);
  expect(probe.after.property).toBe(probe.before);
});
});
