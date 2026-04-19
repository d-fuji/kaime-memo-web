import type { GroupConfig, Kaikata, Kenshu, Mark } from './types';

export const MARKS: Mark[] = ['◎', '○', '▲', '△', '☆', '✕'];

export const KENSHU_OPTIONS: { value: Kenshu; label: string }[] = [
  { value: 'umaren', label: '馬連' },
  { value: 'umatan', label: '馬単' },
  { value: 'sanrenpuku', label: '3連複' },
  { value: 'sanrentan', label: '3連単' },
];

export const KAIKATA_BY_KENSHU: Record<Kenshu, { value: Kaikata; label: string }[]> = {
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

const NORMAL_CONFIGS: Record<Kenshu, GroupConfig[]> = {
  umaren: [
    { label: '1頭目', max: 1 },
    { label: '2頭目', max: 1 },
  ],
  umatan: [
    { label: '1着', max: 1 },
    { label: '2着', max: 1 },
  ],
  sanrenpuku: [
    { label: '1頭目', max: 1 },
    { label: '2頭目', max: 1 },
    { label: '3頭目', max: 1 },
  ],
  sanrentan: [
    { label: '1着', max: 1 },
    { label: '2着', max: 1 },
    { label: '3着', max: 1 },
  ],
};

const FORMATION_CONFIGS: Record<Kenshu, GroupConfig[]> = {
  umaren: [
    { label: '1頭目候補', max: Infinity },
    { label: '2頭目候補', max: Infinity },
  ],
  umatan: [
    { label: '1着候補', max: Infinity },
    { label: '2着候補', max: Infinity },
  ],
  sanrenpuku: [
    { label: '1枠候補', max: Infinity },
    { label: '2枠候補', max: Infinity },
    { label: '3枠候補', max: Infinity },
  ],
  sanrentan: [
    { label: '1着候補', max: Infinity },
    { label: '2着候補', max: Infinity },
    { label: '3着候補', max: Infinity },
  ],
};

const NAGASHI_CONFIGS: Partial<Record<Kaikata, GroupConfig[]>> = {
  nagashi: [
    { label: '軸', max: 1 },
    { label: '相手', max: Infinity },
  ],
  nagashi_1chaku: [
    { label: '軸（1着）', max: 1 },
    { label: '相手', max: Infinity },
  ],
  nagashi_2chaku: [
    { label: '軸（2着）', max: 1 },
    { label: '相手', max: Infinity },
  ],
  nagashi_3chaku: [
    { label: '軸（3着）', max: 1 },
    { label: '相手', max: Infinity },
  ],
  nagashi_12chaku: [
    { label: '軸（1・2着）', max: 2 },
    { label: '相手（3着）', max: Infinity },
  ],
  nagashi_23chaku: [
    { label: '軸（2・3着）', max: 2 },
    { label: '相手（1着）', max: Infinity },
  ],
  nagashi_jiku1: [
    { label: '軸', max: 1 },
    { label: '相手', max: Infinity },
  ],
  nagashi_jiku2: [
    { label: '軸', max: 2 },
    { label: '相手', max: Infinity },
  ],
};

export function getGroupConfigs(kenshu: Kenshu, kaikata: Kaikata): GroupConfig[] {
  if (kaikata === 'normal') return NORMAL_CONFIGS[kenshu];
  if (kaikata === 'box') return [{ label: 'BOX馬', max: Infinity }];
  if (kaikata === 'formation') return FORMATION_CONFIGS[kenshu];
  return NAGASHI_CONFIGS[kaikata] ?? [];
}

export function getKenshuLabel(kenshu: Kenshu): string {
  return KENSHU_OPTIONS.find((k) => k.value === kenshu)?.label ?? '';
}

export function getKaikataLabel(kenshu: Kenshu, kaikata: Kaikata): string {
  return KAIKATA_BY_KENSHU[kenshu]?.find((k) => k.value === kaikata)?.label ?? '';
}
