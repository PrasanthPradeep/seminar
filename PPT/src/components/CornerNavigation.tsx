interface CornerNavigationProps {
  current: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

/**
 * Four invisible click zones:
 * compact top-left + top-right corners → previous slide,
 * bottom-left + bottom-right halves → next slide.
 */
export function CornerNavigation({ current, total, onPrevious, onNext }: CornerNavigationProps) {
  const atFirst = current <= 1
  const atLast = current >= total

  return (
    <>
      <button
        type="button"
        className="corner-nav corner-tl"
        onClick={onPrevious}
        disabled={atFirst}
        aria-label="Previous slide"
        tabIndex={atFirst ? -1 : 0}
      />
      <button
        type="button"
        className="corner-nav corner-tr"
        onClick={onPrevious}
        disabled={atFirst}
        aria-label="Previous slide"
        tabIndex={-1}
      />
      <button
        type="button"
        className="corner-nav corner-bl"
        onClick={onNext}
        disabled={atLast}
        aria-label="Next slide"
        tabIndex={atLast ? -1 : 0}
      />
      <button
        type="button"
        className="corner-nav corner-br"
        onClick={onNext}
        disabled={atLast}
        aria-label="Next slide"
        tabIndex={-1}
      />
    </>
  )
}
