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

export async function exportNodeToPdf(node: HTMLElement, filename: string): Promise<void> {
  const [dataUrl, { jsPDF }] = await Promise.all([
    renderNodeToPngDataUrl(node),
    import("jspdf"),
  ]);

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const scale = Math.min(
    (pageWidth - margin * 2) / node.offsetWidth,
    (pageHeight - margin * 2) / node.offsetHeight
  );
  const width = node.offsetWidth * scale;
  const height = node.offsetHeight * scale;

  pdf.addImage(dataUrl, "PNG", (pageWidth - width) / 2, (pageHeight - height) / 2, width, height);
  pdf.save(filename);
}
