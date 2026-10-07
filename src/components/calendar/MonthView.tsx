"use client";

import { DroppableDay } from "@/components/calendar/DroppableDay";
import { CalendarCard } from "@/components/calendar/CalendarCard";
import { getMonthGrid, isSameMonth, isToday, toDateKey } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const dayKey = toDateKey;

export function MonthView({
  month,
  items,
  weekStartsOn = 0,
  onSelectDay,
}: {
  month: Date;
  items: Content[];
  weekStartsOn?: 0 | 1;
  onSelectDay: (date: Date) => void;
}) {
  const days = getMonthGrid(month, weekStartsOn);
  const labels = weekStartsOn === 1 ? [...WEEKDAY_LABELS.slice(1), WEEKDAY_LABELS[0]] : WEEKDAY_LABELS;

  const byDay = new Map<string, Content[]>();
  for (const item of items) {
    const key = dayKey(new Date(item.scheduledAt));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-7 border-b border-border bg-surface-elevated">
        {labels.map((label) => (
          <div key={label} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => {
          const key = dayKey(date);
          const dayItems = (byDay.get(key) ?? []).sort(
            (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
          );
          const inMonth = isSameMonth(date, month);
          const visible = dayItems.slice(0, 3);
          const overflow = dayItems.length - visible.length;

          return (
            <DroppableDay
              key={key}
              id={key}
              className={cn(
                "flex min-h-28 flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0",
                !inMonth && "bg-surface/40"
              )}
            >
              <button
                onClick={() => onSelectDay(date)}
                className={cn(
                  "flex size-6 items-center justify-center self-end rounded-full text-xs transition-colors hover:bg-surface-elevated",
                  !inMonth && "text-muted-foreground/50",
                  inMonth && "text-foreground",
                  isToday(date) && "bg-primary text-primary-foreground hover:bg-primary-hover"
                )}
              >
                {date.getDate()}
              </button>
              <div className="flex flex-col gap-1">
                {visible.map((item) => (
                  <CalendarCard key={item.id} content={item} compact />
                ))}
                {overflow > 0 && (
                  <button
                    onClick={() => onSelectDay(date)}
                    className="text-left text-[11px] text-muted-foreground hover:text-primary"
                  >
                    +{overflow} mais
                  </button>
                )}
              </div>
            </DroppableDay>
          );
        })}
      </div>
    </div>
  );
}
