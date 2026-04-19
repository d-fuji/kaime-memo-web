'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, ChevronLeft, X, Share2, Trash2, Edit2, Check, Copy, AlertTriangle } from 'lucide-react';

// ============================================================
// 定数
// ============================================================

const MARKS = ['◎', '○', '▲', '△', '☆', '✕'];

const KENSHU_OPTIONS = [
  { value: 'umaren', label: '馬連' },
  { value: 'umatan', label: '馬単' },
  { value: 'sanrenpuku', label: '3連複' },
  { value: 'sanrentan', label: '3連単' },
];

const KAIKATA_BY_KENSHU = {
  umaren: [
    { value: 'normal', label: '通常' },
    { value: 'box', label: 'BOX' },
    { value: 'formation', label: 'F' },
    { value: 'nagashi', label: '流し' },
  ],
  umatan: [
    { value: 'normal', label: '通常' },
    { value: 'box', label: 'BOX' },
    { value: 'formation', label: 'F' },
    { value: 'nagashi_1chaku', label: '1着流し' },
    { value: 'nagashi_2chaku', label: '2着流し' },
  ],
  sanrenpuku: [
    { value: 'normal', label: '通常' },
    { value: 'box', label: 'BOX' },
    { value: 'formation', label: 'F' },
    { value: 'nagashi_jiku1', label: '軸1頭流し' },
    { value: 'nagashi_jiku2', label: '軸2頭流し' },
  ],
  sanrentan: [
    { value: 'normal', label: '通常' },
    { value: 'box', label: 'BOX' },
    { value: 'formation', label: 'F' },
    { value: 'nagashi_1chaku', label: '1着流し' },
    { value: 'nagashi_2chaku', label: '2着流し' },
    { value: 'nagashi_3chaku', label: '3着流し' },
    { value: 'nagashi_12chaku', label: '1・2着流し' },
    { value: 'nagashi_23chaku', label: '2・3着流し' },
  ],
};

// グループ（g1/g2/g3）のラベルと選択数上限を計算
function getGroupConfigs(kenshu, kaikata) {
  if (kaikata === 'normal') {
    if (kenshu === 'umaren') return [{ label: '1頭目', max: 1 }, { label: '2頭目', max: 1 }];
    if (kenshu === 'umatan') return [{ label: '1着', max: 1 }, { label: '2着', max: 1 }];
    if (kenshu === 'sanrenpuku') return [{ label: '1頭目', max: 1 }, { label: '2頭目', max: 1 }, { label: '3頭目', max: 1 }];
    if (kenshu === 'sanrentan') return [{ label: '1着', max: 1 }, { label: '2着', max: 1 }, { label: '3着', max: 1 }];
  }
  if (kaikata === 'box') return [{ label: 'BOX馬', max: Infinity }];
  if (kaikata === 'formation') {
    if (kenshu === 'umaren') return [{ label: '1頭目候補', max: Infinity }, { label: '2頭目候補', max: Infinity }];
    if (kenshu === 'umatan') return [{ label: '1着候補', max: Infinity }, { label: '2着候補', max: Infinity }];
    if (kenshu === 'sanrenpuku') return [{ label: '1枠候補', max: Infinity }, { label: '2枠候補', max: Infinity }, { label: '3枠候補', max: Infinity }];
    if (kenshu === 'sanrentan') return [{ label: '1着候補', max: Infinity }, { label: '2着候補', max: Infinity }, { label: '3着候補', max: Infinity }];
  }
  if (kaikata === 'nagashi') return [{ label: '軸', max: 1 }, { label: '相手', max: Infinity }];
  if (kaikata === 'nagashi_1chaku') return [{ label: '軸（1着）', max: 1 }, { label: '相手', max: Infinity }];
  if (kaikata === 'nagashi_2chaku') return [{ label: '軸（2着）', max: 1 }, { label: '相手', max: Infinity }];
  if (kaikata === 'nagashi_3chaku') return [{ label: '軸（3着）', max: 1 }, { label: '相手', max: Infinity }];
  if (kaikata === 'nagashi_12chaku') return [{ label: '軸（1・2着）', max: 2 }, { label: '相手（3着）', max: Infinity }];
  if (kaikata === 'nagashi_23chaku') return [{ label: '軸（2・3着）', max: 2 }, { label: '相手（1着）', max: Infinity }];
  if (kaikata === 'nagashi_jiku1') return [{ label: '軸', max: 1 }, { label: '相手', max: Infinity }];
  if (kaikata === 'nagashi_jiku2') return [{ label: '軸', max: 2 }, { label: '相手', max: Infinity }];
  return [];
}

// ============================================================
// 点数計算
// ============================================================

