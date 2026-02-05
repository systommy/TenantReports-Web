export function exportHtml(elementId: string, filename: string, title: string) {
  const el = document.getElementById(elementId)
  if (!el) return

  // Create a deep clone
  const clone = el.cloneNode(true) as HTMLElement

  // Convert all canvases to images
  const originalCanvases = el.querySelectorAll('canvas')
  const clonedCanvases = clone.querySelectorAll('canvas')

  Array.from(originalCanvases).forEach((canvas, index) => {
    const clonedCanvas = clonedCanvases[index]
    if (clonedCanvas) {
      try {
        const img = document.createElement('img')
        img.src = canvas.toDataURL('image/png')
        // Copy relevant styles/classes
        img.className = canvas.className
        img.style.cssText = canvas.style.cssText
        // Ensure responsive sizing behaves similarly
        img.style.width = '100%' 
        img.style.height = 'auto'
        img.style.maxWidth = '100%'
        
        clonedCanvas.parentNode?.replaceChild(img, clonedCanvas)
      } catch (e) {
        console.warn('Failed to convert canvas to image', e)
      }
    }
  })

  // Remove interactive elements that won't work in static HTML
  // (Optional: can be refined by adding 'no-export' class to specific elements in React)
  // const interactiveSelectors = ['.pagination-controls', '.filter-input']
  // interactiveSelectors.forEach(sel => {
  //   const elements = clone.querySelectorAll(sel)
  //   elements.forEach(e => e.remove())
  // })

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
    /* Export-specific overrides */
    body { font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; color: #111; }
    .grid { display: grid; }
    .flex { display: flex; }
    .hidden { display: none; }
    
    /* Hide pagination and search inputs in export as they are non-functional */
    input[type="text"], select, button[disabled], .no-export { display: none !important; }
    
    /* Reset cursors to indicate static content */
    .cursor-pointer { cursor: default !important; }
    a { cursor: pointer !important; }
    /* But keep expand buttons visible even if they don't work, or hide them? */
    /* Let's hide the search/pagination bar container if possible, or specific inputs */
  </style>
</head>
<body class="p-8 bg-gray-50">
  <div class="max-w-[84rem] mx-auto">
    <div class="mb-8 border-b border-gray-200 pb-4">
      <h1 class="text-3xl font-bold text-gray-900">${title}</h1>
      <p class="text-sm text-gray-500 mt-2">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
    ${clone.innerHTML}
  </div>
  <script>
    // Simple script to handle basic interactions if needed, or just to show it's static
    console.log('Report exported successfully');
  </script>
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
