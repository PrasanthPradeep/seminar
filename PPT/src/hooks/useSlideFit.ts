import { useCallback, useEffect, useRef } from 'react'

/** Safety floor. Well below the smallest scale any real slide needs, so it
 *  never kicks in — but it keeps `scale()` from ever going to zero. */
const MIN_FIT = 0.28

/**
 * Widest horizontal extent inside `root` that cannot reflow narrower.
 *
 * Elements with `white-space: nowrap` (or an explicit width) keep their full
 * width no matter how narrow the viewport gets, so they are what actually
 * decides whether the scaled slide still fits horizontally. Wrapping text and
 * flexible grids are excluded because they genuinely shrink.
 */
function widestUnbreakable(root: HTMLElement): number {
  let widest = 0
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const style = getComputedStyle(el)
    if (style.whiteSpace === 'nowrap' || style.overflowX === 'scroll') {
      widest = Math.max(widest, el.scrollWidth)
    }
    // An element wider than its parent also can't be shrunk by the browser.
    const parent = el.parentElement
    if (parent && el.scrollWidth > parent.clientWidth + 1) {
      widest = Math.max(widest, el.scrollWidth)
    }
  }
  return widest
}

/**
 * Auto-fit safety net for a single slide.
 *
 * Slides are authored in desktop pixels, so on a short viewport (a phone in
 * landscape is only ~390px tall) the content can be taller than the slide.
 * This measures the slide's *natural* content height against the height it
 * actually has and writes a scale factor to `--slide-fit`, which the styles
 * apply with `transform: scale()`. That guarantees every slide is fully
 * visible with no in-slide scrolling and nothing clipped or overlapping,
 * on any device.
 *
 * `transform` does not affect layout, so the measured values never change
 * once applied — re-running the measurement is idempotent, and it cannot
 * feed back into itself.
 */
export function useSlideFit<T extends HTMLElement>(recomputeKey?: unknown) {
  const ref = useRef<T | null>(null)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return

    // The fixed-height slide frame is what we must fit into.
    const availableH = el.clientHeight
    if (!availableH) return

    // Measure the auto-height column, NOT the frame. Its height is natural
    // because nothing constrains it vertically, so scaling it by
    // availableH/natural lands it exactly on the available height.
    // Content slides scale `.slide-fit`; the title slide scales `.slide-inner`.
    // In both cases the transformed element must be the one we measure, or the
    // scale and the measurement describe different boxes.
    const fitEl =
      el.querySelector<HTMLElement>('.slide-fit') ??
      el.querySelector<HTMLElement>('.slide-inner') ??
      el
    const naturalH = fitEl.scrollHeight

    // Width needs the same treatment: a wide diagram keeps its aspect ratio
    // when scaled, so it can still stick out sideways on a narrow viewport.
    // Measure the widest unbreakable row (text lines and grid cells can't
    // wrap below their natural width) against the column's usable width.
    const naturalW = widestUnbreakable(fitEl)
    const availableW = fitEl.clientWidth || el.clientWidth

    let next = 1
    if (naturalH > availableH + 1) next = Math.min(next, availableH / naturalH)
    if (naturalW > availableW + 1) next = Math.min(next, availableW / naturalW)

    el.style.setProperty('--slide-fit', String(Math.max(next, MIN_FIT)))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    // Observe the content column's own box: it is the thing whose natural
    // height decides the scale.
    const fitEl = el.querySelector<HTMLElement>('.slide-fit')
    if (fitEl) observer.observe(fitEl)

    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    // Web fonts land after first paint and change text metrics.
    document.fonts?.ready.then(measure).catch(() => undefined)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [measure, recomputeKey])

  return ref
}