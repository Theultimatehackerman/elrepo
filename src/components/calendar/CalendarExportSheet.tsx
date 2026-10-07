"use client";

import * as React from "react";
import { StatusBadge } from "@/components/content/StatusBadge";
import { useSettingsStore } from "@/store/settings-store";
import { getClientById } from "@/data/mock-clients";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/constants/status";
import {
  formatMonthYear,
  formatTime,
  getMonthGrid,
  isSameMonth,
  isToday,
  toDateKey,
} from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { Content } from "@/types";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface CalendarExportSheetProps {
  month: Date;
  items: Content[];
}

export function CalendarExportSheet({ month, items }: CalendarExportSheetProps) {
  const workspaceName = useSettingsStore((s) => s.settings.workspaceName);

  const days = getMonthGrid(month);
  const inMonthCount = items.filter((item) =>
    isSameMonth(new Date(item.scheduledAt), month)
  ).length;

  const byDay = new Map<string, Content[]>();
  for (const item of items) {
    const key = toDateKey(new Date(item.scheduledAt));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }

  return (
    <div className="flex w-[1200px] flex-col gap-6 bg-background p-10 text-foreground">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {workspaceName}
          </span>
          <span className="text-3xl font-semibold">Calendário editorial</span>
          <span className="text-sm text-muted-foreground">{formatMonthYear(month)}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-3xl font-semibold text-primary">{inMonthCount}</span>
          <span className="text-xs text-muted-foreground">
            {inMonthCount === 1 ? "conteúdo no mês" : "conteúdos no mês"}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-7 border-b border-border bg-surface-elevated">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((date) => {
            const key = toDateKey(date);
            const dayItems = (byDay.get(key) ?? []).sort(
              (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
            );
            const inMonth = isSameMonth(date, month);

            return (
              <div
                key={key}
                className={cn(
                  "flex min-h-28 flex-col gap-1 border-b border-r border-border p-1.5 last:border-r-0",
                  !inMonth && "bg-surface/40"
                )}
              >
                <div
                  className={cn(
                    "flex size-6 items-center justify-center self-end rounded-full text-xs",
                    !inMonth && "text-muted-foreground/50",
                    inMonth && "text-foreground",
                    isToday(date) && "bg-primary text-primary-foreground"
                  )}
                >
                  {date.getDate()}
                </div>
                <div className="flex flex-col gap-1">
                  {dayItems.map((item) => (
                    <ExportItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status:
          </span>
          {STATUS_ORDER.map((status) => {
            const config = STATUS_CONFIG[status];
            return (
              <span key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: config.color }} />
                {config.label}
              </span>
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground">Gerado por Content OS</span>
      </div>
    </div>
  );
}

function ExportItemCard({ item }: { item: Content }) {
  const PlatformIcon = PLATFORM_CONFIG[item.platform].icon;
  const clientName = getClientById(item.clientId)?.name ?? "—";

  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-surface px-2 py-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium text-foreground">{item.title}</span>
        <PlatformIcon className="size-3 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[10px] text-muted-foreground">
          {clientName} · {formatTime(new Date(item.scheduledAt))}
        </span>
        <StatusBadge status={item.status} showIcon={false} className="shrink-0 px-1.5 py-0" />
      </div>
    </div>
  );
}
