# TRACE_UI-THEME.md — Intro fix + Boot path change
- app/page.tsx — Intro v2.1; glass search with Tailwind (`backdrop-blur-lg`, `bg-white/10`, `bg-white/20`, `bg-white/70`); no Next<Image> to avoid asset import issues.
- app/layout.tsx — Boot loader now reads from `/public/json/` (gaia-v1.3-backup.json → backup.json → gaia-backup.json).
