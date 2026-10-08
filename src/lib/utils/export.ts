export function slugifyFileName(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function renderNodeToPngDataUrl(node: HTMLElement): Promise<string> {
  const { toPng } = await import("html-to-image");
  return toPng(node, { pixelRatio: 2, cacheBust: true });
}

export async function exportNodeToPng(node: HTMLElement, filename: string): Promise<void> {
  const dataUrl = await renderNodeToPngDataUrl(node);
  downloadDataUrl(dataUrl, filename);
}

// A10: o PDF segue o tema ativo, inclusive a folha. Lê o token do documento (nenhuma cor literal aqui);
// só aceita hex, que é o que o jsPDF entende em setFillColor.
function readThemeBackground(): string | null {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim();
  return /^#[0-9a-f]{3,8}$/i.test(value) ? value : null;
}

export async function exportNodeToPdf(node: HTMLElement, filename: string): Promise<void> {
  const [dataUrl, { jsPDF }] = await Promise.all([
    renderNodeToPngDataUrl(node),
    import("jspdf"),
  ]);

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true }); // A9: sem isso o PDF de 1 página pesava ~17 MB
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const scale = Math.min(
    (pageWidth - margin * 2) / node.offsetWidth,
    (pageHeight - margin * 2) / node.offsetHeight
  );
  const width = node.offsetWidth * scale;
  const height = node.offsetHeight * scale;

  const background = readThemeBackground();
  if (background) {
    pdf.setFillColor(background);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  }
  pdf.addImage(dataUrl, "PNG", (pageWidth - width) / 2, (pageHeight - height) / 2, width, height, undefined, "FAST");
  pdf.save(filename);
}
