import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FreeBalanceSection } from './free-balance-section';

const forecast: ForecastResponse = {
  period: {
    id: '11111111-1111-1111-1111-111111111111',
    startDate: '2026-10-01T00:00:00.000Z',
    endDate: '2026-10-31T23:59:59.000Z',
    label: '01/10 a 31/10',
  },
  realized: { income: 2000, expense: 500, balance: 1500 },
  projected: {
    recurringIncome: 0,
    recurringExpense: 300,
    occurrences: [],
  },
  projectedEndBalance: 1200,
  freeBalance: {
    total: 850,
    daysRemaining: 12,
    confidence: 'high',
    income: { fixed: 1800, variable: 200, pendingVariable: 0 },
    commitments: { recurringExpenses: 300 },
    reserves: { budgets: 250, goals: 100 },
    components: {
      realizedBalance: 1500,
      futureRecurringIncome: 0,
      futureRecurringExpense: 300,
      pendingVariableIncome: 0,
      budgetReserve: 250,
      goalReserve: 100,
    },
  },
  asOf: '2026-10-19T10:00:00.000Z',
};

afterEach(cleanup);

describe('FreeBalanceSection', () => {
  it('shows the amount and the calculation summary', () => {
    render(<FreeBalanceSection forecast={forecast} loading={false} error={false} />);

    expect(screen.getByText('R$ 850,00')).toBeInTheDocument();
    expect(screen.getByText('12 dias restantes')).toBeInTheDocument();
    expect(screen.getByText('Confiança alta')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver como é calculado' })).toHaveAttribute(
      'href',
      '/insights'
    );
  });

  it('shows a skeleton while the query is pending', () => {
    render(<FreeBalanceSection loading error={false} />);

    expect(screen.getByLabelText('Carregando saldo livre')).toBeInTheDocument();
    expect(screen.queryByText('R$ 850,00')).not.toBeInTheDocument();
  });

  it('shows a safe message when the query fails', () => {
    render(<FreeBalanceSection loading={false} error />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível calcular quanto está livre para gastar neste período.'
    );
  });
});
