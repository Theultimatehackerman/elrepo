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
import { DropdownCheckboxItem, Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/Dropdown";
import { mockUsers } from "@/data/mock-users";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { PLATFORMS } from "@/types";
import { getInitials } from "@/lib/utils/text";
import type { ClientInput } from "@/store/client-store";
import type { Client } from "@/types";

const AVATAR_COLORS = ["#5B4BFF", "#EC4899", "#F59E0B", "#22C55E", "#0EA5E9", "#8B5CF6"];

export function ClientForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: {
  initial?: Client;
  onSubmit: (input: ClientInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [responsibleId, setResponsibleId] = React.useState(initial?.responsibleId ?? mockUsers[0].id);
  const [platforms, setPlatforms] = React.useState<string[]>(initial?.platforms ?? ["INSTAGRAM"]);

  function togglePlatform(platform: string) {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const color = initial?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      responsibleId,
      platforms: platforms as ClientInput["platforms"],
      avatarColor: color,
      avatarInitials: getInitials(name.trim() || "CL"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nome do cliente" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Responsável</label>
        <Select value={responsibleId} onValueChange={setResponsibleId}>
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

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Plataformas</label>
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-full items-center justify-between rounded-sm border border-border bg-surface-elevated px-3 text-left text-sm text-foreground"
            >
              {platforms.length > 0
                ? platforms.map((p) => PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG].label).join(", ")
                : "Selecione"}
            </button>
          </DropdownTrigger>
          <DropdownContent align="start" className="w-56">
            {PLATFORMS.map((p) => (
              <DropdownCheckboxItem
                key={p}
                checked={platforms.includes(p)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => togglePlatform(p)}
              >
                {PLATFORM_CONFIG[p].label}
              </DropdownCheckboxItem>
            ))}
          </DropdownContent>
        </Dropdown>
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
