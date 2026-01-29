// @ts-ignore - html2pdf.js missing types
import html2pdf from 'html2pdf.js'

export async function exportPdf(elementId: string, filename: string) {
  const el = document.getElementById(elementId)
  if (!el) return
  await html2pdf().set({
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], before: '.print-break' },
  } as any).from(el).save()
}
