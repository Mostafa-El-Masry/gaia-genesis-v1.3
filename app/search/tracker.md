# GAIA v1.3 — Week 9: Search & Close App
Route: /search

Files
- app/search/page.tsx — shell, indexing/rescan, results, deep links, Power Menu.
- app/search/components/SearchBar.tsx — Ctrl/⌘+K focus; Tailwind inline.
- app/search/components/CategoryChips.tsx — category filter.
- app/search/components/ResultItem.tsx — result card + Open link.
- app/search/components/PowerMenu.tsx — Close / Hide / Lock / Clear Search Cache.
- app/search/lib/types.ts — types.
- app/search/lib/sources.ts — LS key→item adapter with prefix→route mapping.
- app/search/lib/indexer.ts — build cache, persist, and run ranked search.
- app/goodbye/page.tsx — fallback page after Close.

Notes
- All TSX begin with 'use client'. Tailwind inline only.
- Index is LocalStorage-only; adaptors can be extended as features grow.
