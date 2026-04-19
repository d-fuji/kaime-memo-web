import { getKaikataLabel, getKenshuLabel, MARKS } from './kaikata';
import { calculatePoints, calculateTotal } from './points';
import type { Bet, Race } from './types';

function betHorseString(bet: Bet): string {
  const { kaikata, g1 = [], g2 = [], g3 = [] } = bet;

  if (kaikata === 'normal') {
    const parts = [g1, g2, g3].filter((g) => g.length > 0).map((g) => g.join(''));
    const sep = bet.kenshu === 'umaren' || bet.kenshu === 'sanrenpuku' ? '-' : '→';
    return parts.join(sep);
  }
  if (kaikata === 'box') {
    return g1.sort((a, b) => a - b).join(',');
  }
  if (kaikata === 'formation') {
    return [g1, g2, g3]
      .filter((g) => g.length > 0)
      .map((g) => g.sort((a, b) => a - b).join(','))
      .join('-');
  }
  return `${g1.sort((a, b) => a - b).join(',')}-${g2.sort((a, b) => a - b).join(',')}`;
}

export function betToText(bet: Bet): string {
  const kenshuLabel = getKenshuLabel(bet.kenshu);
  const kaikataLabel = getKaikataLabel(bet.kenshu, bet.kaikata);
  const horseStr = betHorseString(bet);
  const points = calculatePoints(bet);
  const total = points * bet.amountPerPoint;

  let kaikataShort = '';
  if (bet.kaikata === 'box') kaikataShort = 'BOX';
  else if (bet.kaikata === 'formation') kaikataShort = 'F';
  else if (bet.kaikata.startsWith('nagashi')) kaikataShort = kaikataLabel;

  const kenshuFull = `${kenshuLabel}${kaikataShort}`.trim();
  return `${kenshuFull} ${horseStr} / ${points}点×${bet.amountPerPoint}円 = ${total.toLocaleString()}円`;
}

export function generateShareText(race: Race): string {
  const markedHorses = race.horses.filter((h) => h.mark);
  const header = `📍 ${race.keibajo}${race.raceNumber}R ${race.raceName}`;

  const markLines = MARKS.flatMap((mark) => {
    const horses = markedHorses.filter((h) => h.mark === mark);
    if (horses.length === 0) return [];
    if (horses.length === 1) {
      const h = horses[0];
      return [`${mark}${h.number}${h.name ? ` ${h.name}` : ''}`];
    }
    return [`${mark}${horses.map((h) => h.number).join(',')}`];
  });

  const betLines = race.bets.map(betToText);
  const total = calculateTotal(race.bets);

  const parts: string[] = [header];
  if (markLines.length > 0) parts.push('', markLines.join('\n'));
  if (betLines.length > 0) parts.push('', betLines.join('\n'));
  if (race.bets.length > 0) parts.push('', `合計: ${total.toLocaleString()}円`);

  return parts.join('\n');
}
