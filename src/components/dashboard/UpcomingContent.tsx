"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useContentStore } from "@/store/content-store";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatRelativeDay, formatTime } from "@/lib/utils/date";
import { CalendarClock } from "lucide-react";

export function UpcomingContent() {
  const contents = useContentStore((s) => s.contents);

  const upcoming = contents
    .filter((c) => c.status === "AGENDADO")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 8);

  const groups: { label: string; items: typeof upcoming }[] = [];
  for (const item of upcoming) {
    const label = formatRelativeDay(new Date(item.scheduledAt));
    const group = groups.find((g) => g.label === label);
    if (group) group.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos conteúdos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {upcoming.length === 0 && (
          <EmptyState
            icon={CalendarClock}
            title="Nada agendado"
            description="Conteúdos aprovados e agendados aparecem aqui."
          />
        )}
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const PlatformIcon = PLATFORM_CONFIG[item.platform].icon;
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-sm px-2 py-1.5">
                    <span className="w-12 shrink-0 text-xs font-medium text-foreground">
                      {formatTime(new Date(item.scheduledAt))}
                    </span>
                    <PlatformIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm text-foreground">
                      {FORMAT_LABELS[item.format]} · {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
