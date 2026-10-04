import type { SlideMeta } from '../data/presentation'

interface SlideProps {
  slide: SlideMeta
}

/**
 * 16:9-ish viewport slide. Milestone 1 = placeholder content only.
 * Real layouts (TitleSlide, BulletSlide, …) arrive in Milestone 2/4.
 */
export function Slide({ slide }: SlideProps) {
  return (
    <section
      id={`slide-${slide.index}`}
      data-index={slide.index}
      className="slide"
      aria-label={`Slide ${slide.index} of 22: ${slide.title}`}
    >
      <div className="slide-inner">
        <p className="slide-kicker">{slide.subtitle}</p>
        <h2 className="slide-title">{slide.title}</h2>
        <p className="slide-placeholder">Content will be added here.</p>
      </div>
    </section>
  )
}
