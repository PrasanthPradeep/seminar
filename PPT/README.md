# Seminar Presentation PWA

Milestone 1 — presentation shell (React + Vite + TypeScript).

## Run

```bash
npm install
npm run dev
```

## Milestone 1 scope

- 22 blank 16:9 slides (skeleton titles only)
- Snap scrolling (`scroll-snap-type: y mandatory`)
- Central controller: `src/hooks/usePresentation.ts`
  (`currentSlide`, `nextSlide`, `previousSlide`, `goToSlide`, `firstSlide`, `lastSlide`)
- Button navigation (Previous / Next + counter)
- Keyboard: `→` `Space` `↓` = next, `←` `↑` = previous, `Home` / `End` = first / last
  (ignored while typing in inputs)
- Progress indicator + minimal top/bottom UI

Content, design system, PWA, and fullscreen arrive in later milestones.
