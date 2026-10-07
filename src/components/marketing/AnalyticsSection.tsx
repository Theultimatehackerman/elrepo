"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/Reveal";
import { Badge } from "@/components/ui/Badge";

const BARS = [40, 65, 50, 80, 60, 90, 70];

export function AnalyticsSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <Reveal delay={0.1} className="order-2 sm:order-1">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-(--shadow-elevated)">
            <div className="mb-6 flex h-24 items-end justify-between gap-2">
              {BARS.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-t-xs bg-primary/30"
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Conteúdos publicados por semana</span>
              <span>últimas 7 semanas</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 sm:order-2">
          <Badge variant="outline" className="mb-3">
            Em breve
          </Badge>
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Analytics para entender o que está funcionando.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Uma visão futura do produto: acompanhar volume de produção, ritmo de aprovação e
            performance por cliente — direto no Content OS.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
