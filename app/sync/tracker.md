# GAIA v1.3 — Week 8: Sync & Backup (Centralized)
Route: /sync

Components
- components/ExportPanel.tsx — scan LocalStorage, select sections/keys, optional password encryption (AES‑GCM), and export JSON.
- components/ImportPanel.tsx — import JSON, decrypt if needed, preview keys, merge/replace, then apply.
- lib/gather.ts — list/group keys and apply bundle.
- lib/bundle.ts — builds bundle object and saves JSON.
- lib/crypto.ts — AES‑GCM + PBKDF2 password encryption.

Notes
- All UI files start with 'use client' and use Tailwind inline classes.
- IndexedDB support can be added later; current hub covers LocalStorage (most GAIA data).
