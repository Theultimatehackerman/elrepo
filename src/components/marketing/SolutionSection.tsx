"use client";

import { Layers, CalendarDays, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: Layers,
    title: "Tudo em um lugar",
    description: "Clientes, campanhas, conteúdos e aprovações centralizados em um único fluxo.",
  },
  {
    icon: CalendarDays,
    title: "Calendário visual",
    description: "Veja o que vem por aí, arraste conteúdos entre datas e mude de mês, semana ou dia.",
  },
  {
    icon: CheckCircle2,
    title: "Aprovação simples",
    description: "Envie para o cliente, receba comentários e aprove sem sair da plataforma.",
  },
];

export function SolutionSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            O Content OS centraliza toda a sua operação de conteúdo.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <Card className="flex h-full flex-col gap-3 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
