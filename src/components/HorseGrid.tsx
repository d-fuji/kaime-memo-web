import type { Horse } from '@/lib/types';

interface HorseGridProps {
  horseCount: number;
  horses?: Horse[];
  selected: number[];
  maxSelect: number;
  onToggle: (next: number[]) => void;
  disabled?: boolean;
}

export function HorseGrid({
  horseCount,
  horses,
  selected,
  maxSelect,
  onToggle,
  disabled,
}: HorseGridProps) {
  const handleClick = (num: number) => {
    if (disabled) return;
    if (selected.includes(num)) {
      onToggle(selected.filter((n) => n !== num));
      return;
    }
    if (maxSelect === 1) {
      onToggle([num]);
      return;
    }
    if (selected.length >= maxSelect) return;
    onToggle([...selected, num].sort((a, b) => a - b));
  };

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {Array.from({ length: horseCount }, (_, i) => i + 1).map((num) => {
        const horse = horses?.find((h) => h.number === num);
        const isSelected = selected.includes(num);
        return (
          <button
            type="button"
            key={num}
            onClick={() => handleClick(num)}
            disabled={disabled}
            className="horse-btn relative rounded-sm py-2 flex flex-col items-center justify-center font-num"
            style={{
              background: isSelected ? 'var(--ink)' : 'var(--paper)',
              color: isSelected ? 'var(--paper)' : 'var(--ink)',
              border: `1px solid ${isSelected ? 'var(--ink)' : 'var(--border)'}`,
              minHeight: '44px',
            }}
          >
            <span className="text-base leading-none">{num}</span>
            {horse?.mark && (
              <span
                className="absolute top-0.5 right-1 font-mincho text-[10px]"
                style={{
                  color: isSelected
                    ? 'var(--paper)'
                    : horse.mark === '◎'
                      ? 'var(--accent)'
                      : 'var(--ink-light)',
                }}
              >
                {horse.mark}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
