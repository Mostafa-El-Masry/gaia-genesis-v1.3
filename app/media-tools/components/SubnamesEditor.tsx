'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GalleryManifestV1 } from '../lib/schema';

export default function SubnamesEditor(){
  const [manifest, setManifest] = useState<GalleryManifestV1 | null>(null);
  const [titles, setTitles] = useState<Record<string,string>>({});
  const [filter, setFilter] = useState('');

  useEffect(()=>{
    try{
      const m = localStorage.getItem('gallery_manifest_v1'); if (m) setManifest(JSON.parse(m));
      const t = localStorage.getItem('gallery_titles_v1'); if (t) setTitles(JSON.parse(t));
    }catch{}
  }, []);

  function setTitle(id:string, v:string){
    const next = { ...titles, [id]: v };
    setTitles(next);
    localStorage.setItem('gallery_titles_v1', JSON.stringify(next));
  }

  const items = useMemo(()=>{
    const arr = manifest?.items || [];
    const q = filter.trim().toLowerCase();
    return q ? arr.filter(it => (it.id.toLowerCase().includes(q) || (titles[it.id]||'').toLowerCase().includes(q))) : arr;
  }, [manifest, filter, titles]);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">Subnames (Display titles)</div>
        <input className="rounded border px-2 py-1 text-sm" placeholder="Filter…" value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>

      <div className="grid max-h-[360px] grid-cols-1 gap-2 overflow-auto">
        {items.map(it => (
          <div key={it.id} className="flex items-center gap-3 rounded border border-black/10 p-2">
            <div className="w-40 truncate text-sm opacity-70">{it.id}</div>
            <input className="flex-1 rounded border px-2 py-1 text-sm" placeholder="Display name" value={titles[it.id]||''} onChange={e=>setTitle(it.id, e.target.value)} />
          </div>
        ))}
        {items.length===0 && <div className="text-sm opacity-60">No items (load a manifest first).</div>}
      </div>
    </div>
  );
}
