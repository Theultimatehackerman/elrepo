"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { generateId } from "@/lib/utils/id";

export type ToastVariant = "success" | "error" | "danger" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const VARIANT_ICON: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  danger: AlertCircle,
  info: Info,
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-danger",
  danger: "text-danger",
  info: "text-primary",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ title, description, variant = "info" }) => {
      setItems((prev) => [...prev, { id: generateId("toast"), title, description, variant }]);
    },
    []
  );

  const remove = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={3500}>
        {children}
        {items.map((item) => {
          const Icon = VARIANT_ICON[item.variant];
          return (
            <ToastPrimitive.Root
              key={item.id}
              onOpenChange={(open) => !open && remove(item.id)}
              className="radix-pop flex items-start gap-3 rounded-md border border-border bg-surface-elevated p-4 shadow-(--shadow-elevated) data-[swipe=end]:animate-out"
            >
              <Icon className={cn("size-5 shrink-0", VARIANT_COLOR[item.variant])} />
              <div className="flex flex-col gap-0.5">
                <ToastPrimitive.Title className="text-sm font-medium text-foreground">
                  {item.title}
                </ToastPrimitive.Title>
                {item.description && (
                  <ToastPrimitive.Description className="text-xs text-muted-foreground">
                    {item.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close className="ml-auto text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
