// Renders each slide to a PNG so it can be eyeballed.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const [width = 390, height = 844, tag = 'phone'] = process.argv.slice(2)
const OUT = new URL(`../shots/${tag}/`, import.meta.url).pathname
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: +width, height: +height } })
await page.goto(process.env.URL, { waitUntil: 'networkidle' })
await page.waitForSelector('.slide')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

const slides = await page.evaluate(() =>
  [...document.querySelectorAll('.slide')].map((s) => Number(s.dataset.index)),
)

for (const i of slides) {
  await page.evaluate((n) => {
    document.querySelector(`.slide[data-index="${n}"]`).scrollIntoView({ block: 'start' })
  }, i)
  await page.waitForTimeout(320)
  await page.screenshot({ path: `${OUT}s${String(i).padStart(2, '0')}.png` })
}

await browser.close()
console.log(`${slides.length} screenshots -> ${OUT}`)