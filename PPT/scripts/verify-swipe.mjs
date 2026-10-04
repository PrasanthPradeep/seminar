// Confirms a swipe gesture over slide content advances to the next slide
// instead of scrolling inside the slide body.
import { chromium } from 'playwright'

const URL = process.env.URL ?? 'http://localhost:4173/'
const [width = 390, height = 844] = process.argv.slice(2)

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: +width, height: +height },
  hasTouch: true,
  isMobile: true,
})
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForSelector('.slide')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

const active = () =>
  page.evaluate(() => {
    const el = document.querySelector('.slide[data-active="true"]')
    return { index: Number(el?.dataset.index), scrollTop: Math.round(el?.parentElement.scrollTop ?? 0) }
  })

let failures = 0
console.log(`viewport ${width}x${height}`)

// Start on slide 1 and swipe up (advance) from the middle of the screen,
// which is over slide content — the case that used to scroll in place.
for (const from of [1, 2, 6, 9, 12, 13, 14, 15, 18]) {
  await page.evaluate((i) => {
    document.querySelector(`.slide[data-index="${i}"]`).scrollIntoView({ block: 'start' })
  }, from)
  await page.waitForTimeout(650)

  const before = await active()
  const box = page.viewportSize()
  const cx = box.width / 2
  // Real touch input via CDP — synthetic TouchEvents do not drive native
  // scrolling, so this has to go through the browser's input pipeline.
  const cdp = await page.context().newCDPSession(page)
  const y0 = Math.round(box.height * 0.75)
  const y1 = Math.round(box.height * 0.2)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: cx, y: y0, id: 1 }],
  })
  for (let y = y0; y >= y1; y -= 16) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: cx, y, id: 1 }],
    })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(900)

  const after = await active()
  const advanced = after.index > before.index
  if (!advanced) failures++
  console.log(
    `  s${String(from).padStart(2, '0')} -> ${advanced ? `s${after.index}` : `STUCK at s${after.index}`}` +
      `${advanced ? '' : '  <-- FAILED'}`,
  )
}

await browser.close()
console.log(failures ? `\nRESULT: ${failures} slide(s) trapped` : '\nRESULT: swipes always advance slides')
process.exit(failures ? 1 : 0)