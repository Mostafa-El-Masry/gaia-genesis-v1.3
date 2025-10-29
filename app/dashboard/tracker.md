# GAIA v1.3 — Week 10: Dashboard
Route: /dashboard

Files
- app/dashboard/page.tsx — page shell (GAIA back button, cards, widgets, actions)
- app/dashboard/components/OverviewCards.tsx — prefix-based snapshots
- app/dashboard/components/QuickActions.tsx — links to key places
- app/dashboard/widgets/WeightSpark.tsx — SVG sparkline from local data
- app/dashboard/widgets/WealthSpark.tsx — SVG sparkline from local data
- app/dashboard/widgets/ActivityFeed.tsx — recent updates across features

Notes
- All files start with 'use client'; Tailwind inline only.
- Reads LocalStorage safely; missing data shows friendly empty states.
- No global navbar; GAIA/G button top-left returns to '/'.
