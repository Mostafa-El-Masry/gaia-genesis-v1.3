# GAIA v1.3 - Week 1: Intro

Minimal, clean intro page per spec:

- White background, dark text
- Centered **GAIA** wordmark at the largest reasonable size
- No navbar
- A **corner GAIA logo** exists globally but is hidden on the Intro (shows on other pages and links back home)
- No external fonts; uses system stack for speed/stability
- Respects `prefers-reduced-motion`

## Quick start

```bash
pnpm install   # or npm / yarn
pnpm dev       # http://localhost:3000
```

Development runs with Next.js' default Turbopack bundler; use the build script for production output.

## Structure

- `app/page.tsx`: Intro (just the big GAIA)
- `components/TopLeftHome.tsx`: Fixed top-left "G / GAIA" that links to `/`, auto-hides on the Intro page
- `components/Brand.tsx`: SVG monogram + wordmark
- `styles/global.css`: Tailwind layers and layout globals
- `TRACE_UI-THEME.md`: running trace of theme-related references

## Next steps (Week 2+)
- Add routes like `/gallery`, `/apollo`, etc. The corner logo will appear automatically and route back to `/`.
- The Intro will list component links as they are completed (not implemented in Week 1 by design).
