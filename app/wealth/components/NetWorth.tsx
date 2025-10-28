"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadNetItems,
  saveNetItems,
  loadNetSnaps,
  saveNetSnaps,
  nid,
} from "../lib/store";
import type { NetItem, NetSnapshot } from "../lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

export default function NetWorth() {
  const [items, setItems] = useState<NetItem[]>([]);
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [snaps, setSnaps] = useState<NetSnapshot[]>([]);

  const [name, setName] = useState("Cash");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    setItems(loadNetItems());
    setSnaps(loadNetSnaps());
  }, []);

  const total = useMemo(() => items.reduce((s, i) => s + i.amount, 0), [items]);

  function add() {
    const next = [...items, { id: nid(), name, amount }];
    saveNetItems(next);
    setItems(next);
    setName("Cash");
    setAmount(0);
  }
  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    saveNetItems(next);
    setItems(next);
  }
  function snapshot() {
    const next = [...snaps.filter((s) => s.month !== month), { month, total }];
    saveNetSnaps(next);
    setSnaps(next);
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-wide">Net Worth</h2>
        <div className="flex items-center gap-2">
          <input
            className="rounded-lg border border-black/10 px-3 py-1.5"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            className="rounded-lg border px-3 py-1.5 text-sm"
            onClick={snapshot}
          >
            Snapshot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-3">
          <div className="font-semibold">Items</div>
          <div className="mt-2 flex items-center gap-2">
            <input
              className="rounded-lg border border-black/10 px-3 py-1.5"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-lg border border-black/10 px-3 py-1.5"
              placeholder="Amount (+/-)"
              type="number"
              value={amount ?? ""}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button
              className="rounded-lg border px-3 py-1.5 text-sm"
              onClick={add}
            >
              Add
            </button>
          </div>
          <div className="mt-2 rounded-lg border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-black/5">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="p-2">{i.name}</td>
                    <td className="p-2 text-right">{fmt(i.amount)}</td>
                    <td className="p-2 text-right">
                      <button
                        className="rounded-lg border px-2 py-1 text-xs"
                        onClick={() => remove(i.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="p-3 text-center opacity-60" colSpan={3}>
                      No items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right text-sm">
            Total: <span className="font-bold">{fmt(total)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-black/10 p-3">
          <div className="font-semibold">Snapshots</div>
          <div className="mt-2 rounded-lg border border-black/10">
            <table className="w-full text-sm">
              <thead className="bg-black/5">
                <tr>
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {snaps
                  .sort((a, b) => a.month.localeCompare(b.month))
                  .map((s) => (
                    <tr key={s.month} className="border-t">
                      <td className="p-2">{s.month}</td>
                      <td className="p-2 text-right">{fmt(s.total)}</td>
                    </tr>
                  ))}
                {snaps.length === 0 && (
                  <tr>
                    <td className="p-3 text-center opacity-60" colSpan={2}>
                      No snapshots yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
