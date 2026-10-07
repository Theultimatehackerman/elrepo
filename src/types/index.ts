export const STATUSES = [
  "IDEIA",
  "ROTEIRO",
  "PRODUCAO",
  "EDICAO",
  "APROVACAO",
  "AGENDADO",
  "PUBLICADO",
] as const;

export type ContentStatus = (typeof STATUSES)[number];

export const PLATFORMS = [
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "LINKEDIN",
  "FACEBOOK",
  "TWITTER",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const FORMATS = [
  "REEL",
  "CAROUSEL",
  "STORY",
  "POST",
  "VIDEO",
  "LIVE",
] as const;

export type ContentFormat = (typeof FORMATS)[number];

export type UserRole =
  | "SOCIAL_MEDIA"
  | "DESIGNER"
  | "VIDEOMAKER"
  | "COPYWRITER"
  | "CLIENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  avatarInitials: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  avatarColor: string;
  avatarInitials: string;
  platforms: Platform[];
  responsibleId: string;
  createdAt: string;
}

export type CampaignStatus = "PLANEJAMENTO" | "ATIVA" | "CONCLUIDA";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  clientId: string;
  campaignId: string | null;
  platform: Platform;
  format: ContentFormat;
  status: ContentStatus;
  assigneeId: string;
  scheduledAt: string;
  script: string;
  caption: string;
  hashtags: string[];
  cta: string;
  thumbnailSeed: string;
  driveFile: DriveFile | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  contentId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export type ActivityType =
  | "CONTENT_CREATED"
  | "CONTENT_UPDATED"
  | "CONTENT_MOVED"
  | "CONTENT_DELETED"
  | "CONTENT_SCHEDULED"
  | "COMMENT_ADDED"
  | "CONTENT_APPROVED"
  | "CONTENT_CHANGE_REQUESTED";

export interface Activity {
  id: string;
  type: ActivityType;
  actorId: string;
  contentId: string | null;
  message: string;
  meta?: {
    from?: ContentStatus;
    to?: ContentStatus;
  };
  createdAt: string;
}

export type DateFormatPreference = "DD/MM/YYYY" | "MM/DD/YYYY";
export type WeekStart = "SUNDAY" | "MONDAY";

export interface WorkspaceSettings {
  workspaceName: string;
  workspaceAvatarInitials: string;
  profileName: string;
  profileEmail: string;
  dateFormat: DateFormatPreference;
  weekStart: WeekStart;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  workspaceName: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  workspaceName: string;
  email: string;
  password: string;
}

