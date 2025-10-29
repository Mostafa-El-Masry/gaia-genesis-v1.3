'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GalleryManifestV1, ManifestItem } from '../lib/schema';

function isImage(name:string){ return /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(name); }
function isVideo(name:string){ return /\.(mp4|webm|mov|m4v)$/i.test(name); }

function dedupe(items: ManifestItem[]): ManifestItem[]{
  const seen = new Set<string>(); const out: ManifestItem[] = [];
  for (const it of items){
    if (seen.has(it.id)) continue;
    seen.add(it.id); out.push(it);
  }
  return out;
}

export default function ManifestBuilder(){
  const [manifest, setManifest] = useState<GalleryManifestV1 | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');

  useEffect(()=>{
    const raw = localStorage.getItem('gallery_manifest_v1');
    if (raw){ try{ setManifest(JSON.parse(raw)); }catch{} }
  }, []);

  function loadFromText(){
    try{
      const obj = JSON.parse(jsonText);
      if (obj.schema==='gallery_manifest_v1'){
        setManifest(obj);
        localStorage.setItem('gallery_manifest_v1', JSON.stringify(obj));
        setStatus('Loaded manifest from pasted JSON.');
      } else if (obj.items) {
        const m = { schema:'gallery_manifest_v1', createdAt:new Date().toISOString(), items: obj.items as ManifestItem[] };
        setManifest(m);
        localStorage.setItem('gallery_manifest_v1', JSON.stringify(m));
        setStatus('Loaded generic items → manifest.');
      } else {
        setStatus('JSON missing schema/items.');
      }
    }catch{ setStatus('Invalid JSON.'); }
  }

  async function selectFolder(){
    if (!('showDirectoryPicker' in window)){ alert('Your browser does not support folder selection. Use JSON paste/import.'); return; }
    try{
      const dir = await (window as any).showDirectoryPicker();
      const items: ManifestItem[] = [];
      for await (const entry of dir.values()){
        if (entry.kind !== 'file') continue;
        const name = entry.name as string;
        const file = await entry.getFile();
        const src = '/gallery/' + name; // user should place files under public/gallery
        const id = name.replace(/\.[^.]+$/, '');
        if (isImage(name)){
          items.push({ id, type:'image', src, addedAt: new Date(file.lastModified || Date.now()).toISOString() });
        } else if (isVideo(name)){
          items.push({ id, type:'video', src, addedAt: new Date(file.lastModified || Date.now()).toISOString() });
        }
      }
      const merged = dedupe([...(manifest?.items||[]), ...items]).sort((a,b)=> (a.addedAt>b.addedAt?-1:1));
      const m: GalleryManifestV1 = { schema:'gallery_manifest_v1', createdAt:new Date().toISOString(), items: merged };
      setManifest(m);
      localStorage.setItem('gallery_manifest_v1', JSON.stringify(m));
      setStatus('Scanned folder and merged into manifest (local).');
    }catch(e){ setStatus('Folder selection cancelled.'); }
  }

  function exportManifest(){
    if (!manifest){ alert('No manifest to export'); return; }
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[-:T]/g,'').slice(0, 15);
    a.href = URL.createObjectURL(blob);
    a.download = `manifest-${ts}.json`;
    a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 0);
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">Manifest Builder</div>
        <div className="text-xs opacity-60">{manifest ? `Items: ${manifest.items.length}` : 'No manifest'}</div>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={selectFolder}>Select Folder (optional)</button>
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={exportManifest}>Export manifest.json</button>
        {status && <span className="text-sm text-amber-700">{status}</span>}
      </div>

      <textarea className="h-28 w-full rounded-lg border border-black/10 p-2 text-sm" placeholder="Paste manifest JSON here (or generic {items:[...]})" value={jsonText} onChange={e=>setJsonText(e.target.value)} />
      <div className="mt-2">
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={loadFromText}>Load from JSON</button>
      </div>
    </div>
  );
}
