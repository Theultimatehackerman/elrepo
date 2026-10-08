import type { ResolvedTheme } from "./constants";

/** L16: atalho global para alternar Claro/Escuro. Usa `event.code` (vale no Mac, onde Option altera o caractere). */
export const THEME_SHORTCUT_LABEL = "Alt+Shift+T";
/** Valor para `aria-keyshortcuts` (a spec ARIA usa o nome da tecla, não o rótulo de exibição). */
export const THEME_SHORTCUT_ARIA = "Alt+Shift+T";

export interface ShortcutKeyEvent {
  code: string;
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  repeat: boolean;
}

export function isThemeShortcut(e: ShortcutKeyEvent): boolean {
  return e.code === "KeyT" && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.repeat;
}

export interface ShortcutTarget {
  tagName?: string;
  isContentEditable?: boolean;
}

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Não rouba a tecla de quem está digitando. */
export function isEditableTarget(target: ShortcutTarget | null): boolean {
  if (!target) return false;
  return EDITABLE_TAGS.has((target.tagName ?? "").toUpperCase()) || target.isContentEditable === true;
}

/** Alterna a partir do tema EFETIVO (o que a pessoa está vendo); "Sistema" continua disponível no menu. */
export function nextTheme(resolved: ResolvedTheme): ResolvedTheme {
  return resolved === "dark" ? "light" : "dark";
}
