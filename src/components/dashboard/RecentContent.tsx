"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { StatusBadge } from "@/components/content/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { getUserById } from "@/data/mock-users";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { formatDayMonth } from "@/lib/utils/date";
import { Inbox } from "lucide-react";

export function RecentContent() {
  const contents = useContentStore((s) => s.contents);

  const recent = [...contents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Conteúdos recentes</CardTitle>
        <Button asChild size="sm" variant="ghost">
          <Link href="/content">
            Ver todos <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {recent.length === 0 && (
          <EmptyState icon={Inbox} title="Nenhum conteúdo ainda" description="Crie seu primeiro conteúdo para começar." />
        )}
        {recent.map((content) => {
          const client = getClientById(content.clientId);
          const assignee = getUserById(content.assigneeId);
          const PlatformIcon = PLATFORM_CONFIG[content.platform].icon;

          return (
            <Link
              key={content.id}
              href={`/content/${content.id}`}
              className="flex items-center gap-3 rounded-sm p-2 transition-colors hover:bg-surface-elevated"
            >
              <div className="size-11 shrink-0">
                <ContentThumbnail
                  seed={content.thumbnailSeed}
                  format={content.format}
                  platform={content.platform}
                  imageUrl={content.driveFile?.thumbnailLink}
                  className="aspect-square"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-foreground">
                  {content.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {client?.name}
                  <PlatformIcon className="size-3" />
                </span>
              </div>
              <StatusBadge status={content.status} className="hidden sm:inline-flex" />
              <span className="hidden w-12 shrink-0 text-right text-xs text-muted-foreground sm:block">
                {formatDayMonth(new Date(content.scheduledAt))}
              </span>
              {assignee && (
                <Avatar initials={assignee.avatarInitials} color={assignee.avatarColor} size="xs" />
              )}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
