import type { Client } from "@/types";

export const mockClients: Client[] = [
  {
    id: "client_acme",
    name: "ACME Studio",
    description: "Marca de streetwear e lifestyle urbano com forte presença em vídeo.",
    avatarColor: "#5B4BFF",
    avatarInitials: "AS",
    platforms: ["INSTAGRAM", "TIKTOK", "YOUTUBE"],
    responsibleId: "user_lazaro",
    createdAt: "2025-11-03T10:00:00.000Z",
  },
  {
    id: "client_nomade",
    name: "Nômade Café",
    description: "Rede de cafeterias de especialidade com 6 unidades em São Paulo.",
    avatarColor: "#B45309",
    avatarInitials: "NC",
    platforms: ["INSTAGRAM", "FACEBOOK"],
    responsibleId: "user_rafael",
    createdAt: "2025-12-15T10:00:00.000Z",
  },
  {
    id: "client_vitalis",
    name: "Vitalis Nutrition",
    description: "Suplementos e nutrição esportiva, foco em conteúdo educativo.",
    avatarColor: "#22C55E",
    avatarInitials: "VN",
    platforms: ["INSTAGRAM", "TIKTOK", "YOUTUBE"],
    responsibleId: "user_lazaro",
    createdAt: "2026-01-20T10:00:00.000Z",
  },
  {
    id: "client_urbana",
    name: "Urbana Imóveis",
    description: "Imobiliária boutique especializada em apartamentos compactos.",
    avatarColor: "#0EA5E9",
    avatarInitials: "UI",
    platforms: ["INSTAGRAM", "LINKEDIN", "FACEBOOK"],
    responsibleId: "user_rafael",
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "client_flow",
    name: "Flow Studio Pilates",
    description: "Estúdio boutique de pilates e bem-estar, público feminino 25-45.",
    avatarColor: "#EC4899",
    avatarInitials: "FS",
    platforms: ["INSTAGRAM", "TIKTOK"],
    responsibleId: "user_lazaro",
    createdAt: "2026-03-05T10:00:00.000Z",
  },
];

export function getClientById(id: string | undefined | null) {
  return mockClients.find((c) => c.id === id);
}
