"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClientStore, type ClientInput } from "@/store/client-store";
import { useToast } from "@/components/ui/Toast";

export function CreateClientModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addClient = useClientStore((s) => s.addClient);
  const { toast } = useToast();

  function handleSubmit(input: ClientInput) {
    addClient(input);
    toast({ title: "Cliente criado", description: input.name, variant: "success" });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Novo cliente</ModalTitle>
          <ModalDescription>Adicione um novo cliente ao seu workspace.</ModalDescription>
        </ModalHeader>
        <div className="mt-4">
          <ClientForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar cliente" />
        </div>
      </ModalContent>
    </Modal>
  );
}
