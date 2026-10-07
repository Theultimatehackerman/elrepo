"use client";

import { useEffect, useState } from "react";

/** Generic hook for small UI preferences (e.g. sidebar collapsed state). */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage is only readable client-side; reading it during render would
    // desync SSR/CSR output, so hydrating after mount is intentional here.
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      // ignore malformed storage value
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (e.g. private mode) — fail silently
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
