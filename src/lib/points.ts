import type { Bet, Kaikata } from './types';

export function calculatePoints(bet: Bet): number {
  const { kenshu, kaikata, g1 = [], g2 = [], g3 = [] } = bet;
  try {
    if (kenshu === 'umaren') return umarenPoints(kaikata, g1, g2);
    if (kenshu === 'umatan') return umatanPoints(kaikata, g1, g2);
    if (kenshu === 'sanrenpuku') return sanrenpukuPoints(kaikata, g1, g2, g3);
    if (kenshu === 'sanrentan') return sanrentanPoints(kaikata, g1, g2, g3);
  } catch {
    return 0;
  }
  return 0;
}

function umarenPoints(kaikata: Kaikata, g1: number[], g2: number[]): number {
  switch (kaikata) {
    case 'normal':
      return g1.length === 1 && g2.length === 1 && g1[0] !== g2[0] ? 1 : 0;
    case 'box': {
      const n = g1.length;
      return n >= 2 ? (n * (n - 1)) / 2 : 0;
    }
    case 'formation': {
      const set = new Set<string>();
      for (const a of g1) {
        for (const b of g2) {
          if (a !== b) set.add([a, b].sort((x, y) => x - y).join(','));
        }
      }
      return set.size;
    }
    case 'nagashi':
      if (g1.length !== 1) return 0;
      return g2.filter((x) => x !== g1[0]).length;
    default:
      return 0;
  }
}

function umatanPoints(kaikata: Kaikata, g1: number[], g2: number[]): number {
  switch (kaikata) {
    case 'normal':
      return g1.length === 1 && g2.length === 1 && g1[0] !== g2[0] ? 1 : 0;
    case 'box': {
      const n = g1.length;
      return n >= 2 ? n * (n - 1) : 0;
    }
    case 'formation': {
      const set = new Set<string>();
      for (const a of g1) {
        for (const b of g2) {
          if (a !== b) set.add(`${a},${b}`);
        }
      }
      return set.size;
    }
    case 'nagashi_1chaku':
    case 'nagashi_2chaku':
      if (g1.length !== 1) return 0;
      return g2.filter((x) => x !== g1[0]).length;
    default:
      return 0;
  }
}

function sanrenpukuPoints(kaikata: Kaikata, g1: number[], g2: number[], g3: number[]): number {
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
      const set = new Set<string>();
      for (const a of g1) {
        for (const b of g2) {
          for (const c of g3) {
            if (a !== b && b !== c && a !== c) {
              set.add([a, b, c].sort((x, y) => x - y).join(','));
            }
          }
        }
      }
      return set.size;
    }
    case 'nagashi_jiku1': {
      if (g1.length !== 1) return 0;
      const aite = g2.filter((x) => x !== g1[0]);
      const n = aite.length;
      return n >= 2 ? (n * (n - 1)) / 2 : 0;
    }
    case 'nagashi_jiku2': {
      if (g1.length !== 2 || g1[0] === g1[1]) return 0;
      return g2.filter((x) => !g1.includes(x)).length;
    }
    default:
      return 0;
  }
}

function sanrentanPoints(kaikata: Kaikata, g1: number[], g2: number[], g3: number[]): number {
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
      const set = new Set<string>();
      for (const a of g1) {
        for (const b of g2) {
          for (const c of g3) {
            if (a !== b && b !== c && a !== c) set.add(`${a},${b},${c}`);
          }
        }
      }
      return set.size;
    }
    case 'nagashi_1chaku':
    case 'nagashi_2chaku':
    case 'nagashi_3chaku': {
      if (g1.length !== 1) return 0;
      const aite = g2.filter((x) => x !== g1[0]);
      const n = aite.length;
      return n >= 2 ? n * (n - 1) : 0;
    }
    case 'nagashi_12chaku':
    case 'nagashi_23chaku': {
      if (g1.length !== 2 || g1[0] === g1[1]) return 0;
      return g2.filter((x) => !g1.includes(x)).length * 2;
    }
    default:
      return 0;
  }
}

export function calculateTotal(bets: Bet[]): number {
  return bets.reduce((sum, b) => sum + calculatePoints(b) * b.amountPerPoint, 0);
}
