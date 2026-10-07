"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { useCampaignStore, type CampaignInput } from "@/store/campaign-store";
import { useToast } from "@/components/ui/Toast";

export function CreateCampaignModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addCampaign = useCampaignStore((s) => s.addCampaign);
  const { toast } = useToast();

  function handleSubmit(input: CampaignInput) {
    addCampaign(input);
    toast({ title: "Campanha criada", description: input.name, variant: "success" });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Nova campanha</ModalTitle>
          <ModalDescription>Agrupe conteúdos relacionados em uma campanha.</ModalDescription>
        </ModalHeader>
        <div className="mt-4">
          <CampaignForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar campanha" />
        </div>
      </ModalContent>
    </Modal>
  );
}
