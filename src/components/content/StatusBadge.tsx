import { cn } from "@/lib/utils/cn";
import { STATUS_CONFIG } from "@/lib/constants/status";
import type { ContentStatus } from "@/types";

export interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.border,
        className
      )}
      style={{ color: config.color }}
    >
      {showIcon && <Icon className="size-3" />}
      {config.label}
    </span>
  );
}
