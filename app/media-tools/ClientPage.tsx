'use client';

import ManifestBuilder from './components/ManifestBuilder';
import SubnamesEditor from './components/SubnamesEditor';
import TagsAndTrend from './components/TagsAndTrend';
import PreviewsHelper from './components/PreviewsHelper';

export default function MediaToolsPage(){
  return (
    <main className="min-h-screen bg-white text-black">
      {/* GAIA back to intro */}
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <h1 className="text-2xl font-extrabold tracking-wide">Media Tools</h1>
        <p className="text-sm opacity-70">Build a single gallery manifest, edit display names, manage tags & trend score, and test preview thumbnails. All local-first.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <ManifestBuilder />
          <SubnamesEditor />
          <TagsAndTrend />
          <PreviewsHelper />
        </div>
      </div>
    </main>
  );
}
