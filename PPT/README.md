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

## PWA (offline + installable)

- `vite-plugin-pwa` with `generateSW` + `autoUpdate`: app shell,
  slides, logo, and icons are precached — the deck works fully offline.
- Manifest: standalone display, landscape orientation, Pampas
  background, Crail theme color.
- Icons in `public/icons/` (Crail “M” for MCP): 192/512 standard,
  512 maskable, 180 Apple touch.
- Verify: `npm run build` emits `dist/sw.js` +
  `dist/manifest.webmanifest`; serve `dist/` and check DevTools →
  Application → Manifest/Service Workers.

## Design direction (always in force)

Claude-theme focus throughout, honoring Anthropic as the introducer of
MCP (late 2024) — the reason this palette was chosen:

- Palette: Crail `#C15F3C` (signature), Peach `#DE7356` (accents),
  Pampas `#F4F3EE` (ground), Cloudy `#B1ADA1` (lines/decoration),
  warm charcoal `#2B2622` (reading text, derived — the palette has no dark).
- Voice: plain, warm, precise. Short bullets, one idea each; slides
  support the speaker, never paragraph-dump the papers.
