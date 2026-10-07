"use client";

import * as React from "react";
import { Mic, Square, Sparkles, Loader2, AlertCircle } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ContentForm } from "@/components/content/ContentForm";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useClientStore } from "@/store/client-store";
import { useContentStore, type ContentInput } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";
import type { Content, ContentFormat, Platform } from "@/types";

interface ParsedTask {
  title: string;
  clientName: string | null;
  platform: Platform | null;
  format: ContentFormat | null;
  scheduledAt: string | null;
}

export interface VoiceTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function matchClientByName(clients: { id: string; name: string }[], name: string | null) {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return (
    clients.find((c) => c.name.toLowerCase() === normalized) ??
    clients.find((c) => c.name.toLowerCase().includes(normalized) || normalized.includes(c.name.toLowerCase()))
  );
}

export function VoiceTaskModal({ open, onOpenChange }: VoiceTaskModalProps) {
  const [transcript, setTranscript] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [prefill, setPrefill] = React.useState<Partial<Content> | null>(null);

  const clients = useClientStore((s) => s.clients);
  const addContent = useContentStore((s) => s.addContent);
  const { toast } = useToast();

  const { isListening, isSupported, start, stop } = useSpeechRecognition({
    onResult: setTranscript,
  });

  function reset() {
    setTranscript("");
    setIsProcessing(false);
    setError(null);
    setPrefill(null);
  }

  function handleClose() {
    stop();
    onOpenChange(false);
    reset();
  }

  async function handleProcess() {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/parse-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript, clientNames: clients.map((c) => c.name) }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Não foi possível processar o pedido.");
      }

      const task = data as ParsedTask;
      const matchedClient = matchClientByName(clients, task.clientName);

      setPrefill({
        title: task.title,
        clientId: matchedClient?.id,
        platform: task.platform ?? undefined,
        format: task.format ?? undefined,
        scheduledAt: task.scheduledAt ?? undefined,
        caption: transcript,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleSubmit(input: ContentInput) {
    addContent(input);
    toast({ title: "Conteúdo criado por voz", description: input.title, variant: "success" });
    handleClose();
  }

  return (
    <Modal open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <ModalContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Criar conteúdo por voz</ModalTitle>
          <ModalDescription>
            Fale o que precisa fazer — a IA extrai título, cliente, plataforma e data.
          </ModalDescription>
        </ModalHeader>

        {prefill ? (
          <div className="mt-4">
            <ContentForm
              initial={prefill}
              onSubmit={handleSubmit}
              onCancel={() => setPrefill(null)}
              submitLabel="Criar conteúdo"
            />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {!isSupported && (
              <p className="text-xs text-muted-foreground">
                Seu navegador não suporta reconhecimento de voz — digite o texto abaixo normalmente.
              </p>
            )}

            <div className="flex justify-center">
              <Button
                type="button"
                variant={isListening ? "destructive" : "secondary"}
                onClick={isListening ? stop : start}
                disabled={!isSupported}
              >
                {isListening ? <Square className="size-3.5" /> : <Mic className="size-3.5" />}
                {isListening ? "Parar" : "Falar"}
              </Button>
            </div>

            <Textarea
              label="Transcrição"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder='Ex: "Criar um Reels pro cliente ACME sobre a coleção de verão pra sexta-feira"'
              rows={4}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleProcess} disabled={!transcript.trim() || isProcessing}>
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                Criar tarefa com IA
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
