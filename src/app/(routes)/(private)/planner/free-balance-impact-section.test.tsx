import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FreeBalanceImpactSection } from './free-balance-impact-section';

afterEach(cleanup);

describe('FreeBalanceImpactSection', () => {
  it('shows the total and each reserve from the contract', () => {
    render(
      <FreeBalanceImpactSection
        impact={{ budgetReserve: 250, goalReserve: 100.5, total: 350.5 }}
        loading={false}
        error={false}
      />
    );

    expect(screen.getByText(/350,50/)).toBeInTheDocument();
    expect(screen.getByText('Restante dos orçamentos')).toBeInTheDocument();
    expect(screen.getByText(/250,00/)).toBeInTheDocument();
    expect(screen.getByText('Contribuição sugerida às metas')).toBeInTheDocument();
    expect(screen.getByText(/100,50/)).toBeInTheDocument();
  });

  it('shows a skeleton while the query is pending', () => {
    render(<FreeBalanceImpactSection loading error={false} />);

    expect(screen.getByLabelText('Carregando impacto no saldo livre')).toBeInTheDocument();
  });

  it('shows a safe message when the query fails', () => {
    render(<FreeBalanceImpactSection loading={false} error />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível calcular');
  });

  it('explains when no budget or goal reserves money', () => {
    render(
      <FreeBalanceImpactSection
        impact={{ budgetReserve: 0, goalReserve: 0, total: 0 }}
        loading={false}
        error={false}
      />
    );

    expect(
      screen.getByText('Nenhum orçamento ou meta está reservando valor neste período.')
    ).toBeInTheDocument();
  });
});
