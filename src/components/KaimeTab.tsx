'use client';

import { Plus, Share2 } from 'lucide-react';
import { useState } from 'react';
import { calculateTotal } from '@/lib/points';
import type { Bet, Race } from '@/lib/types';
import { BetCard } from './BetCard';
import { BetModal } from './BetModal';

interface KaimeTabProps {
  race: Race;
  onChange: (race: Race) => void;
  onShare: () => void;
}

export function KaimeTab({ race, onChange, onShare }: KaimeTabProps) {
  const [editingBet, setEditingBet] = useState<Bet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openAddBet = () => {
    setEditingBet(null);
    setModalOpen(true);
  };

  const openEditBet = (bet: Bet) => {
    setEditingBet(bet);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBet(null);
  };

  const saveBet = (bet: Bet) => {
    if (editingBet) {
      onChange({ ...race, bets: race.bets.map((b) => (b.id === editingBet.id ? bet : b)) });
    } else {
      onChange({ ...race, bets: [...race.bets, bet] });
    }
    closeModal();
  };

  const deleteBet = (id: string) => {
    if (!confirm('この買い目を削除しますか？')) return;
    onChange({ ...race, bets: race.bets.filter((b) => b.id !== id) });
  };

  const total = calculateTotal(race.bets);

  return (
    <div className="p-4 space-y-3">
      {race.bets.length === 0 && (
        <div className="text-center py-10 font-gothic text-sm" style={{ color: 'var(--muted)' }}>
          まだ買い目はありません
        </div>
      )}

      {race.bets.map((bet) => (
        <BetCard
          key={bet.id}
          bet={bet}
          onEdit={() => openEditBet(bet)}
          onDelete={() => deleteBet(bet.id)}
        />
      ))}

      <button
        type="button"
        onClick={openAddBet}
        className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm"
        style={{
          background: 'var(--paper)',
          border: '1px dashed var(--border-strong)',
          color: 'var(--ink)',
        }}
      >
        <Plus size={16} /> 買い目を追加
      </button>

      {race.bets.length > 0 && (
        <>
          <div className="divider-h mt-6" />
          <div className="flex items-baseline justify-between py-2">
            <span className="font-mincho text-sm">合計</span>
            <span className="font-num text-xl font-bold">¥{total.toLocaleString()}</span>
          </div>
          <button
            type="button"
            onClick={onShare}
            className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm font-bold"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <Share2 size={16} /> 共有テキストを作成
          </button>
        </>
      )}

      {modalOpen && (
        <BetModal race={race} bet={editingBet} onSave={saveBet} onCancel={closeModal} />
      )}
    </div>
  );
}
