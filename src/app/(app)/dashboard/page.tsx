"use client";

import { motion } from "framer-motion";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentContent } from "@/components/dashboard/RecentContent";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { UpcomingContent } from "@/components/dashboard/UpcomingContent";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useSettingsStore } from "@/store/settings-store";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const profileName = useSettingsStore((s) => s.settings.profileName);
  const firstName = profileName.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-xl font-semibold text-foreground">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Aqui está o que está acontecendo com seu conteúdo.
        </p>
      </motion.div>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <RecentContent />
          <PendingApprovals />
        </div>
        <div className="flex flex-col gap-6">
          <UpcomingContent />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
