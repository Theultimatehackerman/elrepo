import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { loginDemo, THEMES, waitHydrated } from "./helpers";

// L9: exporta PNG e PDF do calendário e grava em test-results/exports/ para revisão visual (pdftoppm no PDF).
// A9: o PDF não pode voltar a pesar ~17 MB. A10: a folha do PDF tem a cor de fundo do tema (canto da página).
const OUT = "test-results/exports";
const PDF_MAX_BYTES = 6_000_000;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

// Pixel (0,0) da página 1 via pdftoppm; null se a ferramenta não existir (então o teste só não checa a cor).
function pdfCornerPixel(pdfPath: string): [number, number, number] | null {
  const run = spawnSync("pdftoppm", ["-r", "20", "-singlefile", "-f", "1", "-l", "1", pdfPath, `${pdfPath}.p`], { encoding: "utf8" });
  if (run.error || run.status !== 0) return null;
  const ppm = fs.readFileSync(`${pdfPath}.p.ppm`);
  const header = /^P6\s+(\d+)\s+(\d+)\s+255\s/.exec(ppm.subarray(0, 40).toString("latin1"));
  if (!header) return null;
  const offset = header[0].length;
  return [ppm[offset], ppm[offset + 1], ppm[offset + 2]];
}
for (const theme of THEMES) {
  for (const [label, ext] of [["Imagem (PNG)", "png"], ["Documento (PDF)", "pdf"]] as const) {
    test(`exporta ${ext.toUpperCase()} — tema ${theme}`, async ({ page }) => {
      test.setTimeout(90_000);
      await loginDemo(page, theme);
      await page.goto("/calendar");
      await waitHydrated(page);
      await page.getByRole("button", { name: "Exportar" }).click();
      const download = page.waitForEvent("download", { timeout: 60_000 });
      await page.getByRole("menuitem", { name: label }).click();
      const file = await download;
      fs.mkdirSync(OUT, { recursive: true });
      const dest = `${OUT}/calendario-${theme}.${ext}`;
      await file.saveAs(dest);
      const buf = fs.readFileSync(dest);
      expect(buf.length).toBeGreaterThan(5_000);
      if (ext === "pdf") {
        expect(buf.subarray(0, 4).toString()).toBe("%PDF");
        expect(buf.length, "PDF grande demais (A9)").toBeLessThan(PDF_MAX_BYTES);
        const corner = pdfCornerPixel(dest);
        if (corner) {
          const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim());
          const want = hexToRgb(bg);
          corner.forEach((channel, i) => expect(Math.abs(channel - want[i]), `canal ${i} da folha vs. fundo do tema ${bg}`).toBeLessThanOrEqual(3));
        }
      } else expect(buf.subarray(1, 4).toString()).toBe("PNG");
    });
  }
}
