# GAIA v1.3 — Week 6: Labs
Route: /labs

Components:
- Controls.tsx — search, category toggles, sort
- Card.tsx — project card with cover/title/tags/date/views + actions
- ViewerDrawer.tsx — right-side drawer with iframe preview

Lib:
- types.ts — LabProject types
- store.ts — LocalStorage (projects), IndexedDB (covers), helpers

Notes:
- All client files start with 'use client' at the top.
- Tailwind inline only (no extra CSS files).
- Deep links: /labs?open=<slug> and /labs?new=1
- “HTML starter” downloads a single index.html (place into /public/labs/<slug>/index.html and set path accordingly).
