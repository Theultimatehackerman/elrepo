"use client";

import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { getUserById } from "@/data/mock-users";
import { FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatFullDate } from "@/lib/utils/date";

export default function ApprovalsPage() {
  const contents = useContentStore((s) => s.contents);
  const pending = [...contents.filter((c) => c.status === "APROVACAO")].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Approvals"
        description="Tudo que está aguardando aprovação do cliente."
      />

      {pending.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="Nada aguardando aprovação"
          description="Conteúdos enviados para aprovação aparecem aqui."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pending.map((content) => {
            const client = getClientById(content.clientId);
            const assignee = getUserById(content.assigneeId);

            return (
              <Card key={content.id} className="flex flex-col overflow-hidden">
                <div className="p-2">
                  <ContentThumbnail
                    seed={content.thumbnailSeed}
                    format={content.format}
                    platform={content.platform}
                    imageUrl={content.driveFile?.thumbnailLink}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 pt-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {FORMAT_LABELS[content.format]}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                    {content.title}
                  </h3>
                  {client && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Avatar initials={client.avatarInitials} color={client.avatarColor} size="xs" />
                      Cliente: {client.name}
                    </div>
                  )}
                  <span className="text-xs text-status-approval">Aguardando cliente</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatFullDate(new Date(content.scheduledAt))}
                    </span>
                    {assignee && (
                      <Avatar initials={assignee.avatarInitials} color={assignee.avatarColor} size="xs" />
                    )}
                  </div>
                  <Button asChild size="sm" variant="secondary" className="mt-2">
                    <Link href={`/review/${content.id}`}>Visualizar</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
