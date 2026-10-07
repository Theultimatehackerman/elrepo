"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { ContentForm } from "@/components/content/ContentForm";
import { useContentStore, type ContentInput } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";

export interface CreateContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateContentModal({ open, onOpenChange }: CreateContentModalProps) {
  const addContent = useContentStore((s) => s.addContent);
  const { toast } = useToast();

  function handleSubmit(input: ContentInput) {
    addContent(input);
    toast({ title: "Conteúdo criado", description: input.title, variant: "success" });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Novo conteúdo</ModalTitle>
          <ModalDescription>Adicione um novo conteúdo ao seu fluxo de produção.</ModalDescription>
        </ModalHeader>
        <div className="mt-4">
          <ContentForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar conteúdo" />
        </div>
      </ModalContent>
    </Modal>
  );
}
