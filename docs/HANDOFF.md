# HANDOFF — Sistema de Temas do Content OS

> **Leia primeiro.** Este arquivo é a fonte da verdade do estado do projeto ao fim da sessão de 07/10/2026.
> O plano contínuo (o que fazer a seguir, sessão por sessão) está em [`ACTION-PLAN.md`](./ACTION-PLAN.md).
> Decisões de arquitetura: [`adr/0001-theme-system.md`](./adr/0001-theme-system.md). Resumo curto: [`THEME-STATUS.md`](./THEME-STATUS.md).

---

## 1. Em uma tela

| | |
|---|---|
| **Objetivo** | Transformar o escuro (antes um valor fixo) em tema de primeira classe: **Escuro · Claro · Sistema**, troca em tempo real, persistência, zero flash, WCAG AA. |
| **Estado** | **Implementação completa e verificada no sandbox.** Falta *validação no seu ambiente* (build, CI real, Safari/iOS) e *ampliar a cobertura de testes*. |
| **Pronto para merge?** | **Ainda não.** Bloqueadores: B1–B4 (seção 4). Nenhum é uma falha conhecida do código — são verificações que o sandbox não pôde fazer. |
| **Base** | `Content-OS-main` (snapshot de 22/09/2026). Commit base: `ebf4d7f`. |
| **Entregue** | 59 arquivos alterados (+1286 / −88, sem o lockfile; inclui docs e testes), 5 commits sobre a base, `theme-system.patch` (aplica limpo no original, verificado). |
| **Verificação** | `eslint` 0 problemas · `tsc` 0 erros · **22** testes Vitest · contraste AA nos 2 temas · **23** testes Playwright/axe (5 de tema + 18 de contraste: 9 rotas × 2 temas). |

---

## 2. O que foi feito (sessões S0–S9 do plano)

| Sessão | Resultado | Evidência / onde |
|---|---|---|
| **S0** Baseline | `npm ci` quebrava (lockfile dessincronizado: faltavam `@emnapi/*`). Corrigido regenerando o lockfile. Baseline medida. | commit `59aa9a2` |
| **S1** Tokens | `globals.css` reescrito: `@theme static` (escuro, também fallback sem JS) + `[data-theme="light"]` só com o que muda. 8 tokens novos por *papel*. `scripts/check-contrast.mjs` valida todos os pares em AA. | `src/app/globals.css`, `scripts/` |
| **S2** Motor | Script síncrono no `<head>` (sem flash), store externo + `useSyncExternalStore` (sem hydration mismatch), `ThemeSync` (escuta SO e outras abas), chave `content-os-theme` registrada em `STORAGE_KEYS`. | `src/lib/theme/*`, `src/hooks/use-theme.ts`, `layout.tsx` |
| **S3** Controles | `ThemeToggle` no Topbar, header da landing, login e cadastro. Settings → Preferências agora funcional (Escuro/Claro/Sistema). `Dropdown` ganhou `DropdownRadioItem`. | `ThemeToggle.tsx`, `settings/page.tsx` |
| **S4–S8** Migração | Mapa R1–R8 aplicado (ver §5). 16 violações de cor literal → 0. Avatar calcula texto legível (`readableTextColor`). Dias fora do mês no calendário corrigidos (contraste). | `git diff ebf4d7f HEAD` |
| **S9** QA/CI | Guarda-corpo ESLint em **error**. Playwright + axe (2 temas × 9 rotas). Workflow de CI. ADR, README, este handoff. | `e2e/`, `.github/workflows/ci.yml`, `eslint.config.mjs` |

### Decisões tomadas (D1–D9 do plano)

