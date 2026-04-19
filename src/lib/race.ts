import type { Race } from './types';

export function createEmptyRace(
  keibajo: string,
  raceNumber: number,
  raceName: string,
  horseCount: number,
): Race {
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

export function createSampleRace(): Race {
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

export function createSatsukishoSampleRace(): Race {
  const race = createEmptyRace('中山', 11, '皐月賞', 18);
  race.horses = [
    { number: 1, name: 'カヴァレリッツォ', mark: '◎', note: '1番人気想定、本命' },
    { number: 2, name: 'サウンドムーブ', mark: null, note: '' },
    { number: 3, name: 'サノノグレーター', mark: null, note: '' },
    { number: 4, name: 'ロブチェン', mark: '○', note: '上位人気' },
    { number: 5, name: 'アスクエジンバラ', mark: null, note: '' },
    { number: 6, name: 'フォルテアンジェロ', mark: null, note: '' },
    { number: 7, name: 'ロードフィレール', mark: '△', note: '' },
    { number: 8, name: 'マテンロウゲイル', mark: null, note: '' },
    { number: 9, name: 'ライヒスアドラー', mark: null, note: '' },
    { number: 10, name: 'ラージアンサンブル', mark: null, note: '' },
    { number: 11, name: 'パントルナイーフ', mark: null, note: '' },
    { number: 12, name: 'グリーンエナジー', mark: '▲', note: '上位人気' },
    { number: 13, name: 'アクロフェイズ', mark: null, note: '' },
    { number: 14, name: 'ゾロアストロ', mark: null, note: '' },
    { number: 15, name: 'リアライズシリウス', mark: '△', note: '' },
    { number: 16, name: 'アルトラムス', mark: null, note: '' },
    { number: 17, name: 'アドマイヤクワッズ', mark: null, note: '' },
    { number: 18, name: 'バステール', mark: '△', note: '' },
  ];
  race.raceMemo = '中山芝2000m G1。カヴァ軸で上位人気を厚く';
  race.bets = [
    {
      id: crypto.randomUUID(),
      kenshu: 'sanrenpuku',
      kaikata: 'formation',
      g1: [1],
      g2: [4, 12],
      g3: [7, 15, 18],
      amountPerPoint: 200,
    },
  ];
  return race;
}
