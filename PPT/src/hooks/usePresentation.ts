import { useCallback, useEffect, useRef, useState } from 'react'
import { TOTAL_SLIDES } from '../data/presentation'

function slideElement(index: number): HTMLElement | null {
  return document.getElementById(`slide-${index}`)
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    el.isContentEditable
  )
}

/** Ease in-out cubic: slow start, steady middle, soft landing. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export interface PresentationController {
  currentSlide: number
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (n: number) => void
  firstSlide: () => void
  lastSlide: () => void
  containerRef: React.RefObject<HTMLDivElement>
}

const GLIDE_DURATION_MS = 750

/**
 * Single source of truth for navigation.
 * Scroll, buttons, keyboard and touch all go through here.
 *
 * Button/keyboard navigation uses a JS eased glide (rAF) with snapping
 * suspended mid-flight, so it lands softly instead of jumping.
 * Manual scrolling stays native + `proximity` snap, so it never yanks.
 */
export function usePresentation(): PresentationController {
  const [currentSlide, setCurrentSlide] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(1)
  const animRef = useRef<number | null>(null)
  const programmaticRef = useRef(false)
  const unlockTimer = useRef<number | null>(null)

  const cancelGlide = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
    containerRef.current?.classList.remove('is-programmatic')
    programmaticRef.current = false
    if (unlockTimer.current !== null) {
      window.clearTimeout(unlockTimer.current)
      unlockTimer.current = null
    }
  }, [])

  const setSlide = useCallback((n: number) => {
    currentRef.current = n
    setCurrentSlide(n)
  }, [])

  const goToSlide = useCallback((n: number) => {
    const container = containerRef.current
    const clamped = Math.min(Math.max(n, 1), TOTAL_SLIDES)
    const target = slideElement(clamped)
    if (!container || !target) return
    if (clamped === currentRef.current) return

    // Cancel any in-flight glide before starting a new one.
    cancelGlide()

    const startTop = container.scrollTop
    const endTop = target.offsetTop
    const distance = endTop - startTop
    if (Math.abs(distance) < 2) {
      setSlide(clamped)
      return
    }

    // Longer distance = slightly longer glide, capped for sanity.
    const duration = Math.min(
      GLIDE_DURATION_MS + Math.abs(clamped - currentRef.current) * 80,
      1200,
    )

    programmaticRef.current = true
    container.classList.add('is-programmatic')
    setSlide(clamped)

    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      container.scrollTop = startTop + distance * easeInOutCubic(t)
      if (t < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        animRef.current = null
        // Let the scroll settle, then re-enable snap + observer.
        unlockTimer.current = window.setTimeout(() => {
          container.classList.remove('is-programmatic')
          programmaticRef.current = false
        }, 120)
      }
    }

    animRef.current = requestAnimationFrame(step)
  }, [cancelGlide, setSlide])

  const nextSlide = useCallback(() => {
    goToSlide(currentRef.current + 1)
  }, [goToSlide])

  const previousSlide = useCallback(() => {
    goToSlide(currentRef.current - 1)
  }, [goToSlide])

  const firstSlide = useCallback(() => goToSlide(1), [goToSlide])
  const lastSlide = useCallback(() => goToSlide(TOTAL_SLIDES), [goToSlide])

  // Deterministic start: a reload always opens on slide 1, ignoring
  // browser scroll restoration (which would otherwise leave the view on
  // slide N while state says slide 1, breaking the first button taps).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    container.scrollTop = 0
    setSlide(1)
  }, [setSlide])

  // A manual scroll/touch during a glide hands control back to the user
  // instead of fighting them.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onUserScroll = () => {
      if (programmaticRef.current && animRef.current !== null) {
        cancelGlide()
      }
    }
    container.addEventListener('wheel', onUserScroll, { passive: true })
    container.addEventListener('touchmove', onUserScroll, { passive: true })
    return () => {
      container.removeEventListener('wheel', onUserScroll)
      container.removeEventListener('touchmove', onUserScroll)
    }
  }, [cancelGlide])

  // Observe which slide is in view so manual scrolling updates the counter.
  // Picks the MOST visible slide to avoid flicker between two neighbours.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticRef.current) return
        let best: Element | null = null
        let bestRatio = 0
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            best = entry.target
          }
        }
        if (best) {
          const idx = Number((best as HTMLElement).dataset.index)
          if (idx >= 1 && idx <= TOTAL_SLIDES && idx !== currentRef.current) {
            setSlide(idx)
          }
        }
      },
      {
        root: container,
        threshold: [0.35, 0.5, 0.65],
      },
    )

    const slides = container.querySelectorAll('[data-index]')
    slides.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [setSlide])

  // Keyboard controls with input-field safeguard.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          nextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          previousSlide()
          break
        case 'Home':
          e.preventDefault()
          firstSlide()
          break
        case 'End':
          e.preventDefault()
          lastSlide()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [nextSlide, previousSlide, firstSlide, lastSlide])

  // Clean up any pending animation on unmount.
  useEffect(() => () => cancelGlide(), [cancelGlide])

  return {
    currentSlide,
    nextSlide,
    previousSlide,
    goToSlide,
    firstSlide,
    lastSlide,
    containerRef,
  }
}
