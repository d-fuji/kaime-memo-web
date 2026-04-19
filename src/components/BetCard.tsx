import { Edit2, Trash2 } from 'lucide-react';
import { getGroupConfigs, getKaikataLabel, getKenshuLabel } from '@/lib/kaikata';
import { calculatePoints } from '@/lib/points';
import type { Bet } from '@/lib/types';

interface BetCardProps {
  bet: Bet;
  onEdit: () => void;
  onDelete: () => void;
}

export function BetCard({ bet, onEdit, onDelete }: BetCardProps) {
  const points = calculatePoints(bet);
  const total = points * bet.amountPerPoint;
  const groups = [bet.g1, bet.g2, bet.g3];
  const configs = getGroupConfigs(bet.kenshu, bet.kaikata);

  return (
    <div className="paper-card rounded-sm p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mincho text-base font-bold">{getKenshuLabel(bet.kenshu)}</span>
          <span className="font-gothic text-xs" style={{ color: 'var(--ink-light)' }}>
            {getKaikataLabel(bet.kenshu, bet.kaikata)}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5"
            style={{ color: 'var(--ink-light)' }}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5"
            style={{ color: 'var(--accent)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-0.5 mb-2">
        {configs.map((cfg, i) => {
          const g = groups[i] ?? [];
          if (g.length === 0) return null;
          return (
            <div key={cfg.label} className="flex gap-2 text-sm">
              <span
                className="font-gothic text-xs w-20 flex-shrink-0"
                style={{ color: 'var(--muted)' }}
              >
                {cfg.label}
              </span>
              <span className="font-num">{[...g].sort((a, b) => a - b).join(', ')}</span>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-baseline justify-between pt-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="font-num text-xs" style={{ color: 'var(--ink-light)' }}>
          {points}点 × {bet.amountPerPoint}円
        </span>
        <span className="font-num text-base font-bold">¥{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
