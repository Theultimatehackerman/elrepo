"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, type ResolvedTheme, type ThemePreference } from "@/lib/theme/constants";
import {
  getResolvedSnapshot,
  readPreference,
  setPreference,
  subscribe,
} from "@/lib/theme/theme-store";

const getServerPreference = (): ThemePreference => DEFAULT_THEME;
const getServerResolved = (): ResolvedTheme => "dark";

/**
 * Lê/escreve o tema. useSyncExternalStore usa o snapshot do servidor durante a hidratação
 * e troca para o valor real do cliente depois — sem hydration mismatch.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readPreference, getServerPreference);
  const resolvedTheme = useSyncExternalStore(subscribe, getResolvedSnapshot, getServerResolved);
  const setTheme = useCallback((next: ThemePreference) => setPreference(next), []);
  return { theme, resolvedTheme, setTheme };
}
