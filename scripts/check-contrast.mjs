// Verifica contraste WCAG 2.2 AA dos tokens de src/app/globals.css nos dois temas.
// Uso: node scripts/check-contrast.mjs   (sai com código 1 se algo reprovar)
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

function block(startRegex) {
  const m = startRegex.exec(css);
  if (!m) throw new Error(`Bloco não encontrado: ${startRegex}`);
  let i = css.indexOf("{", m.index) + 1, depth = 1;
  const start = i;
  while (depth && i < css.length) { depth += css[i] === "{" ? 1 : css[i] === "}" ? -1 : 0; i++; }
  return css.slice(start, i - 1);
}
function tokens(body) {
  const out = {};
  for (const [, k, v] of body.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[k] = v.toLowerCase();
  return out;
}

const dark = tokens(block(/@theme\s+static/));
const light = { ...dark, ...tokens(block(/\[data-theme="light"\]\s*\{/)) };

const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = toRgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, bg, a) => "#" + toRgb(fg).map((c, i) => Math.round(c * a + toRgb(bg)[i] * (1 - a)).toString(16).padStart(2, "0")).join("");

const SURFACES = ["background", "surface", "surface-elevated", "popover"];
const STATUS = ["idea", "script", "production", "editing", "approval", "scheduled", "published"];

let failures = 0;
function check(theme, label, fg, bg, min = 4.5) {
  const r = ratio(fg, bg);
  if (r < min) { failures++; console.error(`✗ [${theme}] ${label}: ${r.toFixed(2)}:1 (mín. ${min}) ${fg} sobre ${bg}`); }
}

for (const [theme, t] of [["dark", dark], ["light", light]]) {
  for (const s of SURFACES) {
    for (const fg of ["foreground", "muted-foreground", "primary-text", "success", "danger"])
      check(theme, `${fg} em ${s}`, t[fg], t[s]);
    for (const st of STATUS) {
      check(theme, `status-${st} (texto) em tint 10% sobre ${s}`, t[`status-${st}`], over(t[`status-${st}`], t[s], 0.1));
    }
  }
  check(theme, "muted-foreground em hover", t["muted-foreground"], t.hover);
  check(theme, "foreground em hover", t.foreground, t.hover);
  check(theme, "primary-foreground em primary", t["primary-foreground"], t.primary);
  check(theme, "primary-foreground em primary-hover", t["primary-foreground"], t["primary-hover"]);
  check(theme, "danger-foreground em danger-solid", t["danger-foreground"], t["danger-solid"]);
  check(theme, "warning em surface", t.warning, t.surface);
}
console.log(failures ? `\n${failures} reprovação(ões).` : "✓ Todos os pares passam AA (4.5:1) nos dois temas.");
process.exit(failures ? 1 : 0);
