"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { StatusBadge } from "@/components/content/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { getClientById } from "@/data/mock-clients";
import { getUserById } from "@/data/mock-users";
import { formatDayMonth } from "@/lib/utils/date";
import { FORMAT_LABELS } from "@/lib/constants/platforms";
import type { Content } from "@/types";

export interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const client = getClientById(content.clientId);
  const assignee = getUserById(content.assigneeId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/content/${content.id}`}
        className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary/40"
      >
        <div className="p-2">
          <ContentThumbnail
            seed={content.thumbnailSeed}
            format={content.format}
            platform={content.platform}
            imageUrl={content.driveFile?.thumbnailLink}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-4 pt-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {FORMAT_LABELS[content.format]}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          {client && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Avatar initials={client.avatarInitials} color={client.avatarColor} size="xs" />
              {client.name}
            </div>
          )}
          <div className="mt-1 flex items-center justify-between">
            <StatusBadge status={content.status} />
            <span className="text-xs text-muted-foreground">
              {formatDayMonth(new Date(content.scheduledAt))}
            </span>
          </div>
          {assignee && (
            <div className="flex items-center justify-end">
              <Avatar
                initials={assignee.avatarInitials}
                color={assignee.avatarColor}
                size="xs"
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
