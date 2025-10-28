'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadBudgets, loadTx, saveBudgets } from '../lib/store';
import type { Budget } from '../lib/types';

function monthKey(d: string){ return d.slice(0,7); }
function fmt(n: number){ return n.toLocaleString('en-EG', { maximumFractionDigits: 0 }); }

export default function Budgets(){
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0,7));
  const [list, setList] = useState<Budget[]>([]);
  const [cat, setCat] = useState('General');
  const [amt, setAmt] = useState<number>(0);

  useEffect(()=>{ setList(loadBudgets()); }, []);

  const tx = useMemo(()=> loadTx().filter(t => monthKey(t.date)===month && t.type==='expense'), [month]);

  const byCat = useMemo(()=>{
    const spent: Record<string, number> = {};
    for (const t of tx){ spent[t.category] = (spent[t.category]||0) + t.amount; }
    const curr = list.filter(b => b.month===month);
    return curr.map(b => ({
      ...b,
      spent: spent[b.category] || 0,
    }));
  }, [tx, list, month]);

  function addBudget(){
    const next = [...list.filter(b=>!(b.month===month && b.category.toLowerCase()===cat.toLowerCase())), { month, category: cat, amount: amt } as Budget];
    saveBudgets(next); setList(next); setCat('General'); setAmt(0);
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-wide">Budgets</h2>
        <input type="month" className="rounded-lg border border-black/10 px-3 py-1.5" value={month} onChange={e=>setMonth(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {byCat.map(b => {
          const pct = Math.min(100, Math.round((b.spent / (b.amount||1)) * 100));
          return (
            <div key={b.category} className="rounded-lg border border-black/10 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{b.category}</div>
                <div className="text-sm">{fmt(b.spent)} / {fmt(b.amount)}</div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-black/10">
                <div className={"h-full " + (pct<80?'bg-emerald-500':pct<100?'bg-amber-500':'bg-red-500')} style={{ width: pct + '%' }} />
              </div>
            </div>
          );
        })}
        {byCat.length===0 && <div className="opacity-60">No budgets set for this month.</div>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input className="rounded-lg border border-black/10 px-3 py-1.5" placeholder="Category" value={cat} onChange={e=>setCat(e.target.value)} />
        <input className="rounded-lg border border-black/10 px-3 py-1.5" placeholder="Amount" type="number" value={amt || ''} onChange={e=>setAmt(Number(e.target.value))} />
        <button className="rounded-lg border px-3 py-1.5 text-sm font-semibold" onClick={addBudget}>Add / Update</button>
      </div>
    </section>
  );
}
