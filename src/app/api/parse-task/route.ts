import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { z } from "zod/v4";
import { PLATFORMS, FORMATS } from "@/types";

export const runtime = "nodejs";

const GROQ_MODEL = "openai/gpt-oss-120b";

const TaskExtractionSchema = z.object({
  title: z.string().describe("Título curto e claro para o conteúdo/tarefa"),
  clientName: z
    .string()
    .nullable()
    .describe("Nome do cliente mencionado, deve bater com um dos clientes cadastrados fornecidos"),
  platform: z.enum(PLATFORMS).nullable(),
  format: z.enum(FORMATS).nullable(),
  scheduledAt: z
    .string()
    .nullable()
    .describe("Data e hora em ISO 8601 já calculada a partir de referências relativas (ex: 'sexta-feira'), ou null se não houver menção de data"),
});

const taskExtractionJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Título curto e claro para o conteúdo/tarefa" },
    clientName: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description: "Nome do cliente mencionado, deve bater com um dos clientes cadastrados fornecidos",
    },
    platform: {
      anyOf: [{ type: "null" }, { type: "string", enum: [...PLATFORMS] }],
    },
    format: {
      anyOf: [{ type: "null" }, { type: "string", enum: [...FORMATS] }],
    },
    scheduledAt: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description:
        "Data e hora em ISO 8601 já calculada a partir de referências relativas (ex: 'sexta-feira'), ou null se não houver menção de data",
    },
  },
  required: ["title", "clientName", "platform", "format", "scheduledAt"],
  additionalProperties: false,
} as const;

function buildSystemPrompt(now: string, clientNames: string[]) {
  return [
    "Você extrai tarefas de produção de conteúdo a partir de fala transcrita, para um sistema de gestão de conteúdo de social media.",
    `A data e hora atuais são: ${now} (use isso para calcular datas relativas como "sexta-feira" ou "amanhã").`,
    clientNames.length > 0
      ? `Clientes cadastrados: ${clientNames.join(", ")}. Se um desses nomes for mencionado (mesmo que parcialmente ou com pequena variação), retorne o nome exatamente como está na lista.`
      : "Nenhum cliente cadastrado foi informado.",
    "Se alguma informação não for mencionada no texto, retorne null para o campo correspondente.",
  ].join("\n");
}

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Integração com IA não configurada. Defina GROQ_API_KEY no servidor (veja o README)." },
      { status: 501 }
    );
  }

  let body: { text?: string; clientNames?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Nenhum texto fornecido." }, { status: 400 });
  }
  const clientNames = Array.isArray(body.clientNames) ? body.clientNames : [];

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const now = new Date().toISOString();
  const systemPrompt = buildSystemPrompt(now, clientNames);

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 1024,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "task_extraction",
          schema: taskExtractionJsonSchema,
        },
      },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      return NextResponse.json({ error: "Não foi possível interpretar a resposta da IA." }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json({ error: "Não foi possível interpretar a resposta da IA." }, { status: 502 });
    }

    const result = TaskExtractionSchema.safeParse(parsed);
    if (!result.success) {
      return NextResponse.json({ error: "Não foi possível interpretar a resposta da IA." }, { status: 502 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    const description =
      error instanceof Groq.APIError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Erro ao conectar com a IA.";
    return NextResponse.json({ error: description }, { status: 502 });
  }
}
