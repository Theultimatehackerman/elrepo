/** Vitrine de tema (L13): só existe fora de produção. */
export function isDevShowcaseEnabled(nodeEnv: string | undefined = process.env.NODE_ENV): boolean {
  return nodeEnv !== "production";
}

export interface ShowcaseToken {
  name: string; // sem o prefixo --color-
  group: string;
  /** Token sobre o qual o contraste é medido (texto) ou que o contém (fundo); omitido = sem razão. */
  against?: string;
  /** "text": `name` é texto sobre `against`. "fill": `against` é texto sobre `name`. */
  role?: "text" | "fill";
}

// Espelha scripts/check-contrast.mjs. O teste dev-showcase.test.ts garante que todo
// `--color-*` de globals.css aparece aqui.
export const SHOWCASE_TOKENS: ShowcaseToken[] = [
  { name: "background", group: "Superfícies" },
  { name: "surface", group: "Superfícies" },
  { name: "surface-elevated", group: "Superfícies" },
  { name: "popover", group: "Superfícies" },
  { name: "hover", group: "Superfícies" },
  { name: "border", group: "Superfícies" },
  { name: "overlay", group: "Superfícies" },
  { name: "scrim", group: "Superfícies" },
  { name: "foreground", group: "Texto", against: "surface", role: "text" },
  { name: "muted-foreground", group: "Texto", against: "surface", role: "text" },
  { name: "on-media", group: "Texto" },
  { name: "primary", group: "Marca" },
  { name: "primary-hover", group: "Marca" },
  { name: "primary-foreground", group: "Marca", against: "primary", role: "text" },
  { name: "primary-text", group: "Marca", against: "surface", role: "text" },
  { name: "success", group: "Estado", against: "surface", role: "text" },
  { name: "warning", group: "Estado", against: "surface", role: "text" },
  { name: "danger", group: "Estado", against: "surface", role: "text" },
  { name: "danger-solid", group: "Estado" },
  { name: "danger-foreground", group: "Estado", against: "danger-solid", role: "text" },
  ...["idea", "script", "production", "editing", "approval", "scheduled", "published"].map(
    (s): ShowcaseToken => ({ name: `status-${s}`, group: "Status", against: "surface", role: "text" }),
  ),
];
