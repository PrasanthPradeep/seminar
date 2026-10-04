interface EdgeNavigationProps {
  current: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

/**
 * Invisible full-height click zones on the left / right edges.
 * A faint chevron only appears on hover or keyboard focus.
 */
export function EdgeNavigation({ current, total, onPrevious, onNext }: EdgeNavigationProps) {
  return (
    <>
      <button
        type="button"
        className="edge-nav edge-left"
        onClick={onPrevious}
        disabled={current <= 1}
        aria-label="Previous slide"
        tabIndex={current <= 1 ? -1 : 0}
      />
      <button
        type="button"
        className="edge-nav edge-right"
        onClick={onNext}
        disabled={current >= total}
        aria-label="Next slide"
        tabIndex={current >= total ? -1 : 0}
      />
    </>
  )
}
