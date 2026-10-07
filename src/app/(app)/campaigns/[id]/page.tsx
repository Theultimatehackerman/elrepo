"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContentCard } from "@/components/content/ContentCard";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { useCampaignStore, type CampaignInput } from "@/store/campaign-store";
import { useContentStore } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";
import { getClientById } from "@/data/mock-clients";
import { formatFullDate } from "@/lib/utils/date";

const CAMPAIGN_STATUS_LABEL = {
  PLANEJAMENTO: "Planejamento",
  ATIVA: "Ativa",
  CONCLUIDA: "Concluída",
} as const;

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaign = useCampaignStore((s) => s.campaigns.find((c) => c.id === params.id));
  const updateCampaign = useCampaignStore((s) => s.updateCampaign);
  const allContents = useContentStore((s) => s.contents);
  const contents = allContents.filter((c) => c.campaignId === params.id);
  const { toast } = useToast();
  const [editOpen, setEditOpen] = React.useState(false);

  if (!campaign) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/campaigns">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </Button>
        <EmptyState title="Campanha não encontrada" />
      </div>
    );
  }

  const client = getClientById(campaign.clientId);

  function handleUpdate(input: CampaignInput) {
    updateCampaign(campaign!.id, input);
    toast({ title: "Campanha atualizada", variant: "success" });
    setEditOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link href="/campaigns">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{campaign.name}</h1>
            <Badge variant="primary">{CAMPAIGN_STATUS_LABEL[campaign.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-3.5" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Cliente</span>
          {client && (
            <div className="mt-1 flex items-center gap-2">
              <Avatar initials={client.avatarInitials} color={client.avatarColor} size="xs" />
              <span className="text-sm font-medium text-foreground">{client.name}</span>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Conteúdos</span>
          <p className="text-xl font-semibold text-foreground">{contents.length}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Início</span>
          <p className="text-sm font-medium text-foreground">{formatFullDate(new Date(campaign.startDate))}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Fim</span>
          <p className="text-sm font-medium text-foreground">{formatFullDate(new Date(campaign.endDate))}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Conteúdos desta campanha</h2>
        {contents.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhum conteúdo nesta campanha ainda" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </div>

      <Modal open={editOpen} onOpenChange={setEditOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Editar campanha</ModalTitle>
            <ModalDescription>Atualize as informações de {campaign.name}.</ModalDescription>
          </ModalHeader>
          <div className="mt-4">
            <CampaignForm
              initial={campaign}
              onSubmit={handleUpdate}
              onCancel={() => setEditOpen(false)}
              submitLabel="Salvar alterações"
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
