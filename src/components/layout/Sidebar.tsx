"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Megaphone,
  Users,
  CheckSquare,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { Logo } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useLocalStorage("content-os-ui-sidebar-collapsed", false);

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <Logo size={32} className="size-8" priority />
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground">Content OS</span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary-text"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );

            if (!collapsed) return link;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-hover hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!collapsed && "Recolher"}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
