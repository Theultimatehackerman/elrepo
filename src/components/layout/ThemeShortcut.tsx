"use client";

import { useEffect } from "react";
import { getResolvedSnapshot, setPreference } from "@/lib/theme/theme-store";
import { isEditableTarget, isThemeShortcut, nextTheme } from "@/lib/theme/shortcut";

/** Montado uma única vez no layout raiz (L16). Não renderiza nada. */
export function ThemeShortcut() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || !isThemeShortcut(e) || isEditableTarget(e.target as HTMLElement | null)) return;
      e.preventDefault();
      setPreference(nextTheme(getResolvedSnapshot()));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return null;
}
