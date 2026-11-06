import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FreeBalanceBreakdownSection } from './free-balance-breakdown-section';
import { buildFreeBalanceMessages } from './free-balance-messages';

const makeForecast = (
  overrides: {
    components?: Partial<ForecastResponse['freeBalance']['components']>;
    total?: number;
    confidence?: ForecastResponse['freeBalance']['confidence'];
  } = {}
): ForecastResponse => ({
  freeBalance: {
    total: overrides.total ?? 85000,
    until: '2026-12-03T03:00:00.000Z',
    confidence: overrides.confidence ?? 'high',
    components: {
      accountsBalance: 150000,
      otherIncome: 0,
      recurringExpense: 30000,
      cardBills: 35000,
      ...overrides.components,
    },
    nextPayment: null,
    committedAfter: 0,
  },
});

afterEach(cleanup);

// Intl separa moeda e valor com NBSP.
const messagesOf = (forecast: ForecastResponse) =>
  buildFreeBalanceMessages(forecast).map((message) => message.replace(/\s/g, ' '));

describe('buildFreeBalanceMessages', () => {
  it('explains recurring bills, card bills and other income with contract values', () => {
    const messages = messagesOf(makeForecast({ components: { otherIncome: 20000 } }));

    expect(messages).toEqual([
      'Suas contas recorrentes consomem R$ 300,00 até o próximo salário.',
      'Faturas que vencem até lá somam R$ 350,00.',
      'Outras entradas previstas adicionam R$ 200,00.',
    ]);
  });

  it('names the largest outflow when the free balance is negative', () => {
    const messages = messagesOf(
      makeForecast({ total: -5000, components: { recurringExpense: 5000, cardBills: 10000 } })
    );

    expect(messages[0]).toBe(
      'Saldo Livre negativo: o maior peso vem de faturas de cartão (R$ 100,00).'
    );
  });

  it('warns about low and medium confidence', () => {
    expect(messagesOf(makeForecast({ confidence: 'low' }))).toContain(
      'Confiança baixa: falta definir o salário ou o saldo inicial de alguma conta.'
    );
    expect(messagesOf(makeForecast({ confidence: 'medium' }))).toContain(
      'Confiança média: alguma conta está com dados atrasados. Faça um check-in.'
    );
  });

  it('says nothing affects the window when every component is zero', () => {
    const messages = messagesOf(
      makeForecast({ components: { recurringExpense: 0, cardBills: 0, otherIncome: 0 } })
    );

    expect(messages).toEqual(['Nenhuma conta, fatura ou entrada prevista até o próximo salário.']);
  });
});

describe('FreeBalanceBreakdownSection', () => {
  it('labels the amount as today and lists every component so the total can be reconstructed', () => {
    render(<FreeBalanceBreakdownSection forecast={makeForecast()} loading={false} error={false} />);

    expect(screen.getByText(/Livre para gastar hoje, até 03\/12/)).toBeInTheDocument();
    expect(screen.getByText('Saldo das contas').nextSibling).toHaveTextContent('+ R$ 1.500,00');
    expect(screen.getByText('Outras entradas previstas').nextSibling).toHaveTextContent(
      '+ R$ 0,00'
    );
    expect(screen.getByText('Contas recorrentes a pagar').nextSibling).toHaveTextContent(
      '− R$ 300,00'
    );
    expect(screen.getByText('Faturas a pagar').nextSibling).toHaveTextContent('− R$ 350,00');
    expect(screen.getByText('Saldo Livre').nextSibling).toHaveTextContent('R$ 850,00');
  });

  it('shows a negative accounts balance as a subtraction', () => {
    render(
      <FreeBalanceBreakdownSection
        forecast={makeForecast({ total: -70000, components: { accountsBalance: -25000 } })}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText('Saldo das contas').nextSibling).toHaveTextContent('− R$ 250,00');
  });

  it('no longer shows reserves, pending overtime or remaining days', () => {
    render(<FreeBalanceBreakdownSection forecast={makeForecast()} loading={false} error={false} />);

    expect(screen.queryByText(/reserva/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/horas extras pendentes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dias restantes|por dia/i)).not.toBeInTheDocument();
  });

  it('shows a skeleton while loading and a safe message on error', () => {
    render(<FreeBalanceBreakdownSection loading error={false} />);
    expect(screen.getByLabelText('Carregando detalhamento do saldo livre')).toBeInTheDocument();
    cleanup();

    render(<FreeBalanceBreakdownSection loading={false} error />);
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível detalhar');
  });
});
