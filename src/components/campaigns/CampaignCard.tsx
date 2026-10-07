"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { formatDayMonth } from "@/lib/utils/date";
import type { Campaign } from "@/types";

const CAMPAIGN_STATUS_LABEL: Record<Campaign["status"], string> = {
  PLANEJAMENTO: "Planejamento",
  ATIVA: "Ativa",
  CONCLUIDA: "Concluída",
};

const CAMPAIGN_STATUS_VARIANT: Record<Campaign["status"], "default" | "primary" | "success"> = {
  PLANEJAMENTO: "default",
  ATIVA: "primary",
  CONCLUIDA: "success",
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const contentCount = useContentStore(
    (s) => s.contents.filter((c) => c.campaignId === campaign.id).length
  );
  const client = getClientById(campaign.clientId);

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Card className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{campaign.name}</span>
          <Badge variant={CAMPAIGN_STATUS_VARIANT[campaign.status]}>
            {CAMPAIGN_STATUS_LABEL[campaign.status]}
          </Badge>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{campaign.description}</p>
        {client && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Avatar initials={client.avatarInitials} color={client.avatarColor} size="xs" />
            {client.name}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {formatDayMonth(new Date(campaign.startDate))} – {formatDayMonth(new Date(campaign.endDate))}
          </span>
          <span>{contentCount} conteúdos</span>
        </div>
      </Card>
    </Link>
  );
}
