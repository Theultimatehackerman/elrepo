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
- ESLint (`error`): proíbe `white/black` e hex literal em TS/TSX (exceções: `src/data`, `src/lib/constants`, gradientes, cálculo de cor).
- CI: lint, tipos, Vitest, contraste, Playwright + axe nos dois temas.

## Consequências
Novo componente usa só tokens semânticos. Nova cor → adicionar o par nos dois temas em `globals.css` e em `check-contrast.mjs`.
