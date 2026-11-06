import { getGetAccountsQueryKey } from '@/api/generated/hooks/accounts/accounts';
import { getGetOverviewForecastQueryKey } from '@/api/generated/hooks/overview/overview';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import type { CardBills } from '@/api/generated/types/CardBills';
import AccountsPage from '@/app/(routes)/(private)/accounts/page';
import { BillPaymentStatus } from '@/app/(routes)/(private)/dashboard/bill-payment-status';
import { SubscriptionRow } from '@/app/(routes)/(private)/insights/subscription-candidates';
import { RecurringTransactionTable } from '@/app/(routes)/(private)/recurring-transactions/recurring-transaction.table';
import { TransactionTable } from '@/app/(routes)/(private)/transactions/transaction.table';
import type { BaseTableOptions } from '@/components/tables/base-table';
import { SidebarProvider } from '@/components/ui/sidebar';
import { queryClient as sharedClient } from '@/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

type Mutation = { mutation: { onSuccess: (data: never) => void } };

const { mutations, capture } = vi.hoisted(() => {
  const mutations: Record<string, Mutation> = {};
  const capture = (name: string) => (options: Mutation) => {
    mutations[name] = options;
    return { mutate: vi.fn(), isPending: false };
  };
  return { mutations, capture };
});

vi.mock('@/api/generated/hooks/accounts/accounts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useGetAccounts: () => ({ data: { data: [] }, isLoading: false, isError: false }),
  useDeleteAccountsId: capture('deleteAccount'),
  usePostAccountsIdBillPayment: capture('markPaid'),
  useDeleteAccountsIdBillPaymentDueDate: capture('unmarkPaid'),
}));
vi.mock(
  '@/api/generated/hooks/recurring-transactions/recurring-transactions',
  async (importOriginal) => ({
    ...(await importOriginal<object>()),
    usePatchRecurringTransactionsIdDeactivate: capture('deactivate'),
    usePatchRecurringTransactionsIdReactivate: capture('activate'),
    useDeleteRecurringTransactionsId: capture('removeRecurring'),
    usePostRecurringTransactionsFromSubscription: capture('convert'),
  })
);
vi.mock('@/api/generated/hooks/transactions/transactions', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useDeleteTransactionsId: capture('deleteTransaction'),
}));
vi.mock('@/components/layout/period-navigator-wrapper', () => ({
  PeriodNavigatorWrapper: () => null,
}));
vi.mock('@/components/layout/header', () => ({ Header: () => null }));
vi.mock('@/app/(routes)/(private)/accounts/transfers-section', () => ({
  TransfersSection: () => null,
}));
vi.mock('@/forms/upsert-transaction.form', () => ({ UpsertTransactionForm: () => null }));
vi.mock('@/forms/upsert-transaction-recurring.form', () => ({
  UpsertTransactionRecurringForm: () => null,
}));

const renderWith = (client: QueryClient, ui: ReactNode) =>
  render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);

const expectFreeBalanceRefreshed = (client: QueryClient, invalidate: () => void) => {
  const spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue();

  invalidate();

  const keys = spy.mock.calls.map(([filters]) => filters?.queryKey);
  for (const key of freeBalanceQueryKeys()) expect(keys).toContainEqual(key);
};

const bill = {
  accountId: 'card',
  dueDate: '2026-10-05T03:00:00.000Z',
  payment: null,
  total: 100,
} as CardBills['bills'][number];

const tableOptions = {
  tableOptions: { pagination: { pageIndex: 0, pageSize: 10 } },
  onPaginationChange: vi.fn(),
} as unknown as BaseTableOptions;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('freeBalanceQueryKeys', () => {
  it('covers the forecast and the accounts', () => {
    expect(freeBalanceQueryKeys()).toContainEqual(getGetOverviewForecastQueryKey());
    expect(freeBalanceQueryKeys()).toContainEqual(getGetAccountsQueryKey());
  });
});

describe('mutations that move the Saldo Livre', () => {
  it('marking and unmarking a bill', () => {
    const client = new QueryClient();
    renderWith(client, <BillPaymentStatus bill={bill} />);

    expectFreeBalanceRefreshed(client, () => mutations.markPaid!.mutation.onSuccess(null as never));
    expectFreeBalanceRefreshed(client, () =>
      mutations.unmarkPaid!.mutation.onSuccess(null as never)
    );
  });

  it('changing a recurrence', () => {
    render(
      <QueryClientProvider client={sharedClient}>
        <RecurringTransactionTable recurringTransactions={[]} isLoading={false} {...tableOptions} />
      </QueryClientProvider>
    );

    for (const name of ['deactivate', 'activate', 'removeRecurring']) {
      expectFreeBalanceRefreshed(sharedClient, () =>
        mutations[name]!.mutation.onSuccess(null as never)
      );
    }
  });

  it('deleting a transaction', () => {
    render(
      <QueryClientProvider client={sharedClient}>
        <TransactionTable transactions={[]} isLoading={false} {...tableOptions} />
      </QueryClientProvider>
    );

    expectFreeBalanceRefreshed(sharedClient, () =>
      mutations.deleteTransaction!.mutation.onSuccess(null as never)
    );
  });

  it('removing an account', () => {
    const client = new QueryClient();
    renderWith(
      client,
      <SidebarProvider>
        <AccountsPage />
      </SidebarProvider>
    );

    expectFreeBalanceRefreshed(client, () =>
      mutations.deleteAccount!.mutation.onSuccess(null as never)
    );
  });

  it('turning a subscription into a recurrence', () => {
    const client = new QueryClient();
    renderWith(
      client,
      <SubscriptionRow
        candidate={{
          title: 'Spotify',
          categoryId: 'c1',
          categoryName: 'Streaming',
          averageAmount: 1990,
          occurrences: 3,
          cadence: 'monthly',
          firstDate: '2026-08-01T03:00:00.000Z',
          lastDate: '2026-10-01T03:00:00.000Z',
          nextEstimatedDate: '2026-11-01T03:00:00.000Z',
          monthlyCost: 1990,
        }}
      />
    );

    expectFreeBalanceRefreshed(client, () =>
      mutations.convert!.mutation.onSuccess({
        data: { nextExecution: '2026-11-01T03:00:00.000Z' },
      } as never)
    );
  });
});
