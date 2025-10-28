"use client";

import { useMemo, useState } from "react";
import { simulate } from "../lib/sim";
import type { SimInput, SimResult } from "../lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

export default function Simulator() {
  const [tab, setTab] = useState<"A" | "B">("A");

  // Make the simulation inputs editable for each plan so deposits can be changed
  const [baseA, setBaseA] = useState<SimInput>({
    startYear: 2025,
    startMonthIndex: 11,
    yearsOfDeposits: 7,
    baseMonthlyDeposit: 25000,
    minReinvest: 1000,
  });
  const [baseB, setBaseB] = useState<SimInput>({
    startYear: 2025,
    startMonthIndex: 11,
    yearsOfDeposits: 7,
    baseMonthlyDeposit: Math.round(25000 / 4),
    minReinvest: 1000,
  });

  const resA: SimResult = useMemo(() => simulate("Plan A", baseA), [baseA]);
  const resB: SimResult = useMemo(() => simulate("Plan B", baseB), [baseB]);

  const res = tab === "A" ? resA : resB;

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold tracking-wide">
              Savings Simulator
            </h2>
            <span className="text-xs rounded bg-black/5 px-2 py-0.5">
              3y certs; 15%→10% floor; reinvest interest & maturities until age
              60
            </span>
          </div>
          <div className="text-xs opacity-70">
            Start: Dec 2025. Deposits for 7 years, then auto‑reinvest monthly if
            ≥ 1,000 EGP.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={
              "rounded-lg border px-3 py-1.5 text-sm font-semibold " +
              (tab === "A" ? "bg-black text-white" : "")
            }
            onClick={() => setTab("A")}
          >
            Plan A — {fmt(baseA.baseMonthlyDeposit)}/mo
          </button>
          <button
            className={
              "rounded-lg border px-3 py-1.5 text-sm font-semibold " +
              (tab === "B" ? "bg-black text-white" : "")
            }
            onClick={() => setTab("B")}
          >
            Plan B — {fmt(baseB.baseMonthlyDeposit)}/mo
          </button>
        </div>
      </header>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs">Plan A deposit</label>
          <input
            className="rounded-lg border border-black/10 px-3 py-1.5 w-40"
            type="number"
            value={baseA.baseMonthlyDeposit}
            onChange={(e) =>
              setBaseA({
                ...baseA,
                baseMonthlyDeposit: Number(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">Plan B deposit</label>
          <input
            className="rounded-lg border border-black/10 px-3 py-1.5 w-32"
            type="number"
            value={baseB.baseMonthlyDeposit}
            onChange={(e) =>
              setBaseB({
                ...baseB,
                baseMonthlyDeposit: Number(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-black/10">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="p-2 text-left">Year</th>
              <th className="p-2 text-left">Age</th>
              <th className="p-2 text-right">Deposited YTD</th>
              <th className="p-2 text-right">Monthly Interest (Dec)</th>
              <th className="p-2 text-right">Active Principal (Dec)</th>
              <th className="p-2 text-right">Cash (Dec)</th>
              <th className="p-2 text-right">Net Worth (Dec)</th>
            </tr>
          </thead>
          <tbody>
            {res.rows.map((r) => (
              <tr key={r.year} className="border-t">
                <td className="p-2">{r.year}</td>
                <td className="p-2">{r.age}</td>
                <td className="p-2 text-right">{fmt(r.depositsYTD)}</td>
                <td className="p-2 text-right">{fmt(r.monthlyInterestDec)}</td>
                <td className="p-2 text-right">{fmt(r.activePrincipalEnd)}</td>
                <td className="p-2 text-right">{fmt(r.cashEnd)}</td>
                <td className="p-2 text-right font-semibold">
                  {fmt(r.netWorthEnd)}
                </td>
              </tr>
            ))}
            {res.rows.length === 0 && (
              <tr>
                <td className="p-3 text-center opacity-60" colSpan={7}>
                  No rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-xs opacity-70">Deposited total</div>
          <div className="text-lg font-extrabold">
            {fmt(res.totals.deposited)} EGP
          </div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-xs opacity-70">Active principal (end)</div>
          <div className="text-lg font-extrabold">
            {fmt(res.totals.activePrincipal)} EGP
          </div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-xs opacity-70">Cash (end)</div>
          <div className="text-lg font-extrabold">
            {fmt(res.totals.cash)} EGP
          </div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="text-xs opacity-70">Net worth (end)</div>
          <div className="text-lg font-extrabold">
            {fmt(res.totals.netWorth)} EGP
          </div>
        </div>
      </div>
    </section>
  );
}
