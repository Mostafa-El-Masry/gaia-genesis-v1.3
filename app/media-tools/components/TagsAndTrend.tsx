'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GalleryManifestV1, ManifestItem } from '../lib/schema';

function trendScore(it: ManifestItem){
  const views = Number(it.views||0);
  const days = Math.max(0, (Date.now() - new Date(it.addedAt).getTime()) / 86400000);
  return views / (1 + days/7);
}

export default function TagsAndTrend(){
  const [manifest, setManifest] = useState<GalleryManifestV1 | null>(null);
  const [q, setQ] = useState('');

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('gallery_manifest_v1'); if (raw) setManifest(JSON.parse(raw));
    }catch{}
  }, []);

  function update(it: ManifestItem, patch: Partial<ManifestItem>){
    if (!manifest) return;
    const items = manifest.items.map(x => x.id===it.id ? { ...x, ...patch } : x);
    const m = { ...manifest, items };
    setManifest(m);
    localStorage.setItem('gallery_manifest_v1', JSON.stringify(m));
  }

  const list = useMemo(()=>{
    const arr = manifest?.items || [];
    const qq = q.trim().toLowerCase();
    const filtered = qq ? arr.filter(i => (i.id.toLowerCase().includes(qq) || (i.tags||[]).join(' ').toLowerCase().includes(qq))) : arr;
    return filtered.map(i => ({ item: i, score: trendScore(i) })).sort((a,b)=> b.score - a.score).slice(0, 50);
  }, [manifest, q]);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">Tags & Trend (Top 50 by score)</div>
        <input className="rounded border px-2 py-1 text-sm" placeholder="Filter…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="grid max-h-[360px] grid-cols-1 gap-2 overflow-auto">
        {list.map(({item, score}) => (
          <div key={item.id} className="rounded border border-black/10 p-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{item.id}</div>
              <div className="opacity-60">score {score.toFixed(2)} • views {item.views||0}</div>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <input className="w-24 rounded border px-2 py-1" type="number" min={0} value={item.views||0} onChange={e=>update(item, { views: Number(e.target.value) })} />
              <input className="flex-1 rounded border px-2 py-1" placeholder="tags (space or comma separated)" value={(item.tags||[]).join(', ')} onChange={e=>update(item, { tags: e.target.value.split(/[,\s]+/).filter(Boolean) })} />
            </div>
          </div>
        ))}
        {(!manifest || manifest.items.length===0) && <div className="text-sm opacity-60">No items (load a manifest first).</div>}
      </div>
    </div>
  );
}
