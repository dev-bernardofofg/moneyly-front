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
