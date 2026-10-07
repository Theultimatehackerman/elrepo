import { describe, expect, it } from "vitest";
import { contrastRatio, readableTextColor } from "./color";

describe("readableTextColor", () => {
  it("usa texto escuro sobre fundos claros/médios e claro sobre escuros", () => {
    expect(readableTextColor("#F59E0B")).toBe("#0b0b0f");
    expect(readableTextColor("#22C55E")).toBe("#0b0b0f");
    expect(readableTextColor("#0EA5E9")).toBe("#0b0b0f");
    expect(readableTextColor("#5B4BFF")).toBe("#ffffff");
    expect(readableTextColor("#1d4ed8")).toBe("#ffffff");
  });
  it("aceita #rgb e ignora entrada inválida", () => {
    expect(readableTextColor("#000")).toBe("#ffffff");
    expect(readableTextColor("não-é-cor")).toBe("#ffffff");
  });
  it("todas as cores de avatar oferecidas atingem >= 4.5:1 (AA)", () => {
    for (const c of ["#5B4BFF", "#EC4899", "#F59E0B", "#22C55E", "#0EA5E9", "#8B5CF6"]) {
      expect(contrastRatio(c, readableTextColor(c))).toBeGreaterThanOrEqual(4.5);
    }
  });
});
