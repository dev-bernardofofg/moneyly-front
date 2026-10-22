import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BaseTable } from './base-table';

afterEach(cleanup);

type Row = { name: string; hours: string; amount: string };

describe('BaseTable', () => {
  it('aligns the footer cells with their columns', () => {
    render(
      <BaseTable<Row>
        data={[{ name: 'Acme', hours: '2h', amount: 'R$ 70,00' }]}
        columns={[
          { header: 'Empresa', accessorKey: 'name' },
          { header: 'Horas', accessorKey: 'hours' },
          { header: 'Valor', accessorKey: 'amount' },
        ]}
        footer={{ name: 'Total do mês', amount: 'R$ 70,00' }}
      />
    );

    const cells = within(screen.getAllByRole('rowgroup').at(-1)!).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual(['Total do mês', '', 'R$ 70,00']);
  });
});

describe('BaseTable mobile cards', () => {
  it('renders a card per row for small screens next to the table', () => {
    render(
      <BaseTable<Row>
        data={[{ name: 'Acme', hours: '2h', amount: 'R$ 70,00' }]}
        columns={[{ header: 'Empresa', accessorKey: 'name' }]}
        mobileCard={(item) => <span>card {item.name}</span>}
        actions={() => <button type="button">Editar</button>}
      />
    );

    expect(screen.getByText('card Acme').closest('ul')).toHaveClass('md:hidden');
    expect(screen.getByRole('table')).toHaveClass('hidden', 'md:table');
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(2);
  });
});
