import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SHOWCASE_TOKENS, isDevShowcaseEnabled } from "./dev-showcase";

describe("vitrine /dev/theme (L13)", () => {
  it("fica 404 em produção e ativa nos demais ambientes", () => {
    expect(isDevShowcaseEnabled("production")).toBe(false);
    expect(isDevShowcaseEnabled("development")).toBe(true);
    expect(isDevShowcaseEnabled("test")).toBe(true);
  });

  it("lista todo token --color-* de globals.css (e nenhum a mais)", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const declared = new Set([...css.matchAll(/--color-([\w-]+):/g)].map((m) => m[1]));
    const listed = new Set(SHOWCASE_TOKENS.map((t) => t.name));
    expect([...declared].filter((n) => !listed.has(n))).toEqual([]);
    expect([...listed].filter((n) => !declared.has(n))).toEqual([]);
  });
});