| ID | Decisão | Estado |
|---|---|---|
| D1 | Escopo: Escuro + Claro + Sistema | ✅ implementado |
| D2 | Padrão de quem nunca escolheu: **escuro** | ✅ (testado e2e) |
| D3 | Mecanismo: `data-theme` em `<html>`, sem `dark:` | ✅ |
| D4 | Persistência por dispositivo, chave própria (fora do `settings-store`) | ✅ |
| D5 | Implementação própria, 0 dependências | ✅ |
| D6 | Landing segue o tema + toggle | ✅ |
| D7 | Exportação PNG/PDF segue o tema ativo | ✅ PNG gerado sem erro no claro; **PDF não testado no claro** |
| D8 | Corrigir falhas de acessibilidade pré-existentes | ✅ |
| D9 | Gate de regressão visual (`toHaveScreenshot`) | ⚠️ **não está no repo** (só rodei um diff de pixels avulso) |

### Mudanças *intencionais* no tema escuro (as únicas)
`primary-hover` (#6e60ff → #6558ff) · `status-scheduled` (#5b4bff → #9b91ff) · `hover` (+1 degrau) · fundo do botão destrutivo (#dc2626) · `text-primary` → `text-primary-text` (#9b91ff, antes #5b4bff 3,6:1) · texto de avatar (preto/branco conforme contraste) · números de dias fora do mês no calendário (cor cheia em vez de /50).
**Regressão medida:** diff de pixels do escuro vs. baseline = 0,01% (landing) a 1,16% (login) por rota; todas as regiões diferentes mapeadas para as mudanças acima.

---

## 3. O que NÃO foi feito (resumo)

| Item | Por quê | Onde está planejado |
|---|---|---|
| `next build` | Google Fonts retorna 403 no sandbox | ACTION-PLAN **N0** |
| Rodar o CI de verdade | workflow escrito, nunca executado | **N0** |
| Safari/iOS/Firefox, fonte Geist real | sandbox só tem Chromium e fontes de fallback | **N0**, **N4** |
| Gate visual (D9) | faltou tempo; baselines devem ser geradas com a fonte real | **N2** |
| Rotas dinâmicas e `/review` nos 2 temas, mobile, estados abertos (modal/dropdown/toast/drag) | só 9 rotas estáticas foram cobertas | **N1** |
| PDF no claro | só o PNG foi gerado | **N1** |
| Regra de lint para `rgb()/hsl()/oklch()`, hex de 3/8 dígitos, `bg-[#…]` | regra atual só pega `white/black` e hex de 6 dígitos (nenhuma ocorrência hoje) | **N3** |
| Página-vitrine `/dev/theme` | prevista no plano (§4.4), não criada | **N3** |
| Documento do plano original (`Plano de Ação…md/pdf`) | parou no §5; §6+ nunca escrito. **Substituído por `ACTION-PLAN.md`** | — |

---

## 4. Bloqueadores antes do merge

| # | Bloqueador | Como resolver | Critério |
|---|---|---|---|
| **B1** | `next build` nunca rodou | `npm ci && npm run build` na sua máquina | build verde, sem erro de tipo/hidratação |
| **B2** | CI nunca executou | abrir PR com o patch; observar `quality` e `e2e` | 2 jobs verdes |
| **B3** | Versões do Playwright: `@playwright/test` está `^1.56.1`, mas `overrides` fixa `playwright-core@1.56.1` | trocar para `"@playwright/test": "1.56.1"` (exato) **ou** subir os dois juntos; rodar `npm ci` | `npm ls playwright-core` com uma única versão |
| **B4** | Node mínimo | vitest 5 exige Node ≥ 22.12. Criar `.nvmrc` (`22`) e `"engines": {"node": ">=22.12"}` | `node -v` ≥ 22.12 no deploy |

---

## 5. Mapa técnico (para não reaprender)

### Fluxo
```
localStorage['content-os-theme'] = light | dark | system     (ausente ⇒ dark)
   ├─ <head> script síncrono ─► <html data-theme style="color-scheme"> + <meta theme-color>   (antes da 1ª pintura)
   ├─ ThemeSync (montado 1× no layout): escuta o SO (só se 'system') e o evento 'storage' (outras abas)
   └─ theme-store ◄─ useTheme() ◄─ ThemeToggle · Settings
globals.css:  @theme static { …ESCURO… }   +   [data-theme='light'] { …só o que muda… }
```

### Tokens novos (todos AA)
`popover` · `hover` · `overlay` · `scrim` · `on-media` · `primary-text` · `danger-solid` · `danger-foreground`.
Regra de uso: **nunca** `dark:`, `white`, `black` nem hex em componente — o ESLint bloqueia.

### Mapa de migração aplicado (R1–R8)
| # | De → Para |
|---|---|
| R1 | `bg-black/70` (overlays) → `bg-overlay` |
| R2 | `bg-surface-elevated` em conteúdo de Select/Dropdown/Tooltip/Toast → `bg-popover` |
| R3 | `data-[highlighted]:bg-surface` → `data-[highlighted]:bg-hover` |
| R4 | `hover:bg-surface-elevated(/70\|/50)` → `hover:bg-hover` (Table mantém `/50`) |
| R5 | `text-primary` / `hover:text-primary` / `text-primary-hover` → `text-primary-text` (links: só `hover:underline`) — 22 usos |
| R6 | `bg-danger text-white` → `bg-danger-solid text-danger-foreground` (Button) |
| R7 | `text-white`, `bg-black/30`, `ring-white/10` → `text-on-media`, `bg-scrim`, `ring-foreground/10` |
| R8 | hex em TSX → paleta movida para `src/lib/constants/avatar-colors.ts`; Avatar sem `color` usa `bg-primary` |

### Arquivos novos / relevantes
`src/lib/theme/{constants,resolve,init-script,theme-store}.ts` (+ `*.test.ts`) · `src/hooks/use-theme.ts` · `src/components/layout/{ThemeSync,ThemeToggle}.tsx` · `src/lib/utils/color.ts` (+ teste) · `src/lib/constants/avatar-colors.ts` · `scripts/check-contrast.mjs` · `vitest.config.ts` · `playwright.config.ts` · `e2e/{theme,a11y}.spec.ts` · `.github/workflows/ci.yml` · `docs/*`. (`theme-system.patch` acompanha o zip, fora da árvore git.)

---

## 6. Como retomar (5 minutos)

```bash
unzip Content-OS-themed.zip && cd Content-OS-main
nvm use 22            # ou Node >= 22.12
npm ci
npx playwright install chromium

# portões (todos devem estar verdes antes de qualquer coisa nova)
npm run lint && npm run typecheck && npm test && npm run contrast
npm run e2e           # sobe o dev server sozinho (PORT=3100 por padrão)
```
Aplicar no **seu** repositório (o zip tem um `.git` próprio, criado no sandbox; `theme-system.patch` fica na raiz do zip, ao lado da pasta do projeto — copie-o para a raiz do seu repo):
```bash
git checkout -b feat/theme-system
git apply --check theme-system.patch && git apply theme-system.patch
npm install            # regenera o lockfile (o patch inclui o lockfile do sandbox)
git add -A && git commit -m "feat(theme): dark/light/system theme system"
```
Login de demonstração (e2e e QA manual): botão **“Entrar com conta de demonstração”** em `/login`.

---

## 7. Armadilhas conhecidas (custaram tempo — não repita)

1. **Tailwind v4 e `@theme`**: sem `static`, tokens que nenhum utilitário usa não são emitidos no `:root` e o override por tema falha silenciosamente.
2. **`npm ci` original falhava** por lockfile dessincronizado (`@emnapi/*`).
3. **vitest 5 exige `@types/node` ≥ 22** (o projeto tinha ^20) — já atualizado.
4. **`@axe-core/playwright` traz o próprio `playwright-core`** (1.64) e quebra o typecheck do `Page` — resolvido com `overrides` (ver B3).
5. **`LayoutProps` é global gerado** por `next typegen`; `npm run typecheck` já roda isso antes do `tsc`.
6. **Turbopack rejeita `node_modules` por symlink** (usar instalação real em worktrees).
7. **Teste “Sistema”**: o `ThemeSync` só escuta o SO após hidratar; o teste espera o marcador `__reactContainer` do React 19 (não `networkidle`). Em dev + paralelo é mais lento; em CI roda sobre `build` + `start`.
8. **Sandbox**: `pkill -f "next dev"` mata o próprio shell (o padrão aparece na linha de comando); servidor em background precisa de `setsid nohup … &`.
9. **Screenshots do sandbox** mostram fonte serifada (Google Fonts bloqueado) e o selo “N” do dev overlay — não são bugs do tema.
10. **Chaves de storage**: o tema é *por dispositivo*; não migrar para o `settings-store` sem rever o script do `<head>`.

---

## 8. Registro da engenharia de prompt desta sessão (técnica do guia `elite_prompt_engineering.md`)

**Prompt original:** “aplique o elite prompt engineering para melhorar o prompt, depois execute; crie handoff e plano de ação contínuo para a próxima sessão: o que foi feito × o que falta, resumo etc.”

**Diagnóstico (Sete Perguntas):** (1) tarefa ambígua — “handoff” e “contínuo” sem critério; (2) persona não definida; (3) sucesso não definido; (4) modos de falha livres (docs genéricos, status inflado); (5) sem esquema de saída; (6) **intenção latente** não declarada: *quem abrir isto numa sessão nova, sem memória, deve conseguir continuar em 5 minutos sem refazer nada nem confiar em afirmações não verificadas*; (7) sem autoavaliação.

**Prompt melhorado (aplicado):**
```
PERSONA   Engenheiro de software sênior em transição de turno: escreve para um colega que
          chega SEM memória, desconfia de status e quer saber o que é fato e o que é suposição.
INTENÇÃO  Não é um resumo bonito. É permitir retomar em 5 min, sem retrabalho, sem confiar em palavra.
TAREFA    Produzir (1) HANDOFF.md e (2) ACTION-PLAN.md contínuo, a partir do estado REAL do repo.
HARD      • Todo número/afirmação vem de um comando rodado nesta sessão (git/npm/testes), nunca de memória.
          • Separar explicitamente: verificado × não verificado × desconhecido.
          • Cada item pendente tem: ID, prioridade, como fazer (comando), critério de aceite.
          • Nenhum item “feito” sem evidência citável.
SOFT      Tabelas para estado, prosa curta para decisões; comandos copiáveis; português.
ANTI      Motivação, “tudo pronto!”, passos vagos (“melhorar testes”), duplicar o plano original,
          listar o que já está no código sem dizer onde.
ESQUEMA   HANDOFF: 1-tela · feito · não feito · bloqueadores · mapa técnico · retomada · armadilhas.
          PLAN: princípios · backlog priorizado · sessões N0–N5 (objetivo, passos, aceite, commit)
          · protocolo de continuidade · riscos · Definition of Done · log.
CHECKPOINT Antes de entregar: (a) conferir cada número contra a saída dos comandos; (b) o “não feito”
          cobre tudo o que o sandbox não conseguiu verificar? (c) teste de inversão: o pior leitor
          aceitável conseguiria começar a trabalhar só com isto?
```

### Prompt de início da próxima sessão (copie e cole)
```
Contexto: projeto Content OS (Next 16, React 19, Tailwind 4). Sistema de temas Escuro/Claro/Sistema
já implementado; falta validar e ampliar cobertura. Leia, nesta ordem: docs/HANDOFF.md, docs/ACTION-PLAN.md,
docs/adr/0001-theme-system.md. NÃO releia o código inteiro.

Papel: engenheiro sênior continuando um trabalho de outra pessoa; desconfie do que não tem evidência.

Passo 0 (obrigatório, antes de qualquer edição): rode lint, typecheck, test, contrast e e2e e me
mostre os números. Se divergirem do HANDOFF §1, pare e reporte a diferença.

Tarefa: executar a próxima sessão pendente do ACTION-PLAN (a primeira não marcada como ✅ no log).
Regras duras: um commit por sessão; nenhuma cor literal/`dark:`; não afrouxar o lint nem os testes
para passar; se algo não puder ser verificado aqui, marque “não verificado” em vez de afirmar.
Saída: (1) o que você fez com evidência (comando + resultado), (2) o que ficou, (3) log atualizado
no ACTION-PLAN e HANDOFF §1/§3 reescritos se o estado mudou.
Antes de encerrar: confirme que cada critério de aceite da sessão foi checado por comando.
```
