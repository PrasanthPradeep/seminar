import type { SlideMeta } from '../data/presentation'

interface SlideProps {
  slide: SlideMeta
}

/**
 * 16:9-ish viewport slide. Milestone 1 = placeholder content only,
 * except slide 01 which carries the real seminar title.
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
        {slide.logo && (
          <img
            className="slide-logo"
            src={slide.logo}
            alt="College of Engineering Karunagappally logo"
          />
        )}
        {slide.subtitle && <p className="slide-kicker">{slide.subtitle}</p>}
        <h2 className="slide-title">{slide.title}</h2>
        {slide.tagline ? (
          <p className="slide-tagline">{slide.tagline}</p>
        ) : (
          <p className="slide-placeholder">Content will be added here.</p>
        )}
        {slide.presenter && (
          <p className="slide-presenter">
            {slide.presenter}
            {slide.affiliation && (
              <>
                <br />
                <span className="slide-affiliation">{slide.affiliation}</span>
              </>
            )}
          </p>
        )}
      </div>
    </section>
  )
}
