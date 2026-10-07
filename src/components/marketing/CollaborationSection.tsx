"use client";

import { motion } from "framer-motion";
import { ArrowDown, UserRound, FileText, Building2, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

const STEPS = [
  { icon: UserRound, label: "Social Media" },
  { icon: FileText, label: "Conteúdo" },
  { icon: Building2, label: "Cliente" },
  { icon: CheckCircle2, label: "Aprovação" },
];

export function CollaborationSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-10">
        <Reveal className="text-center">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Colaboração sem fricção entre equipe e cliente.
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col items-center gap-1"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-2.5">
                <step.icon className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && <ArrowDown className="size-4 text-muted-foreground/40" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
