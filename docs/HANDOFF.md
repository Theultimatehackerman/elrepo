# HANDOFF — Sistema de Temas do Content OS

> **Leia primeiro.** Este arquivo é a fonte da verdade do estado do projeto ao fim da sessão de 07/10/2026.
> O plano contínuo (o que fazer a seguir, sessão por sessão) está em [`ACTION-PLAN.md`](./ACTION-PLAN.md).
> Decisões de arquitetura: [`adr/0001-theme-system.md`](./adr/0001-theme-system.md). Resumo curto: [`THEME-STATUS.md`](./THEME-STATUS.md).

---

## 1. Em uma tela

| | |
|---|---|
| **Objetivo** | Escuro (antes fixo) como tema de primeira classe: **Escuro · Claro · Sistema**, troca em tempo real, persistência, zero flash, WCAG AA. |
| **Estado** | Implementação completa (S0–S9) + **N0 parcial** (pins) + **N1 concluída** + **N3 concluída no sandbox** (lint de cor mais duro, vitrine `/dev/theme`, troca sem transições). Falta: validação no ambiente real (N0/N4), N2 e N5. |
| **Pronto para merge?** | **Ainda não.** Abertos: **B1** `next build` e **B2** CI (nunca executados; só rodam na sua máquina). B3/B4 resolvidos. |
| **Baseline (portões)** | lint **0** · tsc **0** · **36** unit · contraste AA (2 temas) · e2e 105 listados (99 do Passo 0 + 6 de `dev-theme.spec.ts`): **104 passam + 1 skip** (teste de 404 da vitrine, só roda no CI) — suíte completa `DONE exit=0`, 5,1 min (ver ACTION-PLAN §2) · build `não verificado` |
| **Histórico git** | 6 commits: `base` (original) → `feat(theme)…` → `chore(theme): pin…` → `test(theme): …N1 partial` → `test(theme): stabilize axe-full…` → `test(theme): cover mobile, export, landing…` → `feat(theme): stricter color lint, dev showcase, transition suppression` (7 commits). (O hash original `ebf4d7f` não existe aqui; a base foi reconstruída do zip original e o diff é equivalente.) |
| **Próximo passo** | Ver **ACTION-PLAN §1 (painel)**. |

> **Nota de processo (lição desta sessão):** o upload anterior veio com o zip *errado* (o original, sem docs/patch/histórico) e a sessão perdeu tempo. Agora tudo vive em **um único** `CONTENT-OS-SESSION-PACK.zip` com `verify-pack.sh`; o Passo 0 do prompt **para** se a verificação falhar.

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

### Sessão de continuação (N0 parcial + N1 parcial) — 07/10/2026

| Entrega | Evidência |
|---|---|
| Playwright fixado (`@playwright/test` = `playwright-core` = 1.56.1) | `npm ls playwright-core` → 1 versão |
| `.nvmrc` (22) + `engines.node >=22.12` | arquivos no repo; lockfile atualizado |
| `e2e/helpers.ts` (`loginDemo`, `waitHydrated`, rotas) | usado por todos os specs novos |
| a11y contraste: + 5 rotas (`/content/content_1`, `/clients/client_acme`, `/campaigns/campaign_black_friday`, `/review/content_1`, 404) × 2 temas | passou |
| `e2e/a11y-full.spec.ts`: axe `wcag2a/2aa/21a/21aa`, 15 rotas × 2 temas | 8 defeitos pré-existentes achados → allow-list `KNOWN` por rota+regra, com motivo |
| `e2e/overlays.spec.ts`: Modal, Dropdown, Select, Tooltip, Toast, drag Kanban × 2 temas | 12/12 passando (isolado) |
| `playwright.config.ts`: `timeout 60s`, `expect.timeout 20s` | só mitiga compilação sob demanda do `next dev` |

### Sessão de conclusão do N1 — 07/10/2026

| Entrega | Evidência |
|---|---|
| Projeto Playwright `mobile` (Pixel 7) + `e2e/mobile.spec.ts` | 16/16: 7 rotas × 2 temas (overflow, axe, contraste) + MobileNav aberta |
| `e2e/export.spec.ts` (L9) | 4/4; arquivos revisados **visualmente** (PNG claro, PDF claro, PDF escuro) |
| `e2e/landing.spec.ts` (L15) | 2/2; 9 seções × 2 temas **vistas**; achou e corrigiu A8 (`CalendarShowcase`) |
| drag do Calendar em `overlays.spec.ts` (L7) | 2/2 (card fantasma excluído, como no Kanban — A5) |
| `scripts/e2e-sandbox.sh` | servidor + aquecimento + e2e num script; status em `/tmp/e2e-status` |

