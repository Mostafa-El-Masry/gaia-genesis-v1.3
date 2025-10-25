'use client';

import { useEffect, useState } from 'react';
import type { Section } from '../lib/types';

const textareaStyles =
  'min-h-[260px] w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100';
const buttonStyles =
  'inline-flex items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900';

export default function SectionEditor({
  section,
  onSave,
}: {
  section: Section;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(section.blocks.join('\n\n'));

  useEffect(() => {
    setText(section.blocks.join('\n\n'));
  }, [section.id, section.blocks]);

  return (
    <div className='space-y-3'>
      <textarea
        className={textareaStyles}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className='flex justify-end'>
        <button className={buttonStyles} onClick={() => onSave(text)}>
          Save (Ctrl/Cmd+S)
        </button>
      </div>
    </div>
  );
}
