"use client";

import * as React from "react";
import { MessageSquare, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCommentStore } from "@/store/comment-store";
import { getUserById, CURRENT_USER_ID, mockUsers } from "@/data/mock-users";
import { formatRelativeDay, formatTime } from "@/lib/utils/date";

export function CommentSection({ contentId }: { contentId: string }) {
  const allComments = useCommentStore((s) => s.comments);
  const comments = allComments.filter((c) => c.contentId === contentId);
  const addComment = useCommentStore((s) => s.addComment);
  const [text, setText] = React.useState("");

  const sorted = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(contentId, text.trim());
    setText("");
  }

  const currentUser = getUserById(CURRENT_USER_ID) ?? mockUsers[0];

  return (
    <div className="flex flex-col gap-4">
      {sorted.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Nenhum comentário ainda" />
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((comment) => {
            const author = getUserById(comment.authorId);
            const date = new Date(comment.createdAt);
            return (
              <div key={comment.id} className="flex gap-3">
                {author && (
                  <Avatar initials={author.avatarInitials} color={author.avatarColor} size="sm" />
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">{author?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDay(date)} · {formatTime(date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-start gap-3 border-t border-border pt-4">
        <Avatar initials={currentUser.avatarInitials} color={currentUser.avatarColor} size="sm" />
        <div className="flex flex-1 flex-col gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={2}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!text.trim()}>
              <Send className="size-3.5" />
              Comentar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
