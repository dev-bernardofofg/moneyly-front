import type { ForecastResponse } from '@/app/(resources)/(generated)/types/ForecastResponse';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FreeBalanceBreakdownSection } from './free-balance-breakdown-section';
import { buildFreeBalanceMessages } from './free-balance-messages';

const makeForecast = (
  overrides: {
    components?: Partial<ForecastResponse['freeBalance']['components']>;
    income?: Partial<ForecastResponse['freeBalance']['income']>;
    total?: number;
    endDate?: string;
    occurrences?: ForecastResponse['projected']['occurrences'];
  } = {}
): ForecastResponse => {
  const components = {
    realizedBalance: 1500,
    futureRecurringIncome: 0,
    futureRecurringExpense: 300,
    pendingVariableIncome: 0,
    budgetReserve: 250,
    goalReserve: 100,
    ...overrides.components,
  };

  return {
    period: {
      id: '11111111-1111-1111-1111-111111111111',
      startDate: '2026-10-01T03:00:00.000Z',
      endDate: overrides.endDate ?? '2026-11-01T02:59:59.000Z',
      label: '01/10 a 31/10',
    },
    realized: { income: 2000, expense: 500, balance: components.realizedBalance },
    projected: {
      recurringIncome: components.futureRecurringIncome,
      recurringExpense: components.futureRecurringExpense,
      occurrences: overrides.occurrences ?? [],
    },
    projectedEndBalance: 1200,
    freeBalance: {
      total: overrides.total ?? 850,
      daysRemaining: 12,
      confidence: 'high',
      income: { fixed: 1800, variable: 0, pendingVariable: 0, ...overrides.income },
      commitments: { recurringExpenses: components.futureRecurringExpense },
      reserves: { budgets: components.budgetReserve, goals: components.goalReserve },
      components,
    },
    asOf: '2026-10-19T13:00:00.000Z',
  };
};

afterEach(cleanup);

// Intl separa moeda e valor com NBSP.
const messagesOf = (forecast: ForecastResponse) =>
  buildFreeBalanceMessages(forecast).map((message) => message.replace(/\s/g, ' '));

describe('buildFreeBalanceMessages', () => {
  it('explains bills, reserves and overtime with contract values', () => {
    const messages = messagesOf(makeForecast({ income: { variable: 200 } }));

    expect(messages).toEqual([
      'Suas contas futuras consomem R$ 300,00.',
      'R$ 350,00 estão reservados para orçamento e metas.',
      'Horas extras adicionaram R$ 200,00 à renda do período.',
    ]);
  });

  it('names the largest outflow when the free balance is negative', () => {
    const messages = messagesOf(
      makeForecast({
        total: -50,
        components: { realizedBalance: 100, futureRecurringExpense: 50, budgetReserve: 100 },
      })
    );

    expect(messages[0]).toBe(
      'Saldo Livre negativo: o maior peso vem de reserva de orçamentos (R$ 100,00).'
    );
  });

  it('flags a historical period', () => {
    const messages = messagesOf(makeForecast({ endDate: '2026-09-01T02:59:59.000Z' }));

    expect(messages[0]).toBe('Período encerrado: o valor mostra como o período terminou.');
  });

  it('says nothing affects the period when every component is zero', () => {
    const messages = messagesOf(
      makeForecast({ components: { futureRecurringExpense: 0, budgetReserve: 0, goalReserve: 0 } })
    );

    expect(messages).toEqual(['Nenhuma conta futura, reserva ou hora extra afeta este período.']);
  });
});

describe('FreeBalanceBreakdownSection', () => {
  it('lists every component so the total can be reconstructed', () => {
    render(<FreeBalanceBreakdownSection forecast={makeForecast()} loading={false} error={false} />);

    expect(screen.getByText('Saldo realizado').nextSibling).toHaveTextContent('+ R$ 1.500,00');
    expect(screen.getByText('Contas recorrentes a pagar').nextSibling).toHaveTextContent(
      '− R$ 300,00'
    );
    expect(screen.getByText('Reserva de orçamentos').nextSibling).toHaveTextContent('− R$ 250,00');
    expect(screen.getByText('Reserva de metas').nextSibling).toHaveTextContent('− R$ 100,00');
    expect(screen.getByText('Saldo Livre').nextSibling).toHaveTextContent('R$ 850,00');
  });

  it('shows a negative realized balance as a subtraction', () => {
    render(
      <FreeBalanceBreakdownSection
        forecast={makeForecast({ total: -700, components: { realizedBalance: -250 } })}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('Saldo realizado').nextSibling).toHaveTextContent('− R$ 250,00');
  });

  it('renders upcoming occurrences', () => {
    render(
      <FreeBalanceBreakdownSection
        forecast={makeForecast({
          occurrences: [
            {
              recurringTransactionId: '22222222-2222-2222-2222-222222222222',
              title: 'Aluguel',
              type: 'expense',
              amount: 300,
              date: '2026-10-25T03:00:00.000Z',
              categoryId: '33333333-3333-3333-3333-333333333333',
            },
          ],
        })}
        loading={false}
        error={false}
      />
    );

    const item = screen.getByText('Aluguel').closest('li')!;
    expect(within(item).getByText('25/10')).toBeInTheDocument();
    expect(item).toHaveTextContent('− R$ 300,00');
  });

  it('explains when there are no upcoming occurrences', () => {
    render(<FreeBalanceBreakdownSection forecast={makeForecast()} loading={false} error={false} />);

    expect(
      screen.getByText('Nenhuma conta ou entrada recorrente prevista até o fim do período.')
    ).toBeInTheDocument();
  });

  it('labels the total as final for a historical period', () => {
    render(
      <FreeBalanceBreakdownSection
        forecast={makeForecast({ endDate: '2026-09-01T02:59:59.000Z' })}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('Saldo Livre ao fim do período')).toBeInTheDocument();
  });

  it('shows a skeleton while loading and a safe message on error', () => {
    render(<FreeBalanceBreakdownSection loading error={false} />);
    expect(screen.getByLabelText('Carregando detalhamento do saldo livre')).toBeInTheDocument();
    cleanup();

    render(<FreeBalanceBreakdownSection loading={false} error />);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível detalhar');
  });
});
