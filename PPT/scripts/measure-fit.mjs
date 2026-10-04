// Measures per-slide vertical overflow so layout regressions are visible.
// Run with: node scripts/measure-fit.mjs
import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4173/'

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'laptop-1440x900', width: 1440, height: 900 },
  { name: 'phone-landscape-844x390', width: 844, height: 390 },
  { name: 'phone-portrait-390x844', width: 390, height: 844 },
  { name: 'phone-small-360x640', width: 360, height: 640 },
]

const browser = await chromium.launch()
let anyOverflow = false

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('.slide')
  // Let fonts settle and the fit hook run.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)

  const rows = await page.evaluate(() => {
    const out = []
    for (const slide of document.querySelectorAll('.slide')) {
      const body = slide.querySelector('.slide-body')
      const header = slide.querySelector('.slide-header')
      const cs = getComputedStyle(slide)
      out.push({
        index: Number(slide.dataset.index),
        title: (slide.querySelector('.slide-title')?.textContent ?? '(title slide)').slice(0, 34),
        slideH: Math.round(slide.clientHeight),
        headerH: header ? Math.round(header.offsetHeight) : 0,
        bodyClient: body ? Math.round(body.clientHeight) : 0,
        bodyScroll: body ? Math.round(body.scrollHeight) : 0,
        overflowBy: body ? Math.round(body.scrollHeight - body.clientHeight) : 0,
        fit: Number(cs.getPropertyValue('--slide-fit') || '1'),
        // Does content visually spill past the slide box after scaling?
        spillPastSlide: (() => {
          const inner = body ?? slide.firstElementChild
          if (!inner) return 0
          const sr = slide.getBoundingClientRect()
          const ir = inner.getBoundingClientRect()
          const k = Number(cs.getPropertyValue('--slide-fit') || '1')
          return Math.round(Math.max(0, ir.bottom - sr.bottom) / (k || 1))
        })(),
      })
    }
    return out
  })

  const bad = rows.filter((r) => r.overflowBy > 1 || r.spillPastSlide > 1)
  const hard = rows.filter((r) => r.fit <= 0.4 + 0.001)
  console.log(`\n=== ${vp.name} ===`)
  console.log(`slides: ${rows.length}  overflowing: ${bad.length}  at 0.4 floor: ${hard.length}`)
  for (const r of rows) {
    const flags = []
    if (r.overflowBy > 1) flags.push(`scroll+${r.overflowBy}`)
    if (r.spillPastSlide > 1) flags.push(`spill+${r.spillPastSlide}`)
    if (r.fit <= 0.401) flags.push('FLOOR')
    if (flags.length) {
      anyOverflow = true
      console.log(
        `  s${String(r.index).padStart(2, '0')} k=${r.fit.toFixed(2)} ` +
          `hdr=${r.headerH} body=${r.bodyClient}/${r.bodyScroll} ` +
          `[${flags.join(', ')}] ${r.title}`,
      )
    }
  }
  await page.close()
}

await browser.close()
console.log(anyOverflow ? '\nRESULT: overflow present' : '\nRESULT: all slides fit')