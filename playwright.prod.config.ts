// SANDBOX (scripts/sandbox/prod-e2e.sh): config do CI (CI=1) reaproveitando o `next start` já de pé.
import base from "./playwright.config";
import { defineConfig } from "@playwright/test";
// Mesma config do CI, mas reaproveitando o `next start` (build com fontes mockadas).
process.env.CI = "1";
export default defineConfig({ ...base, webServer: { ...base.webServer!, command: "echo reuse", reuseExistingServer: true } });
