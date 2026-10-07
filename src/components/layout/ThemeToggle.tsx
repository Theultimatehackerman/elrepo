"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dropdown,
  DropdownContent,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { useTheme } from "@/hooks/use-theme";
import { isThemePreference } from "@/lib/theme/resolve";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const TriggerIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Alterar tema">
          <TriggerIcon className="size-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">
        <DropdownLabel>Tema</DropdownLabel>
        <DropdownRadioGroup
          value={theme}
          onValueChange={(value) => isThemePreference(value) && setTheme(value)}
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownRadioItem key={value} value={value}>
              <Icon className="size-4 text-muted-foreground" />
              {label}
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
      </DropdownContent>
    </Dropdown>
  );
}
