import type { Comment } from "@/types";
import { addDays } from "@/lib/utils/date";

const today = new Date();

function at(dayOffset: number, hour: number, minute: number): string {
  const d = addDays(today, dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const mockComments: Comment[] = [
  {
    id: "comment_1",
    contentId: "content_17",
    authorId: "user_lazaro",
    text: "Podemos trocar a thumbnail de abertura? Achei meio escura pro feed.",
    createdAt: at(-1, 9, 12),
  },
  {
    id: "comment_2",
    contentId: "content_17",
    authorId: "user_joao",
    text: "Sim, vou ajustar o brilho e subo uma nova versão ainda hoje.",
    createdAt: at(-1, 9, 40),
  },
  {
    id: "comment_3",
    contentId: "content_17",
    authorId: "user_camila",
    text: "Fica melhor com o texto centralizado também, dá uma olhada quando ajustar.",
    createdAt: at(-1, 11, 5),
  },
  {
    id: "comment_4",
    contentId: "content_18",
    authorId: "user_lazaro",
    text: "A legenda ficou ótima. Só confere se o áudio está dentro do trending certo.",
    createdAt: at(0, 8, 30),
  },
  {
    id: "comment_5",
    contentId: "content_18",
    authorId: "user_beatriz",
    text: "Confirmado, é o áudio que está em alta essa semana no nicho fitness.",
    createdAt: at(0, 9, 10),
  },
  {
    id: "comment_6",
    contentId: "content_19",
    authorId: "user_lazaro",
    text: "Podemos destacar mais o percentual de desconto? Está pequeno no slide 1.",
    createdAt: at(-2, 14, 0),
  },
  {
    id: "comment_7",
    contentId: "content_20",
    authorId: "user_camila",
    text: "Adicionei a nova paleta de cores da marca nos ícones. Confere se ficou alinhado.",
    createdAt: at(-1, 16, 20),
  },
];

export function getCommentsByContentId(contentId: string): Comment[] {
  return mockComments.filter((c) => c.contentId === contentId);
}
