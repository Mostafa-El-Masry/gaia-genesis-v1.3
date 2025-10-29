'use client';

import { useState } from 'react';
import { applyBundle } from '../lib/gather';
import { decryptJSON } from '../lib/crypto';

export default function ImportPanel(){
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<'merge'|'replace'>('merge');
  const [password, setPassword] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string>('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if (!f) return;
    setError(''); setPreview(null); setText('');
    const raw = await f.text();
    try {
      const json = JSON.parse(raw);
      if (json && json.enc && json.data){
        if (!password) { setError('This backup is encrypted. Enter password, then click "Preview".'); setText(raw); return; }
        const dec = await decryptJSON(json, password);
        setPreview({ ...dec, __enc__: true });
      } else {
        setPreview(json);
      }
    } catch { setError('Invalid JSON'); }
  }

  async function previewText(){
    if (!text) return;
    try {
      const json = JSON.parse(text);
      if (json && json.enc && json.data){
        if (!password) { setError('Encrypted—enter password.'); return; }
        const dec = await decryptJSON(json, password);
        setPreview({ ...dec, __enc__: true });
      } else {
        setPreview(json);
      }
      setError('');
    } catch { setError('Invalid JSON'); }
  }

  function apply(){
    if (!preview) return;
    try { applyBundle(preview, mode); alert('Import complete.'); }
    catch (e:any){ alert('Import failed: ' + e?.message); }
  }

  const count = preview?.itemCount ?? (preview?.items ? Object.keys(preview.items).length : 0);

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="opacity-70">Mode</span>
          <select className="rounded-lg border border-black/10 px-2 py-1 text-sm" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="merge">Merge</option>
            <option value="replace">Replace</option>
          </select>
        </label>
        <input className="rounded-lg border border-black/10 px-3 py-1.5 text-sm" placeholder="Password (if encrypted)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input type="file" accept="application/json" onChange={handleFile} />
      </div>

      <textarea className="h-28 w-full rounded-lg border border-black/10 p-2 text-sm" placeholder="Or paste backup JSON here…" value={text} onChange={e=>setText(e.target.value)} />

      <div className="mt-2 flex items-center gap-2">
        <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={previewText}>Preview</button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {preview && (
        <div className="mt-3 rounded-lg border border-black/10 p-3 text-sm">
          <div className="mb-1 font-semibold">Preview</div>
          <div className="opacity-70">Schema: {preview.schema} • Items: {count} • Created: {preview.createdAt}</div>
          <div className="mt-1 max-h-48 overflow-auto rounded bg-black/5 p-2"><pre className="whitespace-pre-wrap break-words">{JSON.stringify(preview.items ? Object.keys(preview.items) : preview, null, 2)}</pre></div>
          <div className="mt-2 flex items-center justify-end">
            <button className="rounded-lg border px-3 py-1.5 text-sm font-semibold" onClick={apply}>Apply Import</button>
          </div>
        </div>
      )}
    </div>
  );
}
