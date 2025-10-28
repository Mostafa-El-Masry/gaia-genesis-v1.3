'use client';

export default function SyncPage(){
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold tracking-wide">Central Sync Hub (All‑in‑One)</h1>
          <p className="mt-3 text-sm opacity-80">All backups, restores and migrations now live here. Feature‑level Sync/Reset controls have been removed from other pages.</p>
          <p className="mt-2 text-xs opacity-60">Implementation coming this week. For now this is a safe placeholder so routes and links work.</p>
        </div>
      </div>
    </main>
  );
}
