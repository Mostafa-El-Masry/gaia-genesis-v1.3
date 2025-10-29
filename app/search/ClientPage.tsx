'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from './components/SearchBar';
import CategoryChips from './components/CategoryChips';
import ResultItem from './components/ResultItem';
import PowerMenu from './components/PowerMenu';
import type { Category } from './lib/types';
import { buildIndex, loadIndex, saveIndex, runSearch, getPrefs, setPrefs } from './lib/indexer';

export default function SearchPage(){
  const sp = useSearchParams();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category>('all');
  const [status, setStatus] = useState('');
  const [indexTime, setIndexTime] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(()=>{
    const prefs = getPrefs();
    const q = sp.get('q') ?? prefs.lastQuery ?? '';
    const c = (sp.get('in') as Category) ?? (prefs.lastCat || 'all');
    setQuery(q);
    setCat((['all','apollo','gallery','labs','health','wealth','timeline','settings','intro','other'] as Category[]).includes(c) ? c : 'all');
  }, [sp]);

  function ensureIndex(){
    let idx = loadIndex();
    if (!idx){
      setStatus('Indexing…');
      idx = buildIndex();
      saveIndex(idx);
      setStatus('');
    }
    setIndexTime(idx.createdAt);
    return idx;
  }

  useEffect(()=>{
    const idx = ensureIndex();
    const ranked = runSearch(idx, query, cat);
    setResults(ranked);
    setPrefs({ lastQuery: query, lastCat: cat });
  }, [query, cat]);

  function rescan(){
    setStatus('Indexing…');
    const idx = buildIndex();
    saveIndex(idx);
    setIndexTime(idx.createdAt);
    const ranked = runSearch(idx, query, cat);
    setResults(ranked);
    setStatus('');
  }

  function clearCache(){
    localStorage.removeItem('search_cache_v1');
    setStatus('Cache cleared.');
    setTimeout(()=>setStatus(''), 1200);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="fixed left-4 top-4 z-40">
        <a href="/" className="inline-flex items-center gap-2 rounded-lg border bg-white/90 px-3 py-1.5 text-sm font-semibold">⟵ GAIA</a>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <h1 className="text-2xl font-extrabold tracking-wide">Search</h1>

        <SearchBar value={query} onChange={setQuery} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CategoryChips value={cat} onChange={setCat} />
          <div className="flex items-center gap-2 text-sm">
            <button className="rounded-lg border px-3 py-1.5" onClick={rescan}>Rescan</button>
            <button className="rounded-lg border px-3 py-1.5" onClick={clearCache}>Clear Cache</button>
            <span className="opacity-60">Indexed: {indexTime ? new Date(indexTime).toLocaleString() : '—'}</span>
            {status && <span className="ml-2 text-amber-600">{status}</span>}
          </div>
        </div>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="mb-2 text-sm opacity-70">{results.length} results</div>
          <div className="grid grid-cols-1 gap-2">
            {results.map((r:any) => (
              <ResultItem key={r.id} title={r.title} snippet={r.snippet} route={r.route} anchor={r.anchor} keyName={r.key} score={r.score} />
            ))}
            {results.length===0 && <div className="opacity-60">No results yet. Try “wealth”, “apollo”, or press Rescan.</div>}
          </div>
        </section>

        <PowerMenu />
      </div>
    </main>
  );
}
