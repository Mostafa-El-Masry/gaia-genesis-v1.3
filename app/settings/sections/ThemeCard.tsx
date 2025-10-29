'use client';

import { useEffect, useState } from 'react';

export default function ThemeCard(){
  const [mode, setMode] = useState<'light'|'dark'|'auto'>('auto');
  const [accent, setAccent] = useState('#111111');
  const [scale, setScale] = useState(100);
  const [density, setDensity] = useState<'cozy'|'compact'>('cozy');
  const [glass, setGlass] = useState(6); // blur intensity 0-12

  useEffect(()=>{
    try{
      const m = localStorage.getItem('settings_theme_mode'); if (m) setMode(JSON.parse(m));
      const a = localStorage.getItem('settings_accent'); if (a) setAccent(JSON.parse(a));
      const s = localStorage.getItem('settings_fontScale'); if (s) setScale(JSON.parse(s));
      const d = localStorage.getItem('settings_density'); if (d) setDensity(JSON.parse(d));
      const g = localStorage.getItem('settings_glass'); if (g) setGlass(JSON.parse(g));
    }catch{}
  }, []);

  useEffect(()=>{
    localStorage.setItem('settings_theme_mode', JSON.stringify(mode));
    localStorage.setItem('settings_accent', JSON.stringify(accent));
    localStorage.setItem('settings_fontScale', JSON.stringify(scale));
    localStorage.setItem('settings_density', JSON.stringify(density));
    localStorage.setItem('settings_glass', JSON.stringify(glass));
    // apply minimal CSS vars on <html>
    const html = document.documentElement;
    html.style.setProperty('--gaia-accent', accent);
    html.style.setProperty('--gaia-font-scale', (scale/100).toString());
    html.style.setProperty('--gaia-density', density);
    html.style.setProperty('--gaia-glass', String(glass));
  }, [mode, accent, scale, density, glass]);

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">Appearance</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3">
          <span className="text-sm">Theme</span>
          <select value={mode} onChange={e=>setMode(e.target.value as any)} className="rounded border px-2 py-1 text-sm">
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3">
          <span className="text-sm">Accent</span>
          <input type="color" value={accent} onChange={e=>setAccent(e.target.value)} className="h-8 w-14 rounded border" />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3">
          <span className="text-sm">Font scale</span>
          <input type="range" min={90} max={120} value={scale} onChange={e=>setScale(Number(e.target.value))} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3">
          <span className="text-sm">Density</span>
          <select value={density} onChange={e=>setDensity(e.target.value as any)} className="rounded border px-2 py-1 text-sm">
            <option value="cozy">Cozy</option>
            <option value="compact">Compact</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3 sm:col-span-2">
          <span className="text-sm">Glass intensity</span>
          <input type="range" min={0} max={12} value={glass} onChange={e=>setGlass(Number(e.target.value))} />
        </label>
      </div>
    </section>
  );
}
