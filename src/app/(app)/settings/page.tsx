"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useSettingsStore } from "@/store/settings-store";
import { useToast } from "@/components/ui/Toast";
import { getInitials } from "@/lib/utils/text";

export default function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const { toast } = useToast();

  const [workspaceName, setWorkspaceName] = React.useState(settings.workspaceName);
  const [profileName, setProfileName] = React.useState(settings.profileName);

  function saveWorkspace(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ workspaceName, workspaceAvatarInitials: getInitials(workspaceName) });
    toast({ title: "Workspace atualizado", variant: "success" });
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ profileName });
    toast({ title: "Perfil atualizado", variant: "success" });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Workspace, perfil e preferências." />

      <Tabs defaultValue="workspace" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Informações gerais do seu espaço de trabalho.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveWorkspace} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={getInitials(workspaceName || "CO")} size="lg" />
                  <span className="text-xs text-muted-foreground">
                    O logo é gerado a partir do nome do workspace.
                  </span>
                </div>
                <Input
                  label="Nome do workspace"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={getInitials(profileName || "U")} size="lg" />
                </div>
                <Input
                  label="Nome"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
                <Input label="E-mail" value={settings.profileEmail} disabled />
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Personalize a experiência do produto.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tema</label>
                <Select value="dark" disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Escuro</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                  O modo claro chega em uma próxima versão.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Formato de data</label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(v) => {
                    updateSettings({ dateFormat: v as typeof settings.dateFormat });
                    toast({ title: "Preferência salva", variant: "success" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Início da semana</label>
                <Select
                  value={settings.weekStart}
                  onValueChange={(v) => {
                    updateSettings({ weekStart: v as typeof settings.weekStart });
                    toast({ title: "Preferência salva", variant: "success" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUNDAY">Domingo</SelectItem>
                    <SelectItem value="MONDAY">Segunda-feira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
