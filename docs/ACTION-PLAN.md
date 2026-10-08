# ACTION PLAN CONTÍNUO — Sistema de Temas do Content OS

> Documento **vivo**: ao fim de cada sessão, atualize a seção 8 (log) e marque os itens do backlog.
> Estado atual e contexto: [`HANDOFF.md`](./HANDOFF.md). Última atualização: **08/10/2026 (fim da sessão N5 completa no sandbox)**.

---

## 1. Painel de progresso, PRÓXIMO PASSO e princípios

### 1.1 Painel (atualize ao fim de cada sessão)

| Sessão | Escopo | Estado | Quem consegue fechar |
|---|---|---|---|
| S0–S9 | Implementação do sistema de temas | ✅ concluída | — |
| N0 | Build, CI, pins, QA no ambiente real | ⚠️ parcial: **L3, L4 ✅**; **L1, L2, L5 ⬜** | **você** (máquina real/CI) |
| N1 | Cobertura de testes | ✅ **concluída no sandbox**: L6, L7, L8, L9, L11, L15 ✅ | — |
| N2 | Gate de regressão visual (L10) | ⬜ | você/CI (precisa da fonte Geist real e de N0) |
| N3 | Lint mais duro, `/dev/theme`, sem transição na troca (L12–L14) | ✅ **concluída no sandbox** (L12, L13, L14 ✅; 404 de `/dev/theme` em `next build && next start` **não verificado**) | — |
| N4 | QA manual multi-navegador (L5) | ⬜ | **você** |
| N5 | Polimento e fechamento (L16, L18, L19) | ✅ **concluída no sandbox**: **L16, L18, L19 ✅**. Falta só o fechamento do ADR/DoD (§6), que depende de N0/N4 | você (após N0/N4) |
| — | Achados A1–A4, A9, A10 (a11y e exportação) | ✅ **corrigidos** (A5, A6 seguem abertos: decisão de design) | — |

### 1.2 PRÓXIMO PASSO (ordem recomendada)

1. **Você (em paralelo, ~45 min):** N0 — `npm run build`, abrir PR e ver o CI, abrir o app com Geist real nos 2 temas. Cole os logs na próxima sessão (N0/N2/N4 só você fecha).
2. ✅ **N3 feita** (commit `feat(theme): stricter color lint, dev showcase, transition suppression`). No `next build && next start` confira que `/dev/theme` dá 404 (só você consegue).
3. ✅ **N5 feita no sandbox** (L16 atalho, L18 logo, L19 `CONTRIBUTING.md`) e os achados **A1–A4, A9, A10** corrigidos (decisões padrão registradas no §8). **Não há mais item de tema que o sandbox consiga fechar**: a próxima sessão deve rodar o Passo 0, dizer isso e parar, salvo se você mandar A5/A6 ou algo novo.
4. **Depois do N0 verde:** N2 (baselines visuais no CI) e N4 (QA manual Safari/iOS/Firefox); então o fechamento do N5 (ADR "implementado", Definition of Done §6).
5. **Decisões que tomei por você (reverta se discordar):** L16 = `Alt+Shift+T` alterna claro↔escuro ("Sistema" só pelo menu); A10 = a folha do PDF segue o fundo do tema; A9 = `compress` do jsPDF (PDF 17 MB → 0,4 MB). **Ainda abertos:** A5 (opacidade do card fantasma do Kanban) e A6 (`MotionConfig reducedMotion`).

**Fora do alcance do sandbox (sempre “não verificado” aqui):** `next build` com Google Fonts, CI real, Safari/iOS/Firefox, fonte Geist, baselines visuais.

### 1.3 Princípios (valem para toda sessão)

1. **Medir antes de afirmar.** Nada é “pronto” sem comando + resultado. O que não foi verificado fica marcado `não verificado`.
2. **Um commit por item lógico**, mensagem `tipo(escopo): …`, aplicação nunca quebrada entre commits.
3. **Portões antes e depois** de editar (seção 2). Se estavam verdes antes, têm de estar verdes depois.
4. **Não afrouxar** lint, testes ou contraste para passar. Se um teste está errado, corrija o teste *e* explique no commit.
5. **Só tokens.** Zero `dark:`, `white/black`, hex ou `rgb()` em componente. Cor nova ⇒ par claro/escuro em `globals.css` **e** em `scripts/check-contrast.mjs`.
6. **Mudar o escuro é exceção documentada** (lista no HANDOFF §2). Qualquer outra diferença no escuro é regressão.