function calculatePoints(bet) {
  const { kenshu, kaikata, g1 = [], g2 = [], g3 = [] } = bet;
  try {
    if (kenshu === 'umaren') return umarenPoints(kaikata, g1, g2);
    if (kenshu === 'umatan') return umatanPoints(kaikata, g1, g2);
    if (kenshu === 'sanrenpuku') return sanrenpukuPoints(kaikata, g1, g2, g3);
    if (kenshu === 'sanrentan') return sanrentanPoints(kaikata, g1, g2, g3);
  } catch (e) {
    return 0;
  }
  return 0;
}

function umarenPoints(kaikata, g1, g2) {
  switch (kaikata) {
    case 'normal':
      return (g1.length === 1 && g2.length === 1 && g1[0] !== g2[0]) ? 1 : 0;
    case 'box': {
      const n = g1.length;
      return n >= 2 ? (n * (n - 1)) / 2 : 0;
    }
    case 'formation': {
      const set = new Set();
      for (const a of g1) for (const b of g2) if (a !== b) set.add([a, b].sort((x, y) => x - y).join(','));
      return set.size;
    }
    case 'nagashi':
      if (g1.length !== 1) return 0;
      return g2.filter(x => x !== g1[0]).length;
    default:
      return 0;
  }
}

function umatanPoints(kaikata, g1, g2) {
  switch (kaikata) {
    case 'normal':
      return (g1.length === 1 && g2.length === 1 && g1[0] !== g2[0]) ? 1 : 0;
    case 'box': {
      const n = g1.length;
      return n >= 2 ? n * (n - 1) : 0;
    }
    case 'formation': {
      const set = new Set();
      for (const a of g1) for (const b of g2) if (a !== b) set.add(`${a},${b}`);
      return set.size;
    }
    case 'nagashi_1chaku':
      if (g1.length !== 1) return 0;
      return g2.filter(x => x !== g1[0]).length;
    case 'nagashi_2chaku':
      if (g1.length !== 1) return 0;
      return g2.filter(x => x !== g1[0]).length;
    default:
      return 0;
  }
}

function sanrenpukuPoints(kaikata, g1, g2, g3) {
  switch (kaikata) {
    case 'normal':
      if (g1.length !== 1 || g2.length !== 1 || g3.length !== 1) return 0;
      if (g1[0] === g2[0] || g2[0] === g3[0] || g1[0] === g3[0]) return 0;
      return 1;
    case 'box': {
      const n = g1.length;
      return n >= 3 ? (n * (n - 1) * (n - 2)) / 6 : 0;
    }
    case 'formation': {
      const set = new Set();
      for (const a of g1) for (const b of g2) for (const c of g3) {
        if (a !== b && b !== c && a !== c) {
          set.add([a, b, c].sort((x, y) => x - y).join(','));
        }
      }
      return set.size;
    }
    case 'nagashi_jiku1': {
      if (g1.length !== 1) return 0;
      const aite = g2.filter(x => x !== g1[0]);
      const n = aite.length;
      return n >= 2 ? (n * (n - 1)) / 2 : 0;
    }
    case 'nagashi_jiku2': {
      if (g1.length !== 2 || g1[0] === g1[1]) return 0;
      return g2.filter(x => !g1.includes(x)).length;
    }
    default:
      return 0;
  }
}

function sanrentanPoints(kaikata, g1, g2, g3) {
  switch (kaikata) {
    case 'normal':
      if (g1.length !== 1 || g2.length !== 1 || g3.length !== 1) return 0;
      if (g1[0] === g2[0] || g2[0] === g3[0] || g1[0] === g3[0]) return 0;
      return 1;
    case 'box': {
      const n = g1.length;
      return n >= 3 ? n * (n - 1) * (n - 2) : 0;
    }
    case 'formation': {
      const set = new Set();
      for (const a of g1) for (const b of g2) for (const c of g3) {
        if (a !== b && b !== c && a !== c) set.add(`${a},${b},${c}`);
      }
      return set.size;
    }
    case 'nagashi_1chaku':
    case 'nagashi_2chaku':
    case 'nagashi_3chaku': {
      if (g1.length !== 1) return 0;
      const aite = g2.filter(x => x !== g1[0]);
      const n = aite.length;
      return n >= 2 ? n * (n - 1) : 0;
    }
    case 'nagashi_12chaku':
    case 'nagashi_23chaku': {
      if (g1.length !== 2 || g1[0] === g1[1]) return 0;
      return g2.filter(x => !g1.includes(x)).length * 2;
    }
    default:
      return 0;
  }
}

// ============================================================
// 買い目テキスト生成
// ============================================================

