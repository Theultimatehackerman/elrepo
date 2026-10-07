import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, RegisterInput } from "@/types";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";
import { getInitials } from "@/lib/utils/text";
import { useSettingsStore } from "@/store/settings-store";

export const DEMO_USER: AuthUser = {
  id: "user_lazaro",
  name: "Lázaro Vasconcelos",
  email: "lazaro.vasconcelos@sollydus.com.br",
  password: "password123",
  workspaceName: "Content OS",
  createdAt: "2026-01-01T00:00:00.000Z",
};

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  registeredUsers: AuthUser[];
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  register: (input: RegisterInput) => { success: boolean; error?: string };
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_USER,
      isAuthenticated: true,
      registeredUsers: [DEMO_USER],
      isHydrated: false,

      setHydrated: (isHydrated) => set({ isHydrated }),

      register: (input) => {
        const email = input.email.trim().toLowerCase();
        const existing = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email
        );

        if (existing) {
          return { success: false, error: "Já existe uma conta cadastrada com este e-mail." };
        }

        const newUser: AuthUser = {
          id: generateId("user"),
          name: input.name.trim(),
          workspaceName: input.workspaceName.trim(),
          email,
          password: input.password,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          registeredUsers: [newUser, ...state.registeredUsers],
          currentUser: newUser,
          isAuthenticated: true,
        }));

        useSettingsStore.getState().updateSettings({
          profileName: newUser.name,
          profileEmail: newUser.email,
          workspaceName: newUser.workspaceName,
          workspaceAvatarInitials: getInitials(newUser.workspaceName),
        });

        return { success: true };
      },

      login: (emailInput, passwordInput) => {
        const email = emailInput.trim().toLowerCase();
        const user = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email
        );

        if (!user) {
          return { success: false, error: "Usuário não encontrado." };
        }

        if (user.password && passwordInput && user.password !== passwordInput) {
          return { success: false, error: "Senha incorreta." };
        }

        set({ currentUser: user, isAuthenticated: true });

        useSettingsStore.getState().updateSettings({
          profileName: user.name,
          profileEmail: user.email,
          workspaceName: user.workspaceName,
          workspaceAvatarInitials: getInitials(user.workspaceName),
        });

        return { success: true };
      },

      loginAsDemo: () => {
        set({ currentUser: DEMO_USER, isAuthenticated: true });
        useSettingsStore.getState().updateSettings({
          profileName: DEMO_USER.name,
          profileEmail: DEMO_USER.email,
          workspaceName: DEMO_USER.workspaceName,
          workspaceAvatarInitials: getInitials(DEMO_USER.workspaceName),
        });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => localStorageAdapter),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
