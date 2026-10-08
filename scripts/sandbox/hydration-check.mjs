// Verifica console/erros de página (hidratação incluída) em produção, 2 temas, rotas públicas e do app.
// Uso (dentro do projeto, com `next start` de pé):  BASE=http://localhost:3101 node hydration-check.mjs
// Saída: uma linha por rota/tema + resumo; exit 1 se achar erro de página ou aviso de hidratação.
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3101";
const PUBLIC = ["/", "/login", "/register"];
const APP = ["/dashboard", "/content", "/calendar", "/clients", "/campaigns", "/approvals", "/settings", "/content/content_1", "/clients/client_acme", "/campaigns/campaign_black_friday", "/review/content_1"];
const HYDRATION = /hydrat|did not match|server rendered text|Minified React error #4(18|23|25)/i;
// Em máquina real sem rede para fontes/analytics, ignore só falhas de recurso externo (não de código).
const NOISE = /Failed to load resource|net::ERR_|favicon/i;

const browser = await chromium.launch();
let problems = 0;
for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 } });
  await ctx.addInitScript((t) => localStorage.setItem("content-os-theme", t), theme);
  const page = await ctx.newPage();
  const bag = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type()) && !NOISE.test(m.text())) bag.push(`[${m.type()}] ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => bag.push(`[pageerror] ${String(e).slice(0, 300)}`));
  const visit = async (route) => {
    bag.length = 0;
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForFunction(() => Object.keys(document).some((k) => k.startsWith("__reactContainer")), null, { timeout: 30000 });
    await page.waitForTimeout(800);
    const attr = await page.evaluate(() => document.documentElement.dataset.theme);
    const bad = bag.filter((l) => l.startsWith("[pageerror]") || HYDRATION.test(l));
    const other = bag.length - bad.length;
    if (bad.length || attr !== theme) problems++;
    console.log(`${theme.padEnd(5)} ${route.padEnd(36)} data-theme=${attr}  hidratação/erros=${bad.length}  outros avisos=${other}`);
    bad.forEach((l) => console.log("      ↳", l));
    if (other) bag.filter((l) => !bad.includes(l)).slice(0, 3).forEach((l) => console.log("      ·", l));
  };
  for (const r of PUBLIC) await visit(r);
  await page.goto(BASE + "/login");
  await page.getByRole("button", { name: /demonstra/i }).first().click();
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  for (const r of APP) await visit(r);
  await ctx.close();
}
await browser.close();
console.log(problems ? `\nFALHOU: ${problems} rota(s) com erro de página/hidratação ou tema errado` : "\nOK: nenhuma rota com erro de página ou aviso de hidratação, tema correto em todas");
process.exit(problems ? 1 : 0);
