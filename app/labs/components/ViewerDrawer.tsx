'use client';

import { useEffect } from 'react';
import type { LabProject } from '../lib/types';
import { bumpViews } from '../lib/store';

export default function ViewerDrawer({ open, project, onClose }:{ open:boolean; project:LabProject|null; onClose:()=>void }){
  useEffect(()=>{
    if (open && project) bumpViews(project.id);
  }, [open, project]);
  return (
    <div className={"fixed inset-0 z-50 " + (open? "" : "pointer-events-none")}>
      <div className={"absolute inset-0 bg-black/30 transition-opacity " + (open? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={"absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl border-l transition-transform " + (open? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between border-b p-3">
          <div className="font-extrabold">{project?.title ?? '—'}</div>
          <div className="flex items-center gap-2">
            {project?.path && <a className="rounded-lg border px-3 py-1.5 text-sm font-semibold" href={project.path} target="_blank" rel="noreferrer">Open in new tab</a>}
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="p-3">
          {project?.path ? (
            <iframe src={project.path} className="h-[75vh] w-full rounded-lg border" />
          ) : (
            <div className="opacity-60">No path set for this project.</div>
          )}
        </div>
      </div>
    </div>
  );
}