## 2. Portões de qualidade (comandos)

```bash
npm run lint          # 0 problemas (regra de cor em "error")
npm run typecheck     # next typegen && tsc --noEmit
npm test              # Vitest — baseline: 36 passando (22 tema/cor + 10 fixtures do lint + 2 vitrine + 2 transições)
npm run contrast      # AA nos dois temas
npm run e2e           # Playwright + axe — baseline: **99** (5 tema + 28 contraste + 30 axe completo + 14 overlays + 16 mobile + 4 export + 2 landing) + 6 de `dev-theme` = 105 listados (99 do Passo 0 + 6 de `dev-theme.spec.ts`): **104 passam + 1 skip** (teste de 404 da vitrine, só roda no CI) — suíte completa `DONE exit=0` (5,1 min na sessão N3; 9,8 min no Passo 0 da N5 — varia com a carga) (sandbox: use scripts/e2e-sandbox.sh)
npm run build         # ⚠️ nunca rodou no sandbox (fontes) — N0
```
**Baseline atual (08/10/2026, fim da N5 completa):** lint 0 · tsc 0 · **49** unit · contraste ✅ · e2e **108 listados: 107 passam + 1 skip** (teste de 404 da vitrine, só roda no CI) — `DONE exit=0`, 10,9 min (sandbox: `scripts/e2e-sandbox.sh`; parcial: `scripts/e2e-subset.sh`); projetos `chromium` e `mobile` · build `não verificado`.

**Rodar e2e no sandbox (receita, versão 3):** um único script em background — `rm -f /tmp/e2e-status; setsid nohup bash scripts/e2e-sandbox.sh > /tmp/run-all.out 2>&1 &`. Ele sobe o dev server, aquece as 15 rotas e roda `playwright test --workers=2`. **Só há resultado quando `/tmp/e2e-status` contém `DONE exit=…`** (log em `/tmp/e2e-full.log`). Sem `DONE` e com o log parado = o processo morreu (acontece entre turnos): reinicie, não conclua. O Playwright apaga `test-results/` a cada execução: copie exports/capturas para `/tmp` antes de reexecutar. Encerrar servidor por PID/porta, **nunca** `pkill -f`.

---

## 3. Backlog priorizado

Legenda: **P0** bloqueia merge · **P1** necessário para considerar “concluído” · **P2** qualidade · **P3** opcional.

| ID | Pri | Item | Sessão | Aceite (verificável) |
|---|---|---|---|---|
| L1 | P0 | `next build` verde | N0 | `npm run build` sai com 0; sem warning de hidratação no console |
| L2 | P0 | CI executa e passa | N0 | jobs `quality` e `e2e` verdes num PR |
| L3 | P0 | ✅ Fixar Playwright (`@playwright/test` exato = `playwright-core`) | N0 | `npm ls playwright-core` mostra 1 versão |
| L4 | P0 | ✅ `.nvmrc` + `engines` (Node ≥ 22.12) | N0 | arquivo presente; deploy usa Node ≥ 22.12 |
| L5 | P1 | QA manual em Safari/iOS e Firefox | N0/N4 | checklist da seção 4-N4 sem falhas |
| L6 | P1 | ✅ Cobrir rotas dinâmicas e públicas nos 2 temas | N1 | e2e/axe incluem `/content/[id]`, `/clients/[id]`, `/campaigns/[id]`, `/review/…`, 404 |
| L7 | P1 | ✅ Cobrir estados abertos: Modal, Select, Dropdown, Tooltip, Toast, drag overlay (Kanban/Calendar) | N1 | axe roda com cada overlay aberto, 2 temas |
| L8 | P1 | ✅ Viewport mobile + `MobileNav` | N1 | e2e `mobile` (Pixel 7), 7 rotas + MobileNav × 2 temas, sem overflow e sem violações |
| L9 | P1 | ✅ Exportação **PDF** e PNG no claro (e escuro) | N1 | arquivo gerado; fundo e texto legíveis (verificação visual registrada) |
| L10 | P1 | Gate de regressão visual (D9) com fonte real | N2 | `toHaveScreenshot` no repo, baselines escuro+claro, relógio congelado |
| L11 | P2 | ✅ axe completo (não só `color-contrast`) | N1 | regras `wcag2a/2aa` sem violações novas |
| L12 | P2 | ✅ Lint: `rgb()/hsl()/oklch()`, hex de 3/8 dígitos, `bg-[#…]` | N3 | teste do lint com fixture que falha; 0 ocorrências hoje |
| L13 | P2 | ✅ Página-vitrine `/dev/theme` (só em desenvolvimento) | N3 | lista todos os tokens e componentes nos 2 temas; 404 em produção |
| L14 | P2 | ✅ Suprimir transições durante a troca de tema | N3 | sem “flash” de cor animada ao alternar (verificado em vídeo/trace) |
| L15 | P2 | ✅ Landing completa nos 2 temas (todas as seções, gradientes, logo) | N1 | screenshots revisados; sem contraste ruim |
| L16 | P3 | ✅ Atalho de teclado para alternar tema (**Alt+Shift+T**, claro↔escuro) | N5 | documentado + teste |
| L17 | P3 | Sincronizar preferência entre dispositivos (exigiria mudar D4) | — | só com decisão explícita |
| L18 | P3 | ✅ `midialogo.png` 1 MB exibido a 24–44 px | N5 | < 100 KB, transparente, ok nos 2 temas |
| L19 | P3 | ✅ Regras de tema em `CONTRIBUTING.md` (o `AGENTS.md` está no .gitignore do projeto, por isso não serve) | N5 | contribuidor novo acha a regra em 1 lugar |

