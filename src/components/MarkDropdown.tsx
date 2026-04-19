'use client';

import { useEffect, useRef, useState } from 'react';
import { MARKS } from '@/lib/kaikata';
import type { Mark } from '@/lib/types';

function markColor(mark: Mark | null): string {
  if (mark === '◎') return 'var(--accent)';
  if (mark === '○') return 'var(--green)';
  if (mark === '▲') return 'var(--gold)';
  return 'var(--ink)';
}

interface MarkDropdownProps {
  value: Mark | null;
  onChange: (mark: Mark | null) => void;
}

export function MarkDropdown({ value, onChange }: MarkDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-sm flex items-center justify-center font-mincho"
        style={{
          background: value ? 'var(--paper)' : 'transparent',
          color: value ? markColor(value) : 'var(--muted)',
          border: `1px solid ${value ? 'var(--border-strong)' : 'var(--border)'}`,
          fontSize: value ? '18px' : '11px',
          fontWeight: value ? 700 : 400,
        }}
      >
        {value || '印'}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-20 flex gap-0.5 p-1 rounded-sm"
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--border-strong)',
            boxShadow: '0 2px 12px var(--shadow)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-8 h-8 rounded-sm flex items-center justify-center font-gothic text-xs"
            style={{
              background: !value ? 'var(--ink-light)' : 'transparent',
              color: !value ? 'var(--paper)' : 'var(--muted)',
            }}
          >
            なし
          </button>
          {MARKS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                onChange(m);
                setOpen(false);
              }}
              className="w-8 h-8 rounded-sm flex items-center justify-center font-mincho text-base font-bold"
              style={{
                background: value === m ? 'var(--ink)' : 'transparent',
                color: value === m ? 'var(--paper)' : markColor(m),
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
