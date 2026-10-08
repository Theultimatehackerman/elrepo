# Contribuindo com o Content OS

Este arquivo é **o lugar único** das regras de tema (Escuro · Claro · Sistema). Decisões e motivos:
[`docs/adr/0001-theme-system.md`](./docs/adr/0001-theme-system.md).

## Regra de ouro das cores

**Componente só usa tokens semânticos.** Nunca escreva cor literal.

| Proibido em `src/**/*.{ts,tsx}` | Use |
|---|---|
| `dark:` / `light:` em componentes | o token já muda sozinho com o tema |
| `white`, `black` (`bg-black/70`, `text-white`…) | `bg-overlay`, `bg-scrim`, `text-on-media`, `bg-surface`, `text-foreground`… |
| hex (`#fff`, `#ffffff`, `#ffffff80`) e classes `bg-[#…]` | um token de `globals.css` |
| `rgb()`, `hsl()`, `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()` | um token de `globals.css` |

O `npm run lint` reprova (`error`) tudo isso. **Não afrouxe a regra nem o teste para passar**: se uma exceção
for legítima, ela entra em `ignores` de `eslint.config.mjs` com comentário do motivo. Hoje as exceções são
`src/data/**`, `src/lib/constants/**`, `src/lib/utils/gradient.ts`, `src/lib/theme/constants.ts`,
`src/lib/utils/color.ts` e arquivos de teste.

### Tokens por papel (escolha pelo papel, não pela aparência)

`background` · `surface` · `surface-elevated` · `popover` (conteúdo de Select/Dropdown/Tooltip/Toast) ·
`hover` · `overlay` (fundo de modal) · `scrim` · `on-media` (texto sobre imagem/vídeo) ·
`primary-text` (texto/link na cor da marca) · `danger-solid` + `danger-foreground` (botão destrutivo).
A lista completa e as razões de contraste ao vivo estão em **`/dev/theme`** (só em `npm run dev`; em produção dá 404).

## Como adicionar ou mudar uma cor

1. `src/app/globals.css`: defina o token no bloco `@theme static` (tema escuro, que também é o fallback sem JS)
   **e**, se o valor mudar no claro, em `[data-theme="light"]`. `@theme static` é obrigatório: sem `static`,
   o Tailwind v4 não emite tokens que nenhum utilitário usa e o override por tema falha em silêncio.
2. `scripts/check-contrast.mjs`: adicione os pares de texto/fundo em que o token será usado. Mínimo **4,5:1**
   (WCAG AA) nos **dois** temas. Rode `npm run contrast`.
3. Se mudar `--color-background`, atualize também `THEME_COLORS` em `src/lib/theme/constants.ts`
   (cor da barra do navegador, `<meta name="theme-color">`).
4. Confira em `/dev/theme` nos dois temas.

## Como o tema funciona (para não reaprender)

- Preferência (`light` | `dark` | `system`) em `localStorage['content-os-theme']`; ausente ⇒ **escuro**.
- Um script síncrono no `<head>` aplica `data-theme` em `<html>` antes da primeira pintura (sem flash).
- Estado no React: `useTheme()` (`src/hooks/use-theme.ts`), store externo em `src/lib/theme/theme-store.ts`.
  Não mova a chave para o `settings-store` sem rever o script do `<head>`.
- A troca de tema desliga `transition` por ~50 ms (sem animar cores). Animações (`animation`) não são afetadas.
- **Atalho `Alt+Shift+T`** (Option+Shift+T no Mac) alterna claro↔escuro a partir do tema que se vê; ignora campos de texto. "Sistema" só pelo menu. Lógica em `src/lib/theme/shortcut.ts`, montado por `ThemeShortcut` no layout raiz.
- Exportação PNG/PDF do calendário segue o tema ativo.

## Antes de abrir um PR

```bash
npm run lint && npm run typecheck && npm test && npm run contrast
npx playwright install chromium   # só na 1ª vez
npm run e2e                       # Playwright + axe, nos 2 temas, desktop e mobile
```

- O e2e é lento no `next dev` (compila rota no 1º acesso). O CI roda sobre `build + start`.
- Em testes de UI, espere a hidratação com `waitHydrated(page)` (não `networkidle`) e, se medir contraste,
  `waitMotionSettled(page)` depois (ambos em `e2e/helpers.ts`).
- Mudou visual? Veja a tela **nos dois temas** antes de pedir revisão.

## Acessibilidade (o axe é gate: `KNOWN` está vazio)

- Botão só com ícone e `SelectTrigger` **precisam de `aria-label`**.
- `Input`/`Textarea` com `label` já se associam sozinhos (`useId`); não passe `label` sem usar o componente.
- Radix `Tabs` sem `TabsContent` (ex.: seletor de visão do calendário): `aria-controls={undefined}` nos gatilhos.

## Commits

Um item lógico por commit, mensagem `tipo(escopo): resumo` (ex.: `feat(theme): …`, `fix(ui): …`), aplicação
sempre funcionando entre commits.
