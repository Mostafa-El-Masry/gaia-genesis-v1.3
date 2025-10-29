# TRACE_UI-THEME.md (Week 11 update)
- app/settings/sections/ThemeCard.tsx — defines UI preferences and writes CSS-like vars to <html> (accent, font scale, glass).
- app/settings/page.tsx — no global theme provider; all styles are Tailwind inline.
- Intro glass search (Week 10) continues to use backdrop blur; its intensity knob is `settings_glass`.
