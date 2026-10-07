import type { ComponentType, SVGProps } from "react";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  LinkedinIcon,
  FacebookIcon,
  XIcon,
} from "@/components/icons/platform-icons";
import type { ContentFormat, Platform } from "@/types";

export interface PlatformConfig {
  value: Platform;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  INSTAGRAM: { value: "INSTAGRAM", label: "Instagram", icon: InstagramIcon, color: "#E1306C" },
  TIKTOK: { value: "TIKTOK", label: "TikTok", icon: TikTokIcon, color: "#25F4EE" },
  YOUTUBE: { value: "YOUTUBE", label: "YouTube", icon: YoutubeIcon, color: "#FF0000" },
  LINKEDIN: { value: "LINKEDIN", label: "LinkedIn", icon: LinkedinIcon, color: "#0A66C2" },
  FACEBOOK: { value: "FACEBOOK", label: "Facebook", icon: FacebookIcon, color: "#1877F2" },
  TWITTER: { value: "TWITTER", label: "X (Twitter)", icon: XIcon, color: "#1D9BF0" },
};

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  REEL: "Reel",
  CAROUSEL: "Carrossel",
  STORY: "Story",
  POST: "Post",
  VIDEO: "Vídeo",
  LIVE: "Live",
};
