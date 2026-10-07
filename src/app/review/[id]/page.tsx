"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { StatusBadge } from "@/components/content/StatusBadge";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { CommentSection } from "@/components/comments/CommentSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { PLATFORM_CONFIG, FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatFullDate, formatTime } from "@/lib/utils/date";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const content = useContentStore((s) => s.contents.find((c) => c.id === params.id));
  const approveContent = useContentStore((s) => s.approveContent);
  const requestChanges = useContentStore((s) => s.requestChanges);
  const [justApproved, setJustApproved] = React.useState(false);

  if (!content) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16">
        <EmptyState icon={FileText} title="Conteúdo não encontrado" />
      </div>
    );
  }

  const client = getClientById(content.clientId);
  const PlatformIcon = PLATFORM_CONFIG[content.platform].icon;

  function handleApprove() {
    if (!content) return;
    approveContent(content.id);
    setJustApproved(true);
  }

  function handleRequestChanges() {
    if (!content) return;
    requestChanges(content.id);
    router.push(`/content/${content.id}`);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <div className="flex items-center gap-2.5">
        <Logo size={28} className="size-7" />
        <span className="text-sm font-semibold text-foreground">Content OS</span>
        <span className="text-sm text-muted-foreground">· Revisão de conteúdo</span>
      </div>

      <AnimatePresence mode="wait">
        {justApproved ? (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border border-success/30 bg-success/5 px-6 py-20 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-7" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-foreground">Aprovado</p>
              <p className="text-sm text-muted-foreground">
                &quot;{content.title}&quot; foi aprovado e agendado para publicação.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/content/${content.id}`}>Ver conteúdo</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="mx-auto w-full max-w-xs">
                <ContentThumbnail
                  seed={content.thumbnailSeed}
                  format={content.format}
                  platform={content.platform}
                  imageUrl={content.driveFile?.thumbnailLink}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={content.status} />
                  <Badge variant="outline">{FORMAT_LABELS[content.format]}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <PlatformIcon className="size-3" />
                    {PLATFORM_CONFIG[content.platform].label}
                  </Badge>
                </div>

                <h1 className="text-xl font-semibold text-foreground">{content.title}</h1>

                {client && <p className="text-sm text-muted-foreground">Cliente: {client.name}</p>}

                <p className="text-sm text-muted-foreground">
                  Publicação prevista para {formatFullDate(new Date(content.scheduledAt))} às{" "}
                  {formatTime(new Date(content.scheduledAt))}
                </p>

                {content.caption && (
                  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3">
                    <span className="text-xs font-medium text-muted-foreground">Legenda</span>
                    <p className="text-sm text-foreground">{content.caption}</p>
                  </div>
                )}

                {content.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {content.hashtags.map((h) => (
                      <Badge key={h} variant="outline">
                        {h}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-6">
              <span className="text-sm font-medium text-foreground">
                Aguardando aprovação do cliente
              </span>
              <div className="flex gap-3">
                <Button onClick={handleApprove} className="flex-1">
                  <Check className="size-4" /> Aprovar
                </Button>
                <Button onClick={handleRequestChanges} variant="secondary" className="flex-1">
                  <RotateCcw className="size-4" /> Solicitar alteração
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Comentários</h2>
              <CommentSection contentId={content.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
