/** Utilitários de cor para valores definidos pelo usuário (ex.: cor do avatar de cliente). */

const DARK_TEXT = "#0b0b0f";
const LIGHT_TEXT = "#ffffff";

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: string, b: string): number {
  const ca = parseHex(a);
  const cb = parseHex(b);
  if (!ca || !cb) return 1;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Escolhe texto claro ou escuro, o que tiver maior contraste sobre `background`. */
export function readableTextColor(background: string): string {
  return contrastRatio(background, LIGHT_TEXT) >= contrastRatio(background, DARK_TEXT)
    ? LIGHT_TEXT
    : DARK_TEXT;
}
