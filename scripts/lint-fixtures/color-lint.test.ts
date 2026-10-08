// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

// Prova (L12) que o guarda-corpo de cor literal de eslint.config.mjs falha nas fixtures `fail-*`
// e aceita as `pass-*`. As fixtures são .txt para o `npm run lint` não as varrer.
const dir = join(process.cwd(), "scripts", "lint-fixtures");
const eslint = new ESLint({ cwd: process.cwd() });
const cases = readdirSync(dir).filter((f) => f.endsWith(".txt"));

describe("lint de cor literal (L12)", { timeout: 60_000 }, () => {
  it("tem fixtures de falha e de sucesso", () => {
    expect(cases.some((f) => f.startsWith("fail-"))).toBe(true);
    expect(cases.some((f) => f.startsWith("pass-"))).toBe(true);
  });

  for (const file of cases) {
    it(`${file} ${file.startsWith("fail-") ? "reprova" : "passa"}`, async () => {
      const code = readFileSync(join(dir, file), "utf8");
      // caminho virtual dentro de src/ para a regra (files: src/**) se aplicar
      const [result] = await eslint.lintText(code, { filePath: `src/components/__fixture__/${file}.tsx` });
      const colorErrors = result.messages.filter((m) => m.ruleId === "no-restricted-syntax");
      if (file.startsWith("fail-")) expect(colorErrors.length).toBeGreaterThan(0);
      else expect(colorErrors).toEqual([]);
    });
  }
});
