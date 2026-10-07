"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Send,
  FileText,
  Hash,
  MessageSquareQuote,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/content/StatusBadge";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { EditContentModal } from "@/components/content/EditContentModal";
import { GoogleDrivePickerButton } from "@/components/content/GoogleDrivePickerButton";
import { CommentSection } from "@/components/comments/CommentSection";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useContentStore } from "@/store/content-store";
import { useActivityStore } from "@/store/activity-store";
import { useToast } from "@/components/ui/Toast";
import { getClientById } from "@/data/mock-clients";
import { getCampaignById } from "@/data/mock-campaigns";
import { getUserById } from "@/data/mock-users";
import { PLATFORM_CONFIG, FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatFullDate, formatTime, formatRelativeTime } from "@/lib/utils/date";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const content = useContentStore((s) => s.contents.find((c) => c.id === params.id));
  const deleteContent = useContentStore((s) => s.deleteContent);
  const sendForApproval = useContentStore((s) => s.sendForApproval);
  const updateContent = useContentStore((s) => s.updateContent);
  const allActivities = useActivityStore((s) => s.activities);
  const activities = allActivities.filter((a) => a.contentId === params.id);

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  if (!content) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href="/content">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </Button>
        <EmptyState
          icon={FileText}
          title="Conteúdo não encontrado"
          description="Esse conteúdo pode ter sido excluído."
        />
      </div>
    );
  }

  const client = getClientById(content.clientId);
  const campaign = getCampaignById(content.campaignId);
  const assignee = getUserById(content.assigneeId);
  const PlatformIcon = PLATFORM_CONFIG[content.platform].icon;

  function handleDelete() {
    if (!content) return;
    deleteContent(content.id);
    toast({ title: "Conteúdo excluído", description: content.title, variant: "info" });
    router.push("/content");
  }

  function handleSendForApproval() {
    if (!content) return;
    sendForApproval(content.id);
    toast({
      title: "Enviado para aprovação",
      description: "Aguardando aprovação do cliente.",
      variant: "success",
    });
  }

  function handleDriveFileSelected(driveFile: NonNullable<typeof content>["driveFile"]) {
    if (!content) return;
    updateContent(content.id, { driveFile });
    toast({ title: "Mídia atualizada", description: driveFile?.name, variant: "success" });
  }

  function handleRemoveDriveFile() {
    if (!content) return;
    updateContent(content.id, { driveFile: null });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
            <Link href="/content">
              <ArrowLeft className="size-4" /> Voltar
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">{content.title}</h1>
            <StatusBadge status={content.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {content.status !== "APROVACAO" && content.status !== "PUBLICADO" && (
            <Button variant="secondary" size="sm" onClick={handleSendForApproval}>
              <Send className="size-3.5" /> Enviar para aprovação
            </Button>
          )}
          {content.status === "APROVACAO" && (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/review/${content.id}`}>Ver página de revisão</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="size-3.5" /> Editar
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4 text-danger" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mídia</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="max-w-xs">
                <ContentThumbnail
                  seed={content.thumbnailSeed}
                  format={content.format}
                  platform={content.platform}
                  imageUrl={content.driveFile?.thumbnailLink}
                />
              </div>

              {content.driveFile ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-elevated px-3 py-2">
                  <a
                    href={content.driveFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-foreground hover:text-primary"
                  >
                    {content.driveFile.name}
                  </a>
                  <Button variant="ghost" size="sm" onClick={handleRemoveDriveFile}>
                    Remover
                  </Button>
                </div>
              ) : (
                <GoogleDrivePickerButton onSelect={handleDriveFileSelected} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field icon={FileText} label="Roteiro" value={content.script} multiline />
              <Field icon={MessageSquareQuote} label="Legenda" value={content.caption} multiline />
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="size-3.5" /> Hashtags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {content.hashtags.length === 0 && (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                  {content.hashtags.map((h) => (
                    <Badge key={h} variant="outline">
                      {h}
                    </Badge>
                  ))}
                </div>
              </div>
              <Field icon={Send} label="CTA" value={content.cta} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection contentId={content.id} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <InfoRow label="Cliente">
                {client && (
                  <Link href={`/clients/${client.id}`} className="flex items-center gap-2 hover:text-primary">
                    <Avatar initials={client.avatarInitials} color={client.avatarColor} size="xs" />
                    {client.name}
                  </Link>
                )}
              </InfoRow>
              <InfoRow label="Campanha">
                {campaign ? (
                  <Link href={`/campaigns/${campaign.id}`} className="hover:text-primary">
                    {campaign.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Nenhuma</span>
                )}
              </InfoRow>
              <InfoRow label="Plataforma">
                <span className="flex items-center gap-1.5">
                  <PlatformIcon className="size-3.5" />
                  {PLATFORM_CONFIG[content.platform].label}
                </span>
              </InfoRow>
              <InfoRow label="Formato">{FORMAT_LABELS[content.format]}</InfoRow>
              <InfoRow label="Responsável">
                {assignee && (
                  <span className="flex items-center gap-2">
                    <Avatar initials={assignee.avatarInitials} color={assignee.avatarColor} size="xs" />
                    {assignee.name}
                  </span>
                )}
              </InfoRow>
              <InfoRow label="Publicação">
                {formatFullDate(new Date(content.scheduledAt))} às{" "}
                {formatTime(new Date(content.scheduledAt))}
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="size-4" /> Histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {activities.length === 0 && (
                <span className="text-sm text-muted-foreground">Nenhum evento ainda.</span>
              )}
              {[...activities]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((activity) => {
                  const actor = getUserById(activity.actorId);
                  return (
                    <div key={activity.id} className="flex flex-col gap-0.5 text-sm">
                      <span className="text-foreground">
                        {activity.message.startsWith("Cliente ") ? (
                          activity.message
                        ) : (
                          <>
                            <span className="font-medium">{actor?.name.split(" ")[0]}</span>{" "}
                            {activity.message}
                          </>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(activity.createdAt))}
                      </span>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditContentModal content={content} open={editOpen} onOpenChange={setEditOpen} />

      <Modal open={deleteOpen} onOpenChange={setDeleteOpen}>
        <ModalContent className="max-w-sm">
          <ModalHeader>
            <ModalTitle>Excluir conteúdo?</ModalTitle>
            <ModalDescription>
              Essa ação não pode ser desfeita. &quot;{content.title}&quot; será removido permanentemente.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  multiline,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </span>
      <p className={multiline ? "whitespace-pre-line text-sm text-foreground" : "text-sm text-foreground"}>
        {value || <span className="text-muted-foreground">—</span>}
      </p>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}
