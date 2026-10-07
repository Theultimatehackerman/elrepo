"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/marketing/Reveal";

const TOOLS = ["WhatsApp", "Google Drive", "Notion", "Planilhas", "Trello", "Instagram"];

export function ProblemSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Seu conteúdo não deveria estar espalhado em seis ferramentas diferentes.
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {TOOLS.map((tool) => (
            <motion.span
              key={tool}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground"
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <p className="text-sm text-muted-foreground">
            Isso dificulta saber o que precisa ser produzido, quem é responsável, o que está
            atrasado e o que aguarda aprovação.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
