'use client';

import { useEffect, useRef } from 'react';

const inputStyles =
  'w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100';

export default function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/') {
        e.preventDefault();
        ref.current?.focus();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <input
      ref={ref}
      className={inputStyles}
      placeholder='Search... ( / )'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
