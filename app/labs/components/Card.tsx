'use client';

import { useEffect, useState } from 'react';
import type { LabProject } from '../lib/types';
import { getCover } from '../lib/store';

export default function Card({ proj, onOpen, onEdit, onDelete }:{ proj:LabProject; onOpen:()=>void; onEdit:()=>void; onDelete:()=>void }){
  const [url, setUrl] = useState<string|undefined>(undefined);
  useEffect(()=>{
    let revoke: string | undefined;
    (async()=>{
      if (!proj.coverId) return;
      const blob = await getCover(proj.coverId);
      if (blob) {
        const u = URL.createObjectURL(blob);
        setUrl(u); revoke = u;
      }
    })();
    return ()=>{ if(revoke) URL.revokeObjectURL(revoke); };
  }, [proj.coverId]);

  return (
    <div className="group rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="aspect-video w-full bg-black/5">
        {url ? <img src={url} alt={proj.title} className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-extrabold">{proj.title}</h3>
          <div className="text-xs rounded bg-black/5 px-2 py-0.5">{proj.category}</div>
        </div>
        <div className="mt-1 text-xs opacity-70">{new Date(proj.dateAdded).toLocaleDateString()} • {proj.views} views</div>
        {proj.tags?.length>0 && <div className="mt-1 flex flex-wrap gap-1">{proj.tags.map(t=>(<span key={t} className="text-[10px] rounded border px-1 py-0.5">{t}</span>))}</div>}
        {proj.summary && <div className="mt-1 text-sm opacity-80 line-clamp-2">{proj.summary}</div>}

        <div className="mt-3 flex items-center justify-between">
          <button onClick={onOpen} className="rounded-lg border px-3 py-1.5 text-sm font-semibold">Open</button>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="rounded-lg border px-2 py-1 text-xs">Edit</button>
            <button onClick={onDelete} className="rounded-lg border px-2 py-1 text-xs">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
