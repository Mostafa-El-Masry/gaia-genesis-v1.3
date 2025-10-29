'use client';

import { useEffect, useState } from 'react';

export default function PowerMenu(){
  const [pinSet, setPinSet] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(()=>{ setPinSet(!!localStorage.getItem('settings_lock_pin')); }, []);

  function doClose(){ window.close(); setTimeout(()=>{ location.href = '/goodbye'; }, 300); }
  function doHide(){ const win = window.open('about:blank','_self'); if (win) win.close(); setTimeout(()=>{ location.href='/' }, 250); }
  function setNewPin(){
    const p = prompt('Set 4-digit PIN (digits only)') || '';
    if (/^\d{4}$/.test(p)){ localStorage.setItem('settings_lock_pin', p); alert('PIN set'); setPinSet(true); }
    else alert('PIN must be 4 digits.');
  }
  function lockNow(){ setShowLock(true); }
  function tryUnlock(){
    const s = localStorage.getItem('settings_lock_pin') || '';
    if (pin===s){ setShowLock(false); setPin(''); } else alert('Wrong PIN');
  }
  function clearSearch(){
    localStorage.removeItem('search_cache_v1');
    localStorage.removeItem('search_prefs_v1');
    alert('Search cache cleared');
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold tracking-wide">Power</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={doClose}>Close GAIA</button>
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={doHide}>Hide Quickly</button>
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={pinSet?lockNow:setNewPin}>{pinSet?'Lock':'Set PIN & Lock'}</button>
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={clearSearch}>Clear Search Cache</button>
      </div>

      {showLock && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80">
          <div className="w-[320px] rounded-xl bg-white p-4 text-center">
            <div className="text-lg font-extrabold">Locked</div>
            <input className="mt-3 w-full rounded-lg border border-black/10 px-3 py-2 text-center text-lg tracking-widest"
                   placeholder="PIN" inputMode="numeric" maxLength={4}
                   value={pin} onChange={e=>setPin(e.target.value)} />
            <div className="mt-3 flex items-center justify-center gap-2">
              <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={tryUnlock}>Unlock</button>
              <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={()=>{setShowLock(false); setPin('');}}>Cancel</button>
            </div>
            <div className="mt-2 text-xs opacity-60">Enter your 4-digit PIN to unlock.</div>
          </div>
        </div>
      )}
    </div>
  );
}
