import { localStorageAdapter } from "@/lib/storage/local-storage";
import {
  DEFAULT_THEME,
  SYSTEM_DARK_QUERY,
  THEME_ATTRIBUTE,
  THEME_COLORS,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "./constants";
import { isThemePreference, resolveTheme } from "./resolve";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function systemPrefersDark(): boolean {
  return window.matchMedia(SYSTEM_DARK_QUERY).matches;
}

export function readPreference(): ThemePreference {
  try {
    const raw = localStorageAdapter.getItem(THEME_STORAGE_KEY);
    return isThemePreference(raw) ? raw : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export const NO_TRANSITION_STYLE_ID = "theme-no-transition";

/**
 * Executa `mutate` com todas as transições desligadas (L14): evita o "flash" de cores animadas
 * quando o tema troca. O <style> temporário sai logo após o navegador recalcular os estilos.
 */
function withoutTransitions(mutate: () => void): void {
  document.getElementById(NO_TRANSITION_STYLE_ID)?.remove(); // trocas em sequência: uma tag só
  const style = document.createElement("style");
  style.id = NO_TRANSITION_STYLE_ID;
  style.textContent = "*,*::before,*::after{transition:none !important}";
  document.head.appendChild(style);
  mutate();
  void window.getComputedStyle(document.body).opacity; // força o recálculo com as transições desligadas
  setTimeout(() => style.remove(), 50);
}

/** Aplica o tema resolvido no DOM. Idempotente (sem troca visual, não mexe em transições). */
export function applyTheme(preference: ThemePreference = readPreference()): ResolvedTheme {
  const resolved = resolveTheme(preference, systemPrefersDark());
  const root = document.documentElement;
  const write = () => {
    root.setAttribute(THEME_ATTRIBUTE, resolved);
    root.style.colorScheme = resolved;
  };
  if (root.getAttribute(THEME_ATTRIBUTE) === resolved) write();
  else withoutTransitions(write);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[resolved]);
  return resolved;
}

export function setPreference(preference: ThemePreference): void {
  try {
    localStorageAdapter.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // storage indisponível (ex.: modo privado): o tema vale só nesta sessão.
  }
  applyTheme(preference);
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Registra UMA vez os listeners globais (mudança do SO e outras abas). Retorna a função de limpeza. */
export function initThemeListeners(): () => void {
  const media = window.matchMedia(SYSTEM_DARK_QUERY);
  const onSystemChange = () => {
    if (readPreference() === "system") {
      applyTheme("system");
      emit();
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      applyTheme();
      emit();
    }
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getResolvedSnapshot(): ResolvedTheme {
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === "light" ? "light" : "dark";
}
