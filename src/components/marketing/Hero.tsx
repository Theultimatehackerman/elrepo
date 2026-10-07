"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/constants/status";
import { gradientForSeed } from "@/lib/utils/gradient";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, color-mix(in srgb, var(--color-primary) 25%, transparent), transparent 70%)",
        }}
      />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.span
          variants={item}
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          Content Operations para times de conteúdo
        </motion.span>
        <motion.h1
          variants={item}
          className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          Seu conteúdo. Organizado do início ao fim.
        </motion.h1>
        <motion.p variants={item} className="max-w-xl text-balance text-lg text-muted-foreground">
          Planeje, produza e aprove seus conteúdos em um único lugar.
        </motion.p>
        <motion.div variants={item}>
          <Button asChild size="lg">
            <Link href="/register">
              Começar gratuitamente <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-16 max-w-4xl"
      >
        <DashboardPreview />
      </motion.div>
    </section>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "Em produção", value: 12 },
    { label: "Aprovação", value: 4 },
    { label: "Agendados", value: 8 },
    { label: "Publicados", value: 24 },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-elevated)">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-danger/60" />
        <span className="size-2.5 rounded-full bg-warning/60" />
        <span className="size-2.5 rounded-full bg-success/60" />
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface-elevated p-3">
            <p className="text-xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-5">
        {STATUS_ORDER.slice(0, 5).map((status, i) => {
          const config = STATUS_CONFIG[status];
          return (
            <div key={status} className="flex w-32 shrink-0 flex-col gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">{config.label}</span>
              <div
                className="aspect-[4/5] rounded-md"
                style={{ background: gradientForSeed(`${status}-${i}`) }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
