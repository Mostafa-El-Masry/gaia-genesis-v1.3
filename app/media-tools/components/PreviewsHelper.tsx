'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GalleryManifestV1 } from '../lib/schema';

export default function PreviewsHelper(){
  const [manifest, setManifest] = useState<GalleryManifestV1 | null>(null);
  const [id, setId] = useState('');
  const [base, setBase] = useState('/gallery/previews');
  const [count, setCount] = useState(6);

  useEffect(()=>{
    try{ const m = localStorage.getItem('gallery_manifest_v1'); if (m) setManifest(JSON.parse(m)); }catch{}
  }, []);

  const exists = useMemo(()=> {
    const ids = new Set(manifest?.items.map(i=>i.id) || []);
    return ids.has(id);
  }, [manifest, id]);

  const thumbs = useMemo(()=>{
    const out: string[] = [];
    for (let i=1;i<=count;i++){
      const nn = String(i).padStart(3,'0');
      out.push(`${base}/${id}_${nn}.jpg`);
    }
    return out;
  }, [id, base, count]);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 font-semibold">Previews Helper</div>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="flex items-center justify-between gap-2 rounded border border-black/10 p-2">
          <span className="text-sm">Item ID</span>
          <input className="w-48 rounded border px-2 py-1 text-sm" value={id} onChange={e=>setId(e.target.value)} placeholder="e.g. video123" />
        </label>
        <label className="flex items-center justify-between gap-2 rounded border border-black/10 p-2">
          <span className="text-sm">Base folder</span>
          <input className="w-48 rounded border px-2 py-1 text-sm" value={base} onChange={e=>setBase(e.target.value)} />
        </label>
        <label className="flex items-center justify-between gap-2 rounded border border-black/10 p-2">
          <span className="text-sm">Count</span>
          <input className="w-24 rounded border px-2 py-1 text-sm" type="number" min={1} max={12} value={count} onChange={e=>setCount(Number(e.target.value))} />
        </label>
      </div>

      <div className="mt-2 text-xs opacity-60">{exists ? 'ID found in manifest' : (id ? 'ID not in manifest' : 'Enter an ID')}</div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {thumbs.map((t,i)=>(
          <div key={t} className="aspect-square overflow-hidden rounded border border-black/10 bg-black/5">
            <img src={t} alt={`thumb ${i+1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
