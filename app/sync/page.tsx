'use client';

import ExportPanel from './components/ExportPanel';
import ImportPanel from './components/ImportPanel';

export default function SyncPage(){
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="mb-2">
          <h1 className="text-2xl font-extrabold tracking-wide">Central Sync Hub</h1>
          <p className="text-sm opacity-70">Export or import all GAIA data here. Feature‑level Sync/Reset buttons have been removed.</p>
        </div>

        <ExportPanel />
        <ImportPanel />
      </div>
    </main>
  );
}
