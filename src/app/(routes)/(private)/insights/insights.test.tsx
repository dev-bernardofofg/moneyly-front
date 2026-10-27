import type { FinancialInsights } from '@/api/generated/types/FinancialInsights';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cleanup, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  dailyAllowance,
  foldCategories,
  freeBalanceComposition,
  risingCategories,
  type InsightCategory,
} from './insights.helpers';
import { SpendingByCategorySection } from './spending-by-category-section';
import { SpendingHistorySection } from './spending-history-section';

afterEach(cleanup);

const category = (
  name: string,
  amount: number,
  extra: Partial<InsightCategory> = {}
): InsightCategory => ({
  categoryId: `id-${name}`,
  name,
  amount,
  share: 0,
  averageAmount: null,
  deltaPct: null,
  signal: 'stable',
  ...extra,
});

const forecastWith = (total: number, components: Record<string, number>) =>
  ({
    freeBalance: {
      total,
      components: {
        futureRecurringExpense: 0,
        budgetReserve: 0,
        goalReserve: 0,
        ...components,
      },
    },
  }) as unknown as ForecastResponse;

const makeInsights = (
  overrides: Partial<FinancialInsights['spending']> = {}
): FinancialInsights => ({
  period: {
    id: 'p2',
    startDate: '2026-10-05T03:00:00.000Z',
    endDate: '2026-11-05T02:59:59.000Z',
    label: 'Outubro - Novembro 2026',
    isOpen: true,
  },
  spending: {
    income: 500000,
    expense: 160000,
    upcomingExpense: 30000,
    projectedExpense: 190000,
    averageExpense: 120000,
    deltaPct: 58.3,
    signal: 'up',
    periodsCompared: 1,
    ...overrides,
  },
  history: [
    {
      periodId: 'p1',
      label: 'Setembro - Outubro 2026',
      startDate: '2026-09-05T03:00:00.000Z',
      endDate: '2026-10-05T02:59:59.000Z',
      income: 500000,
      expense: 120000,
      projectedExpense: 120000,
      isSelected: false,
    },
    {
      periodId: 'p2',
      label: 'Outubro - Novembro 2026',
      startDate: '2026-10-05T03:00:00.000Z',
      endDate: '2026-11-05T02:59:59.000Z',
      income: 500000,
      expense: 160000,
      projectedExpense: 190000,
      isSelected: true,
    },
  ],
  categories: [
    category('Mercado', 150000, {
      share: 93.8,
      averageAmount: 100000,
      deltaPct: 50,
      signal: 'up',
    }),
    category('Farmácia', 10000, { share: 6.3, averageAmount: 0 }),
  ],
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

describe('insights helpers', () => {
  it('splits the period money into free and committed, summing to the whole', () => {
    const composition = freeBalanceComposition(
      forecastWith(50000, { futureRecurringExpense: 30000, budgetReserve: 20000 })
    );

    expect(composition.periodMoney).toBe(100000);
    expect(composition.shortfall).toBe(0);
    expect(composition.segments.map((segment) => [segment.key, segment.value])).toEqual([
      ['free', 50000],
      ['bills', 30000],
      ['budgets', 20000],
    ]);
  });

  it('reports the shortfall when commitments exceed the period money', () => {
    const composition = freeBalanceComposition(
      forecastWith(-10000, { futureRecurringExpense: 30000 })
    );

    expect(composition.shortfall).toBe(10000);
    expect(composition.segments.map((segment) => segment.key)).toEqual(['bills']);
  });

  it('spreads the free balance over the remaining days', () => {
    expect(dailyAllowance(30000, 10)).toBe(3000);
    expect(dailyAllowance(-5000, 10)).toBeNull();
    expect(dailyAllowance(30000, 0)).toBeNull();
  });

  it('folds the tail of the categories into one row', () => {
    const many = Array.from({ length: 9 }, (_, index) =>
      category(`C${index}`, 1000 - index, { share: 10 })
    );
    const { top, other } = foldCategories(many);

    expect(top).toHaveLength(6);
    expect(other).toEqual({ count: 3, amount: 994 + 993 + 992, share: 30 });
    expect(foldCategories(many.slice(0, 7)).other).toBeNull();
  });

  it('points out only categories that really went up', () => {
    const rising = risingCategories([
      category('Mercado', 150000, { signal: 'up', averageAmount: 100000, deltaPct: 50 }),
      category('Café', 900, { signal: 'up', averageAmount: 500, deltaPct: 80 }),
      category('Lazer', 5000, { signal: 'down', averageAmount: 9000, deltaPct: -44 }),
    ]);

    expect(rising.map((item) => item.name)).toEqual(['Mercado']);
  });
});

describe('SpendingHistorySection', () => {
  it('states the projection against the average in words', () => {
    render(<SpendingHistorySection insights={makeInsights()} loading={false} error={false} />, {
      wrapper,
    });

    expect(screen.getByText('Previsto para este período')).toBeInTheDocument();
    expect(screen.getByText(/58% acima da sua média de R\$\s1\.200,00/)).toBeInTheDocument();
    expect(screen.getByText(/em contas que ainda vão cair/)).toBeInTheDocument();
  });

  it('says when there is nothing to compare with', () => {
    render(
      <SpendingHistorySection
        insights={makeInsights({ averageExpense: null, deltaPct: null, signal: 'stable' })}
        loading={false}
        error={false}
      />,
      { wrapper }
    );

    expect(screen.getByText('Ainda não há períodos anteriores para comparar.')).toBeInTheDocument();
  });

  it('offers every value in a table', () => {
    render(<SpendingHistorySection insights={makeInsights()} loading={false} error={false} />, {
      wrapper,
    });

    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[2]).toHaveTextContent('R$ 1.900,00');
  });
});

describe('SpendingByCategorySection', () => {
  it('lists each category with its share and comparison in text', () => {
    render(<SpendingByCategorySection insights={makeInsights()} loading={false} error={false} />);

    const list = screen.getByRole('list', { name: 'Gastos por categoria' });
    const [market, pharmacy] = within(list).getAllByRole('listitem');
    expect(market).toHaveTextContent('Mercado');
    expect(market).toHaveTextContent('↑ 50% vs média');
    expect(pharmacy).toHaveTextContent('novo neste período');
  });
});
