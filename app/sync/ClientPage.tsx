'use client';

import { useEffect } from 'react';

export default function LegacySyncRedirect(){
  useEffect(()=>{ location.replace('/settings#backup'); }, []);
  return (
    <main className="grid min-h-[100svh] place-items-center bg-white text-black p-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Sync moved</h1>
        <p className="mt-2 text-sm opacity-70">Redirecting to <code>/settings#backup</code>…</p>
      </div>
    </main>
  );
}
