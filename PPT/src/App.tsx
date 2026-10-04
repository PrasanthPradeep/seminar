import { SLIDES, TOTAL_SLIDES } from './data/presentation'
import { usePresentation } from './hooks/usePresentation'
import { Slide } from './components/Slide'
import { EdgeNavigation } from './components/EdgeNavigation'
import { ProgressIndicator } from './components/ProgressIndicator'
import './styles/globals.css'
import './styles/presentation.css'

export default function App() {
  const {
    currentSlide,
    nextSlide,
    previousSlide,
    containerRef,
  } = usePresentation()

  return (
    <div className="app">
      <header className="topbar">
        <span className="topbar-title">TECHNICAL SEMINAR</span>
        <span className="topbar-counter">
          {String(currentSlide).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
        </span>
      </header>
      <ProgressIndicator current={currentSlide} total={TOTAL_SLIDES} />

      <div className="stage">
        <main ref={containerRef} className="presentation">
          {SLIDES.map((slide) => (
            <Slide key={slide.id} slide={slide} />
          ))}
        </main>

        <EdgeNavigation
          current={currentSlide}
          total={TOTAL_SLIDES}
          onPrevious={previousSlide}
          onNext={nextSlide}
        />
      </div>
    </div>
  )
}