function betToText(bet) {
  const kenshuLabel = KENSHU_OPTIONS.find(k => k.value === bet.kenshu)?.label || '';
  const kaikataLabel = KAIKATA_BY_KENSHU[bet.kenshu]?.find(k => k.value === bet.kaikata)?.label || '';

  let horseStr = '';
  const { kaikata, g1 = [], g2 = [], g3 = [] } = bet;

  if (kaikata === 'normal') {
    const parts = [g1, g2, g3].filter(g => g.length > 0).map(g => g.join(''));
    horseStr = parts.join('→');
    if (bet.kenshu === 'umaren' || bet.kenshu === 'sanrenpuku') {
      horseStr = parts.join('-'); // 順不同はハイフン
    }
  } else if (kaikata === 'box') {
    horseStr = g1.sort((a, b) => a - b).join(',');
  } else if (kaikata === 'formation') {
    const parts = [g1, g2, g3].filter(g => g.length > 0).map(g => g.sort((a, b) => a - b).join(','));
    horseStr = parts.join('-');
  } else {
    // 流し系
    horseStr = `${g1.sort((a, b) => a - b).join(',')}-${g2.sort((a, b) => a - b).join(',')}`;
  }

  const points = calculatePoints(bet);
  const total = points * bet.amountPerPoint;

  // 買い方表記
  let kaikataShort = '';
  if (kaikata === 'box') kaikataShort = 'BOX';
  else if (kaikata === 'formation') kaikataShort = 'F';
  else if (kaikata.startsWith('nagashi')) kaikataShort = kaikataLabel;

  const kenshuFull = `${kenshuLabel}${kaikataShort}`.trim();

  return `${kenshuFull} ${horseStr} / ${points}点×${bet.amountPerPoint}円 = ${total.toLocaleString()}円`;
}

function generateShareText(race) {
  const markedHorses = race.horses.filter(h => h.mark);
  const header = `📍 ${race.keibajo}${race.raceNumber}R ${race.raceName}`;

  const markLines = MARKS.map(mark => {
    const horses = markedHorses.filter(h => h.mark === mark);
    if (horses.length === 0) return null;
    const formatted = horses
      .map(h => h.name ? `${h.number} ${h.name}` : `${h.number}`)
      .join(horses.length > 1 && !horses.some(h => h.name) ? ',' : '\n');
    if (horses.length === 1) {
      return `${mark}${horses[0].number}${horses[0].name ? ' ' + horses[0].name : ''}`;
    }
    // 複数ある印（△など）
    return `${mark}${horses.map(h => h.number).join(',')}`;
  }).filter(Boolean);

  const betLines = race.bets.map(bet => betToText(bet));
  const total = race.bets.reduce((sum, b) => sum + calculatePoints(b) * b.amountPerPoint, 0);

  const parts = [header];
  if (markLines.length > 0) parts.push('', markLines.join('\n'));
  if (betLines.length > 0) parts.push('', betLines.join('\n'));
  if (race.bets.length > 0) parts.push('', `合計: ${total.toLocaleString()}円`);

  return parts.join('\n');
}

// ============================================================
// サンプルデータ
// ============================================================

function createEmptyRace(keibajo, raceNumber, raceName, horseCount) {
  return {
    id: crypto.randomUUID(),
    keibajo,
    raceNumber,
    raceName,
    horseCount,
    raceMemo: '',
    horses: Array.from({ length: horseCount }, (_, i) => ({
      number: i + 1,
      name: '',
      mark: null,
      note: '',
    })),
    bets: [],
    createdAt: new Date().toISOString(),
  };
}

function createSampleRace() {
  const race = createEmptyRace('東京', 11, '日本ダービー', 18);
  race.horses[6] = { number: 7, name: 'イクイノックス', mark: '◎', note: '本命、状態万全' };
  race.horses[2] = { number: 3, name: 'ドウデュース', mark: '○', note: '調教◎' };
  race.horses[4] = { number: 5, name: 'タイトルホルダー', mark: '▲', note: '展開次第' };
  race.horses[0] = { number: 1, name: '', mark: '△', note: '' };
  race.horses[8] = { number: 9, name: '', mark: '△', note: '' };
  race.horses[11] = { number: 12, name: '', mark: '△', note: '' };
  race.raceMemo = '稍重想定、前有利';
  race.bets = [
    {
      id: crypto.randomUUID(),
      kenshu: 'sanrenpuku',
      kaikata: 'formation',
      g1: [7],
      g2: [3, 5],
      g3: [1, 9, 12],
      amountPerPoint: 200,
    },
  ];
  return race;
}

// ============================================================
// スタイル定数
// ============================================================

