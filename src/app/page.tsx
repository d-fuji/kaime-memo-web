'use client';

import { useMemo, useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { RaceDetail } from '@/components/RaceDetail';
import { createSampleRace, createSatsukishoSampleRace } from '@/lib/race';
import type { Race } from '@/lib/types';

export default function App() {
  const [races, setRaces] = useState<Race[]>(() => [
    createSatsukishoSampleRace(),
    createSampleRace(),
  ]);
  const [currentRaceId, setCurrentRaceId] = useState<string | null>(null);

  const currentRace = useMemo(
    () => races.find((r) => r.id === currentRaceId) ?? null,
    [races, currentRaceId],
  );

  const updateRace = (updated: Race) => {
    setRaces((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
  };

  const createRace = (race: Race) => {
    setRaces((rs) => [race, ...rs]);
    setCurrentRaceId(race.id);
  };

  const deleteRace = (id: string) => {
    setRaces((rs) => rs.filter((r) => r.id !== id));
  };

  return (
    <div className="app-root font-gothic">
      {currentRace ? (
        <RaceDetail
          race={currentRace}
          onBack={() => setCurrentRaceId(null)}
          onChange={updateRace}
        />
      ) : (
        <HomeScreen
          races={races}
          onSelectRace={setCurrentRaceId}
          onCreateRace={createRace}
          onDeleteRace={deleteRace}
        />
      )}
    </div>
  );
}
