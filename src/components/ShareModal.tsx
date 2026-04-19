'use client';

import { Check, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { generateShareText } from '@/lib/share';
import type { Race } from '@/lib/types';

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

interface ShareModalProps {
  race: Race;
  onClose: () => void;
}

export function ShareModal({ race, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const text = generateShareText(race);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fail silently — user can still select the text manually
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--bg)' }}>
      <div
        className="flex items-center gap-2 p-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <button type="button" onClick={onClose} className="p-1">
          <X size={22} />
        </button>
        <h2 className="font-mincho text-base font-bold flex-1">共有テキスト</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="paper-card p-4 rounded-sm font-mincho text-sm whitespace-pre-wrap leading-relaxed"
          style={{ color: 'var(--ink)' }}
        >
          {text}
        </div>
      </div>

      <div
        className="p-4 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}
      >
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-3 font-gothic text-sm font-bold rounded-sm flex items-center justify-center gap-2"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {copied ? (
            <>
              <Check size={16} /> コピーしました
            </>
          ) : (
            <>
              <Copy size={16} /> クリップボードにコピー
            </>
          )}
        </button>
      </div>
    </div>
  );
}
