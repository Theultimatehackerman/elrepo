import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Comment } from "@/types";
import { mockComments } from "@/data/mock-comments";
import { localStorageAdapter } from "@/lib/storage/local-storage";
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { generateId } from "@/lib/utils/id";
import { CURRENT_USER_ID } from "@/data/mock-users";
import { useContentStore } from "@/store/content-store";

interface CommentState {
  comments: Comment[];
  addComment: (contentId: string, text: string) => void;
  commentsForContent: (contentId: string) => Comment[];
}

export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: mockComments,
      addComment: (contentId, text) => {
        const comment: Comment = {
          id: generateId("comment"),
          contentId,
          authorId: CURRENT_USER_ID,
          text,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [...state.comments, comment] }));
        useContentStore.getState().addComment(contentId);
      },
      commentsForContent: (contentId) =>
        get()
          .comments.filter((c) => c.contentId === contentId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    }),
    {
      name: STORAGE_KEYS.comments,
      storage: createJSONStorage(() => localStorageAdapter),
    }
  )
);
