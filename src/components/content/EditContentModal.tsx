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
import type { Content } from "@/types";

export interface EditContentModalProps {
  content: Content;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditContentModal({ content, open, onOpenChange }: EditContentModalProps) {
  const updateContent = useContentStore((s) => s.updateContent);
  const { toast } = useToast();

  function handleSubmit(input: ContentInput) {
    updateContent(content.id, input);
    toast({ title: "Conteúdo atualizado", description: input.title, variant: "success" });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Editar conteúdo</ModalTitle>
          <ModalDescription>Atualize as informações deste conteúdo.</ModalDescription>
        </ModalHeader>
        <div className="mt-4">
          <ContentForm
            initial={content}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Salvar alterações"
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
