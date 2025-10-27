'use client';

import { useEffect, useState } from 'react';
import type { HealthRecord } from '../lib/types';
import { loadRecords, upsertRecord, todayLocal } from '../lib/store';

export default function TodayQuick(){
  const [date, setDate] = useState<string>(todayLocal());
  const [rec, setRec] = useState<HealthRecord>({ date });

  useEffect(()=>{ const r = loadRecords().find(x=>x.date===date); setRec(r||{date}); }, [date]);

  function patch(p: Partial<HealthRecord>){
    const next = { ...rec, ...p, date };
    setRec(next); upsertRecord(next);
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold tracking-wide">Today</h2>
        <input type="date" className="rounded-lg border border-black/10 px-3 py-1.5" value={date} onChange={e=>setDate(e.target.value)} />
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-sm font-semibold opacity-70">Water</div>
          <div className="mt-1 flex items-center gap-3">
            <div className="text-xl font-bold">{rec.waterMl ?? 0} ml</div>
            <button className="rounded-lg border px-3 py-1.5 text-sm font-semibold" onClick={()=>patch({ waterMl: (rec.waterMl ?? 0) + 250 })}>+250 ml</button>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={()=>patch({ waterMl: 0 })}>Reset</button>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-sm font-semibold opacity-70">Sleep</div>
          <div className="mt-1 flex items-center gap-3">
            <input type="number" min={0} step="0.5" className="w-24 rounded-lg border border-black/10 px-3 py-1.5" value={rec.sleepHrs ?? ''} onChange={e=>patch({ sleepHrs: e.target.value===''? undefined : Number(e.target.value) })} />
            <div className="text-sm opacity-70">hours</div>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-sm font-semibold opacity-70">Mood / Energy</div>
          <div className="mt-1 flex items-center gap-2">
            {[1,2,3,4,5].map(n=>(
              <button key={'m'+n} className={'rounded-lg border px-3 py-1.5 text-sm font-semibold ' + (rec.mood===n?'bg-black text-white':'')} onClick={()=>patch({ mood:n })}>{n}</button>
            ))}
            <span className="mx-2 opacity-60">/</span>
            {[1,2,3,4,5].map(n=>(
              <button key={'e'+n} className={'rounded-lg border px-3 py-1.5 text-sm font-semibold ' + (rec.energy===n?'bg-black text-white':'')} onClick={()=>patch({ energy:n })}>{n}</button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3 rounded-lg border border-black/10 p-3">
          <div className="text-sm font-semibold opacity-70">Notes</div>
          <input className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5" value={rec.notes ?? ''} onChange={e=>patch({ notes: e.target.value })} placeholder="Free text..." />
        </div>
      </div>
    </section>
  );
}
