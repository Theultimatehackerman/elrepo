"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { StatusBadge } from "@/components/content/StatusBadge";
import { FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatDayMonth } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

export function CalendarCard({ content, compact }: { content: Content; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: content.id,
    data: { content },
  });

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ transform: CSS.Translate.toString(transform) }}
        className={cn(
          "flex cursor-grab items-center gap-1.5 truncate rounded-xs border border-border px-1.5 py-1 text-[11px] active:cursor-grabbing",
          isDragging && "opacity-40"
        )}
      >
        <span className="truncate text-foreground">{content.title}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "flex w-44 shrink-0 cursor-grab flex-col overflow-hidden rounded-lg border border-border bg-surface transition-opacity active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <ContentThumbnail
        seed={content.thumbnailSeed}
        format={content.format}
        platform={content.platform}
        imageUrl={content.driveFile?.thumbnailLink}
        className="aspect-[4/3] rounded-none"
      />
      <div className="flex flex-col gap-1.5 p-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {FORMAT_LABELS[content.format]}
        </span>
        <Link
          href={`/content/${content.id}`}
          onClick={(e) => e.stopPropagation()}
          className="line-clamp-2 text-xs font-medium text-foreground hover:text-primary"
        >
          {content.title}
        </Link>
        <div className="flex items-center justify-between">
          <StatusBadge status={content.status} showIcon={false} className="px-1.5 py-0" />
          <span className="text-[11px] text-muted-foreground">
            {formatDayMonth(new Date(content.scheduledAt))}
          </span>
        </div>
      </div>
    </div>
  );
}
