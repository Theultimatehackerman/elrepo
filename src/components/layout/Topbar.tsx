"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Mic, LogOut } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { VoiceTaskModal } from "@/components/content/VoiceTaskModal";
import { useSettingsStore } from "@/store/settings-store";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/components/ui/Toast";
import { getInitials } from "@/lib/utils/text";

export function Topbar() {
  const router = useRouter();
  const { toast } = useToast();
  const settings = useSettingsStore((s) => s.settings);
  const logout = useAuthStore((s) => s.logout);
  const [voiceOpen, setVoiceOpen] = React.useState(false);

  function handleLogout() {
    logout();
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta.",
      variant: "info",
    });
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <MobileNav />

      <div className="flex-1" />

      <Button
        size="sm"
        variant="outline"
        onClick={() => setVoiceOpen(true)}
        aria-label="Criar por voz"
      >
        <Mic className="size-4" />
        <span className="hidden sm:inline">Criar por voz</span>
      </Button>

      <Button asChild size="sm" variant="secondary">
        <Link href="/content?create=1" aria-label="Novo conteúdo">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Novo conteúdo</span>
        </Link>
      </Button>

      <Dropdown>
        <DropdownTrigger asChild>
          <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <Avatar
              initials={getInitials(settings.profileName)}
              size="sm"
              color="#5B4BFF"
            />
          </button>
        </DropdownTrigger>
        <DropdownContent align="end">
          <DropdownLabel>{settings.profileName}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem asChild>
            <Link href="/settings">Configurações</Link>
          </DropdownItem>
          <DropdownItem asChild>
            <Link href="/">Ver landing page</Link>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            onClick={handleLogout}
            className="cursor-pointer text-danger focus:bg-danger/10 focus:text-danger gap-2"
          >
            <LogOut className="size-4" />
            Sair da conta
          </DropdownItem>
        </DropdownContent>
      </Dropdown>

      <VoiceTaskModal open={voiceOpen} onOpenChange={setVoiceOpen} />
    </header>
  );
}
