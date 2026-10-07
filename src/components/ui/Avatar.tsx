import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_MAP: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
  lg: "size-12 text-base",
};

export function Avatar({ initials, color = "#5B4BFF", size = "md", className, style, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-1 ring-white/10",
        SIZE_MAP[size],
        className
      )}
      style={{ backgroundColor: color, ...style }}
      {...props}
    >
      {initials}
    </div>
  );
}
