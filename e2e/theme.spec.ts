import { expect, test, type Page } from "@playwright/test";

const KEY = "content-os-theme";
const themeOf = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme);

async function demoLogin(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /demonstra/i }).first().click();
  await page.waitForURL(/dashboard/);
}

test("visitante novo começa no escuro (D2)", async ({ page }) => {
  await page.goto("/");
  expect(await themeOf(page)).toBe("dark");
});

test("escolha persiste após recarregar e aplica antes da hidratação (sem flash)", async ({ page }) => {
  await page.addInitScript(([k]) => localStorage.setItem(k, "light"), [KEY]);
  // O atributo precisa estar correto já no HTML parseado, antes de qualquer JS do React.
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(await themeOf(page)).toBe("light");
});

test("ThemeToggle troca o tema e grava a preferência", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Alterar tema").click();
  await page.getByRole("menuitemradio", { name: "Claro" }).click();
  expect(await themeOf(page)).toBe("light");
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe("light");
  await page.reload();
  expect(await themeOf(page)).toBe("light");
});

test("'Sistema' acompanha o SO em tempo real", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(([k]) => localStorage.setItem(k, "system"), [KEY]);
  await page.goto("/login");
  // ThemeSync só escuta o SO depois que o React hidrata: espera o marcador do React 19.
  await page.waitForFunction(() => Object.keys(document).some((k) => k.startsWith("__reactContainer")));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  expect(await themeOf(page)).toBe("light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => themeOf(page), { timeout: 20_000 }).toBe("dark");
});

test("Settings → Preferências altera o tema", async ({ page }) => {
  await demoLogin(page);
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Preferências" }).click();
  await page.getByRole("combobox", { name: "Tema" }).click();
  await page.getByRole("option", { name: "Claro" }).click();
  expect(await themeOf(page)).toBe("light");
});

// L16: atalho Alt+Shift+T. O listener só existe depois de hidratar (mesma corrida do A11), então a tecla é repetida
// até a troca ocorrer: cada tecla é tratada na hora ou nunca, logo não há risco de dupla troca.
async function pressShortcutUntil(page: Page, expected: "light" | "dark") {
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Alt+Shift+T");
    if ((await themeOf(page)) === expected) return;
    await page.waitForTimeout(150);
  }
  throw new Error(`Alt+Shift+T não levou ao tema ${expected}`);
}

test("atalho Alt+Shift+T alterna escuro↔claro e persiste (L16)", async ({ page }) => {
  await page.goto("/");
  await pressShortcutUntil(page, "light");
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe("light");
  await page.keyboard.press("Alt+Shift+T");
  expect(await themeOf(page)).toBe("dark");
  await pressShortcutUntil(page, "light");
  await page.reload();
  expect(await themeOf(page)).toBe("light");
});

test("atalho não age enquanto se digita num campo (L16)", async ({ page }) => {
  await page.goto("/login");
  await pressShortcutUntil(page, "light"); // prova que o listener está ativo
  await page.keyboard.press("Alt+Shift+T");
  expect(await themeOf(page)).toBe("dark");
  await page.locator("input").first().focus();
  await page.keyboard.press("Alt+Shift+T");
  expect(await themeOf(page)).toBe("dark");
});

test("ThemeToggle anuncia o atalho (aria-keyshortcuts) (L16)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Alterar tema")).toHaveAttribute("aria-keyshortcuts", "Alt+Shift+T");
});
