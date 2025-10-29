'use client';

import Link from 'next/link';

export default function ResultItem({
  title, snippet, route, anchor, keyName, score
}:{ title:string; snippet?:string; route?:string; anchor?:string; keyName:string; score?:number }){
  const href = route ? (anchor ? route + anchor : route) : undefined;
  return (
    <div className="rounded-lg border border-black/10 p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-60">{keyName}</div>
      </div>
      {snippet && <div className="mt-1 break-words text-sm opacity-80">{snippet}</div>}
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs opacity-60">Score: {score ?? 0}</div>
        {href ? <Link href={href} className="rounded border px-2 py-1 text-xs">Open</Link> : <span className="text-xs opacity-60">No route</span>}
      </div>
    </div>
  );
}
