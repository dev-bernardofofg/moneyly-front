import type { Account } from '@/api/generated/types/Account';
import { Dialog } from '@/components/ui/dialog';
import { FN_UTILS_DATE } from '@/lib/date';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UpsertAccountForm } from './upsert-account.form';

const { createMutate, updateMutate } = vi.hoisted(() => ({
  createMutate: vi.fn(),
  updateMutate: vi.fn(),
}));

vi.mock('@/api/generated/hooks/accounts/accounts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePostAccounts: () => ({ isPending: false, mutate: createMutate }),
  usePutAccountsId: () => ({ isPending: false, mutate: updateMutate }),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

const account = {
  id: 'a1',
  name: 'Inter',
  type: 'checking',
  closingDay: null,
  dueDay: null,
  creditLimit: null,
  openingBalance: 100000,
  openingBalanceDate: '2026-09-01T03:00:00.000Z',
} as Account;

const today = () => FN_UTILS_DATE.formatInBusinessTZ(new Date(), 'yyyy-MM-dd');

const renderForm = (props: { account?: Account } = {}) =>
  render(
    <Dialog>
      <UpsertAccountForm {...props} />
    </Dialog>
  );

const changeBalance = (value: string) =>
  fireEvent.change(screen.getByLabelText('Saldo inicial'), { target: { value } });

const submit = (label: string) => fireEvent.click(screen.getByRole('button', { name: label }));

beforeEach(() => {
  createMutate.mockClear();
  updateMutate.mockClear();
});

afterEach(cleanup);

describe('UpsertAccountForm', () => {
  it('says the balance counts as the end of the chosen day', () => {
    renderForm({ account });

    expect(screen.getByText(/Saldo no fim desse dia/)).toBeInTheDocument();
    expect(screen.queryByText(/início desse dia/)).not.toBeInTheDocument();
  });

  it('suggests today when the balance of an account changes', async () => {
    renderForm({ account });

    changeBalance('200000');
    submit('Atualizar');

    await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
    expect(updateMutate.mock.calls[0]![0].data).toMatchObject({
      openingBalance: 200000,
      openingBalanceDate: today(),
    });
  });

  it('suggests today for the first balance of an account', async () => {
    renderForm({ account: { ...account, openingBalanceDate: null, openingBalance: 0 } });

    changeBalance('50000');
    submit('Atualizar');

    await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
    expect(updateMutate.mock.calls[0]![0].data).toMatchObject({ openingBalanceDate: today() });
  });

  it('keeps the saved date when the balance does not change', async () => {
    renderForm({ account });

    submit('Atualizar');

    await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
    expect(updateMutate.mock.calls[0]![0].data).toMatchObject({
      openingBalanceDate: '2026-09-01',
    });
  });

  it('keeps a date chosen by hand when the balance changes afterwards', async () => {
    renderForm({ account });

    fireEvent.click(screen.getByLabelText('Data do saldo'));
    const days = await screen.findAllByRole<HTMLButtonElement>('button', { name: /, 1 de / });
    fireEvent.click(days.find((day) => !day.disabled)!);
    changeBalance('200000');
    submit('Atualizar');

    await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
    const chosen = `${today().slice(0, 7)}-01`;
    expect(updateMutate.mock.calls[0]![0].data).toMatchObject({ openingBalanceDate: chosen });
  });
});
