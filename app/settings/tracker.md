# GAIA v1.3 — Week 11: Settings (with Backup)
Route: /settings

Structure
- sections/ThemeCard.tsx — theme, accent, scale, density, glass
- sections/SceneCard.tsx — landing page, intro style
- sections/AccessibilityCard.tsx — reduce motion, contrast, underline links
- sections/PrivacyCard.tsx — 4-digit lock PIN
- sections/DefaultsCard.tsx — reset settings
- sections/BackupPanel.tsx — integrates Export/Import
- sync/lib/* and sync/components/* — backup internals (moved from /sync)

Notes
- All TSX start with 'use client'; Tailwind inline only.
- Legacy /sync route now redirects to /settings#backup.
