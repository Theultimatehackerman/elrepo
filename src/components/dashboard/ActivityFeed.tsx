"use client";

import {
  FilePlus,
  Pencil,
  ArrowRightLeft,
  Trash2,
  CalendarCheck,
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActivityStore, getRecentActivitiesFrom } from "@/store/activity-store";
import { getUserById } from "@/data/mock-users";
import { formatRelativeTime } from "@/lib/utils/date";
import type { ActivityType } from "@/types";
import { History } from "lucide-react";

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  CONTENT_CREATED: FilePlus,
  CONTENT_UPDATED: Pencil,
  CONTENT_MOVED: ArrowRightLeft,
  CONTENT_DELETED: Trash2,
  CONTENT_SCHEDULED: CalendarCheck,
  COMMENT_ADDED: MessageSquare,
  CONTENT_APPROVED: CheckCircle2,
  CONTENT_CHANGE_REQUESTED: RotateCcw,
};

export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const activities = useActivityStore((s) => s.activities);
  const recent = getRecentActivitiesFrom(activities, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade recente</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {recent.length === 0 && (
          <EmptyState icon={History} title="Nenhuma atividade ainda" />
        )}
        {recent.map((activity) => {
          const actor = getUserById(activity.actorId);
          const Icon = ACTIVITY_ICON[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-3 py-2">
              <div className="relative shrink-0">
                {actor ? (
                  <Avatar initials={actor.avatarInitials} color={actor.avatarColor} size="sm" />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-surface-elevated text-muted-foreground">
                    <Icon className="size-3.5" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border border-surface bg-surface-elevated text-muted-foreground">
                  <Icon className="size-2.5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 pt-0.5">
                <p className="text-sm text-foreground">
                  {activity.message.startsWith("Cliente ") ? (
                    activity.message
                  ) : (
                    <>
                      <span className="font-medium">{actor?.name.split(" ")[0] ?? "Alguém"}</span>{" "}
                      {activity.message}
                    </>
                  )}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(new Date(activity.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