### Sessão N3 — 07/10/2026

| Entrega | Evidência |
|---|---|
| L12 lint: hex 3/4/6/8, `rgb/hsl/hwb/lab/lch/oklab/oklch(`, `-[#…]` | `npx eslint` → 0; `scripts/lint-fixtures/` (10 fixtures) + `color-lint.test.ts` provam que `fail-*` reprovam |
| L13 `/dev/theme` | tokens + razões de contraste + componentes; 404 em produção via `isDevShowcaseEnabled()` (**só unit; build/start não verificado**); `e2e/dev-theme.spec.ts` 5/5 local (+1 teste de 404 só no CI, não verificado) + capturas vistas |
| Suíte completa | 104 passed + 1 skipped, `exit=0`; a 1ª execução teve 1 falha intermitente (A6) corrigida **no teste** com `waitMotionSettled` (40/40 em `--repeat-each=40`) |
| L14 sem transição na troca | `theme-store.ts` (`withoutTransitions`); unit 2/2; e2e L14 passa e **falha sem a correção** |

## 3. O que NÃO foi feito (resumo — detalhe e IDs em ACTION-PLAN §3)

| Item | Por quê | Onde |
|---|---|---|
| `next build` (L1), CI real (L2), Safari/iOS/Firefox (L5), fonte Geist real | sandbox sem Google Fonts/CI/outros navegadores | você: N0/N4 |
| Gate visual (L10) | baselines exigem a fonte real, geradas no CI Linux | N2 (exige N0) |
| Regras de tema em README/CONTRIBUTING (L19); otimizar `midialogo.png` (L18) | não feito | **N5 parcial (próximo)** |
| 404 de `/dev/theme` em `next build && next start` | só o guard foi testado (unit) | você: N0 |
| Decisão do dono: atalho de teclado (L16), sync entre dispositivos (L17) | exige decisão | N5 |
| A9 (PDF 17 MB) e A10 (margem branca no PDF escuro) | fora do escopo do tema; decisão sua | ACTION-PLAN §8 |


---

## 4. Bloqueadores antes do merge

| # | Bloqueador | Como resolver | Critério |
|---|---|---|---|
| **B1** | `next build` nunca rodou | `npm ci && npm run build` na sua máquina | build verde, sem erro de tipo/hidratação |
| **B2** | CI nunca executou | abrir PR com o patch; observar `quality` e `e2e` | 2 jobs verdes |
| **B3 ✅ (N0)** | Versões do Playwright: `@playwright/test` está `^1.56.1`, mas `overrides` fixa `playwright-core@1.56.1` | trocar para `"@playwright/test": "1.56.1"` (exato) **ou** subir os dois juntos; rodar `npm ci` | `npm ls playwright-core` com uma única versão |
| **B4 ✅ (N0)** | Node mínimo | vitest 5 exige Node ≥ 22.12. Criar `.nvmrc` (`22`) e `"engines": {"node": ">=22.12"}` | `node -v` ≥ 22.12 no deploy |

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
`src/lib/theme/{constants,resolve,init-script,theme-store}.ts` (+ `*.test.ts`) · `src/hooks/use-theme.ts` · `src/components/layout/{ThemeSync,ThemeToggle}.tsx` · `src/lib/utils/color.ts` (+ teste) · `src/lib/constants/avatar-colors.ts` · `scripts/check-contrast.mjs` · `vitest.config.ts` · `playwright.config.ts` · `e2e/{theme,a11y,a11y-full,overlays,mobile,export,landing}.spec.ts` + `e2e/helpers.ts` · `scripts/e2e-sandbox.sh` · `scripts/lint-fixtures/*` · `src/app/dev/theme/page.tsx` · `src/components/dev/ThemeShowcase.tsx` · `src/lib/theme/dev-showcase.ts` · `e2e/dev-theme.spec.ts` · `.github/workflows/ci.yml` · `docs/*`. (`theme-system.patch` acompanha o zip, fora da árvore git.)

---

## 6. Como retomar (5 minutos)

