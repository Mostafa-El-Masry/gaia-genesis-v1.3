'use client';

import { useCallback, useState } from 'react';
import {
  exportAll,
  importAll,
  loadBody,
  loadHabits,
  loadInsulin,
  loadLogs,
  loadPlans,
  loadRecords,
} from '../lib/store';

type Snapshot = {
  records: number;
  habits: number;
  insulin: number;
  body: number;
  plans: number;
  workouts: number;
};

function takeSnapshot(): Snapshot {
  return {
    records: loadRecords().length,
    habits: loadHabits().length,
    insulin: loadInsulin().length,
    body: loadBody().length,
    plans: loadPlans().length,
    workouts: loadLogs().length,
  };
}

export default function ExportImport() {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => takeSnapshot());
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    setSnapshot(takeSnapshot());
  }, []);

  function handleExport() {
    exportAll();
    setStatus(`Exported ${new Date().toLocaleTimeString()}`);
  }

  async function handleImport() {
    setBusy(true);
    setStatus('Importing...');
    try {
      let didImport = false;
      await importAll(() => {
        didImport = true;
        refresh();
      });
      setStatus(
        didImport ? `Import complete ${new Date().toLocaleTimeString()}` : 'Import canceled'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <header className="mb-2">
        <h2 className="text-lg font-extrabold tracking-wide">Export / Import</h2>
        <p className="text-sm opacity-70">
          Download a backup of your health data (photos are stored separately) or import a JSON
          export to restore it.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
          type="button"
          onClick={handleExport}
          disabled={busy}
        >
          Download export
        </button>
        <button
          className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
          type="button"
          onClick={handleImport}
          disabled={busy}
        >
          {busy ? 'Importing...' : 'Import from file'}
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Daily records</dt>
          <dd className="text-base font-bold">{snapshot.records}</dd>
        </div>
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Habits</dt>
          <dd className="text-base font-bold">{snapshot.habits}</dd>
        </div>
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Insulin entries</dt>
          <dd className="text-base font-bold">{snapshot.insulin}</dd>
        </div>
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Body metrics</dt>
          <dd className="text-base font-bold">{snapshot.body}</dd>
        </div>
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Exercise plan items</dt>
          <dd className="text-base font-bold">{snapshot.plans}</dd>
        </div>
        <div className="rounded-lg border border-black/10 p-2">
          <dt className="font-semibold opacity-70">Workout logs</dt>
          <dd className="text-base font-bold">{snapshot.workouts}</dd>
        </div>
      </dl>

      {status && <p className="mt-3 text-xs uppercase tracking-wide opacity-60">{status}</p>}
    </section>
  );
}
