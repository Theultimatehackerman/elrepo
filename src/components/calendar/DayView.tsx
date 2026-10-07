"use client";

import { DroppableDay } from "@/components/calendar/DroppableDay";
import { CalendarAgendaCard } from "@/components/calendar/CalendarAgendaCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { toDateKey } from "@/lib/utils/date";
import { CalendarClock } from "lucide-react";
import type { Content } from "@/types";

export function DayView({ date, items }: { date: Date; items: Content[] }) {
  const key = toDateKey(date);
  const dayItems = items
    .filter((item) => toDateKey(new Date(item.scheduledAt)) === key)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <DroppableDay id={key} className="flex min-h-40 flex-col gap-2 rounded-lg border border-dashed border-border p-3">
      {dayItems.map((item) => (
        <CalendarAgendaCard key={item.id} content={item} />
      ))}
      {dayItems.length === 0 && (
        <EmptyState icon={CalendarClock} title="Nada agendado para este dia" />
      )}
    </DroppableDay>
  );
}
