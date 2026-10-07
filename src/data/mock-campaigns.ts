import type { Campaign } from "@/types";

export const mockCampaigns: Campaign[] = [
  {
    id: "campaign_black_friday",
    name: "Black Friday 2026",
    description: "Campanha de descontos progressivos com foco em Reels e TikTok.",
    clientId: "client_acme",
    startDate: "2026-11-01T00:00:00.000Z",
    endDate: "2026-11-30T23:59:59.000Z",
    status: "PLANEJAMENTO",
  },
  {
    id: "campaign_colecao_verao",
    name: "Lançamento Coleção Verão",
    description: "Lançamento da nova coleção de verão com bastidores de produção.",
    clientId: "client_acme",
    startDate: "2026-08-01T00:00:00.000Z",
    endDate: "2026-09-15T23:59:59.000Z",
    status: "ATIVA",
  },
  {
    id: "campaign_setembro_amarelo",
    name: "Setembro Amarelo",
    description: "Conteúdo educativo sobre saúde mental e bem-estar.",
    clientId: "client_vitalis",
    startDate: "2026-09-01T00:00:00.000Z",
    endDate: "2026-09-30T23:59:59.000Z",
    status: "PLANEJAMENTO",
  },
  {
    id: "campaign_reformulacao_marca",
    name: "Reformulação de Marca",
    description: "Apresentação da nova identidade visual da Urbana Imóveis.",
    clientId: "client_urbana",
    startDate: "2026-07-01T00:00:00.000Z",
    endDate: "2026-08-31T23:59:59.000Z",
    status: "ATIVA",
  },
];

export function getCampaignById(id: string | undefined | null) {
  return mockCampaigns.find((c) => c.id === id);
}
