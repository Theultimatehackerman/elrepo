"use client";

import { useEffect } from "react";
import { initThemeListeners } from "@/lib/theme/theme-store";

/** Montado uma única vez no layout raiz. Não renderiza nada. */
export function ThemeSync() {
  useEffect(() => initThemeListeners(), []);
  return null;
}
