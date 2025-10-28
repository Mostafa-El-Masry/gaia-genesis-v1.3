# Global cleanup checklist
Run these searches across the repo and remove any feature-level Sync/Reset controls. Keep **only** the centralized `/sync`.

Keywords to find:
- `Sync` (components, buttons, menu items)
- `ExportImport` (remove feature-level usage; move to /sync)
- `Reset Gallery` / `Reset Views`
- `sync*(`, `reset*(` handlers
- References to old backup keys like `*_backup_*`

After removal:
- Ensure top-left GAIA/G still returns to `/` (intro).
- Add a single entry/link to `/sync` on the intro page list so you can reach the hub.