---

## 4. Sessões

Cada sessão: **objetivo → passos → aceite → commit**. Tempo é estimativa.

### N0 — Validação no ambiente real (45–60 min) · fecha L1–L5
1. Aplicar o patch (HANDOFF §6) numa branch `feat/theme-system`.
2. `nvm use 22 && npm ci && npx playwright install chromium`.
3. Rodar todos os portões da seção 2, **incluindo `npm run build`**.
4. Fixar versões (L3): em `package.json` trocar `"@playwright/test": "^1.56.1"` por `"1.56.1"`; `npm install`; `npm ls playwright-core`.
5. Criar `.nvmrc` (`22`) e `"engines": { "node": ">=22.12" }`.
6. Abrir PR; esperar `quality` e `e2e`. Se o e2e falhar só no CI, baixar o `playwright-report` do artifact antes de mexer em qualquer coisa.
7. Abrir o app no navegador real com a fonte Geist; olhar dashboard, content, calendar nos 2 temas.

**Aceite:** build verde; CI verde; `npm ls playwright-core` com 1 versão; nenhum erro de hidratação no console.
**Commit:** `chore(theme): pin playwright, node engines; validate build and ci`

### N1 — ✅ CONCLUÍDA (sandbox) · fecha L6–L9, L11, L15
1. Ler `e2e/a11y.spec.ts`; extrair um helper `loginDemo(page, theme)` para reutilizar.
2. Descobrir ids reais das rotas dinâmicas (dados de demo) e adicioná-las à lista de rotas, mais `/review/<id>` e uma rota inexistente (404).
3. Novo `e2e/overlays.spec.ts`: para cada overlay (Modal de criação, Select, Dropdown do avatar, Tooltip, Toast, drag em Kanban/Calendar) abrir e rodar `AxeBuilder` — nos 2 temas.
4. Novo projeto Playwright `mobile` (`devices['Pixel 7']`) rodando a11y + abertura da `MobileNav`.
5. Exportação: no calendário claro, baixar PDF e PNG; abrir (`pdftoppm -png` p/ o PDF) e **olhar**; registrar no log.
6. Trocar `withRules(["color-contrast"])` por `withTags(["wcag2a","wcag2aa"])` em um spec separado; triar achados (corrigir os de tema; abrir issue p/ os não relacionados).
7. Revisar visualmente cada seção da landing (`/`) nos 2 temas.

**Aceite:** todos os specs novos passam nos 2 temas; PDF/PNG claros legíveis; achados não relacionados ao tema listados no log (não escondidos).
**Commit:** `test(theme): cover dynamic routes, overlays, mobile and export in both themes`

