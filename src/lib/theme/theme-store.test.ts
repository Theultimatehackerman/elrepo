import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, readPreference, setPreference, subscribe, initThemeListeners, NO_TRANSITION_STYLE_ID } from "./theme-store";
import { THEME_STORAGE_KEY } from "./constants";

type Listener = () => void;
let osDark = false;
const mediaListeners = new Set<Listener>();

beforeEach(() => {
  localStorage.clear();
  osDark = false;
  mediaListeners.clear();
  document.documentElement.removeAttribute("data-theme");
  document.querySelectorAll(`#${NO_TRANSITION_STYLE_ID}`).forEach((n) => n.remove()); // sobra de testes anteriores (timer de 50 ms)
  vi.stubGlobal("matchMedia", () => ({
    get matches() { return osDark; },
    addEventListener: (_: string, l: Listener) => mediaListeners.add(l),
    removeEventListener: (_: string, l: Listener) => mediaListeners.delete(l),
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("theme-store", () => {
  it("readPreference: padrão 'dark' quando vazio ou inválido", () => {
    expect(readPreference()).toBe("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "xyz");
    expect(readPreference()).toBe("dark");
  });

  it("setPreference persiste, aplica no DOM e notifica assinantes", () => {
    const spy = vi.fn();
    const unsubscribe = subscribe(spy);
    setPreference("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(spy).toHaveBeenCalledTimes(1);
    unsubscribe();
    setPreference("dark");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("setPreference não quebra se o storage lançar (tema vale na sessão)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
    expect(() => setPreference("light")).not.toThrow();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("segue o SO em tempo real apenas quando a preferência é 'system'", () => {
    const cleanup = initThemeListeners();
    localStorage.setItem(THEME_STORAGE_KEY, "system");
    osDark = true;
    mediaListeners.forEach((l) => l());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    localStorage.setItem(THEME_STORAGE_KEY, "light");
    applyTheme();
    osDark = false;
    mediaListeners.forEach((l) => l());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light"); // 'light' fixo ignora o SO
    cleanup();
    expect(mediaListeners.size).toBe(0);
  });

  it("sincroniza entre abas via evento 'storage'", () => {
    const cleanup = initThemeListeners();
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    window.dispatchEvent(new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "light" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    cleanup();
  });
});

describe("applyTheme sem transições (L14)", () => {
  const styleTag = () => document.getElementById(NO_TRANSITION_STYLE_ID);

  it("troca de tema: <style> temporário existe no instante da troca e sai depois", () => {
    vi.useFakeTimers();
    try {
      applyTheme("dark");
      vi.runAllTimers();
      expect(styleTag()).toBeNull();

      let seenDuringSwap = false;
      const observer = new MutationObserver(() => {});
      observer.observe(document.documentElement, { attributes: true });
      const original = document.documentElement.setAttribute.bind(document.documentElement);
      vi.spyOn(document.documentElement, "setAttribute").mockImplementation((name, value) => {
        if (name === "data-theme") seenDuringSwap = styleTag() !== null;
        original(name, value);
      });
      applyTheme("light");
      observer.disconnect();

      expect(seenDuringSwap).toBe(true);
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
      expect(styleTag()?.textContent).toContain("transition:none");
      vi.advanceTimersByTime(60);
      expect(styleTag()).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("reaplicar o mesmo tema não injeta <style>", () => {
    applyTheme("dark");
    document.getElementById(NO_TRANSITION_STYLE_ID)?.remove();
    applyTheme("dark");
    expect(styleTag()).toBeNull();
  });
});
