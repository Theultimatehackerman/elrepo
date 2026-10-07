"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContentCard } from "@/components/content/ContentCard";
import { ClientForm } from "@/components/clients/ClientForm";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { useClientStore, type ClientInput } from "@/store/client-store";
import { useContentStore } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";
import { getUserById } from "@/data/mock-users";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { FileText } from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const client = useClientStore((s) => s.clients.find((c) => c.id === params.id));
  const updateClient = useClientStore((s) => s.updateClient);
  const allContents = useContentStore((s) => s.contents);
  const contents = allContents.filter((c) => c.clientId === params.id);
  const { toast } = useToast();
  const [editOpen, setEditOpen] = React.useState(false);

  if (!client) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/clients">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </Button>
        <EmptyState title="Cliente não encontrado" />
      </div>
    );
  }

  const published = contents.filter((c) => c.status === "PUBLICADO").length;
  const responsible = getUserById(client.responsibleId);

  function handleUpdate(input: ClientInput) {
    updateClient(client!.id, input);
    toast({ title: "Cliente atualizado", variant: "success" });
    setEditOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link href="/clients">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar initials={client.avatarInitials} color={client.avatarColor} size="lg" />
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-foreground">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-3.5" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Conteúdos</span>
          <p className="text-xl font-semibold text-foreground">{contents.length}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Publicados</span>
          <p className="text-xl font-semibold text-foreground">{published}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Pendentes</span>
          <p className="text-xl font-semibold text-foreground">{contents.length - published}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Responsável</span>
          <p className="truncate text-sm font-medium text-foreground">{responsible?.name ?? "—"}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {client.platforms.map((p) => (
          <Badge key={p} variant="outline">
            {PLATFORM_CONFIG[p].label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Conteúdos deste cliente</h2>
        {contents.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhum conteúdo para este cliente ainda" />
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
            <ModalTitle>Editar cliente</ModalTitle>
            <ModalDescription>Atualize as informações de {client.name}.</ModalDescription>
          </ModalHeader>
          <div className="mt-4">
            <ClientForm
              initial={client}
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
