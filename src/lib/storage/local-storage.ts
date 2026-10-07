import type { StateStorage } from "zustand/middleware";

/**
 * Single isolated entry point for all LocalStorage access in the app.
 * Used as the storage adapter for every Zustand `persist` store, so that
 * swapping LocalStorage for a real API later only means changing this file.
 */
export const localStorageAdapter: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(name);
  },
};
