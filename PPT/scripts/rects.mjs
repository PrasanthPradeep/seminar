// Prints raw (post-transform) rects for a slide and its key parts.
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
  const sr = slide.getBoundingClientRect()
  const q = (sel) => {
    const el = sel === '.slide' ? slide : slide.querySelector(sel)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      sel,
      top: Math.round(r.top - sr.top),
      bottom: Math.round(r.bottom - sr.top),
      left: Math.round(r.left - sr.left),
      right: Math.round(r.right - sr.left),
      h: Math.round(r.height),
      w: Math.round(r.width),
      offsetH: el.offsetHeight,
    }
  }
  // Deepest offenders, measured on the real post-transform rect.
  const off = []
  for (const el of slide.querySelectorAll('.slide-body *')) {
    const r = el.getBoundingClientRect()
    if (!r.height) continue
    const over = Math.max(r.bottom - sr.bottom, sr.top - r.top, r.right - sr.right, sr.left - r.left)
    if (over > 1) {
      off.push({
        sel: (typeof el.className === 'string' ? el.className.split(/\s+/)[0] : '') || el.tagName,
        over: Math.round(over),
        belowSlideBottom: Math.round(r.bottom - sr.bottom),
        rectTop: Math.round(r.top - sr.top),
        rectH: Math.round(r.height),
      })
    }
  }
  return {
    slide: q('.slide'),
    header: q('.slide-header'),
    body: q('.slide-body'),
    firstChild: slide.querySelector('.slide-body')?.firstElementChild
      ? q(`.slide-body > ${slide.querySelector('.slide-body').firstElementChild.className.split(/\s+/).map((c) => '.' + c).join('')}`)
      : null,
    k: getComputedStyle(slide).getPropertyValue('--slide-fit').trim(),
    overflowCount: off.length,
    offenders: off.sort((a, b) => b.over - a.over).slice(0, 6),
  }
}, idx)

console.log(JSON.stringify(d, null, 2))
await browser.close()