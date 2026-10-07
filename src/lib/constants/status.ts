import {
  Lightbulb,
  FileText,
  Clapperboard,
  Scissors,
  Eye,
  CalendarClock,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { ContentStatus } from "@/types";

export interface StatusConfig {
  value: ContentStatus;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export const STATUS_CONFIG: Record<ContentStatus, StatusConfig> = {
  IDEIA: {
    value: "IDEIA",
    label: "Ideia",
    icon: Lightbulb,
    color: "var(--color-status-idea)",
    bg: "bg-status-idea/10",
    border: "border-status-idea/30",
  },
  ROTEIRO: {
    value: "ROTEIRO",
    label: "Roteiro",
    icon: FileText,
    color: "var(--color-status-script)",
    bg: "bg-status-script/10",
    border: "border-status-script/30",
  },
  PRODUCAO: {
    value: "PRODUCAO",
    label: "Produção",
    icon: Clapperboard,
    color: "var(--color-status-production)",
    bg: "bg-status-production/10",
    border: "border-status-production/30",
  },
  EDICAO: {
    value: "EDICAO",
    label: "Edição",
    icon: Scissors,
    color: "var(--color-status-editing)",
    bg: "bg-status-editing/10",
    border: "border-status-editing/30",
  },
  APROVACAO: {
    value: "APROVACAO",
    label: "Aprovação",
    icon: Eye,
    color: "var(--color-status-approval)",
    bg: "bg-status-approval/10",
    border: "border-status-approval/30",
  },
  AGENDADO: {
    value: "AGENDADO",
    label: "Agendado",
    icon: CalendarClock,
    color: "var(--color-status-scheduled)",
    bg: "bg-status-scheduled/10",
    border: "border-status-scheduled/30",
  },
  PUBLICADO: {
    value: "PUBLICADO",
    label: "Publicado",
    icon: CheckCircle2,
    color: "var(--color-status-published)",
    bg: "bg-status-published/10",
    border: "border-status-published/30",
  },
};

export const STATUS_ORDER: ContentStatus[] = [
  "IDEIA",
  "ROTEIRO",
  "PRODUCAO",
  "EDICAO",
  "APROVACAO",
  "AGENDADO",
  "PUBLICADO",
];

export function nextStatus(status: ContentStatus): ContentStatus | null {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 && idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
}
