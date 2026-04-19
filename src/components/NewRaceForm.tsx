'use client';

import { useState } from 'react';
import { createEmptyRace } from '@/lib/race';
import type { Race } from '@/lib/types';

const KEIBAJO_OPTIONS = [
  '東京',
  '中山',
  '阪神',
  '京都',
  '中京',
  '新潟',
  '福島',
  '小倉',
  '札幌',
  '函館',
];

interface NewRaceFormProps {
  onCreate: (race: Race) => void;
  onCancel: () => void;
}

export function NewRaceForm({ onCreate, onCancel }: NewRaceFormProps) {
  const [keibajo, setKeibajo] = useState('東京');
  const [raceNumber, setRaceNumber] = useState(11);
  const [raceName, setRaceName] = useState('');
  const [horseCount, setHorseCount] = useState(18);

  const handleCreate = () => {
    onCreate(createEmptyRace(keibajo, raceNumber, raceName, horseCount));
  };

  return (
    <div className="paper-card rounded-sm p-4 space-y-3">
      <div className="font-mincho text-sm font-bold">新しいレース</div>

      <div>
        <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
          競馬場
        </div>
        <div className="flex flex-wrap gap-1">
          {KEIBAJO_OPTIONS.map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setKeibajo(k)}
              className="px-2.5 py-1 rounded-sm font-mincho text-xs"
              style={{
                background: keibajo === k ? 'var(--ink)' : 'var(--bg)',
                color: keibajo === k ? 'var(--paper)' : 'var(--ink)',
                border: `1px solid ${keibajo === k ? 'var(--ink)' : 'var(--border)'}`,
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField label="R" value={raceNumber} onChange={setRaceNumber} min={1} max={12} />
        <NumberField label="頭数" value={horseCount} onChange={setHorseCount} min={2} max={18} />
      </div>

      <div>
        <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
          レース名
        </div>
        <input
          type="text"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          placeholder="例: 日本ダービー"
          className="w-full px-2 py-1.5 rounded-sm font-gothic text-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 font-gothic text-sm rounded-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="flex-1 py-2 font-gothic text-sm font-bold rounded-sm"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          作成
        </button>
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

function NumberField({ label, value, onChange, min, max }: NumberFieldProps) {
  return (
    <div>
      <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full px-2 py-1.5 rounded-sm font-num text-sm"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      />
    </div>
  );
}
