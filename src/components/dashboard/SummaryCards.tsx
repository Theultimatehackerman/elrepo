"use client";

import { motion } from "framer-motion";
import { Clapperboard, Eye, CalendarClock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { useContentStore } from "@/store/content-store";

const CARD_CONFIG = [
  {
    key: "producao",
    label: "Em produção",
    icon: Clapperboard,
    color: "text-status-production",
    statuses: ["ROTEIRO", "PRODUCAO", "EDICAO"],
  },
  {
    key: "aprovacao",
    label: "Aguardando aprovação",
    icon: Eye,
    color: "text-status-approval",
    statuses: ["APROVACAO"],
  },
  {
    key: "agendado",
    label: "Agendados",
    icon: CalendarClock,
    color: "text-status-scheduled",
    statuses: ["AGENDADO"],
  },
  {
    key: "publicado",
    label: "Publicados",
    icon: CheckCircle2,
    color: "text-status-published",
    statuses: ["PUBLICADO"],
  },
] as const;

export function SummaryCards() {
  const contents = useContentStore((s) => s.contents);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARD_CONFIG.map((card, i) => {
        const count = contents.filter((c) =>
          (card.statuses as readonly string[]).includes(c.status)
        ).length;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="flex items-center justify-between p-5">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className="text-2xl font-semibold text-foreground">{count}</span>
              </div>
              <div className={cn("flex size-10 items-center justify-center rounded-md bg-surface-elevated", card.color)}>
                <card.icon className="size-5" />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
