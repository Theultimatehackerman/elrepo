"use client";

import { DroppableDay } from "@/components/calendar/DroppableDay";
import { CalendarAgendaCard } from "@/components/calendar/CalendarAgendaCard";
import { getWeekDays, isToday, toDateKey, formatWeekdayShort } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

export function WeekView({
  anchor,
  items,
  weekStartsOn = 0,
}: {
  anchor: Date;
  items: Content[];
  weekStartsOn?: 0 | 1;
}) {
  const days = getWeekDays(anchor, weekStartsOn);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((date) => {
        const key = toDateKey(date);
        const dayItems = items
          .filter((item) => toDateKey(new Date(item.scheduledAt)) === key)
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        return (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {formatWeekdayShort(date)}
              </span>
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-xs text-foreground",
                  isToday(date) && "bg-primary text-primary-foreground"
                )}
              >
                {date.getDate()}
              </span>
            </div>
            <DroppableDay
              id={key}
              className="flex min-h-32 flex-col gap-2 rounded-lg border border-dashed border-border p-2"
            >
              {dayItems.map((item) => (
                <CalendarAgendaCard key={item.id} content={item} />
              ))}
              {dayItems.length === 0 && (
                <span className="py-4 text-center text-xs text-muted-foreground">Vazio</span>
              )}
            </DroppableDay>
          </div>
        );
      })}
    </div>
  );
}