### N2 — Gate de regressão visual (60–90 min) · fecha L10
1. Criar `e2e/visual.spec.ts` com `toHaveScreenshot` (`maxDiffPixelRatio: 0.002`), `reducedMotion: "reduce"`, relógio congelado (`page.clock.setFixedTime('2026-10-07T12:00:00Z')`), viewport fixo 1366×850.
2. Esconder o overlay de dev (`nextjs-portal{display:none}`) — ou rodar sobre `build + start`, que não o tem.
3. Gerar baselines **no CI/Linux** com a fonte real (`npx playwright test visual --update-snapshots`) e commitar `e2e/visual.spec.ts-snapshots/`.
4. Documentar no README como atualizar baselines (só em PR de design, com revisão).
5. Rotas: as 9 + 3 dinâmicas; 2 temas.

**Aceite:** gate verde em re-execução (sem flakiness em 3 execuções seguidas); mudar um token propositalmente faz o teste falhar (provar com uma alteração descartada).
**Commit:** `test(visual): add screenshot regression gate for dark and light`

### N3 — ✅ CONCLUÍDA (sandbox) · fecha L12–L14
1. `eslint.config.mjs`: ampliar seletores para `rgb(`, `hsl(`, `oklch(`, hex de 3/4/8 dígitos e `\[#` em classes arbitrárias. Escrever fixtures em `scripts/lint-fixtures/` e um teste que prova que **falham**; manter as isenções atuais.
2. Criar `src/app/dev/theme/page.tsx` (vitrine: tokens com swatch + razão de contraste, e todos os componentes de `components/ui`), com `notFound()` quando `process.env.NODE_ENV === "production"`.
3. Suprimir transições na troca de tema (inserir `<style>` temporário `*{transition:none!important}` por 1 frame em `applyTheme`, com teste unitário).
4. Rodar tudo; atualizar ADR com a consequência.

**Aceite:** fixture de cor literal falha o lint; `/dev/theme` renderiza e dá 404 em `npm run build && npm start`; sem flash ao alternar.
**Commit:** `feat(theme): stricter color lint, dev showcase, transition suppression`

### N4 — QA multi-navegador e publicação (45–60 min) · fecha L5
Checklist manual (anotar ✅/❌ + navegador/versão no log):
- [ ] Safari macOS e **iOS**: sem flash no 1º carregamento; barra do navegador acompanha o tema (`theme-color`); `backdrop-blur` do Topbar ok.
- [ ] Firefox: toggle, persistência, “Sistema”.
- [ ] Alternar tema em uma aba atualiza as outras abertas (evento `storage`).
- [ ] JavaScript desabilitado: página abre no escuro (fallback do `:root`).
- [ ] Alto contraste do SO / `prefers-reduced-motion`.
- [ ] Deploy de preview: abrir com cache limpo, 2 temas.
**Aceite:** todos ✅ ou defeitos registrados como issues com prioridade.
**Commit:** `docs(theme): record cross-browser qa results`

### N5 — Polimento e fechamento (45–60 min) · fecha L16, L18, L19 (✅ no sandbox; falta só o passo 4: ADR/DoD, depende de N0/N4)
1. Decidir (com o dono do produto) se L16/L17 entram; só implementar L16 se sim.
2. Otimizar `midialogo.png` (manter transparência; conferir nos 2 temas).
3. Escrever as regras de tema onde contribuidores leem (README/`CONTRIBUTING`).
4. Rodar **Definition of Done** (seção 6), fechar o ADR com “status: implementado”, atualizar o HANDOFF para “concluído”.
**Commit:** `chore(theme): final polish and docs`

---

## 5. Protocolo de continuidade

### Início de sessão (obrigatório)
1. Ler `HANDOFF.md` §1 e §3, depois este arquivo — **não** reler o código inteiro.
2. Rodar os portões (seção 2) e comparar com a baseline. **Divergiu? Pare e reporte antes de editar.**
3. Escolher a primeira sessão não marcada ✅ no log (seção 8).

### Durante
- Fazer o **menor** passo que fecha um item do backlog; rodar o portão correspondente; só então seguir.
- Achou algo fora do escopo? Registre no log (“Achados”), não corrija junto.

### Fim de sessão (obrigatório)
1. Todos os portões verdes (ou a falha documentada com causa).
2. Marcar itens do backlog; preencher a linha do log com **evidência** (comando + resultado).
3. Se o estado mudou, atualizar `HANDOFF.md` §1 (números) e §3 (pendências).
4. Um commit. Gerar `git diff <base> HEAD --binary > theme-system.patch` se for entregar fora do repo.

---

## 6. Definition of Done (projeto inteiro)

