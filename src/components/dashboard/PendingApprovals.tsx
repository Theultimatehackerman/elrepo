"use client";

import Link from "next/link";
import { Eye as EyeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { FORMAT_LABELS } from "@/lib/constants/platforms";

export function PendingApprovals() {
  const contents = useContentStore((s) => s.contents);
  const pending = contents.filter((c) => c.status === "APROVACAO");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovações pendentes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {pending.length === 0 && (
          <EmptyState
            icon={EyeIcon}
            title="Nada aguardando aprovação"
            description="Os conteúdos enviados para aprovação aparecem aqui."
          />
        )}
        {pending.map((content) => {
          const client = getClientById(content.clientId);
          return (
            <div
              key={content.id}
              className="flex items-center gap-3 rounded-md border border-border p-3"
            >
              <div className="size-12 shrink-0">
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
                  {FORMAT_LABELS[content.format]} — {content.title}
                </span>
                <span className="text-xs text-muted-foreground">Cliente: {client?.name}</span>
                <span className="text-xs text-status-approval">Aguardando cliente</span>
              </div>
              <Button asChild size="sm" variant="secondary" className="shrink-0">
                <Link href={`/review/${content.id}`}>Visualizar</Link>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
