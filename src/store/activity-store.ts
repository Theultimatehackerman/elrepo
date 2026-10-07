import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Activity, ActivityType, ContentStatus } from "@/types";
import { mockActivities } from "@/data/mock-activities";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";

interface ActivityState {
  activities: Activity[];
  logActivity: (input: {
    type: ActivityType;
    actorId: string;
    contentId: string | null;
    message: string;
    meta?: { from?: ContentStatus; to?: ContentStatus };
  }) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: mockActivities,
      logActivity: (input) =>
        set((state) => ({
          activities: [
            {
              id: generateId("activity"),
              createdAt: new Date().toISOString(),
              ...input,
            },
            ...state.activities,
          ],
        })),
    }),
    {
      name: STORAGE_KEYS.activities,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);

export function getRecentActivitiesFrom(activities: Activity[], limit = 10): Activity[] {
  return [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
