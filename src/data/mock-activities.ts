import type { Activity } from "@/types";
import { addDays } from "@/lib/utils/date";

const today = new Date();

function at(dayOffset: number, hour: number, minute: number): string {
  const d = addDays(today, dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const mockActivities: Activity[] = [
  {
    id: "activity_1",
    type: "COMMENT_ADDED",
    actorId: "user_camila",
    contentId: "content_20",
    message: 'comentou em "Carrossel: como escolher seu treino ideal"',
    createdAt: at(-1, 16, 20),
  },
  {
    id: "activity_2",
    type: "CONTENT_MOVED",
    actorId: "user_joao",
    contentId: "content_17",
    message: 'moveu "5 erros que fazem seu Instagram perder alcance" de Edição → Aprovação',
    meta: { from: "EDICAO", to: "APROVACAO" },
    createdAt: at(-1, 8, 15),
  },
  {
    id: "activity_3",
    type: "COMMENT_ADDED",
    actorId: "user_lazaro",
    contentId: "content_17",
    message: 'comentou em "5 erros que fazem seu Instagram perder alcance"',
    createdAt: at(-1, 9, 12),
  },
  {
    id: "activity_4",
    type: "CONTENT_CREATED",
    actorId: "user_beatriz",
    contentId: "content_4",
    message: 'criou o conteúdo "Mitos e verdades sobre suplementação"',
    createdAt: at(-1, 10, 0),
  },
  {
    id: "activity_5",
    type: "CONTENT_MOVED",
    actorId: "user_rafael",
    contentId: "content_23",
    message: 'moveu "LinkedIn: reformulação de marca Urbana Imóveis" de Aprovação → Agendado',
    meta: { from: "APROVACAO", to: "AGENDADO" },
    createdAt: at(-2, 15, 40),
  },
  {
    id: "activity_6",
    type: "CONTENT_APPROVED",
    actorId: "user_lazaro",
    contentId: "content_24",
    message: 'Cliente aprovou "TikTok: making of da coleção verão"',
    createdAt: at(-2, 17, 5),
  },
  {
    id: "activity_7",
    type: "COMMENT_ADDED",
    actorId: "user_beatriz",
    contentId: "content_18",
    message: 'comentou em "Reel: rotina de alongamento pós-treino"',
    createdAt: at(0, 9, 10),
  },
  {
    id: "activity_8",
    type: "CONTENT_UPDATED",
    actorId: "user_rafael",
    contentId: "content_25",
    message: 'alterou a data de "Carrossel: guia de compra do apartamento ideal"',
    createdAt: at(-2, 11, 30),
  },
  {
    id: "activity_9",
    type: "CONTENT_MOVED",
    actorId: "user_joao",
    contentId: "content_9",
    message: 'moveu "TikTok: desafio de treino Vitalis" de Roteiro → Produção',
    meta: { from: "ROTEIRO", to: "PRODUCAO" },
    createdAt: at(-3, 13, 20),
  },
  {
    id: "activity_10",
    type: "CONTENT_SCHEDULED",
    actorId: "user_lazaro",
    contentId: "content_28",
    message: 'agendou "Reel: bastidores da nova coleção Flow" para publicação',
    createdAt: at(-3, 16, 0),
  },
  {
    id: "activity_11",
    type: "CONTENT_CREATED",
    actorId: "user_lazaro",
    contentId: "content_2",
    message: 'criou o conteúdo "Bastidores da produção da campanha de verão"',
    createdAt: at(-3, 9, 45),
  },
  {
    id: "activity_12",
    type: "CONTENT_CHANGE_REQUESTED",
    actorId: "user_rafael",
    contentId: "content_19",
    message: 'Cliente solicitou alteração em "Post: promoção Setembro Amarelo"',
    createdAt: at(-2, 14, 0),
  },
  {
    id: "activity_13",
    type: "CONTENT_MOVED",
    actorId: "user_beatriz",
    contentId: "content_14",
    message: 'moveu "Carrossel: guia completo de treino em casa" de Produção → Edição',
    meta: { from: "PRODUCAO", to: "EDICAO" },
    createdAt: at(-4, 10, 10),
  },
  {
    id: "activity_14",
    type: "CONTENT_APPROVED",
    actorId: "user_lazaro",
    contentId: "content_29",
    message: 'Cliente aprovou "Reel: 5 hábitos que aceleram seu resultado"',
    createdAt: at(-4, 18, 30),
  },
  {
    id: "activity_15",
    type: "COMMENT_ADDED",
    actorId: "user_joao",
    contentId: "content_17",
    message: 'comentou em "5 erros que fazem seu Instagram perder alcance"',
    createdAt: at(-1, 9, 40),
  },
  {
    id: "activity_16",
    type: "CONTENT_CREATED",
    actorId: "user_rafael",
    contentId: "content_3",
    message: 'criou o conteúdo "Enquete: qual sabor de latte vocês querem ver no cardápio?"',
    createdAt: at(-5, 11, 15),
  },
  {
    id: "activity_17",
    type: "CONTENT_MOVED",
    actorId: "user_lazaro",
    contentId: "content_8",
    message: 'moveu "Unboxing da nova coleção" de Roteiro → Produção',
    meta: { from: "ROTEIRO", to: "PRODUCAO" },
    createdAt: at(-5, 14, 50),
  },
];

export function getRecentActivities(limit = 10): Activity[] {
  return [...mockActivities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
