"use client";

import * as React from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { GoogleDrivePickerButton } from "@/components/content/GoogleDrivePickerButton";
import { useClientStore } from "@/store/client-store";
import { useCampaignStore } from "@/store/campaign-store";
import { mockUsers } from "@/data/mock-users";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { FORMAT_LABELS } from "@/lib/constants/platforms";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/constants/status";
import { toDateInputValue } from "@/lib/utils/date";
import { PLATFORMS, FORMATS } from "@/types";
import type { ContentInput } from "@/store/content-store";
import type { Content, DriveFile } from "@/types";

export interface ContentFormProps {
  initial?: Partial<Content>;
  onSubmit: (input: ContentInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ContentForm({ initial, onSubmit, onCancel, submitLabel = "Salvar" }: ContentFormProps) {
  const clients = useClientStore((s) => s.clients);
  const campaigns = useCampaignStore((s) => s.campaigns);

  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [clientId, setClientId] = React.useState(initial?.clientId ?? clients[0]?.id ?? "");
  const [campaignId, setCampaignId] = React.useState<string>(initial?.campaignId ?? "none");
  const [platform, setPlatform] = React.useState(initial?.platform ?? "INSTAGRAM");
  const [format, setFormat] = React.useState(initial?.format ?? "REEL");
  const [status, setStatus] = React.useState(initial?.status ?? "IDEIA");
  const [assigneeId, setAssigneeId] = React.useState(initial?.assigneeId ?? mockUsers[0].id);
  const [scheduledAt, setScheduledAt] = React.useState(
    toDateInputValue(initial?.scheduledAt ? new Date(initial.scheduledAt) : new Date())
  );
  const [script, setScript] = React.useState(initial?.script ?? "");
  const [caption, setCaption] = React.useState(initial?.caption ?? "");
  const [hashtags, setHashtags] = React.useState((initial?.hashtags ?? []).join(", "));
  const [cta, setCta] = React.useState(initial?.cta ?? "");
  const [driveFile, setDriveFile] = React.useState<DriveFile | null>(initial?.driveFile ?? null);

  const clientCampaigns = campaigns.filter((c) => c.clientId === clientId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !clientId) return;

    onSubmit({
      title: title.trim(),
      description: caption.trim() || title.trim(),
      clientId,
      campaignId: campaignId === "none" ? null : campaignId,
      platform,
      format,
      status,
      assigneeId,
      scheduledAt: new Date(scheduledAt).toISOString(),
      script,
      caption,
      hashtags: hashtags
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean)
        .map((h) => (h.startsWith("#") ? h : `#${h}`)),
      cta,
      driveFile,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex: 5 erros que fazem seu Instagram perder alcance"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Cliente</label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Campanha</label>
          <Select value={campaignId} onValueChange={setCampaignId}>
            <SelectTrigger>
              <SelectValue placeholder="Nenhuma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {clientCampaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Plataforma</label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {PLATFORM_CONFIG[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Formato</label>
          <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Responsável</label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Input
        label="Data de publicação"
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => setScheduledAt(e.target.value)}
      />

      <Textarea
        label="Roteiro"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Estrutura do roteiro..."
        rows={3}
      />

      <Textarea
        label="Legenda"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Legenda que vai na publicação..."
        rows={2}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Mídia</label>
        {driveFile ? (
          <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-surface-elevated px-3 py-2">
            <span className="truncate text-sm text-foreground">{driveFile.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setDriveFile(null)}>
              Remover
            </Button>
          </div>
        ) : (
          <GoogleDrivePickerButton onSelect={setDriveFile} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Hashtags"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="marca, reels, dicas"
        />
        <Input
          label="CTA"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          placeholder="Ex: Salva esse post"
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
