import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { loginDemo, THEMES, waitHydrated } from "./helpers";

// L9: exporta PNG e PDF do calendário e grava em test-results/exports/ para revisão visual (pdftoppm no PDF).
const OUT = "test-results/exports";
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
      if (ext === "pdf") expect(buf.subarray(0, 4).toString()).toBe("%PDF");
      else expect(buf.subarray(1, 4).toString()).toBe("PNG");
    });
  }
}
