import type { FinancialInsights } from '@/api/generated/types/FinancialInsights';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';

export type InsightCategory = FinancialInsights['categories'][number];

export interface CompositionSegment {
  key: 'free' | 'bills' | 'budgets' | 'goals';
  label: string;
  value: number;
  color: string;
}

/**
 * Para onde vai o dinheiro do período (saldo anterior + entradas): o que ainda está livre e o
 * que já tem destino. Soma exata do Saldo Livre: livre + contas + reservas = dinheiro do período.
 * Cores fixas por papel (nunca pela posição), na ordem da paleta categórica.
 */
export const freeBalanceComposition = (forecast: ForecastResponse) => {
  const { total, components } = forecast.freeBalance;
  const committed: CompositionSegment[] = [
    {
      key: 'bills',
      label: 'Contas a pagar',
      value: components.futureRecurringExpense,
      color: 'var(--series-2)',
    },
    {
      key: 'budgets',
      label: 'Reservado para orçamentos',
      value: components.budgetReserve,
      color: 'var(--series-3)',
    },
    {
      key: 'goals',
      label: 'Reservado para metas',
      value: components.goalReserve,
      color: 'var(--series-4)',
    },
  ];
  const committedTotal = committed.reduce((sum, segment) => sum + segment.value, 0);
  const free = Math.max(0, total);

  return {
    periodMoney: total + committedTotal,
    // Base da barra: com Saldo Livre negativo, o comprometido passa do dinheiro do período.
    base: free + committedTotal,
    shortfall: total < 0 ? -total : 0,
    segments: [
      { key: 'free', label: 'Livre para gastar', value: free, color: 'var(--series-1)' },
      ...committed,
    ].filter((segment) => segment.value > 0) as CompositionSegment[],
  };
};

/** Quanto dá para gastar por dia sem passar do Saldo Livre; só faz sentido com período aberto. */
export const dailyAllowance = (total: number, daysRemaining: number) =>
  total > 0 && daysRemaining > 0 ? Math.floor(total / daysRemaining) : null;

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
