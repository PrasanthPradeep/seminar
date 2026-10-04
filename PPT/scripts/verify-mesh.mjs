// Confirms every .d-mesh row fills its 5-column grid exactly, with the
// endpoint/arrow/label/arrow/endpoint cells in the right places.
import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4173/'
const browser = await chromium.launch()
let bad = 0

for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 720], [844, 390], [390, 844], [360, 640]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(450)

  const meshes = await page.evaluate(() => {
    const out = []
    for (const mesh of document.querySelectorAll('.d-mesh')) {
      const kids = [...mesh.children]
      const colCount = getComputedStyle(mesh).gridTemplateColumns.split(' ').length
      const rows = []
      for (let i = 0; i < kids.length; i += colCount) {
        rows.push(
          kids
            .slice(i, i + colCount)
            .map((k) => k.tagName.toLowerCase())
            .join(','),
        )
      }
      // Each row must be a complete 5-cell link: span,i,em,i,span
      const expected = 'span,i,em,i,span'
      out.push({
        variant: mesh.className.replace('d-mesh ', ''),
        colCount,
        cellCount: kids.length,
        rows,
        ok: rows.every((r) => r === expected) && kids.length % colCount === 0,
      })
    }
    return out
  })

  const fails = meshes.filter((m) => !m.ok)
  bad += fails.length
  console.log(`${w}x${h}: ${meshes.length} mesh(es), ${fails.length} malformed`)
  for (const m of meshes) {
    console.log(`    ${m.variant.padEnd(12)} cols=${m.colCount} cells=${m.cellCount} rows=[${m.rows.join(' | ')}]${m.ok ? '' : '  <-- MALFORMED'}`)
  }
  await page.close()
}

await browser.close()
console.log(bad ? `\nRESULT: ${bad} malformed mesh(es)` : '\nRESULT: all mesh rows well formed')
process.exit(bad ? 1 : 0)