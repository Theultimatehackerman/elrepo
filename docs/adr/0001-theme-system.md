# ADR 0001 — Sistema de temas (Escuro · Claro · Sistema)

**Status:** aceito · 07/10/2026

## Contexto
O app era dark-only (classe `dark` fixa, `color-scheme: dark`, seletor de tema desabilitado). O design system já era tokenizado, o que tornava o modo claro barato.

## Decisões
- **Mecanismo:** atributo `data-theme` em `<html>` + override de tokens em `globals.css`. Sem `dark:` nos componentes.
- **`@theme static`:** obrigatório no Tailwind v4; sem ele, tokens não usados por nenhum utilitário não são emitidos e o override por tema falha.
- **Padrão:** escuro para quem nunca escolheu (preserva a identidade); "Sistema" disponível.
- **Persistência:** chave própria `content-os-theme` (por dispositivo), lida por script síncrono no `<head>` (sem flash). Store externo + `useSyncExternalStore` (sem hydration mismatch).
- **Implementação própria** (~130 linhas, 0 dependências) em vez de `next-themes`: mantém o adapter de storage e permite re-tematizar subárvores.
- **Tokens por papel** (`popover`, `hover`, `overlay`, `scrim`, `on-media`, `primary-text`, `danger-solid`) em vez de por elevação.
- **Exportação PNG/PDF** segue o tema ativo.
- **A11y:** pares validados em WCAG AA por `scripts/check-contrast.mjs`; corrigidas falhas pré-existentes (texto primário, "Agendado", botão destrutivo, avatares, dias fora do mês).

## Guardrails
- ESLint (`error`): proíbe `white/black`, hex de 3/4/6/8 dígitos, `rgb()/hsl()/hwb()/lab()/lch()/oklab()/oklch()` e classes arbitrárias `-[#…]` em TS/TSX (exceções: `src/data`, `src/lib/constants`, gradientes, cálculo de cor). Fixtures em `scripts/lint-fixtures/` provam que as regras reprovam (`color-lint.test.ts`).
- CI: lint, tipos, Vitest, contraste, Playwright + axe nos dois temas.

## Consequências (N3)
- `applyTheme` desliga `transition` por ~50 ms **somente quando o tema muda** (tag `<style id="theme-no-transition">`): trocar de tema não anima cores. Animações (`animation`) não são afetadas.
- `/dev/theme` (vitrine de tokens com razão de contraste ao vivo + componentes) existe só fora de produção (`isDevShowcaseEnabled()` → `notFound()`); um teste garante que todo `--color-*` de `globals.css` está listado nela.

## Consequências
Novo componente usa só tokens semânticos. Nova cor → adicionar o par nos dois temas em `globals.css` e em `check-contrast.mjs`.
