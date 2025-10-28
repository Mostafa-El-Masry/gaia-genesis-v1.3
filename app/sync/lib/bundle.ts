'use client';

import { listAllKeys, groupKeys, readSelected } from './gather';

export function buildBundle(selectedKeys: string[]){
  const now = new Date().toISOString();
  const items = readSelected(selectedKeys);
  return {
    schema: 'gaia-1.3',
    createdAt: now,
    deviceId: navigator.userAgent,
    itemCount: Object.keys(items).length,
    items
  };
}

export function saveJSON(obj: any, filename: string){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 0);
}
