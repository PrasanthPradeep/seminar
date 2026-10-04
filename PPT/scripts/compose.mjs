// Dumps the tallest elements inside a slide's body so layout fixes can be targeted.
// Usage: node scripts/compose.mjs <width> <height> <slide indexes...>
import { chromium } from 'playwright'

const [w, h, ...idx] = process.argv.slice(2)
const URL = process.env.URL ?? 'http://localhost:4173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)

const data = await page.evaluate((list) => {
  return list.map((i) => {
    const slide = document.querySelector(`.slide[data-index="${i}"]`)
    if (!slide) return { i, missing: true }
    const body = slide.querySelector('.slide-body')
    const nodes = [...body.querySelectorAll('*')]
      .map((el) => {
        const r = el.getBoundingClientRect()
        const kids = [...el.children]
        const own =
          r.height -
          kids.reduce((s, c) => s + c.getBoundingClientRect().height, 0)
        return {
          sel: el.className && typeof el.className === 'string'
            ? el.tagName.toLowerCase() + '.' + el.className.trim().split(/\s+/).join('.')
            : el.tagName.toLowerCase(),
          h: Math.round(r.height),
          own: Math.round(own),
          kids: kids.length,
        }
      })
      .filter((n) => n.own > 8 || n.h > 140)
      .sort((a, b) => b.own - a.own)
      .slice(0, 8)
    return {
      i,
      title: (slide.querySelector('.slide-title')?.textContent ?? '').slice(0, 32),
      bodyScroll: Math.round(body.scrollHeight),
      bodyClient: Math.round(body.clientHeight),
      fit: getComputedStyle(slide).getPropertyValue('--slide-fit').trim(),
      nodes,
    }
  })
}, idx)

for (const d of data) {
  console.log(`\ns${d.i} ${d.title}  body ${d.bodyClient}/${d.bodyScroll} k=${d.fit}`)
  for (const n of d.nodes) {
    console.log(`    own=${String(n.own).padStart(4)} h=${String(n.h).padStart(4)} kids=${n.kids}  ${n.sel.slice(0, 88)}`)
  }
}
await browser.close()