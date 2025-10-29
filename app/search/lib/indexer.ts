'use client';

import type { SearchIndex, Category } from './types';
import { makeItemFromLS } from './sources';

const CACHE_KEY = 'search_cache_v1';
const PREFS_KEY = 'search_prefs_v1';
const INDEX_VERSION = 1;

export function listAllKeys(): string[] {
  const keys: string[] = [];
  try { for (let i=0;i<localStorage.length;i++){ const k = localStorage.key(i); if (k) keys.push(k); } } catch {}
  return keys.sort();
}

export function buildIndex(): SearchIndex {
  const items = listAllKeys().map(k => makeItemFromLS(k)).filter(Boolean) as any[];
  return { v: INDEX_VERSION, createdAt: new Date().toISOString(), items };
}

export function loadIndex(): SearchIndex | null {
  try { const raw = localStorage.getItem(CACHE_KEY); if (!raw) return null; return JSON.parse(raw) as SearchIndex; } catch { return null; }
}
export function saveIndex(idx: SearchIndex){ localStorage.setItem(CACHE_KEY, JSON.stringify(idx)); }

export function getPrefs(){ try { const raw = localStorage.getItem(PREFS_KEY); if (raw) return JSON.parse(raw); } catch {} return { lastQuery:'', lastCat:'all' }; }
export function setPrefs(p: any){ localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

// tiny scoring: title > tags > text + tiny recency bonus if a date exists
function scoreText(q: string, txt: string, weight=1){
  if (!q || !txt) return 0;
  let s = 0;
  for (const token of q.toLowerCase().split(/\s+/).filter(Boolean)){
    const rx = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const m = txt.toLowerCase().match(rx);
    s += (m?.length || 0) * weight;
  }
  return s;
}

export function runSearch(idx: SearchIndex, query: string, cat: Category){
  const q = (query||'').trim();
  const base = cat==='all' ? idx.items : idx.items.filter((i:any)=> i.cat===cat);
  if (!q) return base.map((i:any)=> ({...i, score: 0}));

  const ranked = base.map((i:any)=>{
    const s = scoreText(q, i.title, 6) + scoreText(q, (i.tags||[]).join(' '), 3) + scoreText(q, i.text, 1);
    const rec = i.date ? 1 : 0;
    return { ...i, score: s + rec };
  }).filter((i:any)=> i.score > 0);

  ranked.sort((a:any,b:any)=> b.score - a.score);
  return ranked;
}
