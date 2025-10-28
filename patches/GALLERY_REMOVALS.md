# Remove Gallery-specific Sync/Reset
Search in `app/gallery/` for any of the following and delete the buttons/components and their handlers:
- `Sync` (buttons, icons, or menu items)
- `Reset Gallery`
- `Reset Views`
- `syncGallery()`, `resetGallery()`, `resetViews()`

Typical spots:
- `app/gallery/page.tsx` top action toolbar
- `app/gallery/components/Controls.tsx` or similar
- Any modal/dialog offering Reset (remove the entire block)

Replace with nothing, or a link to `/sync` if you still want quick access (recommended to keep the page clean).
