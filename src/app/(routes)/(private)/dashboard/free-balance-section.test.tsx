import type { Account } from '@/api/generated/types/Account';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FreeBalanceSection } from './free-balance-section';

vi.mock('@/forms/upsert-overtime.form', () => ({
  UpsertOvertimeForm: () => <div>Formulário de horas</div>,
}));

const today = new Date('2026-11-11T15:00:00.000Z');

const makeForecast = (
  overrides: Partial<ForecastResponse['freeBalance']> = {}
): ForecastResponse => ({
  freeBalance: {
    total: 85000,
    until: '2026-12-03T03:00:00.000Z',
    confidence: 'high',
    components: {
      accountsBalance: 100000,
      otherIncome: 0,
      recurringExpense: 5000,
      cardBills: 10000,
    },
    nextPayment: {
      date: '2026-12-03T03:00:00.000Z',
      salary: 500000,
      overtime: 40000,
      total: 540000,
    },
    committedAfter: 30000,
    ...overrides,
  },
});

const accounts = [
  {
    id: 'a1',
    name: 'Inter',
    type: 'checking',
    isActive: true,
    dataThrough: '2026-11-10T03:00:00.000Z',
    freshness: 'fresh',
  },
  {
    id: 'a2',
    name: 'Nubank',
    type: 'credit_card',
    isActive: true,
    dataThrough: '2026-11-02T03:00:00.000Z',
    freshness: 'stale',
  },
] as Account[];

afterEach(cleanup);

describe('FreeBalanceSection', () => {
  it('shows the amount, the end of the window and the data freshness', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('R$ 850,00')).toBeInTheDocument();
    expect(screen.getByText(/até 03\/12/)).toBeInTheDocument();
    expect(
      screen.getByText('Dados até 02/11 · Inter em dia · Nubank há 9 dias')
    ).toBeInTheDocument();
    expect(screen.getByText('Confiança alta')).toBeInTheDocument();
  });

  it('shows the next payment and what is already committed afterwards', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('Próximo pagamento')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 5\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 400,00/)).toBeInTheDocument();
    expect(screen.getByText('Já comprometido depois')).toBeInTheDocument();
    expect(screen.getByText('R$ 300,00')).toBeInTheDocument();
  });

  it('hides the next payment block when there is no salary', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast({ nextPayment: null, confidence: 'low' })}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.queryByText('Próximo pagamento')).not.toBeInTheDocument();
    expect(screen.getByText('Já comprometido depois')).toBeInTheDocument();
  });

  it('links to the check-in and opens the overtime form without leaving the page', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByRole('link', { name: 'Fazer check-in' })).toHaveAttribute(
      'href',
      '/check-in'
    );
    expect(screen.getByRole('button', { name: 'Registrar horas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver como é calculado' })).toHaveAttribute(
      'href',
      '/insights'
    );
  });

  it('uses text colors that pass WCAG over the tinted block', () => {
    const { container, rerender } = render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('R$ 850,00')).toHaveClass('text-income-strong');
    expect(container.querySelector('.bg-primary\\/10 .text-muted-foreground')).toBeNull();
    expect(screen.getByText('Já comprometido depois')).toHaveClass(
      'text-slate-600',
      'dark:text-slate-300'
    );

    rerender(
      <FreeBalanceSection
        forecast={makeForecast({ total: -100 })}
        accounts={accounts}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText(/-R\$\s1,00|R\$\s-1,00/)).toHaveClass('text-expense-strong');
  });

  it('says there is no active account only after /accounts answers', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={[]}
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('Nenhuma conta ativa')).toBeInTheDocument();
  });

  it('does not claim there is no account while /accounts is loading', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={[]}
        accountsLoading
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.queryByText('Nenhuma conta ativa')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Carregando contas')).toBeInTheDocument();
  });

  it('does not claim there is no account when /accounts fails', () => {
    render(
      <FreeBalanceSection
        forecast={makeForecast()}
        accounts={[]}
        accountsError
        today={today}
        loading={false}
        error={false}
      />
    );

    expect(screen.queryByText('Nenhuma conta ativa')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar as contas.');
  });

  it('shows a skeleton while the query is pending', () => {
    render(<FreeBalanceSection today={today} loading error={false} />);

    expect(screen.getByLabelText('Carregando saldo livre')).toBeInTheDocument();
    expect(screen.queryByText('R$ 850,00')).not.toBeInTheDocument();
  });

  it('shows a safe message when the query fails', () => {
    render(<FreeBalanceSection today={today} loading={false} error />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível calcular quanto está livre para gastar.'
    );
  });
});
