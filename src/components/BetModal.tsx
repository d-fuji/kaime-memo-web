'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { getGroupConfigs, KAIKATA_BY_KENSHU, KENSHU_OPTIONS } from '@/lib/kaikata';
import { calculatePoints } from '@/lib/points';
import type { Bet, Kaikata, Kenshu, Race } from '@/lib/types';
import { HorseGrid } from './HorseGrid';

interface BetModalProps {
  race: Race;
  bet: Bet | null;
  onSave: (bet: Bet) => void;
  onCancel: () => void;
}

const AMOUNT_PRESETS = [100, 200, 500, 1000];

export function BetModal({ race, bet, onSave, onCancel }: BetModalProps) {
  const [kenshu, setKenshu] = useState<Kenshu>(bet?.kenshu ?? 'sanrenpuku');
  const [kaikata, setKaikata] = useState<Kaikata>(bet?.kaikata ?? 'formation');
  const [g1, setG1] = useState<number[]>(bet?.g1 ?? []);
  const [g2, setG2] = useState<number[]>(bet?.g2 ?? []);
  const [g3, setG3] = useState<number[]>(bet?.g3 ?? []);
  const [amount, setAmount] = useState<number>(bet?.amountPerPoint ?? 100);

  const resetGroups = () => {
    setG1([]);
    setG2([]);
    setG3([]);
  };

  const handleKenshuChange = (newKenshu: Kenshu) => {
    setKenshu(newKenshu);
    const available = KAIKATA_BY_KENSHU[newKenshu];
    if (!available.find((k) => k.value === kaikata)) {
      setKaikata(available[0].value);
    }
    resetGroups();
  };

  const handleKaikataChange = (newKaikata: Kaikata) => {
    setKaikata(newKaikata);
    resetGroups();
  };

  const configs = getGroupConfigs(kenshu, kaikata);
  const groupValues = [g1, g2, g3];
  const groupSetters = [setG1, setG2, setG3];

  const draftBet: Bet = {
    id: bet?.id ?? '',
    kenshu,
    kaikata,
    g1,
    g2,
    g3,
    amountPerPoint: amount,
  };
  const points = calculatePoints(draftBet);
  const total = points * amount;
  const isWarn = points > 100 || total > 10000;
  const canSave = points > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (
      isWarn &&
      !confirm(`点数 ${points}点 / 合計 ${total.toLocaleString()}円 です。よろしいですか？`)
    ) {
      return;
    }
    onSave({ ...draftBet, id: bet?.id ?? crypto.randomUUID() });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--bg)' }}>
      <div
        className="flex items-center gap-2 p-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <button type="button" onClick={onCancel} className="p-1">
          <X size={22} />
        </button>
        <h2 className="font-mincho text-base font-bold flex-1">
          {bet ? '買い目を編集' : '買い目を追加'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <OptionGroup label="券種">
          <div className="grid grid-cols-4 gap-1.5">
            {KENSHU_OPTIONS.map((opt) => (
              <SelectionButton
                key={opt.value}
                active={kenshu === opt.value}
                onClick={() => handleKenshuChange(opt.value)}
                label={opt.label}
                size="md"
              />
            ))}
          </div>
        </OptionGroup>

        <OptionGroup label="買い方">
          <div className="flex flex-wrap gap-1.5">
            {KAIKATA_BY_KENSHU[kenshu].map((opt) => (
              <SelectionButton
                key={opt.value}
                active={kaikata === opt.value}
                onClick={() => handleKaikataChange(opt.value)}
                label={opt.label}
                size="sm"
              />
            ))}
          </div>
        </OptionGroup>

        {configs.map((cfg, i) => (
          <div key={cfg.label}>
            <div className="flex items-baseline justify-between mb-2">
              <div className="font-mincho text-sm font-bold">{cfg.label}</div>
              <div className="font-num text-xs" style={{ color: 'var(--muted)' }}>
                {groupValues[i].length}頭
                {cfg.max !== Infinity && cfg.max > 1 && ` / 最大${cfg.max}頭`}
              </div>
            </div>
            <HorseGrid
              horseCount={race.horseCount}
              horses={race.horses}
              selected={groupValues[i]}
              maxSelect={cfg.max}
              onToggle={groupSetters[i]}
            />
          </div>
        ))}

        <OptionGroup label="1点あたり金額">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(Math.max(100, Math.floor(Number(e.target.value) / 100) * 100))
              }
              step={100}
              min={100}
              className="flex-1 px-3 py-2 rounded-sm font-num text-base"
              style={{ background: 'var(--paper)', border: '1px solid var(--border)' }}
            />
            <span className="font-mincho text-sm">円</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {AMOUNT_PRESETS.map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setAmount(v)}
                className="px-2 py-1 text-xs font-num rounded-sm"
                style={{
                  background: amount === v ? 'var(--ink)' : 'transparent',
                  color: amount === v ? 'var(--paper)' : 'var(--ink-light)',
                  border: `1px solid ${amount === v ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >
                {v}円
              </button>
            ))}
          </div>
        </OptionGroup>
      </div>

      <div
        className="p-4 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}
      >
        {isWarn && (
          <div
            className="flex items-center gap-1.5 mb-2 text-xs"
            style={{ color: 'var(--accent)' }}
          >
            <AlertTriangle size={14} />
            <span className="font-gothic">点数または金額が大きくなっています</span>
          </div>
        )}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="font-num text-xl font-bold">{points}</span>
            <span className="font-mincho text-sm ml-1">点</span>
            <span className="font-gothic text-xs mx-2" style={{ color: 'var(--muted)' }}>
              ×
            </span>
            <span className="font-num text-sm">{amount}円</span>
          </div>
          <div>
            <span className="font-mincho text-xs" style={{ color: 'var(--muted)' }}>
              合計
            </span>
            <span className="font-num text-2xl font-bold ml-2">¥{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 font-gothic text-sm rounded-sm"
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              color: 'var(--ink)',
            }}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-3 font-gothic text-sm font-bold rounded-sm"
            style={{
              background: canSave ? 'var(--ink)' : 'var(--border)',
              color: 'var(--paper)',
              opacity: canSave ? 1 : 0.5,
            }}
          >
            {bet ? '更新' : '追加'}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-gothic text-xs mb-2" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
      {children}
    </div>
  );
}

interface SelectionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  size: 'sm' | 'md';
}

function SelectionButton({ active, onClick, label, size }: SelectionButtonProps) {
  const sizeClass = size === 'md' ? 'py-2 font-mincho text-sm' : 'px-3 py-1.5 font-gothic text-xs';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm ${sizeClass}`}
      style={{
        background: active ? 'var(--ink)' : 'var(--paper)',
        color: active ? 'var(--paper)' : 'var(--ink)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`,
      }}
    >
      {label}
    </button>
  );
}
