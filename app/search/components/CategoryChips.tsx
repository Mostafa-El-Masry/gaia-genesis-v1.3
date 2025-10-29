'use client';

import type { Category } from '../lib/types';

const CATS: {id:Category; label:string}[] = [
  { id:'all', label:'All' }, { id:'apollo', label:'Apollo' }, { id:'gallery', label:'Gallery' },
  { id:'labs', label:'Labs' }, { id:'health', label:'Health' }, { id:'wealth', label:'Wealth' },
  { id:'timeline', label:'Timeline' }, { id:'settings', label:'Settings' }, { id:'intro', label:'Intro' }, { id:'other', label:'Other' },
];

export default function CategoryChips({ value, onChange }:{ value:Category; onChange:(c:Category)=>void }){
  return (
    <div className="flex flex-wrap items-center gap-2">
      {CATS.map(c => (
        <button key={c.id}
          className={'rounded-lg border px-3 py-1.5 text-sm ' + (value===c.id ? 'bg-black text-white' : '')}
          onClick={()=>onChange(c.id)}
        >{c.label}</button>
      ))}
    </div>
  );
}
