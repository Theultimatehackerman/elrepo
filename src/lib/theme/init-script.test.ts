import { beforeEach, describe, expect, it, vi } from "vitest";
import { themeInitScript } from "./init-script";
import { THEME_COLORS, THEME_STORAGE_KEY } from "./constants";

function mockMatchMedia(prefersDark: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("dark") ? prefersDark : false }));
}
const run = () => new Function(themeInitScript)();
const root = () => document.documentElement;

describe("themeInitScript (anti-FOUC)", () => {
  beforeEach(() => {
    localStorage.clear();
    root().removeAttribute("data-theme");
    root().style.colorScheme = "";
    document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
  });

  it("sem preferência salva -> escuro (comportamento atual preservado), mesmo com SO claro", () => {
    mockMatchMedia(false);
    run();
    expect(root().getAttribute("data-theme")).toBe("dark");
  });

  it("preferência 'light' salva -> claro, colorScheme e meta theme-color corretos", () => {
    mockMatchMedia(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    run();
    expect(root().getAttribute("data-theme")).toBe("light");
    expect(root().style.colorScheme).toBe("light");
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(THEME_COLORS.light);
  });

  it.each([
    [true, "dark"],
    [false, "light"],
  ])("'system' com SO escuro=%s -> %s", (osDark, expected) => {
    mockMatchMedia(osDark);
    localStorage.setItem(THEME_STORAGE_KEY, "system");
    run();
    expect(root().getAttribute("data-theme")).toBe(expected);
  });

  it("valor corrompido no storage -> cai no padrão (escuro) sem lançar erro", () => {
    mockMatchMedia(false);
    localStorage.setItem(THEME_STORAGE_KEY, "{lixo");
    expect(run).not.toThrow();
    expect(root().getAttribute("data-theme")).toBe("dark");
  });

  it("localStorage lançando exceção (modo privado) -> escuro, sem lançar", () => {
    mockMatchMedia(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(run).not.toThrow();
    expect(root().getAttribute("data-theme")).toBe("dark");
  });

  it("não duplica a meta theme-color ao rodar duas vezes", () => {
    mockMatchMedia(false);
    run();
    run();
    expect(document.querySelectorAll('meta[name="theme-color"]').length).toBe(1);
  });
});
