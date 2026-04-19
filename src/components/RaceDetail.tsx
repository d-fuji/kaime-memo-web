'use client';

import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import type { Race } from '@/lib/types';
import { KaimeTab } from './KaimeTab';
import { ShareModal } from './ShareModal';
import { YosoTab } from './YosoTab';

type TabKey = 'yoso' | 'kaime';

interface RaceDetailProps {
  race: Race;
  onBack: () => void;
  onChange: (race: Race) => void;
}

export function RaceDetail({ race, onBack, onChange }: RaceDetailProps) {
  const [tab, setTab] = useState<TabKey>('yoso');
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      <header
        className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <button type="button" onClick={onBack} className="p-1">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 font-mincho">
          <div className="text-base font-bold leading-tight">
            {race.keibajo}
            {race.raceNumber}R <span className="font-normal">{race.raceName}</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {race.horseCount}頭立て
          </div>
        </div>
      </header>

      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mincho text-xs font-bold" style={{ color: 'var(--ink-light)' }}>
            メモ
          </span>
        </div>
        <textarea
          value={race.raceMemo}
          onChange={(e) => onChange({ ...race, raceMemo: e.target.value })}
          placeholder="レース全体の予想メモ..."
          className="w-full font-gothic text-sm bg-transparent outline-none leading-relaxed"
          style={{ color: 'var(--ink)', border: 'none', overflow: 'hidden', minHeight: '24px' }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
          }}
          rows={1}
        />
      </div>

      <div className="tab-bar flex">
        <TabButton active={tab === 'yoso'} onClick={() => setTab('yoso')} label="予想" />
        <TabButton
          active={tab === 'kaime'}
          onClick={() => setTab('kaime')}
          label={`買い目 ${race.bets.length > 0 ? `(${race.bets.length})` : ''}`.trim()}
        />
      </div>

      <div className="flex-1">
        {tab === 'yoso' && <YosoTab race={race} onChange={onChange} />}
        {tab === 'kaime' && (
          <KaimeTab race={race} onChange={onChange} onShare={() => setShareOpen(true)} />
        )}
      </div>

      {shareOpen && <ShareModal race={race} onClose={() => setShareOpen(false)} />}
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 font-mincho text-sm ${active ? 'tab-active' : 'tab-inactive'}`}
    >
      {label}
    </button>
  );
}
