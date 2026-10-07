"use client";

import * as React from "react";
import { Plus, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { useCampaignStore } from "@/store/campaign-store";

export default function CampaignsPage() {
  const campaigns = useCampaignStore((s) => s.campaigns);
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Campaigns"
        description="Agrupe conteúdos relacionados em campanhas."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Nova campanha
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Nenhuma campanha ainda"
          description="Crie sua primeira campanha para agrupar conteúdos."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> Nova campanha
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}

      <CreateCampaignModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
