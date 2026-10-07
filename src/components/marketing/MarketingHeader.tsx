"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <Logo size={32} className="size-8" priority />
        <span className="text-sm font-semibold text-foreground">Content OS</span>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Começar gratuitamente</Link>
        </Button>
      </div>
    </header>
  );
}