const STYLE = `
  :root {
    --bg: #F4F1E8;
    --paper: #FBF8F0;
    --ink: #1F1A14;
    --ink-light: #5A5248;
    --muted: #A69B8A;
    --border: #D8D0BF;
    --border-strong: #8B8172;
    --accent: #B83C3C;
    --accent-dim: #EDDAD7;
    --green: #2C5545;
    --green-dim: #DCE7DF;
    --gold: #9C7A2F;
    --shadow: rgba(31, 26, 20, 0.08);
  }
  .font-mincho { font-family: "Hiragino Mincho ProN", "YuMincho", "Yu Mincho", "Noto Serif JP", serif; }
  .font-gothic { font-family: "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif; }
  .font-num { font-family: "Hiragino Mincho ProN", "YuMincho", serif; font-feature-settings: "tnum"; }
  body { background: var(--bg); color: var(--ink); }
  .app-root { min-height: 100vh; background: var(--bg); }
  .paper-card { background: var(--paper); border: 1px solid var(--border); }
  .paper-card-sharp { background: var(--paper); border-left: 3px solid var(--border-strong); }
  input, textarea { font-family: inherit; }
  textarea { resize: none; }
  button { -webkit-tap-highlight-color: transparent; }
  .tab-bar { border-bottom: 1px solid var(--border); }
  .tab-active { border-bottom: 2px solid var(--ink); color: var(--ink); font-weight: 700; }
  .tab-inactive { color: var(--muted); }
  .horse-btn { transition: all 0.08s; }
  .horse-btn:active { transform: scale(0.96); }
  .divider-v { border-top: 1px solid var(--border); }
  .divider-h { border-top: 2px solid var(--ink); }
`;

// ============================================================
// コンポーネント: 共通
// ============================================================

function MarkBadge({ mark }) {
  if (!mark) return null;
  const color = mark === '◎' ? 'var(--accent)' : mark === '○' ? 'var(--green)' : mark === '▲' ? 'var(--gold)' : 'var(--ink-light)';
  return (
    <span className="font-mincho text-lg font-bold" style={{ color }}>{mark}</span>
  );
}