- [ ] `lint`, `typecheck`, `test`, `contrast`, `build` e `e2e` verdes localmente **e** no CI.
- [ ] Gate visual com baselines escuro+claro; escuro sem diffs além da lista do HANDOFF §2.
- [ ] axe (wcag2a/2aa) sem violações nos 2 temas — desktop e mobile, incluindo overlays.
- [ ] QA manual Safari/iOS/Firefox registrado (N4).
- [ ] Sem `dark:`/cor literal em componentes; lint cobre `rgb/hsl/oklch/hex curto/arbitrário`.
- [ ] ADR com status “implementado”; README e CONTRIBUTING com a regra de tokens.
- [ ] Nenhum item P0/P1 aberto no backlog.

## 7. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Build falha por algo que o sandbox escondeu (fontes, `next/font`, Turbopack) | média | alto | N0 antes de qualquer outra coisa |
| E2E flaky em CI (hidratação/dev server) | média | médio | CI usa `build + start`; esperar marcador do React, não `networkidle` |
| Baselines visuais geradas em SO diferente do CI | alta | médio | gerar baselines **no CI** (Linux) |
| Nova cor sem par no outro tema | média | médio | lint + `check-contrast.mjs` + vitrine |
| Lockfile voltar a dessincronizar | baixa | alto | CI roda `npm ci`; nunca editar `package.json` sem `npm install` |
| Safari/iOS com comportamento próprio (`color-scheme`, `theme-color`, blur) | média | médio | N4 |
| Regressão sutil no escuro | média | alto | gate visual (N2) |

## 8. Log de sessões

