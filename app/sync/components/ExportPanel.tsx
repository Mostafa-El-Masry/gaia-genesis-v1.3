"use client";

import { useEffect, useMemo, useState } from "react";
import { listAllKeys, groupKeys } from "../lib/gather";
import { buildBundle, saveJSON } from "../lib/bundle";
import { encryptJSON } from "../lib/crypto";

export default function ExportPanel() {
  const [keys, setKeys] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [password, setPassword] = useState("");
  const [useEnc, setUseEnc] = useState(false);

  useEffect(() => {
    setKeys(listAllKeys());
  }, []);
  const sections = useMemo(() => groupKeys(keys), [keys]);
  const selectedKeys = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  );

  function selectSection(id: string, on: boolean) {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    const next = { ...selected };
    for (const k of sec.keys) next[k] = on;
    setSelected(next);
  }
  function selectAll(on: boolean) {
    const next: Record<string, boolean> = {};
    for (const k of keys) next[k] = on;
    setSelected(next);
  }

  async function doExport() {
    const toSave = selectedKeys.length ? selectedKeys : keys;
    const bundle = buildBundle(toSave);
    // Avoid literal bracket sequence being picked up by Tailwind's content scanner
    // (which can generate invalid CSS for bracket-notation classes). Use RegExp constructor.
    const ts = new Date()
      .toISOString()
      .replace(new RegExp("[-:T]", "g"), "")
      .slice(0, 15);
    if (useEnc && password) {
      const pack = await encryptJSON(bundle, password);
      saveJSON(
        {
          schema: "gaia-1.3",
          enc: pack.enc,
          v: pack.v,
          iv: pack.iv,
          salt: pack.salt,
          data: pack.data,
        },
        `gaia-v1.3-backup-${ts}.enc.json`
      );
    } else {
      saveJSON(bundle, `gaia-v1.3-backup-${ts}.json`);
    }
  }

  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-wide">Export</h2>
        <div className="text-sm opacity-60">{keys.length} keys</div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <button
          className="rounded-lg border px-3 py-1.5 text-sm"
          onClick={() => selectAll(true)}
        >
          Select all
        </button>
        <button
          className="rounded-lg border px-3 py-1.5 text-sm"
          onClick={() => selectAll(false)}
        >
          Clear
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useEnc}
              onChange={(e) => setUseEnc(e.target.checked)}
            />{" "}
            Encrypt
          </label>
          <input
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm"
            placeholder="Password (optional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
            onClick={doExport}
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <div key={sec.id} className="rounded-lg border border-black/10 p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-semibold">{sec.title}</div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border px-2 py-0.5 text-xs"
                  onClick={() => selectSection(sec.id, true)}
                >
                  All
                </button>
                <button
                  className="rounded border px-2 py-0.5 text-xs"
                  onClick={() => selectSection(sec.id, false)}
                >
                  None
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {sec.keys.map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!selected[k]}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [k]: e.target.checked }))
                    }
                  />
                  <span className="truncate">{k}</span>
                </label>
              ))}
              {sec.keys.length === 0 && (
                <div className="text-sm opacity-60">No keys.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
