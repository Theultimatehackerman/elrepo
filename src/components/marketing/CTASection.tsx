"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
          Pare de gerenciar conteúdo em ferramentas diferentes.
        </h2>
        <Button asChild size="lg">
          <Link href="/register">
            Começar gratuitamente <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
