import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Campaign } from "@/types";
import { mockCampaigns } from "@/data/mock-campaigns";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";

export type CampaignInput = Omit<Campaign, "id">;

interface CampaignState {
  campaigns: Campaign[];
  addCampaign: (input: CampaignInput) => Campaign;
  updateCampaign: (id: string, patch: Partial<CampaignInput>) => void;
  deleteCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set) => ({
      campaigns: mockCampaigns,
      addCampaign: (input) => {
        const campaign: Campaign = { ...input, id: generateId("campaign") };
        set((state) => ({ campaigns: [campaign, ...state.campaigns] }));
        return campaign;
      },
      updateCampaign: (id, patch) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCampaign: (id) =>
        set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),
    }),
    {
      name: STORAGE_KEYS.campaigns,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
