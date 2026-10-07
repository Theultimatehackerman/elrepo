"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/store/content-store";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import type { Client } from "@/types";

export function ClientCard({ client }: { client: Client }) {
  const allContents = useContentStore((s) => s.contents);
  const contents = allContents.filter((c) => c.clientId === client.id);
  const published = contents.filter((c) => c.status === "PUBLICADO").length;
  const pending = contents.length - published;

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="flex h-full flex-col gap-4 p-5 transition-colors hover:border-primary/40">
        <div className="flex items-center gap-3">
          <Avatar initials={client.avatarInitials} color={client.avatarColor} size="lg" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{client.name}</span>
            <span className="line-clamp-1 text-xs text-muted-foreground">{client.description}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {client.platforms.map((p) => (
            <Badge key={p} variant="outline" className="gap-1">
              {PLATFORM_CONFIG[p].label}
            </Badge>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{contents.length}</span>
            <span className="text-[11px] text-muted-foreground">conteúdos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{pending}</span>
            <span className="text-[11px] text-muted-foreground">pendentes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{published}</span>
            <span className="text-[11px] text-muted-foreground">publicados</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
