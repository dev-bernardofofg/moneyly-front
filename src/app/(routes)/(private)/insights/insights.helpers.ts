import type { FinancialInsights } from '@/api/generated/types/FinancialInsights';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';

export type InsightCategory = FinancialInsights['categories'][number];

export interface CompositionSegment {
  key: 'free' | 'recurring' | 'cards';
  label: string;
  value: number;
  color: string;
}

/**
 * Para onde vai o dinheiro até o próximo salário (contas + outras entradas): o que ainda está
 * livre e o que já tem destino. Soma exata do Saldo Livre: livre + recorrentes + faturas = dinheiro.
 * Cores fixas por papel (nunca pela posição), na ordem da paleta categórica.
 */
export const freeBalanceComposition = (forecast: ForecastResponse) => {
  const { total, components } = forecast.freeBalance;
  const committed: CompositionSegment[] = [
    {
      key: 'recurring',
      label: 'Contas recorrentes',
      value: components.recurringExpense,
      color: 'var(--series-2)',
    },
    {
      key: 'cards',
      label: 'Faturas de cartão',
      value: components.cardBills,
      color: 'var(--series-3)',
    },
  ];
  const committedTotal = committed.reduce((sum, segment) => sum + segment.value, 0);
  const free = Math.max(0, total);

  return {
    periodMoney: total + committedTotal,
    // Base da barra: com Saldo Livre negativo, o comprometido passa do dinheiro disponível.
    base: free + committedTotal,
    shortfall: total < 0 ? -total : 0,
    segments: [
      { key: 'free', label: 'Livre para gastar', value: free, color: 'var(--series-1)' },
      ...committed,
    ].filter((segment) => segment.value > 0) as CompositionSegment[],
  };
};

const MAX_CATEGORIES = 6;

/** As maiores categorias e o resto somado em "Outras", para a lista não virar um extrato. */
export const foldCategories = (categories: InsightCategory[]) => {
  if (categories.length <= MAX_CATEGORIES + 1) return { top: categories, other: null };
  const rest = categories.slice(MAX_CATEGORIES);
  return {
    top: categories.slice(0, MAX_CATEGORIES),
    other: {
      count: rest.length,
      amount: rest.reduce((sum, category) => sum + category.amount, 0),
      share: Number(rest.reduce((sum, category) => sum + category.share, 0).toFixed(1)),
    },
  };
};

const MIN_AVERAGE_FOR_ALERT = 1000; // R$ 10: abaixo disso, variação percentual é ruído.

/** Categorias que subiram de verdade contra a média: o que vale a pena olhar primeiro. */
export const risingCategories = (categories: InsightCategory[]) =>
  categories
    .filter(
      (category) =>
        category.signal === 'up' && (category.averageAmount ?? 0) >= MIN_AVERAGE_FOR_ALERT
    )
    .sort((a, b) => b.amount - (b.averageAmount ?? 0) - (a.amount - (a.averageAmount ?? 0)))
    .slice(0, 3);

export const formatPercent = (value: number) =>
  `${Math.abs(value).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%`;
