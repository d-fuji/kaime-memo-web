export type Mark = '◎' | '○' | '▲' | '△' | '☆' | '✕';

export type Kenshu = 'umaren' | 'umatan' | 'sanrenpuku' | 'sanrentan';

export type Kaikata =
  | 'normal'
  | 'box'
  | 'formation'
  | 'nagashi'
  | 'nagashi_jiku1'
  | 'nagashi_jiku2'
  | 'nagashi_1chaku'
  | 'nagashi_2chaku'
  | 'nagashi_3chaku'
  | 'nagashi_12chaku'
  | 'nagashi_23chaku';

export interface Horse {
  number: number;
  name: string;
  mark: Mark | null;
  note: string;
}

export interface Bet {
  id: string;
  kenshu: Kenshu;
  kaikata: Kaikata;
  g1: number[];
  g2: number[];
  g3: number[];
  amountPerPoint: number;
}

export interface Race {
  id: string;
  keibajo: string;
  raceNumber: number;
  raceName: string;
  horseCount: number;
  raceMemo: string;
  horses: Horse[];
  bets: Bet[];
  createdAt: string;
}

export interface GroupConfig {
  label: string;
  max: number;
}
