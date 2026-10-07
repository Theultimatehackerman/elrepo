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
