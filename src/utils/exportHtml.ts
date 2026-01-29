export function exportHtml(elementId: string, filename: string, title: string) {
  const el = document.getElementById(elementId)
  if (!el) return

  const clone = el.cloneNode(true) as HTMLElement

  const cssRules: string[] = []
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const sheet = document.styleSheets[i]
      if (sheet.cssRules) {
        for (let j = 0; j < sheet.cssRules.length; j++) {
          cssRules.push(sheet.cssRules[j].cssText)
        }
      }
    } catch (e) {
      console.warn('Could not access stylesheet', e)
    }
  }

  const styles = cssRules.join(' ')

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${styles}
    @media print {
      .no-print { display: none !important; }
      body { font-size: 10pt; }
    }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #111; }
    .grid { display: grid; }
    .flex { display: flex; }
    .hidden { display: none; }
  </style>
</head>
<body class="p-4">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">${title}</h1>
    ${clone.innerHTML}
  </div>
</body>
</html>`

  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
