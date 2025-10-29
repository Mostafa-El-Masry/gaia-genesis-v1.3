'use client';

import type { Category, SearchItem } from './types';

// key prefix → category + default route
const PREFIX: Record<string, {cat: Category, route?: string}> = {
  apollo_:    { cat: 'apollo',   route: '/apollo'   },
  timeline_:  { cat: 'timeline', route: '/timeline' },
  health_:    { cat: 'health',   route: '/health'   },
  labs_:      { cat: 'labs',     route: '/labs'     },
  gallery_:   { cat: 'gallery',  route: '/gallery'  },
  wealth_:    { cat: 'wealth',   route: '/wealth'   },
  settings_:  { cat: 'settings', route: '/settings' },
  intro_:     { cat: 'intro',    route: '/'         },
  gaia_:      { cat: 'other',    route: '/'         },
};

function detectPrefix(key: string){
  const k = key.toLowerCase();
  const pref = Object.keys(PREFIX).find(p => k.startsWith(p));
  return pref ? PREFIX[pref] : { cat: 'other' as const, route: undefined };
}

// flatten object to strings for matching/snippet
function flatten(v: any, out: string[]){
  if (v == null) return;
  const t = typeof v;
  if (t==='string' || t==='number' || t==='boolean') out.push(String(v));
  else if (Array.isArray(v)) v.forEach(x=>flatten(x,out));
  else if (t==='object') Object.values(v).forEach(x=>flatten(x,out));
}

export function makeItemFromLS(key: string): SearchItem | null {
  try{
    const meta = detectPrefix(key);
    const raw = localStorage.getItem(key);
    if (raw==null) return null;

    let obj: any = null;
    try { obj = JSON.parse(raw); } catch {}

    const frags: string[] = [];
    if (obj) flatten(obj, frags); else frags.push(raw);

    let title = (obj?.title || obj?.name || obj?.heading || '').toString();
    if (!title) title = key.replace(/[_-]/g,' ');

    const date = (obj?.date || obj?.createdAt || obj?.updatedAt || obj?.when || '').toString() || undefined;
    const text = frags.join(' ').slice(0, 4000);
    const snippet = text.slice(0, 220);

    return { id:key, key, cat:meta.cat, route:meta.route, title, text, snippet, date, tags:Array.isArray(obj?.tags)?obj.tags:undefined };
  }catch{ return null; }
}
