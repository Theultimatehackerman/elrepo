"use client";

import * as React from "react";
import { LayoutGrid, List, Kanban as KanbanIcon, Plus, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentListRow } from "@/components/content/ContentListRow";
import { CreateContentModal } from "@/components/content/CreateContentModal";
import {
  ContentFilters,
  EMPTY_FILTERS,
  applyContentFilters,
  type ContentFilterState,
} from "@/components/content/ContentFilters";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useContentStore } from "@/store/content-store";
import { getClientById } from "@/data/mock-clients";
import { getCampaignById } from "@/data/mock-campaigns";

export default function ContentPage() {
  const contents = useContentStore((s) => s.contents);
  const [filters, setFilters] = React.useState<ContentFilterState>(EMPTY_FILTERS);
  const [view, setView] = React.useState("grid");
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    // Sync from the ?create=1 deep link (used by the Topbar "Novo conteúdo" button).
    if (new URLSearchParams(window.location.search).get("create") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreateOpen(true);
    }
  }, []);

  const filtered = applyContentFilters(
    contents,
    filters,
    (id) => getClientById(id)?.name ?? "",
    (id) => getCampaignById(id)?.name ?? ""
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Content"
        description="Todos os seus conteúdos em um só lugar."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Novo conteúdo
          </Button>
        }
      />

      <Tabs value={view} onValueChange={setView} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ContentFilters value={filters} onChange={setFilters} />
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="size-3.5" /> Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="size-3.5" /> Lista
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <KanbanIcon className="size-3.5" /> Kanban
            </TabsTrigger>
          </TabsList>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={contents.length === 0 ? "Nenhum conteúdo ainda" : "Nenhum resultado"}
            description={
              contents.length === 0
                ? "Comece criando seu primeiro conteúdo."
                : "Tente ajustar os filtros ou o termo de busca."
            }
            action={
              contents.length === 0 ? (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  Criar conteúdo
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <TabsContent value="grid">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sorted.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((content) => (
                    <ContentListRow key={content.id} content={content} />
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="kanban">
              <KanbanBoard items={sorted} />
            </TabsContent>
          </>
        )}
      </Tabs>

      <CreateContentModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