```bash
unzip CONTENT-OS-SESSION-PACK.zip && cd CONTENT-OS-SESSION-PACK
bash verify-pack.sh                    # tem de terminar com "PACK OK"
cd project/Content-OS-main             # já é um repo git com o histórico
nvm use 22                             # ou Node >= 22.12
npm ci && npx playwright install chromium   # sandbox: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers

npm run lint && npm run typecheck && npm test && npm run contrast
# e2e: o dev server compila rota sob demanda — aqueça antes (HANDOFF §7.12) e rode em background
```
Aplicar no **seu** repositório (a partir do original): `git apply --check theme-system.patch && git apply theme-system.patch && npm install`.
O patch está em `theme-system.patch` (raiz do pack) e foi gerado com `git diff <commit base> HEAD --binary`.
Login de demonstração: botão **“Entrar com conta de demonstração”** em `/login`.

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

11. **Upload errado** custou uma volta inteira: sempre anexar só o `CONTENT-OS-SESSION-PACK.zip` e rodar `verify-pack.sh` primeiro.
12. **`next dev` compila a rota no 1º acesso**: com `.next` limpo e vários workers, testes estouram 30 s sem ser bug. Aqueça (`curl` em todas as rotas), use `--workers=2` e o timeout de 60 s do config. No CI (`build + start`) não ocorre.
13. **Hidratação**: clique/asserção logo após `goto` falha sob carga. Use `waitHydrated(page)` (marcador `__reactContainer`), não `networkidle`.
14. **Shell do sandbox**: `pkill -f "next-server|next dev"` mata o próprio shell (e deixa o commit pela metade). Mate por PID/porta (`ss -ltnp | grep 3100`). Comando único tem teto de ~300 s: rode e2e longo em background (`setsid nohup … &`) e leia o log.
15. **Zip**: excluir `node_modules`, `.next`, `test-results`, `playwright-report` antes de empacotar; sem expansão `{a,b}` em `rm`. Conferir que o `.git` foi junto.
16. **Drag Kanban**: o card fantasma usa `opacity-40` de propósito (contraste ≈1,8–2,2:1, transitório). O teste exclui só ele; é achado, não regressão de tema.

---

## 8. Registro da engenharia de prompt (arquivado)

> A seção abaixo é histórico da sessão S0–S9. O prompt **vigente** está em `NEXT-SESSION-PROMPT.md` (raiz do pack).

## 8-hist. (S0–S9) (técnica do guia `elite_prompt_engineering.md`)

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

---

## 9. Armadilhas novas (sessão de conclusão do N1)

17. **Processos em background morrem entre turnos** (dev server e e2e). Use `scripts/e2e-sandbox.sh` e só confie em `/tmp/e2e-status` = `DONE exit=…`. Log parado sem `DONE` = reiniciar.
18. **`sh` do sandbox**: não existe `${PIPESTATUS[0]}`; use `$?` em comandos separados.
19. **Playwright apaga `test-results/`** a cada execução: copie exports/capturas para `/tmp` antes de reexecutar.
20. **Tempo da sessão é finito**: faça commit + docs + pack **antes** da suíte longa (ordem A–F do NEXT-SESSION-PROMPT).
21. **A6 / contraste da landing intermitente**: `Reveal` faz fade de 0,5 s e o axe lê a cor misturada (`#7f8490`). Em specs que medem contraste, chame `waitMotionSettled(page)` depois de `waitHydrated`. Elemento oculto dentro da área visível conta como "ainda vai animar".
22. **Não use `kill`/`pkill` com padrão de `ps`** (ex.: `sh -c next`): o padrão casa com o próprio comando e mata o shell (exit 144). Pegue o PID da porta/`ps` e confira antes.
23. **Teste do lint com `ESLint.lintText`** (`scripts/lint-fixtures/color-lint.test.ts`): 1ª chamada é lenta (carrega o config do Next); o teste tem timeout próprio de 60 s. Fixtures são `.txt` para o `npm run lint` não varrê-las.
24. **`e2e/dev-theme.spec.ts` depende de `process.env.CI`**: CI roda `build + start` (produção) ⇒ vitrine 404; local (`next dev`) ⇒ vitrine existe. Não mexer sem ver `playwright.config.ts`.
25. **Testes de `theme-store`** deixam `<style id=theme-no-transition>` pendente (timer real de 50 ms): `beforeEach` limpa todas as tags.
26. **PDFs claro e escuro têm exatamente o mesmo tamanho** (jsPDF grava pixels sem compressão): não é bug de tema; confirme com `cmp`/`md5sum`.
