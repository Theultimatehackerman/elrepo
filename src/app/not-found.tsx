import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <EmptyState
        icon={FileQuestion}
        title="Página não encontrada"
        description="A página que você está procurando não existe ou foi movida."
        action={
          <Button asChild>
            <Link href="/dashboard">Voltar para o Dashboard</Link>
          </Button>
        }
      />
    </div>
  );
}
