'use client';

import { loadTx, loadBudgets, loadGoals, loadNetItems, loadNetSnaps, saveTx, saveBudgets, saveGoals, saveNetItems, saveNetSnaps } from '../lib/store';

export default function ExportImport(){
  function doExport(){
    const payload = {
      tx: loadTx(),
      budgets: loadBudgets(),
      goals: loadGoals(),
      netItems: loadNetItems(),
      netSnaps: loadNetSnaps(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gaia-wealth-data.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 0);
  }
  async function doImport(){
    const input = document.createElement('input');
    input.type = 'file'; input.accept='application/json';
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return;
      const text = await f.text();
      try {
        const obj = JSON.parse(text);
        if (obj.tx) saveTx(obj.tx);
        if (obj.budgets) saveBudgets(obj.budgets);
        if (obj.goals) saveGoals(obj.goals);
        if (obj.netItems) saveNetItems(obj.netItems);
        if (obj.netSnaps) saveNetSnaps(obj.netSnaps);
        alert('Imported.');
      } catch { alert('Invalid JSON'); }
    };
    input.click();
  }
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold tracking-wide">Export / Import</h2>
      <div className="flex items-center gap-2">
        <button onClick={doExport} className="rounded-lg border px-3 py-1.5 text-sm font-semibold">Export JSON</button>
        <button onClick={doImport} className="rounded-lg border px-3 py-1.5 text-sm">Import JSON</button>
      </div>
    </section>
  );
}
