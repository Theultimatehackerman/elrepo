import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const COLOR_UTILITY =
  "\\b(?:bg|text|border|ring|from|to|via|fill|stroke|divide|outline|shadow)-(?:white|black)\\b";

// Padrões de cor literal proibidos em componentes (L12). Cada um vale para strings e template literals.
// Hex: só 3, 4, 6 ou 8 dígitos (evita falso positivo de âncora/ID); funções de cor CSS; classe arbitrária `-[#...]`.
const HEX = "#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\\b";
const COLOR_FUNCTION = "\\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\\(";
const ARBITRARY_HEX = "-\\[#";
const TOKEN_HINT = "Use um token de globals.css (ou var(--color-*)); cor nova = par claro/escuro + check-contrast.mjs.";
const COLOR_PATTERNS = [
  { pattern: COLOR_UTILITY, message: "Use tokens semânticos (bg-surface, text-foreground, text-on-media, bg-overlay...), não white/black." },
  { pattern: HEX, message: `Cor hexadecimal literal. ${TOKEN_HINT}` },
  { pattern: COLOR_FUNCTION, message: `Função de cor literal (rgb/hsl/oklch...). ${TOKEN_HINT}` },
  { pattern: ARBITRARY_HEX, message: `Classe arbitrária com hex (ex.: bg-[#fff]). ${TOKEN_HINT}` },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Guarda-corpo do sistema de temas: cor só via tokens semânticos (globals.css).
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/data/**", // dados de exemplo (avatarColor)
      "src/lib/constants/**", // paleta de marca por plataforma
      "src/lib/utils/gradient.ts", // gradientes decorativos (independentes de tema)
      "src/lib/theme/constants.ts", // THEME_COLORS (meta theme-color)
      "src/lib/utils/color.ts", // cálculo de contraste (valores de referência)
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        // "error": migração concluída; novas cores literais quebram o lint.
        "error",
        ...COLOR_PATTERNS.flatMap(({ pattern, message }) => [
          { selector: `Literal[value=/${pattern}/]`, message },
          { selector: `TemplateElement[value.raw=/${pattern}/]`, message },
        ]),
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
