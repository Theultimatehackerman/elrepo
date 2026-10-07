import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Content, ContentStatus } from "@/types";
import { mockContents } from "@/data/mock-content";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";
import { STATUS_CONFIG } from "@/lib/constants/status";
import { useActivityStore } from "@/store/activity-store";
import { CURRENT_USER_ID } from "@/data/mock-users";

export type ContentInput = Omit<
  Content,
  "id" | "createdAt" | "updatedAt" | "thumbnailSeed"
>;

interface ContentState {
  contents: Content[];
  addContent: (input: ContentInput) => Content;
  updateContent: (id: string, patch: Partial<ContentInput>) => void;
  deleteContent: (id: string) => void;
  moveContent: (id: string, status: ContentStatus) => void;
  rescheduleContent: (id: string, scheduledAt: string) => void;
  sendForApproval: (id: string) => void;
  approveContent: (id: string) => void;
  requestChanges: (id: string) => void;
  addComment: (id: string) => void;
}

function touch<T extends { updatedAt: string }>(item: T): T {
  return { ...item, updatedAt: new Date().toISOString() };
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      contents: mockContents,

      addContent: (input) => {
        const content: Content = {
          ...input,
          id: generateId("content"),
          thumbnailSeed: generateId("thumb"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ contents: [content, ...state.contents] }));
        useActivityStore.getState().logActivity({
          type: "CONTENT_CREATED",
          actorId: CURRENT_USER_ID,
          contentId: content.id,
          message: `criou o conteúdo "${content.title}"`,
        });
        return content;
      },

      updateContent: (id, patch) => {
        const before = get().contents.find((c) => c.id === id);
        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? touch({ ...c, ...patch }) : c
          ),
        }));
        if (before) {
          useActivityStore.getState().logActivity({
            type: "CONTENT_UPDATED",
            actorId: CURRENT_USER_ID,
            contentId: id,
            message: `atualizou "${patch.title ?? before.title}"`,
          });
        }
      },

      deleteContent: (id) => {
        const content = get().contents.find((c) => c.id === id);
        set((state) => ({ contents: state.contents.filter((c) => c.id !== id) }));
        if (content) {
          useActivityStore.getState().logActivity({
            type: "CONTENT_DELETED",
            actorId: CURRENT_USER_ID,
            contentId: null,
            message: `excluiu "${content.title}"`,
          });
        }
      },

      moveContent: (id, status) => {
        const content = get().contents.find((c) => c.id === id);
        if (!content || content.status === status) return;

        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? touch({ ...c, status }) : c
          ),
        }));

        useActivityStore.getState().logActivity({
          type: "CONTENT_MOVED",
          actorId: CURRENT_USER_ID,
          contentId: id,
          message: `moveu "${content.title}" de ${STATUS_CONFIG[content.status].label} → ${STATUS_CONFIG[status].label}`,
          meta: { from: content.status, to: status },
        });
      },

      rescheduleContent: (id, scheduledAt) => {
        const content = get().contents.find((c) => c.id === id);
        if (!content) return;

        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? touch({ ...c, scheduledAt }) : c
          ),
        }));

        useActivityStore.getState().logActivity({
          type: "CONTENT_UPDATED",
          actorId: CURRENT_USER_ID,
          contentId: id,
          message: `alterou a data de "${content.title}"`,
        });
      },

      sendForApproval: (id) => get().moveContent(id, "APROVACAO"),

      approveContent: (id) => {
        const content = get().contents.find((c) => c.id === id);
        if (!content) return;

        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? touch({ ...c, status: "AGENDADO" }) : c
          ),
        }));

        useActivityStore.getState().logActivity({
          type: "CONTENT_APPROVED",
          actorId: CURRENT_USER_ID,
          contentId: id,
          message: `Cliente aprovou "${content.title}"`,
        });
      },

      requestChanges: (id) => {
        const content = get().contents.find((c) => c.id === id);
        if (!content) return;

        set((state) => ({
          contents: state.contents.map((c) =>
            c.id === id ? touch({ ...c, status: "EDICAO" }) : c
          ),
        }));

        useActivityStore.getState().logActivity({
          type: "CONTENT_CHANGE_REQUESTED",
          actorId: CURRENT_USER_ID,
          contentId: id,
          message: `Cliente solicitou alteração em "${content.title}"`,
        });
      },

      addComment: (id) => {
        const content = get().contents.find((c) => c.id === id);
        if (!content) return;
        useActivityStore.getState().logActivity({
          type: "COMMENT_ADDED",
          actorId: CURRENT_USER_ID,
          contentId: id,
          message: `comentou em "${content.title}"`,
        });
      },
    }),
    {
      name: STORAGE_KEYS.contents,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
