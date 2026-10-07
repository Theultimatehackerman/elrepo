"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = React.useState("");
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Informe seu nome completo.";
    if (!workspaceName.trim()) errs.workspaceName = "Informe o nome do seu workspace ou agência.";
    if (!email.trim()) {
      errs.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Informe um e-mail válido.";
    }
    if (!password) {
      errs.password = "Crie uma senha.";
    } else if (password.length < 6) {
      errs.password = "A senha deve ter pelo menos 6 caracteres.";
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = "As senhas não coincidem.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = register({
        name,
        workspaceName,
        email,
        password,
      });

      if (!result.success) {
        setErrors({ email: result.error ?? "Erro ao realizar cadastro." });
        toast({
          title: "Erro no cadastro",
          description: result.error,
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo ao Content OS, ${name.split(" ")[0]}!`,
        variant: "success",
      });

      router.push("/dashboard");
    } catch {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível concluir o cadastro.",
        variant: "error",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/15 blur-[120px]" />

      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para o início
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Logo size={24} className="size-6" />
            <span className="font-semibold text-foreground">Content OS</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="border-border bg-surface shadow-elevated">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                Crie sua conta
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Comece a organizar seu fluxo de conteúdo de forma profissional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Nome completo"
                  placeholder="Ex: Ana Silva"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  error={errors.name}
                  autoComplete="name"
                  disabled={isLoading}
                />

                <Input
                  label="Nome do workspace ou agência"
                  placeholder="Ex: Silva Marketing Studio"
                  value={workspaceName}
                  onChange={(e) => {
                    setWorkspaceName(e.target.value);
                    if (errors.workspaceName) setErrors((prev) => ({ ...prev, workspaceName: "" }));
                  }}
                  error={errors.workspaceName}
                  disabled={isLoading}
                />

                <Input
                  label="E-mail"
                  type="email"
                  placeholder="ana@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  error={errors.email}
                  autoComplete="email"
                  disabled={isLoading}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Senha"
                    type="password"
                    placeholder="Mínimo 6 dígitos"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    error={errors.password}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />

                  <Input
                    label="Confirmar senha"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar conta gratuitamente
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-border pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Já possui uma conta?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline hover:text-primary-hover"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
