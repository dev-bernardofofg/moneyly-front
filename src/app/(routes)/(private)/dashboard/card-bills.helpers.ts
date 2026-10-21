import type { CardBills } from '@/api/generated/types/CardBills';

const SERIES = ['--series-1', '--series-2', '--series-3', '--series-4', '--series-5'];
export const OTHER_COLOR = 'var(--series-other)';
export const OTHER_LABEL = 'Outras';

export interface BillSegment {
  key: string;
  name: string;
  amount: number;
  color: string;
}

/**
 * Cor segue a categoria, não a posição no cartão: as 5 maiores no total de todos os cartões
 * ganham uma cor fixa (mesma cor em todos os cartões); o resto vira "Outras".
 */
export const buildCategoryColors = (bills: CardBills['bills']): Map<string, string> => {
  const totals = new Map<string, number>();
  for (const bill of bills) {
    for (const category of bill.categories) {
      totals.set(category.categoryId, (totals.get(category.categoryId) ?? 0) + category.amount);
    }
  }
  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, SERIES.length);
  return new Map(ranked.map(([categoryId], index) => [categoryId, `var(${SERIES[index]})`]));
};

export const billSegments = (
  bill: CardBills['bills'][number],
  colors: Map<string, string>
): BillSegment[] => {
  const segments: BillSegment[] = [];
  let other = 0;
  for (const category of bill.categories) {
    const color = colors.get(category.categoryId);
    if (color) {
      segments.push({
        key: category.categoryId,
        name: category.name,
        amount: category.amount,
        color,
      });
    } else {
      other += category.amount;
    }
  }
  if (other > 0) {
    segments.push({ key: 'other', name: OTHER_LABEL, amount: other, color: OTHER_COLOR });
  }
  return segments;
};
