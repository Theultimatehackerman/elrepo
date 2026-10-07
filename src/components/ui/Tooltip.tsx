"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "radix-pop z-50 overflow-hidden rounded-sm border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-foreground shadow-(--shadow-popover)",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
