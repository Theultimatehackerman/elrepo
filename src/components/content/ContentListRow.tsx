"use client";

import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/Table";
import { ContentThumbnail } from "@/components/content/ContentThumbnail";
import { StatusBadge } from "@/components/content/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { getClientById } from "@/data/mock-clients";
import { getUserById } from "@/data/mock-users";
import { PLATFORM_CONFIG, FORMAT_LABELS } from "@/lib/constants/platforms";
import { formatDayMonth } from "@/lib/utils/date";
import type { Content } from "@/types";

export function ContentListRow({ content }: { content: Content }) {
  const client = getClientById(content.clientId);
  const assignee = getUserById(content.assigneeId);
  const PlatformIcon = PLATFORM_CONFIG[content.platform].icon;

  return (
    <TableRow>
      <TableCell className="w-14">
        <Link href={`/content/${content.id}`} className="block size-10">
          <ContentThumbnail
            seed={content.thumbnailSeed}
            format={content.format}
            platform={content.platform}
            imageUrl={content.driveFile?.thumbnailLink}
            className="aspect-square"
          />
        </Link>
      </TableCell>
      <TableCell>
        <Link href={`/content/${content.id}`} className="font-medium hover:text-primary">
          {content.title}
        </Link>
        <div className="mt-0.5 text-xs text-muted-foreground">{FORMAT_LABELS[content.format]}</div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{client?.name}</TableCell>
      <TableCell>
        <PlatformIcon className="size-4 text-muted-foreground" />
      </TableCell>
      <TableCell>
        <StatusBadge status={content.status} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDayMonth(new Date(content.scheduledAt))}
      </TableCell>
      <TableCell>
        {assignee && (
          <Avatar initials={assignee.avatarInitials} color={assignee.avatarColor} size="xs" />
        )}
      </TableCell>
    </TableRow>
  );
}
