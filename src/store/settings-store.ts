import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WorkspaceSettings } from "@/types";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";

const defaultSettings: WorkspaceSettings = {
  workspaceName: "Content OS",
  workspaceAvatarInitials: "CO",
  profileName: "Lázaro Vasconcelos",
  profileEmail: "lazaro.vasconcelos@sollydus.com.br",
  dateFormat: "DD/MM/YYYY",
  weekStart: "SUNDAY",
};

interface SettingsState {
  settings: WorkspaceSettings;
  updateSettings: (patch: Partial<WorkspaceSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
