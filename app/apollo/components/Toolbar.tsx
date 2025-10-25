"use client";

import { exportJSON, importJSON } from "../lib/store";

const buttonStyles =
  "inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50";
// Primary button explicitly sets bg and text to avoid accidental overrides and ensure contrast
const primaryButton =
  "inline-flex items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200";

export default function Toolbar({
  onNewSection,
}: {
  onNewSection: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
      <button className={primaryButton} onClick={onNewSection}>
        New section (N)
      </button>
      <span className="ml-auto flex-1 text-right text-xs font-medium uppercase tracking-[0.25em] text-slate-300 max-sm:hidden">
        Archive tools
      </span>
      <button
        className={buttonStyles}
        onClick={() =>
          exportJSON(
            JSON.parse(
              localStorage.getItem("gaia_apollo_v1_notes") || '{"topics":[]}'
            )
          )
        }
      >
        Export
      </button>
      <button className={buttonStyles} onClick={() => importJSON(() => {})}>
        Import
      </button>
    </div>
  );
}
