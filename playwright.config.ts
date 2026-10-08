import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  expect: { timeout: 20_000 }, // dev server compila rota sob demanda (só afeta `next dev`; o CI usa build+start)
  timeout: 60_000, // dev server compila rota sob demanda no 1º acesso (CI usa build+start)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: /(mobile|visual)\.spec\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /mobile\.spec\.ts/ },
    // L10: só com VISUAL=1 (baselines do CI/Linux). Fora disso `npm run e2e` não o enxerga.
    ...(process.env.VISUAL
      ? [{ name: "visual", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 850 } }, testMatch: /visual\.spec\.ts/ }]
      : []),
  ],
  webServer: {
    command: process.env.CI ? `npm run build && npm run start -- -p ${PORT}` : `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