| Data | Sessão | Resultado | Evidência | Achados / próximos |
|---|---|---|---|---|
| 07/10/2026 | S0–S9 (plano original) | ✅ implementação completa | lint 0 · tsc 0 · 22 unit · contraste AA · 23 e2e · diff do escuro 0,01–1,16%/rota | build e CI não verificados; ver HANDOFF §3–§4 |
| 07/10/2026 | N0 (parcial) | ⚠️ L3, L4 ✅; L1, L2, L5 **não verificados** (sandbox) | Passo 0: lint 0 · tsc 0 · 22 unit · contraste AA · 23 e2e (= baseline). `npm ls playwright-core` → 1 versão (1.56.1). `.nvmrc`=22, `engines.node`=">=22.12". `npm run build` falha **só** por Google Fonts inacessível (Geist/Geist Mono) | **Rodar no ambiente real:** `npm run build`, PR com CI (`quality`,`e2e`), abrir com Geist real nos 2 temas. Só então marcar N0 ✅. Achado: `npm run build` aqui nunca passa sem rede p/ fonts; considerar `next/font/local` (fora do escopo) |
| 07/10/2026 | N1 (parcial) | ⚠️ L6, L11 ✅; L7 parcial; **L8, L9, L15 não feitos** | e2e/helpers.ts, a11y.spec (+5 rotas dinâmicas/404), a11y-full.spec (wcag2a/2aa, 15 rotas × 2 temas), overlays.spec (6 overlays × 2 temas). Rodados: overlays 12/12 ✅; a11y-full nas 4 rotas com allow-list 10/10 ✅; lint 0 · tsc 0 · 22 unit. **Suíte completa: 75 testes — 1 execução cheia (72 ✅; 2 falhas eram SIGKILL de um processo duplicado meu; 1 falso positivo de contraste na landing/claro dentro do axe completo, intermitente por animação) + reexecução dos 15 testes `tema light` do axe completo ✅ após remover `color-contrast` dele (contraste segue em a11y.spec). Não houve uma 2ª execução cheia única depois da edição final** | **Achados (fora do tema, idênticos nos 2 temas, em KNOWN):** 3 SelectTrigger sem nome em /content e /calendar (button-name); /calendar Select de mês com aria-controls inválido; /settings input sem label; /content/[id] botão de ícone sem aria-label. **Achado de contraste:** card fantasma do Kanban usa `opacity-40` (≈1,8–2,2:1), excluído da varredura só durante o arrasto. Pendente N1: mobile (Pixel 7 + MobileNav), PDF/PNG claro, landing por seção, drag do Calendar |
| 07/10/2026 | N1 (conclusão) | ✅ L7, L8, L9, L15 fechados (L6, L11 já ✅) | Passo 0 = baseline (75 e2e). Novos specs: `mobile.spec.ts` (16/16 ✅), `export.spec.ts` (4/4 ✅; PNG claro, PDF claro e PDF escuro **vistos**), `landing.spec.ts` (2/2 ✅ após correção; 9 seções × 2 temas **vistas**), `overlays.spec.ts` + drag do Calendar (2/2 ✅). Config: projeto `mobile` (Pixel 7). Correção: `CalendarShowcase.tsx` L38 `text-muted-foreground/60`→`text-muted-foreground`. lint 0 · tsc 0 · 22 unit · contraste AA. Suíte completa: ver linha “e2e completo (N1)” abaixo | **A8** (corrigido): números dos dias na landing com 3,42:1 (escuro) e 2,59:1 (claro). **A9:** PDF exportado ≈17 MB por 1 página (jsPDF sem compressão) — fora do tema. **A10:** PDF escuro sai com margem de página branca (A4) — decisão de design. **Armadilhas novas:** processos em background morrem entre turnos; `sh` sem `PIPESTATUS`; Playwright apaga `test-results/` |
| 07/10/2026 | e2e completo (N1) | ✅ 99/99 passando | `bash scripts/e2e-sandbox.sh` → `/tmp/e2e-status` = `DONE exit=0`; “99 passed (12.8m)”; projetos chromium (83) + mobile (16). 1ª tentativa morreu em 92/99 (processo encerrado entre turnos) e foi **descartada**; vale a 2ª execução completa | |
| — | N2 | ⬜ | | |
| 07/10/2026 | N3 | ✅ L12, L13, L14 | Passo 0 = baseline (lint 0 · tsc 0 · 22 unit · contraste AA · e2e 99/99, 5,7 min, `DONE exit=0`). **L12:** `eslint.config.mjs` agora barra hex 3/4/6/8 dígitos, `rgb/rgba/hsl/hsla/hwb/lab/lch/oklab/oklch(` e `-[#…]` (strings e template literals); 0 ocorrências no código; 10 fixtures em `scripts/lint-fixtures/` (8 `fail-*` reprovam, 1 `pass-*` passa) testadas por `color-lint.test.ts` (Vitest). **L13:** `/dev/theme` (`src/app/dev/theme/page.tsx` + `ThemeShowcase`) com todos os `--color-*` (swatch, valor computado, razão de contraste ao vivo) e os componentes de `ui/`; `isDevShowcaseEnabled()` → `notFound()` em produção; teste garante que todo token de `globals.css` está listado; `e2e/dev-theme.spec.ts` (razões ≥ 4,5 e axe contraste nos 2 temas + teste L14; **no CI, onde roda `build + start`, os testes de vitrine são pulados e um teste exige 404** — esse último só rodará de fato no CI, **não verificado aqui**). **L14:** `applyTheme` injeta `<style id=theme-no-transition>` (`transition:none`) só quando o tema muda e o remove em 50 ms; unit + e2e (o e2e foi visto **falhar** sem a correção). Portões finais: lint 0 · tsc 0 · 36 unit · contraste AA. Specs afetados: `dev-theme` + `theme` 10/10. Capturas de `/dev/theme` (topo, claro e escuro) **vistas**. Suíte completa: ver linha “e2e completo (N3)” | **Não verificado:** `next build && next start` (404 da vitrine em produção; só o guard foi testado por unit); parte de baixo da vitrine (galeria de componentes) não foi vista, só passou no axe de contraste. Sem achados novos fora do tema |
| 07/10/2026 | e2e completo (N3) | ✅ 104 passed + 1 skipped, `exit=0` | `bash scripts/e2e-sandbox.sh` → `/tmp/e2e-status` = `DONE exit=0`; “104 passed (5.1m)”, “1 skipped” (= `em produção /dev/theme dá 404`, só roda com `CI=1`). **1ª execução cheia: 103 passed + 1 falha** (`a11y.spec › axe light › /` — contraste 3,29:1 com `#7f8490`, ou seja o muted a ~76% de opacidade: fade de entrada do `Reveal` em andamento = **A6**); reproduzida (1 em 10 e 1 em 25 com `--repeat-each`). **Correção de teste (não do app):** `waitMotionSettled` em `e2e/helpers.ts` (usado em `a11y.spec` e `mobile.spec`) espera as animações assentarem, limitado a 4 s; `--repeat-each=40` → **40/40**. A execução com falha foi descartada; vale a 2ª execução cheia | **A6 mitigado** no teste (o app não mudou). Armadilha: `kill` por padrão de `ps` (`sh -c next`) mata o próprio shell — mate só o PID do servidor |
| — | N4 | ⬜ | | |
| 07/10/2026 | N5 (parcial) | ⚠️ L18, L19 ✅; L16 ⬜ (aguarda decisão do dono); passo 4 (ADR/DoD) ⬜ (depende de N0/N4) | Passo 0 = baseline (lint 0 · tsc 0 · 36 unit · contraste AA · e2e **104 passed + 1 skipped**, `DONE exit=0`, 9,8 min). **L18:** `public/midialogo.png` 1254×1254 RGBA (1.031.689 B) → 256×256 RGBA (**66.627 B**, < 100 KB); alpha 0–255 preservado; sem quantização (versões de 256 cores deram 14 KB, mas o RGBA completo já cabe no aceite); conferido sobre `#050505` e `#f7f7fa` (composto a 88 px = 44 px @2×) e no header da landing real, **visto** nos 2 temas. Usos: `Logo.tsx` (24–44 px) e `layout.tsx` (ícone/apple). **L19:** `CONTRIBUTING.md` novo (regra de tokens, tabela do que é proibido, como adicionar cor — `globals.css` + `check-contrast.mjs` + `THEME_COLORS` —, como o tema funciona, checklist de PR); `README` aponta para ele. Todos os nomes citados (helpers, tokens, `ignores` do lint, chave `content-os-theme`) foram conferidos no código. Specs afetados (`landing`, `theme`, `dev-theme`, `a11y`): 39 passed + 1 skipped + **1 failed** (L14) — ver **A11**. Portões finais: lint 0 · tsc 0 · 36 unit · contraste AA. Suíte completa depois do commit: ver linha “e2e completo (N5 parcial)” | **A11** (corrigido no teste): `dev-theme › L14` intermitente — controle com o logo **original**: 3 falhas em 20; com o logo novo: 9 em 20 (o logo não é a causa; só mudou o tempo de carga). Causa: o teste dispara o evento `storage` logo após `waitHydrated`, antes de o `ThemeSync` registrar o listener (efeito pós-hidratação) ⇒ evento ignorado, tema segue `dark`. Correção só no teste: prova o listener com ida e volta (`expect.poll`) antes de medir. `--repeat-each=40` → **40/40**; mutação (desligar `withoutTransitions`) → **falha**, restaurada (diff limpo) |
| 07/10/2026 | e2e completo (N5 parcial) | ✅ 104 passed + 1 skipped, `exit=0` | `bash scripts/e2e-sandbox.sh` sobre o commit final → `/tmp/e2e-status` = `DONE exit=0`; “104 passed (9.0m)”, “1 skipped” (= `em produção /dev/theme dá 404`, só com `CI=1`). Sem falhas, inclusive `dev-theme › L14` (A11 corrigido). Duração 9,0 min (a N3 levou 5,1 min: varia com a carga do sandbox) | Continuam **não verificados** aqui: `next build`, 404 de `/dev/theme` em produção, CI real, Safari/iOS/Firefox, Geist real |
| 08/10/2026 | N5 (completa no sandbox) + achados A1–A4, A9, A10 | ✅ L16 ✅; A1–A4 ✅; A9 ✅; A10 ✅; passo 4 do N5 (ADR/DoD) ⬜ (depende de N0/N4) | **Autorização:** você pediu “todo o plano”; tratei L16, A1–A4, A9, A10 como autorizados, com decisões padrão (ver §1.2 item 5). **Commits:** `fix(a11y)` (A1–A4) · `fix(export)` (A9, A10) · `feat(theme)` (L16) · docs. **A1–A4:** `KNOWN` esvaziado em `a11y-full` e `mobile`; axe wcag2a/2aa/21a/21aa passa nas 7+dinâmicas × 2 temas × (desktop, mobile): 42 + 4 passed; 1ª rodada achou A2 em outro lugar que o documentado (era o Tabs do calendário, não Select). **A9/A10:** PDF 17 MB → 416.030 B (escuro) / 418.279 B (claro); rasterizado e **visto** nos 2 temas; canto da folha `5,5,5` / `247,247,250`. Mutações: sem `compress` → falha por tamanho; sem o `fill` → falha por cor; restauradas. **L16:** `Alt+Shift+T` (`event.code`), ignora campos de texto/Ctrl/Meta/repeat; unit **36 → 49**; e2e 3 testes, 30/30 em `--repeat-each=10`; sem `<ThemeShortcut />` montado, 2 reprovam. Portões: lint 0 · tsc 0 · 49 unit · contraste AA | **Nenhum novo.** Corrigido o achado A2 (alvo real). Aberto: A5 (opacidade do card fantasma), A6 (`MotionConfig`). Atalho **não verificado** em Safari/iOS/Firefox (conflito com atalhos do navegador/SO) — incluir no QA da N4 |
| 08/10/2026 | e2e completo (N5 completa) | ✅ 107 passed + 1 skipped, `exit=0` | `bash scripts/e2e-sandbox.sh` sobre o commit final → `DONE exit=0`; 108 listados (105 + 3 do atalho L16), “107 passed (10.9m)”, “1 skipped” (404 de `/dev/theme`, só com `CI=1`). Sem falhas, com `KNOWN` vazio no axe | Continuam **não verificados** aqui: `next build`, 404 de `/dev/theme` em produção, CI real, Safari/iOS/Firefox (incl. o atalho), Geist real |

