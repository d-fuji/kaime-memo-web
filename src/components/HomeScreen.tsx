'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Race } from '@/lib/types';
import { NewRaceForm } from './NewRaceForm';
import { RaceListItem } from './RaceListItem';

interface HomeScreenProps {
  races: Race[];
  onSelectRace: (id: string) => void;
  onCreateRace: (race: Race) => void;
  onDeleteRace: (id: string) => void;
}

export function HomeScreen({ races, onSelectRace, onCreateRace, onDeleteRace }: HomeScreenProps) {
  const [creating, setCreating] = useState(false);

  const handleCreate = (race: Race) => {
    onCreateRace(race);
    setCreating(false);
  };

  return (
    <div className="min-h-screen">
      <header className="px-4 pt-6 pb-4" style={{ borderBottom: '2px solid var(--ink)' }}>
        <div className="font-mincho text-2xl font-bold tracking-tight">競馬下書き帳</div>
        <div className="font-gothic text-xs mt-1" style={{ color: 'var(--muted)' }}>
          予想・買い目を仲間に送るまで
        </div>
      </header>

      <div className="p-4 space-y-3">
        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <Plus size={16} /> 新しいレース
          </button>
        )}

        {creating && <NewRaceForm onCreate={handleCreate} onCancel={() => setCreating(false)} />}

        {races.length === 0 && !creating && (
          <div className="text-center py-16 font-gothic text-sm" style={{ color: 'var(--muted)' }}>
            まだレースがありません
          </div>
        )}

        <div className="space-y-2">
          {races.map((race) => (
            <RaceListItem
              key={race.id}
              race={race}
              onSelect={() => onSelectRace(race.id)}
              onDelete={() => onDeleteRace(race.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
