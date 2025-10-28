'use client';

import { useMemo, useState } from 'react';
import QuickAdd from './components/QuickAdd';
import Filters, { type FilterState } from './components/Filters';
import Ledger from './components/Ledger';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import NetWorth from './components/NetWorth';
import Simulator from './components/Simulator';
import WealthLevels from './components/WealthLevels';
import ExportImport from './components/ExportImport';

export default function WealthPage(){
  const [filter, setFilter] = useState<FilterState>({ q:'', type:'All', category:'' });

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-wide">Wealth — Week 6</h1>
        </div>

        <QuickAdd />
        <Filters onChange={setFilter} />
        <Budgets />
        <Ledger filter={filter} />
        <Goals />
        <NetWorth />
        <Simulator />
        <WealthLevels />
        <ExportImport />
      </div>
    </main>
  );
}
