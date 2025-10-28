"use client";

import { useEffect, useMemo, useState } from "react";
import { loadGoals, saveGoals, nid } from "../lib/store";
import type { Goal } from "../lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

export default function Goals() {
  const [list, setList] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState<number>(0);

  useEffect(() => {
    setList(loadGoals());
  }, []);

  function add() {
    if (!title || !target) return;
    const next = [...list, { id: nid(), title, target, saved: 0 }];
    saveGoals(next);
    setList(next);
    setTitle("");
    setTarget(0);
  }
  function adjust(id: string, delta: number) {
    const next = list.map((g) =>
      g.id === id ? { ...g, saved: Math.max(0, g.saved + delta) } : g
    );
    saveGoals(next);
    setList(next);
  }
  function remove(id: string) {
    const next = list.filter((g) => g.id !== id);
    saveGoals(next);
    setList(next);
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold tracking-wide">Goals</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => {
          const pct = Math.min(
            100,
            Math.round((g.saved / (g.target || 1)) * 100)
          );
          return (
            <div key={g.id} className="rounded-lg border border-black/10 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm">
                  {fmt(g.saved)} / {fmt(g.target)}
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-black/10">
                <div className="h-full bg-black" style={{ width: pct + "%" }} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="rounded-lg border px-2 py-1 text-xs"
                  onClick={() => adjust(g.id, 1000)}
                >
                  +1k
                </button>
                <button
                  className="rounded-lg border px-2 py-1 text-xs"
                  onClick={() => adjust(g.id, -1000)}
                >
                  -1k
                </button>
                <button
                  className="ml-auto rounded-lg border px-2 py-1 text-xs"
                  onClick={() => remove(g.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <div className="opacity-60">No goals yet.</div>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="rounded-lg border border-black/10 px-3 py-1.5"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded-lg border border-black/10 px-3 py-1.5"
          placeholder="Target amount"
          type="number"
          value={target ?? ""}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
        <button
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
          onClick={add}
        >
          Add Goal
        </button>
      </div>
    </section>
  );
}
