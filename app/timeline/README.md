# GAIA v1.3 — Week 4: Timeline (drop-in feature)

Place this folder under `app/timeline/` (Next.js App Router). Visit `/timeline`.

## What it does
- View a global timeline from **Big Bang → Today** (cosmic/human/personal layers).
- **Add events** (instant or ranges), with optional note/link (e.g., link to an Apollo section).
- **Zoom levels:** Cosmic / Human / Personal. Toggle layers. Sort by chronological vs recently added.
- **Local only**. Export/Import your timeline as JSON.

## Styles
At the top of `app/timeline/page.tsx` we import base styles:
```ts
import "./styles/layout.css";
```
Each component imports its own CSS.

## Seed data
First load seeds the timeline with a few cosmic/human milestones. Remove or keep as you like.
