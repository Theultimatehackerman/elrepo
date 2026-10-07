"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);
  const loginAsDemo = useAuthStore((s) => s.loginAsDemo);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }

    setIsLoading(true);
    const result = login(email, password);

    if (!result.success) {
      setError(result.error ?? "E-mail ou senha incorretos.");
      toast({
        title: "Falha no login",
        description: result.error ?? "E-mail ou senha incorretos.",
        variant: "error",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Login realizado",
      description: "Bem-vindo de volta ao Content OS!",
      variant: "success",
    });

    router.push("/dashboard");
  }

  function handleDemoLogin() {
    loginAsDemo();
    toast({
      title: "Modo demonstração",
      description: "Conectado como Lázaro Vasconcelos.",
      variant: "info",
    });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/15 blur-[120px]" />

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

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
                Acesse sua conta
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Entre com seu e-mail e senha para gerenciar seus conteúdos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="email"
                  disabled={isLoading}
                />

                <Input
                  label="Senha"
                  type="password"
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="current-password"
                  disabled={isLoading}
                />

                {error && <span className="text-xs text-danger">{error}</span>}

                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ou</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="secondary"
                className="mt-4 w-full gap-2"
                onClick={handleDemoLogin}
              >
                <UserCheck className="size-4 text-primary-text" />
                Entrar com conta de demonstração
              </Button>

              <div className="mt-6 border-t border-border pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Ainda não tem uma conta?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary-text hover:underline"
                  >
                    Cadastre-se gratuitamente
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
