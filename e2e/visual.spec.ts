import { expect, test, type Page } from "@playwright/test";
import { loginDemo, STATIC_ROUTES, THEMES, waitHydrated, waitMotionSettled } from "./helpers";

// L10 — gate de regressão visual (D9). Roda só no projeto "visual" (VISUAL=1), viewport fixo 1366×850,
// contra `build + start` (sem o overlay do dev server). As baselines vêm do CI/Linux com a fonte real
// (workflow "Visual baselines"); NUNCA gere baselines em macOS/Windows: o antialiasing difere e dá falso diff.
const FIXED_TIME = new Date("2026-10-07T12:00:00Z"); // mesma data do Passo 0 do plano: dados "relativos a hoje" ficam estáveis
const ROUTES = [...STATIC_ROUTES, "/content/content_1", "/clients/client_acme", "/campaigns/campaign_black_friday"];
const slug = (route: string) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "-"));

// `Reveal` só anima ao entrar na viewport (IntersectionObserver): percorre a página para revelar tudo antes do print.
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
}

for (const theme of THEMES) {
  test.describe(`visual — tema ${theme}`, () => {
    for (const route of ROUTES) {
      test(route, async ({ page }) => {
        test.setTimeout(90_000);
        await page.clock.setFixedTime(FIXED_TIME);
        await loginDemo(page, theme);
        await page.goto(route);
        await waitHydrated(page);
        await revealAll(page);
        await waitMotionSettled(page);
        await expect(page).toHaveScreenshot(`${theme}-${slug(route)}.png`, {
          fullPage: true,
          animations: "disabled",
          caret: "hide",
          maxDiffPixelRatio: 0.002,
        });
      });
    }
  });
}
