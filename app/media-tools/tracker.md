# GAIA v1.3 — Week 12: Media Tools (Manifests & Subnames)
Route: /media-tools

Files
- app/media-tools/page.tsx — hub page
- app/media-tools/lib/schema.ts — manifest types
- app/media-tools/components/ManifestBuilder.tsx — build/import/export/merge manifest
- app/media-tools/components/SubnamesEditor.tsx — overlay display names
- app/media-tools/components/TagsAndTrend.tsx — tags + trend scoring preview
- app/media-tools/components/PreviewsHelper.tsx — verify 001–006 hover previews

Notes
- All client components with Tailwind inline.
- Gallery integration will read `gallery_manifest_v1` in a later patch.
