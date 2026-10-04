// Prints layout internals for one slide so the fit bug can be pinpointed.
import { chromium } from 'playwright'

const [w, h, idx] = process.argv.slice(2)
const URL = process.env.URL ?? 'http://localhost:4173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(450)

const d = await page.evaluate((i) => {
  const slide = document.querySelector(`.slide[data-index="${i}"]`)
  const body = slide.querySelector('.slide-body')
  const cs = getComputedStyle(slide)
  const k = parseFloat(cs.getPropertyValue('--slide-fit')) || 1
  return {
    classes: slide.className,
    transform: cs.transform,
    transformOrigin: cs.transformOrigin,
    k,
    slideClient: slide.clientHeight,
    slideScroll: slide.scrollHeight,
    headerH: slide.querySelector('.slide-header')?.offsetHeight ?? 0,
    bodyClient: body?.clientHeight,
    bodyScroll: body?.scrollHeight,
    bodyOverflow: body ? getComputedStyle(body).overflow : null,
    children: [...(body?.children ?? [])].map((c) => {
      const s = getComputedStyle(c)
      return {
        cls: c.className.slice(0, 40),
        h: Math.round(c.getBoundingClientRect().height / k),
        offsetH: c.offsetHeight,
        shrink: s.flexShrink,
        grow: s.flexGrow,
        basis: s.flexBasis,
        scrollH: c.scrollHeight,
      }
    }),
  }
}, idx)

console.log(JSON.stringify(d, null, 2))
await browser.close()