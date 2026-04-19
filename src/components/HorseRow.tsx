'use client';

import { useState } from 'react';
import type { Horse } from '@/lib/types';
import { MarkDropdown } from './MarkDropdown';

interface HorseRowProps {
  horse: Horse;
  onUpdate: (updates: Partial<Horse>) => void;
}

export function HorseRow({ horse, onUpdate }: HorseRowProps) {
  const [showNote, setShowNote] = useState(!!horse.note);
  const noteVisible = showNote || !!horse.note;

  return (
    <div className="paper-card-sharp pl-3 py-2 pr-2">
      <div className="flex items-center gap-2">
        <span className="font-num text-xl font-bold w-7 text-center">{horse.number}</span>
        <MarkDropdown value={horse.mark} onChange={(mark) => onUpdate({ mark })} />
        <input
          type="text"
          value={horse.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="馬名 (任意)"
          className="flex-1 min-w-0 bg-transparent text-sm font-gothic outline-none px-1 py-1"
          style={{ color: 'var(--ink)' }}
        />
        <button
          type="button"
          onClick={() => setShowNote(!showNote)}
          className="text-xs px-2 py-1 rounded-sm"
          style={{ color: noteVisible ? 'var(--ink)' : 'var(--muted)' }}
        >
          メモ
        </button>
      </div>

      {noteVisible && (
        <textarea
          value={horse.note}
          onChange={(e) => onUpdate({ note: e.target.value })}
          placeholder="この馬のメモ..."
          className="w-full mt-2 bg-transparent text-sm font-gothic outline-none px-1"
          style={{
            color: 'var(--ink-light)',
            border: 'none',
            overflow: 'hidden',
            minHeight: '24px',
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }}
          rows={1}
        />
      )}
    </div>
  );
}
