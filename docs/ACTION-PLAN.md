# ACTION PLAN CONTÍNUO — Sistema de Temas do Content OS

> Documento **vivo**: ao fim de cada sessão, atualize a seção 8 (log) e marque os itens do backlog.
> Estado atual e contexto: [`HANDOFF.md`](./HANDOFF.md). Última atualização: **07/10/2026**.

---

## 1. Princípios (valem para toda sessão)

1. **Medir antes de afirmar.** Nada é “pronto” sem comando + resultado. O que não foi verificado fica marcado `não verificado`.
2. **Um commit por sessão**, mensagem `tipo(escopo): …`, aplicação nunca quebrada entre sessões.
3. **Portões antes e depois** de editar (seção 2). Se estavam verdes antes, têm de estar verdes depois.
4. **Não afrouxar** lint, testes ou contraste para passar. Se um teste está errado, corrija o teste *e* explique no commit.
5. **Só tokens.** Zero `dark:`, `white/black`, hex ou `rgb()` em componente. Cor nova ⇒ par claro/escuro em `globals.css` **e** em `scripts/check-contrast.mjs`.
6. **Mudar o escuro é exceção documentada** (lista no HANDOFF §2). Qualquer outra diferença no escuro é regressão.

## 2. Portões de qualidade (comandos)

```bash
npm run lint          # 0 problemas (regra de cor em "error")
npm run typecheck     # next typegen && tsc --noEmit
npm test              # Vitest — baseline: 22 passando
npm run contrast      # AA nos dois temas
npm run e2e           # Playwright + axe — baseline: 23 passando
npm run build         # ⚠️ nunca rodou no sandbox (fontes) — N0
```
**Baseline atual (07/10/2026):** lint 0 · tsc 0 · 22 unit · contraste ✅ · 23 e2e · build `não verificado`.

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
| L7 | P1 | ✅ (parcial: Modal, Dropdown, Select, Tooltip, Toast, drag Kanban; falta drag do Calendar) Cobrir estados abertos: Modal, Select, Dropdown, Tooltip, Toast, drag overlay (Kanban/Calendar) | N1 | axe roda com cada overlay aberto, 2 temas |
| L8 | P1 | Viewport mobile + `MobileNav` | N1 | e2e em 390×844, 2 temas, sem violações |
| L9 | P1 | Exportação **PDF** e PNG no claro | N1 | arquivo gerado; fundo e texto legíveis (verificação visual registrada) |
| L10 | P1 | Gate de regressão visual (D9) com fonte real | N2 | `toHaveScreenshot` no repo, baselines escuro+claro, relógio congelado |
| L11 | P2 | ✅ axe completo (não só `color-contrast`) | N1 | regras `wcag2a/2aa` sem violações novas |
| L12 | P2 | Lint: `rgb()/hsl()/oklch()`, hex de 3/8 dígitos, `bg-[#…]` | N3 | teste do lint com fixture que falha; 0 ocorrências hoje |
| L13 | P2 | Página-vitrine `/dev/theme` (só em desenvolvimento) | N3 | lista todos os tokens e componentes nos 2 temas; 404 em produção |
| L14 | P2 | Suprimir transições durante a troca de tema | N3 | sem “flash” de cor animada ao alternar (verificado em vídeo/trace) |
| L15 | P2 | Landing completa nos 2 temas (todas as seções, gradientes, logo) | N1 | screenshots revisados; sem contraste ruim |
| L16 | P3 | Atalho de teclado para alternar tema | N5 | documentado + teste |
| L17 | P3 | Sincronizar preferência entre dispositivos (exigiria mudar D4) | — | só com decisão explícita |
| L18 | P3 | `midialogo.png` 1 MB exibido a 24–44 px | N5 | < 100 KB, transparente, ok nos 2 temas |
| L19 | P3 | Regras de tema em `CONTRIBUTING`/`AGENTS.md` (hoje no .gitignore do projeto) | N5 | contribuidor novo acha a regra em 1 lugar |

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

### N1 — Ampliar cobertura (90–120 min) · fecha L6–L9, L11, L15
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

### N3 — Endurecer guarda-corpos e DX (60–90 min) · fecha L12–L14
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

### N5 — Polimento e fechamento (45–60 min) · fecha L16, L18, L19
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
| 07/10/2026 | N1 (parcial) | ⚠️ L6, L11 ✅; L7 parcial; **L8, L9, L15 não feitos** | e2e/helpers.ts, a11y.spec (+5 rotas dinâmicas/404), a11y-full.spec (wcag2a/2aa, 15 rotas × 2 temas), overlays.spec (6 overlays × 2 temas). Rodados: overlays 12/12 ✅; a11y-full nas 4 rotas com allow-list 10/10 ✅; lint 0 · tsc 0 · 22 unit. **Suíte e2e completa NÃO reexecutada após as mudanças** | **Achados (fora do tema, idênticos nos 2 temas, em KNOWN):** 3 SelectTrigger sem nome em /content e /calendar (button-name); /calendar Select de mês com aria-controls inválido; /settings input sem label; /content/[id] botão de ícone sem aria-label. **Achado de contraste:** card fantasma do Kanban usa `opacity-40` (≈1,8–2,2:1), excluído da varredura só durante o arrasto. Pendente N1: mobile (Pixel 7 + MobileNav), PDF/PNG claro, landing por seção, drag do Calendar |
| — | N2 | ⬜ | | |
| — | N3 | ⬜ | | |
| — | N4 | ⬜ | | |
| — | N5 | ⬜ | | |
