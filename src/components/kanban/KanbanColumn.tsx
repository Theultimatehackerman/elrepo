"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { STATUS_CONFIG } from "@/lib/constants/status";
import { cn } from "@/lib/utils/cn";
import type { Content, ContentStatus } from "@/types";

export function KanbanColumn({ status, items }: { status: ContentStatus; items: Content[] }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <Icon className="size-3.5" style={{ color: config.color }} />
        <span className="text-sm font-medium text-foreground">{config.label}</span>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-1 flex-col gap-2 rounded-lg border border-dashed border-transparent p-1.5 transition-colors",
          isOver && "border-primary/50 bg-primary/5"
        )}
      >
        {items.map((content) => (
          <KanbanCard key={content.id} content={content} />
        ))}
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
            Nenhum conteúdo
          </div>
        )}
      </div>
    </div>
  );
}
