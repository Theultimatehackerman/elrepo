"use client";

import { Check, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { Button } from "@/components/ui/Button";
import { gradientForSeed } from "@/lib/utils/gradient";

export function ApprovalSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <Reveal>
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            Aprovação sem trocar 20 mensagens no WhatsApp.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            O cliente recebe um link, visualiza o conteúdo, comenta o que precisa mudar e aprova
            com um clique. Tudo fica registrado.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-(--shadow-elevated)">
            <div className="mb-4 flex gap-3">
              <div
                className="size-16 shrink-0 rounded-lg"
                style={{ background: gradientForSeed("approval-demo") }}
              />
              <div className="flex flex-col justify-center gap-1">
                <span className="text-sm font-medium text-foreground">
                  5 erros que fazem seu Instagram perder alcance
                </span>
                <span className="text-xs text-muted-foreground">Aguardando aprovação do cliente</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" tabIndex={-1}>
                <Check className="size-3.5" /> Aprovar
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" tabIndex={-1}>
                <RotateCcw className="size-3.5" /> Solicitar alteração
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
