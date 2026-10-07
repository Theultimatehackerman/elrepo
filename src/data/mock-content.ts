import type { Content, ContentFormat, ContentStatus, Platform } from "@/types";
import { addDays } from "@/lib/utils/date";

const today = new Date();

function at(dayOffset: number, hour = 10, minute = 0): string {
  const d = addDays(today, dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const HASHTAG_POOL: Record<string, string[]> = {
  client_acme: ["#acmestudio", "#streetwear", "#moda", "#estilourbano"],
  client_nomade: ["#nomadecafe", "#cafeespecial", "#coffeetime", "#sp"],
  client_vitalis: ["#vitalisnutrition", "#nutricaoesportiva", "#saude", "#performance"],
  client_urbana: ["#urbanaimoveis", "#apartamentocompacto", "#morarbem", "#sp"],
  client_flow: ["#flowstudio", "#pilates", "#bemestar", "#movimento"],
};

const CTA_POOL: Record<ContentFormat, string> = {
  REEL: "Salva esse vídeo pra assistir depois 👇",
  CAROUSEL: "Arrasta pro lado e conta o que achou nos comentários",
  STORY: "Responde no story e participa",
  POST: "Comenta aqui embaixo o que você achou",
  VIDEO: "Se inscreve no canal pra não perder o próximo",
  LIVE: "Ativa o sininho pra não perder a próxima live",
};

function buildHashtags(clientId: string, platform: Platform): string[] {
  const base = HASHTAG_POOL[clientId] ?? ["#contentos"];
  const platformTag =
    platform === "TIKTOK" ? "#fyp" : platform === "YOUTUBE" ? "#youtube" : "#reels";
  return [...base, platformTag];
}

interface RawContent {
  title: string;
  clientId: string;
  campaignId?: string;
  platform: Platform;
  format: ContentFormat;
  status: ContentStatus;
  assigneeId: string;
  dayOffset: number;
  hour?: number;
  minute?: number;
  description?: string;
  script?: string;
  caption?: string;
  hashtags?: string[];
  cta?: string;
}

const RAW: RawContent[] = [
  // ---- IDEIA ----
  {
    title: "3 tendências de conteúdo para 2026",
    clientId: "client_acme",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "IDEIA",
    assigneeId: "user_beatriz",
    dayOffset: 12,
    description: "Carrossel educativo mapeando as tendências que vão dominar o feed em 2026.",
  },
  {
    title: "Bastidores da produção da campanha de verão",
    clientId: "client_acme",
    campaignId: "campaign_colecao_verao",
    platform: "TIKTOK",
    format: "VIDEO",
    status: "IDEIA",
    assigneeId: "user_joao",
    dayOffset: 14,
    description: "Vídeo mostrando os bastidores do dia de still da coleção verão.",
  },
  {
    title: "Enquete: qual sabor de latte vocês querem ver no cardápio?",
    clientId: "client_nomade",
    platform: "INSTAGRAM",
    format: "STORY",
    status: "IDEIA",
    assigneeId: "user_rafael",
    dayOffset: 5,
    description: "Story interativo para testar novo sabor sazonal.",
  },
  {
    title: "Mitos e verdades sobre suplementação",
    clientId: "client_vitalis",
    campaignId: "campaign_setembro_amarelo",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "IDEIA",
    assigneeId: "user_beatriz",
    dayOffset: 20,
    description: "Carrossel derrubando mitos comuns sobre whey e creatina.",
  },

  // ---- ROTEIRO ----
  {
    title: "Como criar um Reels em 30 segundos",
    clientId: "client_acme",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "ROTEIRO",
    assigneeId: "user_beatriz",
    dayOffset: 6,
    script:
      "Gancho (0-3s): 'Você não precisa de 3 horas pra gravar um Reels bom'.\nDesenvolvimento (3-20s): 3 passos rápidos com b-roll.\nCTA (20-30s): convite pra salvar o vídeo.",
  },
  {
    title: "Rotina matinal saudável em 5 passos",
    clientId: "client_vitalis",
    platform: "TIKTOK",
    format: "REEL",
    status: "ROTEIRO",
    assigneeId: "user_beatriz",
    dayOffset: 8,
    script: "Abertura mostrando o despertador. Corte rápido pros 5 hábitos. Fechamento com CTA de salvar.",
  },
  {
    title: "Tour guiado: apartamento compacto de 45m²",
    clientId: "client_urbana",
    campaignId: "campaign_reformulacao_marca",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "ROTEIRO",
    assigneeId: "user_rafael",
    dayOffset: 9,
    script: "Roteiro de tour guiado destacando aproveitamento de espaço e luz natural.",
  },

  // ---- PRODUCAO ----
  {
    title: "Unboxing da nova coleção",
    clientId: "client_acme",
    campaignId: "campaign_colecao_verao",
    platform: "YOUTUBE",
    format: "VIDEO",
    status: "PRODUCAO",
    assigneeId: "user_joao",
    dayOffset: 4,
    description: "Gravação em estúdio do unboxing com o time de produto.",
  },
  {
    title: "TikTok: desafio de treino Vitalis",
    clientId: "client_vitalis",
    platform: "TIKTOK",
    format: "VIDEO",
    status: "PRODUCAO",
    assigneeId: "user_joao",
    dayOffset: 3,
    description: "Filmagem do desafio de treino de 15 minutos no estúdio parceiro.",
  },
  {
    title: "Depoimento de aluna: 90 dias de Pilates",
    clientId: "client_flow",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "PRODUCAO",
    assigneeId: "user_joao",
    dayOffset: 2,
    description: "Gravação de depoimento real com aluna do estúdio.",
  },
  {
    title: "Live de lançamento — bastidores da coleção",
    clientId: "client_acme",
    campaignId: "campaign_colecao_verao",
    platform: "INSTAGRAM",
    format: "LIVE",
    status: "PRODUCAO",
    assigneeId: "user_lazaro",
    dayOffset: 7,
    description: "Preparação de pauta e convidados para a live de lançamento.",
  },

  // ---- EDICAO ----
  {
    title: "Como funciona nosso programa de fidelidade",
    clientId: "client_nomade",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "EDICAO",
    assigneeId: "user_rafael",
    dayOffset: 2,
    caption: "A cada 9 cafés, o 10º é por nossa conta. Veja como participar em 3 passos simples.",
  },
  {
    title: "Receita rápida: café gelado para o verão",
    clientId: "client_nomade",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "EDICAO",
    assigneeId: "user_joao",
    dayOffset: 1,
    caption: "Receita de 4 ingredientes pra fazer em casa e refrescar o verão. Salva pra testar!",
  },
  {
    title: "Carrossel: guia completo de treino em casa",
    clientId: "client_vitalis",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "EDICAO",
    assigneeId: "user_beatriz",
    dayOffset: 2,
    caption: "Sem academia? Sem problema. Guia completo com 6 exercícios pra treinar em casa.",
  },
  {
    title: "3 motivos para investir em imóveis compactos agora",
    clientId: "client_urbana",
    campaignId: "campaign_reformulacao_marca",
    platform: "LINKEDIN",
    format: "POST",
    status: "EDICAO",
    assigneeId: "user_rafael",
    dayOffset: 3,
    caption: "O mercado de compactos está aquecido. Reunimos os 3 principais motivos para investir agora.",
  },
  {
    title: "Antes e depois: reforma de apartamento compacto",
    clientId: "client_urbana",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "EDICAO",
    assigneeId: "user_rafael",
    dayOffset: 4,
    caption: "8 semanas de reforma resumidas em 6 slides. Olha essa transformação.",
  },

  // ---- APROVACAO ----
  {
    title: "5 erros que fazem seu Instagram perder alcance",
    clientId: "client_acme",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "APROVACAO",
    assigneeId: "user_joao",
    dayOffset: 0,
    caption:
      "Você trava seu próprio alcance sem perceber. Separei os 5 erros mais comuns (e como corrigir cada um).",
    script:
      "1. Postar sem pensar no primeiro segundo\n2. Ignorar legenda\n3. Não usar áudio em alta\n4. Publicar sempre no mesmo horário\n5. Não responder comentários na primeira hora",
  },
  {
    title: "Reel: rotina de alongamento pós-treino",
    clientId: "client_flow",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "APROVACAO",
    assigneeId: "user_beatriz",
    dayOffset: 3,
    caption: "5 alongamentos de 30 segundos pra fazer depois de qualquer treino. Salva esse vídeo!",
  },
  {
    title: "Post: promoção Setembro Amarelo",
    clientId: "client_vitalis",
    campaignId: "campaign_setembro_amarelo",
    platform: "INSTAGRAM",
    format: "POST",
    status: "APROVACAO",
    assigneeId: "user_beatriz",
    dayOffset: 5,
    caption: "Setembro Amarelo também é sobre cuidar do corpo. 20% off em toda linha de bem-estar.",
  },
  {
    title: "Carrossel: como escolher seu treino ideal",
    clientId: "client_vitalis",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "APROVACAO",
    assigneeId: "user_beatriz",
    dayOffset: 4,
    caption: "Cada objetivo pede um tipo de treino diferente. Guia rápido pra você escolher o seu.",
  },

  // ---- AGENDADO ----
  {
    title: "Story: enquete sobre novo sabor de café",
    clientId: "client_nomade",
    platform: "INSTAGRAM",
    format: "STORY",
    status: "AGENDADO",
    assigneeId: "user_rafael",
    dayOffset: 0,
    hour: 14,
    minute: 30,
    caption: "Enquete rápida pra decidir o sabor do mês.",
  },
  {
    title: "Reel: dia na vida de um personal Vitalis",
    clientId: "client_vitalis",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "AGENDADO",
    assigneeId: "user_joao",
    dayOffset: 0,
    hour: 19,
    minute: 0,
    caption: "Acompanhe a rotina de um dos nossos personal trainers de perto.",
  },
  {
    title: "LinkedIn: reformulação de marca Urbana Imóveis",
    clientId: "client_urbana",
    campaignId: "campaign_reformulacao_marca",
    platform: "LINKEDIN",
    format: "POST",
    status: "AGENDADO",
    assigneeId: "user_rafael",
    dayOffset: 1,
    hour: 9,
    minute: 0,
    caption: "Hoje apresentamos a nova identidade visual da Urbana Imóveis. Vem ver.",
  },
  {
    title: "TikTok: making of da coleção verão",
    clientId: "client_acme",
    campaignId: "campaign_colecao_verao",
    platform: "TIKTOK",
    format: "VIDEO",
    status: "AGENDADO",
    assigneeId: "user_joao",
    dayOffset: 2,
    hour: 18,
    minute: 0,
    caption: "Bastidores do still de fotos da coleção verão, direto do estúdio.",
  },
  {
    title: "Carrossel: guia de compra do apartamento ideal",
    clientId: "client_urbana",
    platform: "INSTAGRAM",
    format: "CAROUSEL",
    status: "AGENDADO",
    assigneeId: "user_rafael",
    dayOffset: 3,
    hour: 11,
    minute: 0,
    caption: "6 perguntas pra fazer antes de fechar negócio no seu próximo imóvel.",
  },
  {
    title: "Reel: 3 receitas fit para o verão",
    clientId: "client_vitalis",
    platform: "INSTAGRAM",
    format: "REEL",
    status: "AGENDADO",
    assigneeId: "user_beatriz",
    dayOffset: 4,
    hour: 12,
    minute: 30,
    caption: "3 receitas rápidas, leves e ricas em proteína pra o calor.",
  },
  {
    title: "Post: cardápio sazonal de primavera",
    clientId: "client_nomade",
    platform: "FACEBOOK",
    format: "POST",
    status: "AGENDADO",
    assigneeId: "user_rafael",
    dayOffset: 6,
    hour: 8,
    minute: 0,
    caption: "Chegou o cardápio sazonal! Novos sabores por tempo limitado.",
  },
  {
    title: "Reel: bastidores da nova coleção Flow",
    clientId: "client_flow",
    platform: "TIKTOK",
    format: "REEL",
    status: "AGENDADO",
    assigneeId: "user_joao",
    dayOffset: 7,
    hour: 17,
    minute: 0,
    caption: "Um gostinho do que vem por aí na nova temporada do estúdio.",
  },

  // ---- PUBLICADO ----
  { title: "Reel: 5 hábitos que aceleram seu resultado", clientId: "client_vitalis", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -2, hour: 18 },
  { title: "Carrossel: guia de compra para primeira viagem", clientId: "client_urbana", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -3, hour: 10 },
  { title: "TikTok: making of da campanha de inverno", clientId: "client_acme", platform: "TIKTOK", format: "VIDEO", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -4, hour: 19 },
  { title: "Post: novo horário de funcionamento", clientId: "client_nomade", platform: "FACEBOOK", format: "POST", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -5, hour: 9 },
  { title: "Reel: alongamento para quem trabalha sentado", clientId: "client_flow", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -6, hour: 12 },
  { title: "Carrossel: 6 erros comuns na dieta", clientId: "client_vitalis", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -7, hour: 11 },
  { title: "Reel: como surgiu a ACME Studio", clientId: "client_acme", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -8, hour: 18 },
  { title: "LinkedIn: bastidores da equipe Urbana", clientId: "client_urbana", platform: "LINKEDIN", format: "POST", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -9, hour: 9 },
  { title: "TikTok: teste cego de sabores de café", clientId: "client_nomade", platform: "TIKTOK", format: "VIDEO", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -10, hour: 17 },
  { title: "Reel: 3 exercícios pra iniciantes no pilates", clientId: "client_flow", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -11, hour: 12 },
  { title: "Carrossel: linha do tempo da marca ACME", clientId: "client_acme", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -12, hour: 14 },
  { title: "Post: dica rápida de pós-treino", clientId: "client_vitalis", platform: "INSTAGRAM", format: "POST", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -13, hour: 15 },
  { title: "Reel: um dia no estúdio Flow", clientId: "client_flow", platform: "TIKTOK", format: "REEL", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -14, hour: 19 },
  { title: "Carrossel: 5 bairros em alta para morar", clientId: "client_urbana", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -15, hour: 10 },
  { title: "Vídeo: entrevista com o fundador da Nômade", clientId: "client_nomade", platform: "YOUTUBE", format: "VIDEO", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -16, hour: 16 },
  { title: "Reel: rotina de skincare em 60 segundos", clientId: "client_acme", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -17, hour: 18 },
  { title: "Post: aviso de manutenção programada", clientId: "client_flow", platform: "INSTAGRAM", format: "POST", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -18, hour: 9 },
  { title: "Carrossel: guia de hidratação no verão", clientId: "client_vitalis", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -19, hour: 11 },
  { title: "TikTok: transição de closet — coleção inverno", clientId: "client_acme", platform: "TIKTOK", format: "VIDEO", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -20, hour: 20 },
  { title: "LinkedIn: números do primeiro semestre", clientId: "client_urbana", platform: "LINKEDIN", format: "POST", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -21, hour: 9 },
  { title: "Reel: bastidores do torrefação artesanal", clientId: "client_nomade", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_joao", dayOffset: -22, hour: 17 },
  { title: "Carrossel: erros comuns ao montar treino", clientId: "client_vitalis", platform: "INSTAGRAM", format: "CAROUSEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -23, hour: 13 },
  { title: "Reel: aula experimental gratuita", clientId: "client_flow", platform: "INSTAGRAM", format: "REEL", status: "PUBLICADO", assigneeId: "user_beatriz", dayOffset: -24, hour: 12 },
  { title: "Post: parceria com academia local", clientId: "client_vitalis", platform: "FACEBOOK", format: "POST", status: "PUBLICADO", assigneeId: "user_rafael", dayOffset: -25, hour: 10 },
];

function buildContent(raw: RawContent, index: number): Content {
  const scheduledAt = at(raw.dayOffset, raw.hour ?? 10, raw.minute ?? 0);
  const createdOffset = raw.dayOffset - (3 + (index % 5));
  const isPastStatus = raw.status === "PUBLICADO" || raw.status === "AGENDADO";

  return {
    id: `content_${index + 1}`,
    title: raw.title,
    description: raw.description ?? raw.caption ?? raw.title,
    clientId: raw.clientId,
    campaignId: raw.campaignId ?? null,
    platform: raw.platform,
    format: raw.format,
    status: raw.status,
    assigneeId: raw.assigneeId,
    scheduledAt,
    script: raw.script ?? "",
    caption: raw.caption ?? raw.description ?? raw.title,
    hashtags: raw.hashtags ?? buildHashtags(raw.clientId, raw.platform),
    cta: CTA_POOL[raw.format],
    thumbnailSeed: `${raw.clientId}-${index}`,
    driveFile: null,
    createdAt: at(createdOffset, 9, 0),
    updatedAt: isPastStatus ? at(raw.dayOffset - 1, 16, 0) : at(createdOffset, 9, 0),
  };
}

export const mockContents: Content[] = RAW.map(buildContent);

export function getContentById(id: string | undefined | null) {
  return mockContents.find((c) => c.id === id);
}
