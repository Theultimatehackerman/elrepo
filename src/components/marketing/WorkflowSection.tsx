"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/constants/status";

export function WorkflowSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Do primeiro rascunho até a publicação.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Um fluxo claro que sua equipe já entende: ideia, roteiro, produção, edição, aprovação,
            agendamento e publicação.
          </p>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {STATUS_ORDER.map((status, i) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            return (
              <motion.div
                key={status}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex items-center gap-2"
              >
                <div
                  className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                  style={{
                    color: config.color,
                    borderColor: "color-mix(in srgb, " + config.color + " 35%, transparent)",
                    background: "color-mix(in srgb, " + config.color + " 10%, transparent)",
                  }}
                >
                  <Icon className="size-3.5" />
                  {config.label}
                </div>
                {i < STATUS_ORDER.length - 1 && (
                  <ArrowRight className="size-4 text-muted-foreground/50" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
