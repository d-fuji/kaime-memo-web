import { calculateTotal } from '@/lib/points';
import type { Race } from '@/lib/types';

interface RaceListItemProps {
  race: Race;
  onSelect: () => void;
  onDelete: () => void;
}

export function RaceListItem({ race, onSelect, onDelete }: RaceListItemProps) {
  const date = new Date(race.createdAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
  const total = calculateTotal(race.bets);

  return (
    <div className="paper-card rounded-sm">
      <button type="button" onClick={onSelect} className="w-full text-left p-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-num text-xs" style={{ color: 'var(--muted)' }}>
            {dateStr}
          </span>
          <span className="font-mincho text-sm font-bold">
            {race.keibajo}
            {race.raceNumber}R
          </span>
        </div>
        <div className="font-mincho text-base mb-1" style={{ color: 'var(--ink)' }}>
          {race.raceName || '(無題)'}
        </div>
        <div className="flex items-baseline justify-between">
          <div className="font-gothic text-xs" style={{ color: 'var(--ink-light)' }}>
            買い目 {race.bets.length}件
          </div>
          {total > 0 && <div className="font-num text-sm">¥{total.toLocaleString()}</div>}
        </div>
      </button>
      <div className="px-3 pb-2 flex justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('削除しますか？')) onDelete();
          }}
          className="text-xs font-gothic py-1 px-2"
          style={{ color: 'var(--muted)' }}
        >
          削除
        </button>
      </div>
    </div>
  );
}
