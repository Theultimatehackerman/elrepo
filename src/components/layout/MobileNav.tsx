"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  FileText,
  Megaphone,
  Users,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/settings-store";
import { useToast } from "@/components/ui/Toast";
import { getInitials } from "@/lib/utils/text";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const settings = useSettingsStore((s) => s.settings);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    setOpen(false);
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta.",
      variant: "info",
    });
    router.push("/login");
  }

  React.useEffect(() => {
    // Close the drawer whenever the route changes (link click, back/forward nav).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-sm text-foreground hover:bg-hover md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="radix-fade fixed inset-0 z-50 bg-overlay md:hidden" />
        <DialogPrimitive.Content className="radix-slide-left fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border bg-surface p-3 outline-none md:hidden">
          <div>
            <div className="flex h-11 items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Logo size={32} className="size-8" />
                <DialogPrimitive.Title className="text-sm font-semibold text-foreground">
                  Content OS
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close className="flex size-7 items-center justify-center rounded-xs text-muted-foreground hover:bg-hover hover:text-foreground">
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
            <nav className="mt-2 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary-text"
                        : "text-muted-foreground hover:bg-hover hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-border pt-3 mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2.5 px-2 py-1">
              <Avatar
                initials={getInitials(settings.profileName)}
                size="sm"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-foreground truncate">
                  {settings.profileName}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {settings.profileEmail}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut className="size-4 shrink-0" />
               da conta
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
