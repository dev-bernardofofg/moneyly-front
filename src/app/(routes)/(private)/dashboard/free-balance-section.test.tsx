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
  realized: { income: 200000, expense: 50000, balance: 150000 },
  projected: {
    recurringIncome: 0,
    recurringExpense: 30000,
    occurrences: [],
  },
  projectedEndBalance: 120000,
  freeBalance: {
    total: 85000,
    daysRemaining: 12,
    confidence: 'high',
    income: { fixed: 180000, variable: 20000, pendingVariable: 0 },
    commitments: { recurringExpenses: 30000 },
    reserves: { budgets: 25000, goals: 10000 },
    components: {
      carryOverBalance: 0,
      realizedBalance: 150000,
      futureRecurringIncome: 0,
      futureRecurringExpense: 30000,
      pendingVariableIncome: 0,
      budgetReserve: 25000,
      goalReserve: 10000,
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
