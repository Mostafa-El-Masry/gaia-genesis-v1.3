'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ApolloData } from '../lib/types';
import {
  appendToSection,
  loadData,
  saveData,
  upsertSection,
  upsertTopic,
} from '../lib/store';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const fieldStyles =
  'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100';
const primaryButton =
  'inline-flex items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
const subtleButton =
  'inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-50';

export default function AskPanel({ onChange }: { onChange: (d: ApolloData) => void }) {
  const [data, setData] = useState<ApolloData>({ topics: [] });
  const [topic, setTopic] = useState('HTML');
  const [section, setSection] = useState('Basics');
  const [prompt, setPrompt] = useState('');
  const [buffer, setBuffer] = useState(
    'Ask Apollo anything, then append the important parts to your archive.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const hasHistory = history.length > 0;
  const trimmedPrompt = prompt.trim();

  async function askModel() {
    if (!trimmedPrompt) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/apollo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt, history }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error ?? 'The assistant is unavailable.');
      }

      const answer: string =
        payload?.answer ??
        payload?.choices?.[0]?.message?.content ??
        'No answer was returned.';

      setHistory((prev) => [
        ...prev,
        { role: 'user', content: trimmedPrompt },
        { role: 'assistant', content: answer },
      ]);
      setBuffer(answer);
      setPrompt('');
      setTimeout(() => taRef.current?.focus(), 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected network error.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function appendSelection() {
    const ta = taRef.current;
    if (!ta) return;

    const rawSelection = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    const selection = rawSelection.trim() || ta.value.trim();
    if (!selection) {
      setError('Nothing to append yet.');
      return;
    }

    const freshData = loadData();
    const t = upsertTopic(freshData, topic);
    const s = upsertSection(t, section);
    appendToSection(s, selection);
    saveData(freshData);
    setData(freshData);
    onChange(freshData);
    setError(null);
  }

  function clearBuffer() {
    setBuffer('');
    setError(null);
    setTimeout(() => taRef.current?.focus(), 0);
  }

  function resetChat() {
    setHistory([]);
    setPrompt('');
    setError(null);
  }

  const statusMessage = useMemo(() => {
    if (loading) return 'Waiting for ChatGPT...';
    if (error) return null;
    return 'Select the best parts of the answer and append them to your archive.';
  }, [loading, error]);

  return (
    <div className='space-y-4'>
      <div className='grid gap-3 md:grid-cols-[1fr,1fr,auto]'>
        <input
          className={fieldStyles}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder='Topic (e.g., HTML)'
        />
        <input
          className={fieldStyles}
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder='Section (H2, e.g., Inline vs Block)'
        />
        <button
          className={subtleButton}
          onClick={appendSelection}
          title='Append selected text to archive'
          disabled={loading}
        >
          Append +
        </button>
      </div>

      <div className='grid gap-3 md:grid-cols-[1fr,auto]'>
        <input
          className={fieldStyles}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask ChatGPT something...'
        />
        <button className={primaryButton} onClick={askModel} disabled={loading || !trimmedPrompt}>
          {loading ? 'Asking...' : 'Ask ChatGPT'}
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-3 text-sm'>
        {statusMessage && <span className='text-slate-500'>{statusMessage}</span>}
        {error && <span className='font-semibold text-rose-600'>{error}</span>}
        {!error && hasHistory && (
          <button className='text-slate-500 underline-offset-4 hover:text-slate-900' onClick={resetChat}>
            Reset chat
          </button>
        )}
      </div>

      <textarea
        ref={taRef}
        className='min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100'
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
      />

      <div className='flex justify-end'>
        <button className={subtleButton} onClick={clearBuffer} disabled={loading}>
          Clear
        </button>
      </div>
    </div>
  );
}
