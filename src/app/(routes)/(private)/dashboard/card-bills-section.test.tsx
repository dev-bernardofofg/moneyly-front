import type { CardBills } from '@/app/(resources)/(generated)/types/CardBills';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cleanup, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { billSegments, buildCategoryColors } from './card-bills.helpers';
import { CardBillsSection } from './card-bills-section';

const category = (id: string, name: string, amount: number) => ({ categoryId: id, name, amount });

const DATA: CardBills = {
  periodId: '11111111-1111-1111-1111-111111111111',
  total: 1000,
  bills: [
    {
      accountId: 'inter',
      name: 'Cartão Inter',
      closingDay: 25,
      dueDay: 5,
      total: 700,
      categories: [
        category('ride', 'Transporte', 400),
        category('food', 'Alimentação', 200),
        category('a', 'A', 40),
        category('b', 'B', 30),
        category('c', 'C', 20),
        category('d', 'D', 10),
      ],
    },
    {
      accountId: 'nubank',
      name: 'Cartão Nubank',
      closingDay: 3,
      dueDay: 10,
      total: 300,
      categories: [category('food', 'Alimentação', 300)],
    },
  ],
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
);

afterEach(cleanup);

describe('card bills helpers', () => {
  it('colors a category the same way in every card', () => {
    const colors = buildCategoryColors(DATA.bills);
    const inter = billSegments(DATA.bills[0]!, colors);
    const nubank = billSegments(DATA.bills[1]!, colors);

    expect(nubank[0]!.color).toBe(inter.find((s) => s.key === 'food')!.color);
  });

  it('folds categories beyond the top five into Outras', () => {
    const segments = billSegments(DATA.bills[0]!, buildCategoryColors(DATA.bills));

    expect(segments.map((s) => s.name)).toEqual([
      'Transporte',
      'Alimentação',
      'A',
      'B',
      'C',
      'Outras',
    ]);
    expect(segments.at(-1)).toMatchObject({ amount: 10, color: 'var(--series-other)' });
  });
});

describe('CardBillsSection', () => {
  it('shows the period total and each card with its category amounts', () => {
    render(<CardBillsSection data={DATA} loading={false} error={false} />, { wrapper });

    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
    const inter = screen.getByText('Cartão Inter').closest('li')!;
    expect(within(inter).getByText('vence dia 5')).toBeInTheDocument();
    expect(within(inter).getByText('R$ 700,00')).toBeInTheDocument();
    expect(within(inter).getByText('Transporte')).toBeInTheDocument();
    expect(within(inter).getByText('R$ 400,00')).toBeInTheDocument();
  });

  it('invites to register a card when there is none', () => {
    render(
      <CardBillsSection data={{ ...DATA, total: 0, bills: [] }} loading={false} error={false} />,
      { wrapper }
    );

    expect(screen.getByRole('link', { name: 'Cadastre um cartão' })).toHaveAttribute(
      'href',
      '/accounts'
    );
  });

  it('shows a safe message on error', () => {
    render(<CardBillsSection loading={false} error />, { wrapper });

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar as faturas');
  });
});
