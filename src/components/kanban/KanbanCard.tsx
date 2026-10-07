"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { Avatar } from "@/components/ui/Avatar";
import { getClientById } from "@/data/mock-clients";
import { getUserById } from "@/data/mock-users";
import { formatDayMonth } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

export function KanbanCard({ content, dragging }: { content: Content; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: content.id,
    data: { content },
  });

  const client = getClientById(content.clientId);
  const assignee = getUserById(content.assigneeId);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "group relative flex gap-3 rounded-lg border border-border bg-surface p-2.5 transition-shadow",
        (isDragging || dragging) && "opacity-40",
        dragging && "shadow-(--shadow-elevated)"
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="absolute right-1.5 top-1.5 flex size-5 cursor-grab items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-surface-elevated group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Arrastar"
      >
        <GripVertical className="size-3.5" />
      </button>
      <Link href={`/content/${content.id}`} className="size-12 shrink-0">
        <ContentThumbnail
          seed={content.thumbnailSeed}
          format={content.format}
          platform={content.platform}
          imageUrl={content.driveFile?.thumbnailLink}
          className="aspect-square"
        />
      </Link>
      <Link href={`/content/${content.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="line-clamp-2 pr-4 text-xs font-medium text-foreground">
          {content.title}
        </span>
        <span className="truncate text-[11px] text-muted-foreground">{client?.name}</span>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {formatDayMonth(new Date(content.scheduledAt))}
          </span>
          {assignee && (
            <Avatar initials={assignee.avatarInitials} color={assignee.avatarColor} size="xs" />
          )}
        </div>
      </Link>
    </div>
  );
}
