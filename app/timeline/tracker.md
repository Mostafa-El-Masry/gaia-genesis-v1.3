# Timeline — tracker

**Route:** `/timeline`

## Files
- `page.tsx` — main page; imports `FilterBar`, `EventForm`, `ImportExport`, `TimelineCanvas`; base styles: `styles/layout.css`.
- `components/FilterBar.tsx` — zoom + layer toggles + sort; styles: `styles/filter-bar.css`.
- `components/EventForm.tsx` — add instant/range events; styles: `styles/event-form.css`.
- `components/ImportExport.tsx` — JSON export/import; styles: `styles/import-export.css`.
- `components/TimelineCanvas.tsx` — horizontal track with boxes; styles: `styles/timeline-canvas.css`.

## Lib
- `lib/types.ts` — event and prefs types.
- `lib/store.ts` — localStorage load/save, add/remove, import/export.
- `lib/scale.ts` — year→percentage mapping + zoom domains.

## Where referenced
- Each component imports its own CSS file.
- `page.tsx` imports `./styles/layout.css` (top of file).

## Local storage keys
- `gaia_timeline_v1_events`
- `gaia_timeline_v1_prefs`
