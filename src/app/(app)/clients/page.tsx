"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClientCard } from "@/components/clients/ClientCard";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { useClientStore } from "@/store/client-store";

export default function ClientsPage() {
  const clients = useClientStore((s) => s.clients);
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description="Gerencie seus clientes e o que está pendente para cada um."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Novo cliente
          </Button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente ainda"
          description="Cadastre seu primeiro cliente para começar."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> Novo cliente
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      <CreateClientModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
