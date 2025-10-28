'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadTx, saveTx } from '../lib/store';
import type { Transaction } from '../lib/types';
import type { FilterState } from './Filters';

function match(t: Transaction, f: FilterState): boolean {
  if (f.type !== 'All' && t.type !== f.type) return false;
  if (f.category && t.category.toLowerCase() !== f.category.toLowerCase()) return false;
  if (f.q) {
    const hay = [t.note||'', t.category, ...t.tags].join(' ').toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  if (f.from && t.date < new Date(f.from).toISOString()) return false;
  if (f.to && t.date > new Date(f.to + 'T23:59:59').toISOString()) return false;
  return true;
}

function fmt(n: number){ return n.toLocaleString('en-EG', { maximumFractionDigits: 0 }); }

export default function Ledger({ filter }:{ filter: FilterState }){
  const [list, setList] = useState<Transaction[]>([]);
  useEffect(()=>{ setList(loadTx()); }, []);

  const filtered = useMemo(()=> list.filter(t => match(t, filter)).sort((a,b)=> a.date.localeCompare(b.date)), [list, filter]);

  function remove(id: string){
    const next = loadTx().filter(t => t.id !== id); saveTx(next); setList(next);
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold tracking-wide">Ledger</h2>
      <div className="overflow-auto rounded-lg border border-black/10">
        <table className="w-full text-sm">
          <thead className="bg-black/5"><tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Tags</th>
            <th className="p-2 text-left">Note</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2"></th>
          </tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2">{t.tags.join(', ')}</td>
                <td className="p-2">{t.note}</td>
                <td className={"p-2 text-right " + (t.type==='expense'?'text-red-600':'text-emerald-700')}>{fmt(t.amount)}</td>
                <td className="p-2 text-right"><button className="rounded-lg border px-2 py-1 text-xs" onClick={()=>remove(t.id)}>Delete</button></td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td className="p-3 text-center opacity-60" colSpan={7}>No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
