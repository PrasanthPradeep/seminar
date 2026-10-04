// Verifies each slide's content is fully visible inside the slide box.
// Runs against dist/ via scripts/serve.mjs.
import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4173/'

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'laptop-1440x900', width: 1440, height: 900 },
  { name: 'laptop-1280x720', width: 1280, height: 720 },
  { name: 'phone-landscape-844x390', width: 844, height: 390 },
  { name: 'phone-portrait-390x844', width: 390, height: 844 },
  { name: 'phone-small-360x640', width: 360, height: 640 },
]

const browser = await chromium.launch()
let totalBad = 0

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('.slide')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(450)

  const rows = await page.evaluate(() => {
    const out = []
    for (const slide of document.querySelectorAll('.slide')) {
      const body = slide.querySelector('.slide-body')
      const inner = body ?? slide.firstElementChild
      if (!inner) continue
      const k = Number(getComputedStyle(slide).getPropertyValue('--slide-fit') || '1')
      const sr = slide.getBoundingClientRect()
      const ir = inner.getBoundingClientRect()

      // Overflow past the slide box, measured on the SCALED rect (post-transform).
      const overBottom = Math.round(Math.max(0, ir.bottom - sr.bottom))
      const overTop = Math.round(Math.max(0, sr.top - ir.top))
      const overRight = Math.round(Math.max(0, ir.right - sr.right))
      const overLeft = Math.round(Math.max(0, sr.left - ir.left))

      // Worst single element that pokes out of the slide horizontally or
      // vertically — catches a lone overflowing node, not just the body box.
      let worst = 0
      let worstSel = ''
      for (const el of body ? body.querySelectorAll('*') : []) {
        const r = el.getBoundingClientRect()
        if (!r.height) continue
        const d = Math.max(r.bottom - sr.bottom, sr.top - r.top, r.right - sr.right, sr.left - r.left)
        if (d > worst) {
          worst = d
          worstSel = typeof el.className === 'string' && el.className
            ? el.tagName.toLowerCase() + '.' + el.className.trim().split(/\s+/)[0]
            : el.tagName.toLowerCase()
        }
      }

      out.push({
        index: Number(slide.dataset.index),
        title: (slide.querySelector('.slide-title')?.textContent ?? '(title)').slice(0, 30),
        fit: k,
        over: Math.round(Math.max(overBottom, overTop, overRight, overLeft)),
        worst: Math.round(worst),
        worstSel,
        // Text smaller than this starts being hard to read on a phone.
        tiny: [...(body ? body.querySelectorAll('*') : [])].some((el) => {
          if (!el.textContent?.trim() || el.children.length) return false
          const fs = parseFloat(getComputedStyle(el).fontSize) * k
          return fs > 0 && fs < 9
        }),
      })
    }
    return out
  })

  const bad = rows.filter((r) => r.over > 1 || r.worst > 1)
  const tiny = rows.filter((r) => r.tiny)
  totalBad += bad.length
  console.log(`\n=== ${vp.name} === clipped: ${bad.length}/${rows.length}  tiny-text: ${tiny.length}`)
  for (const r of bad) {
    console.log(
      `  s${String(r.index).padStart(2, '0')} k=${r.fit.toFixed(2)} ` +
        `over=${r.over} worst=${r.worst} (${r.worstSel}) ${r.title}`,
    )
  }
  if (tiny.length) console.log(`  tiny text: ${tiny.map((r) => `s${r.index}@${r.fit.toFixed(2)}`).join(', ')}`)
  await page.close()
}

await browser.close()
console.log(totalBad ? `\nRESULT: ${totalBad} clipped slide(s)` : '\nRESULT: every slide fully visible')
process.exit(totalBad ? 1 : 0)