import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const COLOR_UTILITY =
  "\\b(?:bg|text|border|ring|from|to|via|fill|stroke|divide|outline|shadow)-(?:white|black)\\b";

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
        {
          selector: `Literal[value=/${COLOR_UTILITY}/]`,
          message: "Use tokens semânticos (bg-surface, text-foreground, text-on-media, bg-overlay...), não white/black.",
        },
        {
          selector: `TemplateElement[value.raw=/${COLOR_UTILITY}/]`,
          message: "Use tokens semânticos (bg-surface, text-foreground, text-on-media, bg-overlay...), não white/black.",
        },
        {
          selector: "Literal[value=/#[0-9a-fA-F]{6}\\b/]",
          message: "Cor hexadecimal literal: use um token de globals.css (ou var(--color-*)).",
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
