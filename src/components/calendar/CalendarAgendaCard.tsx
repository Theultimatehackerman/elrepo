"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { getClientById } from "@/data/mock-clients";
import { STATUS_CONFIG } from "@/lib/constants/status";
import { formatTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

export function CalendarAgendaCard({ content }: { content: Content }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: content.id,
    data: { content },
  });
  const client = getClientById(content.clientId);
  const statusColor = STATUS_CONFIG[content.status].color;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform), borderLeftColor: statusColor }}
      className={cn(
        "flex w-full min-w-0 cursor-grab items-center gap-2 overflow-hidden rounded-lg border border-l-[3px] border-border bg-surface py-2 pl-2.5 pr-3 active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
      title={STATUS_CONFIG[content.status].label}
    >
      <span className="w-10 shrink-0 text-[11px] font-medium text-muted-foreground">
        {formatTime(new Date(content.scheduledAt))}
      </span>
      <div className="size-9 shrink-0">
        <ContentThumbnail
          seed={content.thumbnailSeed}
          format={content.format}
          platform={content.platform}
          imageUrl={content.driveFile?.thumbnailLink}
          className="aspect-square"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/content/${content.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block truncate text-sm font-medium text-foreground hover:text-primary"
        >
          {content.title}
        </Link>
        {client && (
          <span className="block truncate text-xs text-muted-foreground">{client.name}</span>
        )}
      </div>
    </div>
  );
}
