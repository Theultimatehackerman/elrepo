import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Client } from "@/types";
import { mockClients } from "@/data/mock-clients";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";

export type ClientInput = Omit<Client, "id" | "createdAt">;

interface ClientState {
  clients: Client[];
  addClient: (input: ClientInput) => Client;
  updateClient: (id: string, patch: Partial<ClientInput>) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clients: mockClients,
      addClient: (input) => {
        const client: Client = {
          ...input,
          id: generateId("client"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [client, ...state.clients] }));
        return client;
      },
      updateClient: (id, patch) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteClient: (id) =>
        set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),
    }),
    {
      name: STORAGE_KEYS.clients,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
