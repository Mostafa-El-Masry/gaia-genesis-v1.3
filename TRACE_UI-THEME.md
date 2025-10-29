# TRACE_UI-THEME.md (updated for Week 10)

- patches/intro-glass.page.tsx — uses Tailwind glass styles:
  - `backdrop-blur-lg` at lines: [27, 33]
  - translucent whites: `bg-white/10`, `bg-white/20`, `bg-white/70`
- app/dashboard/** — Tailwind inline only; no theme toggles or data-theme attributes currently.