function HorseGrid({ horseCount, horses, selected, maxSelect, onToggle, disabled }) {
  const handleClick = (num) => {
    if (disabled) return;
    if (selected.includes(num)) {
      onToggle(selected.filter(n => n !== num));
    } else {
      if (maxSelect === 1) {
        onToggle([num]);
      } else if (selected.length >= maxSelect) {
        return;
      } else {
        onToggle([...selected, num].sort((a, b) => a - b));
      }
    }
  };
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {Array.from({ length: horseCount }, (_, i) => i + 1).map(num => {
        const horse = horses?.find(h => h.number === num);
        const isSelected = selected.includes(num);
        return (
          <button
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
              <span className="absolute top-0.5 right-1 font-mincho text-[10px]" style={{
                color: isSelected ? 'var(--paper)' : (horse.mark === '◎' ? 'var(--accent)' : 'var(--ink-light)')
              }}>{horse.mark}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 予想タブ
// ============================================================

function YosoTab({ race, onChange }) {
  const updateHorse = (number, updates) => {
    onChange({
      ...race,
      horses: race.horses.map(h => h.number === number ? { ...h, ...updates } : h),
    });
  };

  return (
    <div className="space-y-3 p-4">
      {race.horses.map(horse => (
        <HorseRow key={horse.number} horse={horse} onUpdate={(u) => updateHorse(horse.number, u)} />
      ))}
    </div>
  );
}

function MarkDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  const color = value === '◎' ? 'var(--accent)' : value === '○' ? 'var(--green)' : value === '▲' ? 'var(--gold)' : 'var(--ink)';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-sm flex items-center justify-center font-mincho"
        style={{
          background: value ? 'var(--paper)' : 'transparent',
          color: value ? color : 'var(--muted)',
          border: `1px solid ${value ? 'var(--border-strong)' : 'var(--border)'}`,
          fontSize: value ? '18px' : '11px',
          fontWeight: value ? 700 : 400,
        }}
      >
        {value || '印'}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-20 flex gap-0.5 p-1 rounded-sm"
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--border-strong)',
            boxShadow: '0 2px 12px var(--shadow)',
          }}
        >
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className="w-8 h-8 rounded-sm flex items-center justify-center font-gothic text-xs"
            style={{
              background: !value ? 'var(--ink-light)' : 'transparent',
              color: !value ? 'var(--paper)' : 'var(--muted)',
            }}
          >なし</button>
          {MARKS.map(m => {
            const mColor = m === '◎' ? 'var(--accent)' : m === '○' ? 'var(--green)' : m === '▲' ? 'var(--gold)' : 'var(--ink)';
            return (
              <button
                key={m}
                onClick={() => { onChange(m); setOpen(false); }}
                className="w-8 h-8 rounded-sm flex items-center justify-center font-mincho text-base font-bold"
                style={{
                  background: value === m ? 'var(--ink)' : 'transparent',
                  color: value === m ? 'var(--paper)' : mColor,
                }}
              >{m}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HorseRow({ horse, onUpdate }) {
  const [showNote, setShowNote] = useState(!!horse.note);
  const hasContent = horse.mark || horse.name || horse.note;

  return (
    <div className="paper-card-sharp pl-3 py-2 pr-2">
      <div className="flex items-center gap-2">
        <span className="font-num text-xl font-bold w-7 text-center">{horse.number}</span>

        <MarkDropdown value={horse.mark} onChange={(mark) => onUpdate({ mark })} />

        <input
          type="text"
          value={horse.name}
          onChange={e => onUpdate({ name: e.target.value })}
          placeholder="馬名 (任意)"
          className="flex-1 min-w-0 bg-transparent text-sm font-gothic outline-none px-1 py-1"
          style={{ color: 'var(--ink)' }}
        />

        <button
          onClick={() => setShowNote(!showNote)}
          className="text-xs px-2 py-1 rounded-sm"
          style={{ color: showNote || horse.note ? 'var(--ink)' : 'var(--muted)' }}
        >
          メモ
        </button>
      </div>

      {(showNote || horse.note) && (
        <textarea
          value={horse.note}
          onChange={e => onUpdate({ note: e.target.value })}
          placeholder="この馬のメモ..."
          className="w-full mt-2 bg-transparent text-sm font-gothic outline-none px-1"
          style={{
            color: 'var(--ink-light)',
            border: 'none',
            overflow: 'hidden',
            minHeight: '24px',
          }}
          onInput={e => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          rows={1}
        />
      )}
    </div>
  );
}

// ============================================================
// 買い目タブ
// ============================================================

function KaimeTab({ race, onChange, onShare }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBet, setEditingBet] = useState(null);

  const addBet = () => { setEditingBet(null); setModalOpen(true); };
  const editBet = (bet) => { setEditingBet(bet); setModalOpen(true); };

  const saveBet = (bet) => {
    if (editingBet) {
      onChange({ ...race, bets: race.bets.map(b => b.id === editingBet.id ? bet : b) });
    } else {
      onChange({ ...race, bets: [...race.bets, bet] });
    }
    setModalOpen(false);
    setEditingBet(null);
  };

  const deleteBet = (id) => {
    if (!confirm('この買い目を削除しますか？')) return;
    onChange({ ...race, bets: race.bets.filter(b => b.id !== id) });
  };

  const total = race.bets.reduce((s, b) => s + calculatePoints(b) * b.amountPerPoint, 0);

  return (
    <div className="p-4 space-y-3">
      {race.bets.length === 0 && (
        <div className="text-center py-10 font-gothic text-sm" style={{ color: 'var(--muted)' }}>
          まだ買い目はありません
        </div>
      )}

      {race.bets.map(bet => (
        <BetCard key={bet.id} bet={bet} onEdit={() => editBet(bet)} onDelete={() => deleteBet(bet.id)} />
      ))}

      <button
        onClick={addBet}
        className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm"
        style={{ background: 'var(--paper)', border: '1px dashed var(--border-strong)', color: 'var(--ink)' }}
      >
        <Plus size={16} /> 買い目を追加
      </button>

      {race.bets.length > 0 && (
        <>
          <div className="divider-h mt-6"></div>
          <div className="flex items-baseline justify-between py-2">
            <span className="font-mincho text-sm">合計</span>
            <span className="font-num text-xl font-bold">¥{total.toLocaleString()}</span>
          </div>
          <button
            onClick={onShare}
            className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm font-bold"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <Share2 size={16} /> 共有テキストを作成
          </button>
        </>
      )}

      {modalOpen && (
        <BetModal
          race={race}
          bet={editingBet}
          onSave={saveBet}
          onCancel={() => { setModalOpen(false); setEditingBet(null); }}
        />
      )}
    </div>
  );
}

function BetCard({ bet, onEdit, onDelete }) {
  const kenshuLabel = KENSHU_OPTIONS.find(k => k.value === bet.kenshu)?.label || '';
  const kaikataLabel = KAIKATA_BY_KENSHU[bet.kenshu]?.find(k => k.value === bet.kaikata)?.label || '';
  const points = calculatePoints(bet);
  const total = points * bet.amountPerPoint;

  const configs = getGroupConfigs(bet.kenshu, bet.kaikata);
  const groups = [bet.g1, bet.g2, bet.g3].filter(g => g && g.length > 0);

  return (
    <div className="paper-card rounded-sm p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mincho text-base font-bold">{kenshuLabel}</span>
          <span className="font-gothic text-xs" style={{ color: 'var(--ink-light)' }}>{kaikataLabel}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5" style={{ color: 'var(--ink-light)' }}><Edit2 size={14} /></button>
          <button onClick={onDelete} className="p-1.5" style={{ color: 'var(--accent)' }}><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="space-y-0.5 mb-2">
        {configs.map((cfg, i) => {
          const g = [bet.g1, bet.g2, bet.g3][i] || [];
          if (g.length === 0) return null;
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-gothic text-xs w-20 flex-shrink-0" style={{ color: 'var(--muted)' }}>{cfg.label}</span>
              <span className="font-num">{g.sort((a,b)=>a-b).join(', ')}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-baseline justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="font-num text-xs" style={{ color: 'var(--ink-light)' }}>
          {points}点 × {bet.amountPerPoint}円
        </span>
        <span className="font-num text-base font-bold">¥{total.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ============================================================
// 買い目モーダル
// ============================================================

function BetModal({ race, bet, onSave, onCancel }) {
  const [kenshu, setKenshu] = useState(bet?.kenshu || 'sanrenpuku');
  const [kaikata, setKaikata] = useState(bet?.kaikata || 'formation');
  const [g1, setG1] = useState(bet?.g1 || []);
  const [g2, setG2] = useState(bet?.g2 || []);
  const [g3, setG3] = useState(bet?.g3 || []);
  const [amount, setAmount] = useState(bet?.amountPerPoint || 100);

  const handleKenshuChange = (newKenshu) => {
    setKenshu(newKenshu);
    const available = KAIKATA_BY_KENSHU[newKenshu];
    if (!available.find(k => k.value === kaikata)) {
      setKaikata(available[0].value);
    }
    setG1([]); setG2([]); setG3([]);
  };

  const handleKaikataChange = (newKaikata) => {
    setKaikata(newKaikata);
    setG1([]); setG2([]); setG3([]);
  };

  const configs = getGroupConfigs(kenshu, kaikata);
  const setters = [setG1, setG2, setG3];
  const values = [g1, g2, g3];

  const currentBet = { kenshu, kaikata, g1, g2, g3, amountPerPoint: amount };
  const points = calculatePoints(currentBet);
  const total = points * amount;
  const isWarn = points > 100 || total > 10000;
  const canSave = points > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (isWarn && !confirm(`点数 ${points}点 / 合計 ${total.toLocaleString()}円 です。よろしいですか？`)) return;
    onSave({
      id: bet?.id || crypto.randomUUID(),
      kenshu, kaikata, g1, g2, g3,
      amountPerPoint: amount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={onCancel} className="p-1"><X size={22} /></button>
        <h2 className="font-mincho text-base font-bold flex-1">{bet ? '買い目を編集' : '買い目を追加'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 券種 */}
        <div>
          <div className="font-gothic text-xs mb-2" style={{ color: 'var(--muted)' }}>券種</div>
          <div className="grid grid-cols-4 gap-1.5">
            {KENSHU_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleKenshuChange(opt.value)}
                className="py-2 rounded-sm font-mincho text-sm"
                style={{
                  background: kenshu === opt.value ? 'var(--ink)' : 'var(--paper)',
                  color: kenshu === opt.value ? 'var(--paper)' : 'var(--ink)',
                  border: `1px solid ${kenshu === opt.value ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* 買い方 */}
        <div>
          <div className="font-gothic text-xs mb-2" style={{ color: 'var(--muted)' }}>買い方</div>
          <div className="flex flex-wrap gap-1.5">
            {KAIKATA_BY_KENSHU[kenshu].map(opt => (
              <button
                key={opt.value}
                onClick={() => handleKaikataChange(opt.value)}
                className="px-3 py-1.5 rounded-sm font-gothic text-xs"
                style={{
                  background: kaikata === opt.value ? 'var(--ink)' : 'var(--paper)',
                  color: kaikata === opt.value ? 'var(--paper)' : 'var(--ink)',
                  border: `1px solid ${kaikata === opt.value ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* 馬番入力 */}
        {configs.map((cfg, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between mb-2">
              <div className="font-mincho text-sm font-bold">{cfg.label}</div>
              <div className="font-num text-xs" style={{ color: 'var(--muted)' }}>
                {values[i].length}頭
                {cfg.max !== Infinity && cfg.max > 1 && ` / 最大${cfg.max}頭`}
              </div>
            </div>
            <HorseGrid
              horseCount={race.horseCount}
              horses={race.horses}
              selected={values[i]}
              maxSelect={cfg.max}
              onToggle={setters[i]}
            />
          </div>
        ))}

        {/* 金額 */}
        <div>
          <div className="font-gothic text-xs mb-2" style={{ color: 'var(--muted)' }}>1点あたり金額</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Math.max(100, Math.floor(Number(e.target.value) / 100) * 100))}
              step={100}
              min={100}
              className="flex-1 px-3 py-2 rounded-sm font-num text-base"
              style={{ background: 'var(--paper)', border: '1px solid var(--border)' }}
            />
            <span className="font-mincho text-sm">円</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[100, 200, 500, 1000].map(v => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="px-2 py-1 text-xs font-num rounded-sm"
                style={{
                  background: amount === v ? 'var(--ink)' : 'transparent',
                  color: amount === v ? 'var(--paper)' : 'var(--ink-light)',
                  border: `1px solid ${amount === v ? 'var(--ink)' : 'var(--border)'}`,
                }}
              >{v}円</button>
            ))}
          </div>
        </div>
      </div>

      {/* フッター: 計算結果 */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}>
        {isWarn && (
          <div className="flex items-center gap-1.5 mb-2 text-xs" style={{ color: 'var(--accent)' }}>
            <AlertTriangle size={14} />
            <span className="font-gothic">点数または金額が大きくなっています</span>
          </div>
        )}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="font-num text-xl font-bold">{points}</span>
            <span className="font-mincho text-sm ml-1">点</span>
            <span className="font-gothic text-xs mx-2" style={{ color: 'var(--muted)' }}>×</span>
            <span className="font-num text-sm">{amount}円</span>
          </div>
          <div>
            <span className="font-mincho text-xs" style={{ color: 'var(--muted)' }}>合計</span>
            <span className="font-num text-2xl font-bold ml-2">¥{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 font-gothic text-sm rounded-sm"
            style={{ background: 'var(--paper)', border: '1px solid var(--border)', color: 'var(--ink)' }}
          >キャンセル</button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-3 font-gothic text-sm font-bold rounded-sm"
            style={{
              background: canSave ? 'var(--ink)' : 'var(--border)',
              color: 'var(--paper)',
              opacity: canSave ? 1 : 0.5,
            }}
          >{bet ? '更新' : '追加'}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 共有モーダル
// ============================================================

function ShareModal({ race, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = generateShareText(race);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={onClose} className="p-1"><X size={22} /></button>
        <h2 className="font-mincho text-base font-bold flex-1">共有テキスト</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="paper-card p-4 rounded-sm font-mincho text-sm whitespace-pre-wrap leading-relaxed"
          style={{ color: 'var(--ink)' }}
        >
          {text}
        </div>
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}>
        <button
          onClick={handleCopy}
          className="w-full py-3 font-gothic text-sm font-bold rounded-sm flex items-center justify-center gap-2"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          {copied ? <><Check size={16} /> コピーしました</> : <><Copy size={16} /> クリップボードにコピー</>}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// レース詳細
// ============================================================

function RaceDetail({ race, onBack, onChange }) {
  const [tab, setTab] = useState('yoso');
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-2 px-3 py-3" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} className="p-1"><ChevronLeft size={22} /></button>
        <div className="flex-1 font-mincho">
          <div className="text-base font-bold leading-tight">
            {race.keibajo}{race.raceNumber}R <span className="font-normal">{race.raceName}</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{race.horseCount}頭立て</div>
        </div>
      </header>

      {/* レース全体メモ */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mincho text-xs font-bold" style={{ color: 'var(--ink-light)' }}>メモ</span>
        </div>
        <textarea
          value={race.raceMemo}
          onChange={e => onChange({ ...race, raceMemo: e.target.value })}
          placeholder="レース全体の予想メモ..."
          className="w-full font-gothic text-sm bg-transparent outline-none leading-relaxed"
          style={{ color: 'var(--ink)', border: 'none', overflow: 'hidden', minHeight: '24px' }}
          onInput={e => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          rows={1}
        />
      </div>

      {/* タブ */}
      <div className="tab-bar flex">
        <button
          onClick={() => setTab('yoso')}
          className={`flex-1 py-3 font-mincho text-sm ${tab === 'yoso' ? 'tab-active' : 'tab-inactive'}`}
        >予想</button>
        <button
          onClick={() => setTab('kaime')}
          className={`flex-1 py-3 font-mincho text-sm ${tab === 'kaime' ? 'tab-active' : 'tab-inactive'}`}
        >買い目 {race.bets.length > 0 && `(${race.bets.length})`}</button>
      </div>

      {/* タブ中身 */}
      <div className="flex-1">
        {tab === 'yoso' && <YosoTab race={race} onChange={onChange} />}
        {tab === 'kaime' && <KaimeTab race={race} onChange={onChange} onShare={() => setShareOpen(true)} />}
      </div>

      {shareOpen && <ShareModal race={race} onClose={() => setShareOpen(false)} />}
    </div>
  );
}

// ============================================================
// ホーム画面
// ============================================================

function HomeScreen({ races, onSelectRace, onCreateRace, onDeleteRace }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="px-4 pt-6 pb-4" style={{ borderBottom: '2px solid var(--ink)' }}>
        <div className="font-mincho text-2xl font-bold tracking-tight">競馬下書き帳</div>
        <div className="font-gothic text-xs mt-1" style={{ color: 'var(--muted)' }}>予想・買い目を仲間に送るまで</div>
      </header>

      <div className="p-4 space-y-3">
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="w-full py-3 font-gothic text-sm flex items-center justify-center gap-2 rounded-sm"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <Plus size={16} /> 新しいレース
          </button>
        )}

        {creating && (
          <NewRaceForm
            onCreate={(r) => { onCreateRace(r); setCreating(false); }}
            onCancel={() => setCreating(false)}
          />
        )}

        {races.length === 0 && !creating && (
          <div className="text-center py-16 font-gothic text-sm" style={{ color: 'var(--muted)' }}>
            まだレースがありません
          </div>
        )}

        <div className="space-y-2">
          {races.map(race => (
            <RaceListItem key={race.id} race={race} onSelect={() => onSelectRace(race.id)} onDelete={() => onDeleteRace(race.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RaceListItem({ race, onSelect, onDelete }) {
  const date = new Date(race.createdAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
  const total = race.bets.reduce((s, b) => s + calculatePoints(b) * b.amountPerPoint, 0);

  return (
    <div className="paper-card rounded-sm">
      <button onClick={onSelect} className="w-full text-left p-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-num text-xs" style={{ color: 'var(--muted)' }}>{dateStr}</span>
          <span className="font-mincho text-sm font-bold">{race.keibajo}{race.raceNumber}R</span>
        </div>
        <div className="font-mincho text-base mb-1" style={{ color: 'var(--ink)' }}>{race.raceName || '(無題)'}</div>
        <div className="flex items-baseline justify-between">
          <div className="font-gothic text-xs" style={{ color: 'var(--ink-light)' }}>
            買い目 {race.bets.length}件
          </div>
          {total > 0 && (
            <div className="font-num text-sm">¥{total.toLocaleString()}</div>
          )}
        </div>
      </button>
      <div className="px-3 pb-2 flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); if (confirm('削除しますか？')) onDelete(); }}
          className="text-xs font-gothic py-1 px-2"
          style={{ color: 'var(--muted)' }}
        >削除</button>
      </div>
    </div>
  );
}

function NewRaceForm({ onCreate, onCancel }) {
  const [keibajo, setKeibajo] = useState('東京');
  const [raceNumber, setRaceNumber] = useState(11);
  const [raceName, setRaceName] = useState('');
  const [horseCount, setHorseCount] = useState(18);

  const keibajoOptions = ['東京', '中山', '阪神', '京都', '中京', '新潟', '福島', '小倉', '札幌', '函館'];

  const handleCreate = () => {
    onCreate(createEmptyRace(keibajo, raceNumber, raceName, horseCount));
  };

  return (
    <div className="paper-card rounded-sm p-4 space-y-3">
      <div className="font-mincho text-sm font-bold">新しいレース</div>

      <div>
        <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>競馬場</div>
        <div className="flex flex-wrap gap-1">
          {keibajoOptions.map(k => (
            <button
              key={k}
              onClick={() => setKeibajo(k)}
              className="px-2.5 py-1 rounded-sm font-mincho text-xs"
              style={{
                background: keibajo === k ? 'var(--ink)' : 'var(--bg)',
                color: keibajo === k ? 'var(--paper)' : 'var(--ink)',
                border: `1px solid ${keibajo === k ? 'var(--ink)' : 'var(--border)'}`,
              }}
            >{k}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>R</div>
          <input
            type="number"
            value={raceNumber}
            onChange={e => setRaceNumber(Number(e.target.value))}
            min={1} max={12}
            className="w-full px-2 py-1.5 rounded-sm font-num text-sm"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          />
        </div>
        <div>
          <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>頭数</div>
          <input
            type="number"
            value={horseCount}
            onChange={e => setHorseCount(Number(e.target.value))}
            min={2} max={18}
            className="w-full px-2 py-1.5 rounded-sm font-num text-sm"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          />
        </div>
      </div>

      <div>
        <div className="font-gothic text-xs mb-1.5" style={{ color: 'var(--muted)' }}>レース名</div>
        <input
          type="text"
          value={raceName}
          onChange={e => setRaceName(e.target.value)}
          placeholder="例: 日本ダービー"
          className="w-full px-2 py-1.5 rounded-sm font-gothic text-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 font-gothic text-sm rounded-sm"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >キャンセル</button>
        <button
          onClick={handleCreate}
          className="flex-1 py-2 font-gothic text-sm font-bold rounded-sm"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >作成</button>
      </div>
    </div>
  );
}

// ============================================================
// アプリ本体
// ============================================================

export default function App() {
  const [races, setRaces] = useState([createSampleRace()]);
  const [currentRaceId, setCurrentRaceId] = useState(null);

  const currentRace = useMemo(
    () => races.find(r => r.id === currentRaceId) || null,
    [races, currentRaceId]
  );

  const updateRace = (updated) => {
    setRaces(rs => rs.map(r => r.id === updated.id ? updated : r));
  };

  const createRace = (race) => {
    setRaces(rs => [race, ...rs]);
    setCurrentRaceId(race.id);
  };

  const deleteRace = (id) => {
    setRaces(rs => rs.filter(r => r.id !== id));
  };

  return (
    <>
      <style>{STYLE}</style>
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
    </>
  );
}
