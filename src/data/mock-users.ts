import type { User } from "@/types";

export const CURRENT_USER_ID = "user_lazaro";

export const mockUsers: User[] = [
  {
    id: "user_lazaro",
    name: "Lázaro Vasconcelos",
    email: "lazaro.vasconcelos@sollydus.com.br",
    role: "SOCIAL_MEDIA",
    avatarColor: "#5B4BFF",
    avatarInitials: "LV",
  },
  {
    id: "user_camila",
    name: "Camila Rocha",
    email: "camila.rocha@contentos.app",
    role: "DESIGNER",
    avatarColor: "#EC4899",
    avatarInitials: "CR",
  },
  {
    id: "user_joao",
    name: "João Pedro Alves",
    email: "joao.alves@contentos.app",
    role: "VIDEOMAKER",
    avatarColor: "#F59E0B",
    avatarInitials: "JA",
  },
  {
    id: "user_beatriz",
    name: "Beatriz Santos",
    email: "beatriz.santos@contentos.app",
    role: "COPYWRITER",
    avatarColor: "#22C55E",
    avatarInitials: "BS",
  },
  {
    id: "user_rafael",
    name: "Rafael Nogueira",
    email: "rafael.nogueira@contentos.app",
    role: "SOCIAL_MEDIA",
    avatarColor: "#60A5FA",
    avatarInitials: "RN",
  },
];

export function getUserById(id: string | undefined | null): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
