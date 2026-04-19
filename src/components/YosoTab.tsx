import type { Horse, Race } from '@/lib/types';
import { HorseRow } from './HorseRow';

interface YosoTabProps {
  race: Race;
  onChange: (race: Race) => void;
}

export function YosoTab({ race, onChange }: YosoTabProps) {
  const updateHorse = (number: number, updates: Partial<Horse>) => {
    onChange({
      ...race,
      horses: race.horses.map((h) => (h.number === number ? { ...h, ...updates } : h)),
    });
  };

  return (
    <div className="space-y-3 p-4">
      {race.horses.map((horse) => (
        <HorseRow key={horse.number} horse={horse} onUpdate={(u) => updateHorse(horse.number, u)} />
      ))}
    </div>
  );
}
