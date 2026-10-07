"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { STATUS_ORDER, STATUS_CONFIG } from "@/lib/constants/status";
import { useContentStore } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";
import type { Content, ContentStatus } from "@/types";

export function KanbanBoard({ items }: { items: Content[] }) {
  const moveContent = useContentStore((s) => s.moveContent);
  const { toast } = useToast();
  const [activeContent, setActiveContent] = React.useState<Content | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveContent((event.active.data.current?.content as Content) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveContent(null);
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as ContentStatus;
    const content = active.data.current?.content as Content | undefined;
    if (!content || content.status === newStatus) return;

    moveContent(content.id, newStatus);
    toast({
      title: "Conteúdo movido",
      description: `"${content.title}" agora está em ${STATUS_CONFIG[newStatus].label}`,
      variant: "success",
    });
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            items={items.filter((c) => c.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeContent && <KanbanCard content={activeContent} dragging />}
      </DragOverlay>
    </DndContext>
  );
}
