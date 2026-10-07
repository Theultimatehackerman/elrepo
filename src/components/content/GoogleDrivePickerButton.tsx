"use client";

import { HardDrive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGoogleDrivePicker } from "@/hooks/use-google-drive-picker";
import { useToast } from "@/components/ui/Toast";
import type { DriveFile } from "@/types";

export function GoogleDrivePickerButton({
  onSelect,
}: {
  onSelect: (file: DriveFile) => void;
}) {
  const { openPicker, isConfigured, isLoading } = useGoogleDrivePicker();
  const { toast } = useToast();

  async function handleClick() {
    if (!isConfigured) {
      toast({
        title: "Google Drive não configurado",
        description:
          "Defina NEXT_PUBLIC_GOOGLE_CLIENT_ID e NEXT_PUBLIC_GOOGLE_API_KEY (veja o README).",
        variant: "info",
      });
      return;
    }

    try {
      const file = await openPicker();
      if (file) onSelect(file);
    } catch (error) {
      toast({
        title: "Não foi possível conectar ao Google Drive",
        description: error instanceof Error ? error.message : undefined,
        variant: "error",
      });
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <HardDrive className="size-3.5" />}
      Escolher do Google Drive
    </Button>
  );
}
