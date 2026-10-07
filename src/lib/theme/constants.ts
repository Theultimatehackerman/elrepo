import { STORAGE_KEYS } from "@/lib/storage/keys";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = "light" | "dark";

/** Preferência usada quando o usuário nunca escolheu (preserva o comportamento atual: escuro). */
export const DEFAULT_THEME: ThemePreference = "dark";

/** Cor da barra do navegador (meta theme-color). Manter igual a --color-background de cada tema. */
export const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: "#f7f7fa",
  dark: "#050505",
};

export const THEME_ATTRIBUTE = "data-theme";
export const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";