### Achados acumulados (A1–A4, A8, A9, A10, A11 corrigidos; A5, A6, A7 seguem abertos)

| ID | Onde | Achado | Sugestão |
|---|---|---|---|
| A1 | `/content`, `/calendar` | ✅ **corrigido**: `aria-label` nos 5 `SelectTrigger` de `ContentFilters`, na busca e nos botões ‹ › do calendário (eram só ícone) | `e2e/a11y-full` e `mobile` com `KNOWN` vazio passam |
| A2 | `/calendar` | ✅ **corrigido**: o alvo era o **Tabs** Dia/Semana/Mês (não o Select): sem `TabsContent`, o `aria-controls` do Radix apontava para id inexistente; os 3 gatilhos passam `aria-controls={undefined}` | idem |
| A3 | `/settings` | ✅ **corrigido na raiz**: `Input`/`Textarea` ligavam `<label htmlFor>` a `id ?? name`; sem nenhum dos dois o label ficava sem alvo. Agora `useId()` como fallback | idem |
| A4 | `/content/[id]` | ✅ **corrigido**: `aria-label="Excluir conteúdo"` no botão de lixeira | idem |
| A5 | Kanban (arrasto) | card fantasma com `opacity-40`: contraste ≈1,8–2,2:1 (transitório) | decisão de design: reduzir menos a opacidade |
| A6 | landing `/` no claro | axe viu contraste baixo **durante a animação de entrada** do `Reveal` (intermitente: 1 em 10–25 sob carga) | ✅ mitigado no teste: `waitMotionSettled` (e2e/helpers.ts). Opcional (decisão sua): `MotionConfig reducedMotion="user"` no framer-motion |
| A7 | e2e em dev server | compilação sob demanda causa timeouts a frio | manter timeout 60 s; CI usa build+start |
| A8 | landing `/` (CalendarShowcase L38) | ✅ **corrigido**: `text-muted-foreground/60` em texto de 10px (3,42:1 escuro / 2,59:1 claro) | já aplicado: cor cheia do token (AA validado em check-contrast) |
| A9 | `src/lib/utils/export.ts` | ✅ **corrigido**: `jsPDF({ compress: true })` + `addImage(..., "FAST")`: 1 página de ≈17 MB → ≈0,4 MB (dark 416.030 B / light 418.279 B) | `e2e/export.spec.ts`: PDF < 6 MB; sem a correção o teste falha |
| A10 | exportação PDF no escuro | ✅ **corrigido** (decisão padrão: o PDF segue o tema, folha inclusive): `--color-background` lido do documento pinta a página; pixel do canto = `5,5,5` (escuro) e `247,247,250` (claro) | `e2e/export.spec.ts` confere o pixel via `pdftoppm` (pula se a ferramenta não existir); sem o fill o teste falha |
| A11 | `e2e/dev-theme.spec.ts` (L14) | ✅ **corrigido no teste**: corrida entre o evento `storage` sintético e o registro do listener do `ThemeSync` (3/20 e 9/20 de falha antes; 40/40 depois) | já aplicado; regra geral: em teste que dispara `storage`, provar o listener antes (HANDOFF §7.27) |
