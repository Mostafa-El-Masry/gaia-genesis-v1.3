'use client';

import { useMemo } from 'react';
import Simulator from './components/Simulator';
import WealthLevels from './components/WealthLevels';
import { simulate } from './lib/sim';

export default function WealthPage(){
  const simA = useMemo(()=>simulate('Plan A', { startYear: 2025, startMonthIndex: 11, yearsOfDeposits: 7, baseMonthlyDeposit: 25000, minReinvest: 1000 }), []);
  const simB = useMemo(()=>simulate('Plan B', { startYear: 2025, startMonthIndex: 11, yearsOfDeposits: 7, baseMonthlyDeposit: Math.round(25000/4), minReinvest: 1000 }), []);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-wide">Wealth — Week 6</h1>
        </div>

        <Simulator />
        <WealthLevels />
        {/* Export/Import moved to /sync (centralized). */}
      </div>
    </main>
  );
}
