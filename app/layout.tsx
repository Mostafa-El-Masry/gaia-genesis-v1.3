"use client";

import "../styles/global.css";
import { useEffect, useState } from "react";
import type { ReactNode } from 'react';

function fromB64(s: string){ return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
async function deriveKey(password: string, salt: Uint8Array){
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations: 120000, hash:'SHA-256'}, keyMat, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
}
async function decryptJSON(pack: {enc:string; v:number; iv:string; salt:string; data:string}, password: string){
  const iv = fromB64(pack.iv);
  const salt = fromB64(pack.salt);
  const key = await deriveKey(password, salt);
  const ct = fromB64(pack.data);
  const pt = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
  const text = new TextDecoder().decode(pt);
  return JSON.parse(text);
}

function applyBundle(bundle: any){
  if (!bundle) return;
  if (bundle.items && typeof bundle.items === 'object'){
    for (const [k,v] of Object.entries(bundle.items)){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  } else {
    for (const [k,v] of Object.entries(bundle)){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  }
}

async function loadBackupFromPublic(){
  const candidates = [
    '/json/gaia-v1.3-backup.json',
    '/json/backup.json',
    '/json/gaia-backup.json',
  ];
  for (const url of candidates){
    try{
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const raw = await res.json();
      if (raw && raw.enc && raw.data){
        const pwd = localStorage.getItem('settings_boot_backup_password') || localStorage.getItem('settings_backup_password') || '';
        if (!pwd) continue;
        try {
          const dec = await decryptJSON(raw, pwd);
          applyBundle(dec);
          localStorage.setItem('boot_last_loaded', new Date().toISOString());
          localStorage.setItem('boot_last_source', url);
          return true;
        } catch(e){ continue; }
      } else {
        applyBundle(raw);
        localStorage.setItem('boot_last_loaded', new Date().toISOString());
        localStorage.setItem('boot_last_source', url);
        return true;
      }
    } catch (e) { /* try next */ }
  }
  return false;
}

export default function RootLayout({ children }: { children: ReactNode }){
  const [ready, setReady] = useState(false);
  useEffect(()=>{
    let alive = true;
  }, [])
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      try { await loadBackupFromPublic(); } catch {}
      if (alive) setReady(true);
    })();
    return ()=>{ alive = false; };
  }, []);

  return (
    <html lang="en">
      <body className="bg-white text-black">
        {!ready ? (
          <div className="grid min-h-[100svh] place-items-center">
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-wide">GAIA</div>
              <div className="mt-2 text-sm opacity-60">Loading data…</div>
            </div>
          </div>
        ) : children}
      </body>
    </html>
  );
}
