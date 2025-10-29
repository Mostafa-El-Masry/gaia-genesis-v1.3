'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Intro with a single "glass" search chip.
 * Hover or click to expand, type, and press Enter to jump to /search?q=…
 * No extra links or UI here (keeps intro clean).
 */
export default function IntroGlassOnly(){
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  function submit(){
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  return (
    <main className="grid min-h-[100svh] place-items-center bg-white text-black p-6">
      <div className="relative">
        {/* Glass chip container */}
        <div
          className="group relative flex items-center gap-2 rounded-full border border-black/10 bg-white/10
                     p-3 backdrop-blur-lg transition-all duration-300 hover:border-black/20"
          onMouseEnter={()=>setOpen(true)}
          onMouseLeave={()=>{ if(!q) setOpen(false);}}
          onClick={()=>setOpen(true)}
        >
          {/* Glass circle */}
          <div className="grid h-14 w-14 place-items-center rounded-full border border-black/10 bg-white/20 backdrop-blur">
            <span className="text-xl font-black tracking-tight">G</span>
          </div>

          {/* Expanding input */}
          <div
            className={"overflow-hidden transition-all duration-300 " + (open ? "w-[60vw] max-w-[640px]" : "w-0")}
          >
            <input
              autoFocus={open}
              value={q}
              onChange={e=>setQ(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') submit(); }}
              placeholder="Search GAIA…"
              className="w-full rounded-full border border-black/10 bg-white/70 px-5 py-3 text-lg outline-none
                         placeholder:text-black/50 focus:border-black/30"
            />
          </div>

          {/* Submit */}
          {open && (
            <button
              onClick={submit}
              className="shrink-0 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold hover:border-black/30"
              aria-label="Search"
            >
              Go
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
