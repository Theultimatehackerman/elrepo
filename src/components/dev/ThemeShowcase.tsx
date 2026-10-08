"use client";

import { useSyncExternalStore } from "react";
import { Inbox } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownTrigger } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { subscribe as subscribeTheme } from "@/lib/theme/theme-store";
import { SHOWCASE_TOKENS } from "@/lib/theme/dev-showcase";
import { contrastRatio } from "@/lib/utils/color";

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
}

// Snapshot (string estável) dos valores computados; muda quando o tema troca (o store emite).
function readSnapshot(): string {
  return JSON.stringify(Object.fromEntries(SHOWCASE_TOKENS.map((t) => [t.name, readToken(t.name)])));
}

function useTokenValues(): Record<string, string> {
  const snapshot = useSyncExternalStore(subscribeTheme, readSnapshot, () => "{}");
  return JSON.parse(snapshot) as Record<string, string>;
}

function TokenTable() {
  const values = useTokenValues();
  const groups = [...new Set(SHOWCASE_TOKENS.map((t) => t.group))];
  return (
    <div className="space-y-6" data-testid="token-table">
      {groups.map((group) => (
        <section key={group}>
          <h3 className="mb-2 text-sm font-semibold text-foreground">{group}</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE_TOKENS.filter((t) => t.group === group).map((token) => {
              const value = values[token.name] ?? "";
              let ratio: number | null = null;
              if (token.against && token.role) {
                const other = values[token.against] ?? "";
                ratio = token.role === "text" ? contrastRatio(value, other) : contrastRatio(other, value);
              }
              return (
                <div key={token.name} className="flex items-center gap-3 rounded-sm border border-border bg-surface p-2">
                  <span
                    className="size-10 shrink-0 rounded-sm border border-border"
                    style={{ background: `var(--color-${token.name})` }}
                    aria-hidden
                  />
                  <div className="min-w-0 text-xs">
                    <p className="truncate font-mono text-foreground">--color-{token.name}</p>
                    <p className="text-muted-foreground">
                      {value || "…"}
                      {ratio !== null && ratio > 1 && (
                        <span data-testid={`ratio-${token.name}`}> · {ratio.toFixed(2)}:1 sobre {token.against}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function ThemeShowcase() {
  const { toast } = useToast();
  return (
    <TooltipProvider delayDuration={100}>
      <main className="mx-auto max-w-5xl space-y-10 p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Vitrine de tema</h1>
            <p className="text-sm text-muted-foreground">Somente desenvolvimento · alterne o tema e compare tokens e componentes.</p>
          </div>
          <ThemeToggle />
        </header>

        <Section title="Tokens">
          <TokenTable />
        </Section>

        <Section title="Botões">
          <div className="flex flex-wrap items-center gap-2">
            {(["primary", "secondary", "ghost", "outline", "destructive", "link"] as const).map((variant) => (
              <Button key={variant} variant={variant}>{variant}</Button>
            ))}
            <Button size="sm">sm</Button>
            <Button size="lg">lg</Button>
            <Button loading>loading</Button>
            <Button disabled>disabled</Button>
          </div>
        </Section>

        <Section title="Badges e avatares">
          <div className="flex flex-wrap items-center gap-2">
            {(["default", "primary", "success", "warning", "danger", "outline"] as const).map((variant) => (
              <Badge key={variant} variant={variant}>{variant}</Badge>
            ))}
            <Avatar initials="AB" size="xs" />
            <Avatar initials="CD" size="sm" />
            <Avatar initials="EF" size="md" />
            <Avatar initials="GH" size="lg" />
          </div>
        </Section>

        <Section title="Formulário">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nome" placeholder="Digite aqui" />
            <Input label="Com erro" error="Campo obrigatório" defaultValue="valor" />
            <Textarea label="Descrição" placeholder="Texto longo" />
            <Select defaultValue="a">
              <SelectTrigger aria-label="Exemplo de select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Opção A</SelectItem>
                <SelectItem value="b">Opção B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Cartão, tabela, abas, esqueleto, vazio">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Título do cartão</CardTitle>
                <CardDescription>Descrição secundária</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <EmptyState icon={Inbox} title="Nada por aqui" description="Estado vazio de exemplo." />
          </div>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Coluna</TableHead><TableHead>Valor</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>Linha 1</TableCell><TableCell>10</TableCell></TableRow>
              <TableRow><TableCell>Linha 2</TableCell><TableCell>20</TableCell></TableRow>
            </TableBody>
          </Table>
          <Tabs defaultValue="um">
            <TabsList>
              <TabsTrigger value="um">Aba um</TabsTrigger>
              <TabsTrigger value="dois">Aba dois</TabsTrigger>
            </TabsList>
            <TabsContent value="um" className="text-sm text-muted-foreground">Conteúdo da aba um.</TabsContent>
            <TabsContent value="dois" className="text-sm text-muted-foreground">Conteúdo da aba dois.</TabsContent>
          </Tabs>
        </Section>

        <Section title="Sobreposições">
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Tooltip</Button></TooltipTrigger>
              <TooltipContent>Dica de exemplo</TooltipContent>
            </Tooltip>
            <Dropdown>
              <DropdownTrigger asChild><Button variant="outline">Dropdown</Button></DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>Menu</DropdownLabel>
                <DropdownItem>Item um</DropdownItem>
                <DropdownItem>Item dois</DropdownItem>
              </DropdownContent>
            </Dropdown>
            <Modal>
              <ModalTrigger asChild><Button variant="outline">Modal</Button></ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Modal de exemplo</ModalTitle>
                  <ModalDescription>Fundo com o token overlay.</ModalDescription>
                </ModalHeader>
                <ModalFooter><Button>Confirmar</Button></ModalFooter>
              </ModalContent>
            </Modal>
            <Button variant="outline" onClick={() => toast({ title: "Sucesso", description: "Toast de exemplo", variant: "success" })}>Toast sucesso</Button>
            <Button variant="outline" onClick={() => toast({ title: "Erro", description: "Toast de exemplo", variant: "error" })}>Toast erro</Button>
          </div>
        </Section>
      </main>
    </TooltipProvider>
  );
}
