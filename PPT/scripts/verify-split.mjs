// Asserts a split slide's visual sits to the RIGHT of its bullets (or
// stacked on top at <=800px wide, where side-by-side would be unreadable).
import { chromium } from 'playwright'

const TARGET = process.env.URL ?? 'http://localhost:4173/'
// Slides using `.slide-split`: 2 agent-flow, 9 architecture, 12 workflow,
// 15 threat. Pass indexes to check a subset.
const args = process.argv.slice(2).map(Number)
const SLIDES = args.length ? args : [2, 9, 12, 15]
const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1280, 720],
  [844, 390],
  [390, 844],
  [360, 640],
]

const browser = await chromium.launch()
let bad = 0

for (const index of SLIDES) {
  console.log(`\n--- slide ${index} ---`)
  for (const [w, h] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    await page.goto(TARGET, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(450)

    const r = await page.evaluate((i) => {
      const slide = document.querySelector(`.slide[data-index="${i}"]`)
      const split = slide?.querySelector('.slide-split')
      if (!split) return { missing: true, cls: slide?.className ?? '(no slide)' }
      // AgentFlow is inlined; the other three wrap it in `.slide-visual`.
      const [text, visual] = split.children
      if (!text || !visual) return { missing: true, cls: split.className }
      const a = text.getBoundingClientRect()
      const b = visual.getBoundingClientRect()
      const stacked = b.top > a.bottom - 10
      return {
        cls: split.className,
        sideBySide: !stacked,
        stackedOk: stacked && window.innerWidth <= 800,
        visualRight: b.left >= a.right - 4,
        textLeft: a.left < b.left,
        gap: Math.round(b.left - a.right),
        textW: Math.round(a.width),
        visualW: Math.round(b.width),
        k: Number(getComputedStyle(slide).getPropertyValue('--slide-fit')) || 1,
      }
    }, index)

    const ok =
      !r.missing &&
      ((r.sideBySide && r.visualRight && r.textLeft) || r.stackedOk)
    if (!ok) bad++
    console.log(
      `  ${w}x${h}: ${
        r.missing
          ? `MISSING ${r.cls}`
          : `${r.sideBySide ? 'row   visual-right' : 'stacked'} gap=${r.gap} ` +
            `text=${r.textW} visual=${r.visualW} k=${r.k.toFixed(2)}`
      }${ok ? '' : '  <-- FAIL'}`,
    )
    await page.close()
  }
}

await browser.close()
console.log(bad ? `\nRESULT: ${bad} viewport(s) wrong` : '\nRESULT: diagram is right of text on all viewports')
process.exit(bad ? 1 : 0)