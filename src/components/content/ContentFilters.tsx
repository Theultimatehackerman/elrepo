"use client";

import { Search, X } from "lucide-react";
import { inputBaseClasses } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useClientStore } from "@/store/client-store";
import { useCampaignStore } from "@/store/campaign-store";
import { mockUsers } from "@/data/mock-users";
import { PLATFORM_CONFIG } from "@/lib/constants/platforms";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/constants/status";
import { PLATFORMS } from "@/types";

export interface ContentFilterState {
  search: string;
  clientId: string;
  platform: string;
  status: string;
  campaignId: string;
  assigneeId: string;
}

export const EMPTY_FILTERS: ContentFilterState = {
  search: "",
  clientId: "all",
  platform: "all",
  status: "all",
  campaignId: "all",
  assigneeId: "all",
};

export interface ContentFiltersProps {
  value: ContentFilterState;
  onChange: (value: ContentFilterState) => void;
}

export function ContentFilters({ value, onChange }: ContentFiltersProps) {
  const clients = useClientStore((s) => s.clients);
  const campaigns = useCampaignStore((s) => s.campaigns);

  const hasActiveFilters =
    value.clientId !== "all" ||
    value.platform !== "all" ||
    value.status !== "all" ||
    value.campaignId !== "all" ||
    value.assigneeId !== "all" ||
    value.search !== "";

  function set<K extends keyof ContentFilterState>(key: K, v: ContentFilterState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-48 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className={inputBaseClasses + " pl-9"}
          placeholder="Buscar por título, cliente, campanha..."
          value={value.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      <Select value={value.clientId} onValueChange={(v) => set("clientId", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Cliente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os clientes</SelectItem>
          {clients.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.platform} onValueChange={(v) => set("platform", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Plataforma" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as plataformas</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>{PLATFORM_CONFIG[p].label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.campaignId} onValueChange={(v) => set("campaignId", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Campanha" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as campanhas</SelectItem>
          {campaigns.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.assigneeId} onValueChange={(v) => set("assigneeId", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Responsável" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os responsáveis</SelectItem>
          {mockUsers.map((u) => (
            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
          <X className="size-3.5" />
          Limpar
        </Button>
      )}
    </div>
  );
}

export function applyContentFilters<
  T extends {
    title: string;
    description: string;
    clientId: string;
    campaignId: string | null;
    platform: string;
    status: string;
    assigneeId: string;
  },
>(items: T[], filters: ContentFilterState, clientNameOf: (id: string) => string, campaignNameOf: (id: string | null) => string): T[] {
  const search = filters.search.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.clientId !== "all" && item.clientId !== filters.clientId) return false;
    if (filters.platform !== "all" && item.platform !== filters.platform) return false;
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.campaignId !== "all" && item.campaignId !== filters.campaignId) return false;
    if (filters.assigneeId !== "all" && item.assigneeId !== filters.assigneeId) return false;

    if (search) {
      const haystack = [
        item.title,
        item.description,
        clientNameOf(item.clientId),
        campaignNameOf(item.campaignId),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
