'use client';
export type Section = { id: string; title: string; keys: string[] };
const DEFAULT_PREFIXES = ['wealth_', 'gallery_', 'apollo_', 'timeline_', 'health_', 'labs_', 'gaia_', 'prefs_', 'settings_', 'intro_', 'dashboard_', 'search_', 'sync_'];
export function listAllKeys(): string[] {
  try { const keys: string[] = []; for (let i=0;i<localStorage.length;i++){ const k = localStorage.key(i); if (k) keys.push(k); } return keys.sort(); } catch { return []; }
}
export function groupKeys(keys: string[]): Section[] {
  const by: Record<string, string[]> = {};
  for (const k of keys){
    const pref = DEFAULT_PREFIXES.find(p => k.startsWith(p));
    const bucket = pref ? pref.replace(/_$/,'') : 'other';
    if (!by[bucket]) by[bucket] = [];
    by[bucket].push(k);
  }
  return Object.entries(by).map(([id, ks]) => ({ id, title: id.charAt(0).toUpperCase()+id.slice(1), keys: ks.sort() })).sort((a,b)=> a.id.localeCompare(b.id));
}
export function readSelected(keys: string[]){
  const out: Record<string, any> = {};
  for (const k of keys){
    try { const v = localStorage.getItem(k); if (v!==null) out[k] = JSON.parse(v); }
    catch { const v = localStorage.getItem(k); if (v!==null) out[k] = v; }
  }
  return out;
}
export function applyBundle(bundle: any, mode: 'merge'|'replace' = 'merge'){
  if (!bundle || !bundle.items) throw new Error('Invalid bundle');
  if (mode==='replace'){
    for (const k of Object.keys(bundle.items)){ localStorage.removeItem(k); }
  }
  for (const [k,v] of Object.entries(bundle.items)){ localStorage.setItem(k, JSON.stringify(v)); }
}
