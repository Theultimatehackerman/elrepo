import { expect, type Page } from "@playwright/test";

export type Theme = "dark" | "light";
export const THEMES: Theme[] = ["dark", "light"];

/** Rotas estáticas do app (exigem login de demonstração). */
export const STATIC_ROUTES = ["/", "/login", "/register", "/dashboard", "/content", "/calendar", "/clients", "/campaigns", "/approvals", "/settings"];

/** Rotas dinâmicas com ids reais dos dados de demonstração (src/data/mock-*.ts). */
export const DYNAMIC_ROUTES = ["/content/content_1", "/clients/client_acme", "/campaigns/campaign_black_friday", "/review/content_1", "/rota-que-nao-existe"];

export async function loginDemo(page: Page, theme: Theme) {
  await page.addInitScript(([t]) => localStorage.setItem("content-os-theme", t), [theme]);
  await page.goto("/login");
  await page.getByRole("button", { name: /demonstra/i }).first().click();
  await page.waitForURL(/dashboard/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}

/** Espera o React 19 hidratar (marcador interno) — mais confiável que `networkidle` sob carga. */
export async function waitHydrated(page: Page) {
  await page.waitForFunction(() => Object.keys(document).some((k) => k.startsWith("__reactContainer")));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/**
 * Espera as animações de entrada (framer-motion, ex.: `Reveal`) assentarem antes do axe: no meio do fade a cor
 * efetiva mistura opacidade (ex.: #7f8490 em vez do token) e o contraste "reprova" de forma intermitente (A6).
 * "Assentado" = todo elemento com opacidade inline está em 1, ou em 0 FORA da área visível (um oculto dentro dela
 * ainda vai animar assim que o IntersectionObserver disparar — `Reveal` usa margin -80px).
 * Limitado a 4 s: opacidade parcial permanente continua sendo avaliada (e reprovada) pelo axe.
 */
export async function waitMotionSettled(page: Page) {
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll<HTMLElement>('[style*="opacity"]')].every((el) => {
          const o = parseFloat(getComputedStyle(el).opacity);
          if (o === 1) return true;
          if (o !== 0) return false;
          const r = el.getBoundingClientRect();
          return r.bottom <= 80 || r.top >= window.innerHeight - 80 || r.width === 0 || r.height === 0;
        }),
      undefined,
      { timeout: 4000 },
    )
    .catch(() => {});
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}
