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
import { useClientStore } from "@/store/client-store";
import { toDateInputValue } from "@/lib/utils/date";
import type { CampaignInput } from "@/store/campaign-store";
import type { Campaign, CampaignStatus } from "@/types";

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "PLANEJAMENTO", label: "Planejamento" },
  { value: "ATIVA", label: "Ativa" },
  { value: "CONCLUIDA", label: "Concluída" },
];

export function CampaignForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: {
  initial?: Campaign;
  onSubmit: (input: CampaignInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const clients = useClientStore((s) => s.clients);

  const [name, setName] = React.useState(initial?.name ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [clientId, setClientId] = React.useState(initial?.clientId ?? clients[0]?.id ?? "");
  const [status, setStatus] = React.useState<CampaignStatus>(initial?.status ?? "PLANEJAMENTO");
  const [startDate, setStartDate] = React.useState(
    toDateInputValue(initial ? new Date(initial.startDate) : new Date()).slice(0, 10)
  );
  const [endDate, setEndDate] = React.useState(
    toDateInputValue(initial ? new Date(initial.endDate) : new Date()).slice(0, 10)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !clientId) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      clientId,
      status,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nome da campanha" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Cliente</label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue />
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
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as CampaignStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          label="Início"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input label="Fim" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
