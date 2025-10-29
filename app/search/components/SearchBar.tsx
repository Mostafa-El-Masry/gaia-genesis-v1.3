'use client';

import { useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange }:{ value:string; onChange:(v:string)=>void }){
  const ref = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); ref.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <input
      ref={ref}
      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-black/30"
      placeholder="Search GAIA… (Ctrl/⌘+K)"
      value={value}
      onChange={e=>onChange(e.target.value)}
    />
  );
}
