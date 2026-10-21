import { Dialog } from '@/components/ui/dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImportStatementForm } from './import-statement.form';
import {
  initialRowState,
  isUncategorized,
  toBase64Url,
  type ImportPreviewItem,
} from './import-statement.helpers';

const CATEGORY = { id: '99999999-9999-9999-9999-999999999999', name: 'Mercado' };
const OUTROS = { id: '88888888-8888-8888-8888-888888888888', name: 'Outros' };

const UNKNOWN = (externalId: string): ImportPreviewItem => ({
  externalId,
  type: 'expense',
  amount: 10,
  date: '2026-10-08T03:00:00.000Z',
  title: 'BOX CHINA',
  status: 'new',
  duplicateOf: null,
  suggestedCategoryId: OUTROS.id,
  suggestionSource: 'fallback',
});

const ITEMS: ImportPreviewItem[] = [
  {
    externalId: 'acc:1',
    type: 'expense',
    amount: 25,
    date: '2026-10-05T03:00:00.000Z',
    title: 'Padaria',
    status: 'new',
    duplicateOf: null,
    suggestedCategoryId: CATEGORY.id,
    suggestionSource: 'rule',
  },
  {
    externalId: 'acc:2',
    type: 'expense',
    amount: 40,
    date: '2026-10-06T03:00:00.000Z',
    title: 'Farmácia',
    status: 'possible_duplicate',
    duplicateOf: '11111111-1111-1111-1111-111111111111',
    suggestedCategoryId: CATEGORY.id,
    suggestionSource: 'rule',
  },
  {
    externalId: 'acc:4',
    type: 'income',
    amount: 3822,
    date: '2026-10-04T03:00:00.000Z',
    title: 'PAGAMENTO ON LINE',
    status: 'bill_payment',
    duplicateOf: null,
    suggestedCategoryId: CATEGORY.id,
    suggestionSource: 'rule',
  },
  {
    externalId: 'acc:3',
    type: 'income',
    amount: 3000,
    date: '2026-10-07T03:00:00.000Z',
    title: 'Salário',
    status: 'imported',
    duplicateOf: null,
    suggestedCategoryId: CATEGORY.id,
    suggestionSource: 'rule',
  },
];

const confirmMutate = vi.fn();
let previewItems: ImportPreviewItem[] = ITEMS;

vi.mock('@/api/generated/hooks/accounts/accounts', () => ({
  useGetAccounts: () => ({
    data: {
      data: [{ id: 'account-default', name: 'Conta principal', type: 'checking', isDefault: true }],
    },
  }),
}));
vi.mock('@/api/generated/hooks/categories/categories', () => ({
  getGetCategoriesQueryKey: () => ['/categories/'],
  useGetCategories: () => ({ data: { data: [CATEGORY, OUTROS] } }),
  usePostCategoriesCreate: () => ({ isPending: false, mutate: vi.fn() }),
}));
vi.mock('@/api/generated/hooks/transactions/transactions', () => ({
  getGetTransactionsQueryKey: () => ['/transactions/'],
  getGetTransactionsSummaryQueryKey: () => ['/transactions/summary'],
  usePostTransactionsImportPreview: ({
    mutation,
  }: {
    mutation: { onSuccess: (response: unknown) => void };
  }) => ({
    isPending: false,
    mutate: () => mutation.onSuccess({ data: { accountKey: 'acc', items: previewItems } }),
  }),
  usePostTransactionsImport: () => ({ isPending: false, mutate: confirmMutate }),
}));

const renderForm = () =>
  render(<ImportStatementForm />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>
        <Dialog open>{children}</Dialog>
      </QueryClientProvider>
    ),
  });

const uploadFile = () =>
  fireEvent.change(screen.getByLabelText('Arquivo OFX do extrato'), {
    target: { files: [new File(['<OFX>'], 'extrato.ofx')] },
  });

afterEach(() => {
  cleanup();
  previewItems = ITEMS;
  confirmMutate.mockClear();
});

describe('import statement helpers', () => {
  it('encodes files as base64url without padding', () => {
    const encoded = toBase64Url(new TextEncoder().encode('<OFX>?>').buffer as ArrayBuffer);

    expect(encoded).toBe('PE9GWD4_Pg');
  });

  it('treats a fallback suggestion as uncategorized until the user changes it', () => {
    const item = UNKNOWN('acc:9');

    expect(isUncategorized(item, { selected: true, categoryId: OUTROS.id })).toBe(true);
    expect(isUncategorized(item, { selected: true, categoryId: CATEGORY.id })).toBe(false);
    expect(isUncategorized(ITEMS[0]!, { selected: true, categoryId: CATEGORY.id })).toBe(false);
  });

  it('selects only new rows by default', () => {
    expect(ITEMS.map((item) => initialRowState(item).selected)).toEqual([
      true,
      false,
      false,
      false,
    ]);
  });
});

describe('ImportStatementForm', () => {
  it('lists preview rows with their status and keeps imported rows locked', async () => {
    renderForm();
    uploadFile();

    expect(await screen.findByText('Padaria')).toBeInTheDocument();
    expect(screen.getByText('Possível duplicata')).toBeInTheDocument();
    expect(screen.getByText('Já importada')).toBeInTheDocument();
    expect(screen.getByText('Pagamento de fatura')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Salário/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Importar 1 transação' })).toBeEnabled();
  });

  it('confirms only the selected rows with their categories', async () => {
    renderForm();
    uploadFile();
    fireEvent.click(await screen.findByRole('checkbox', { name: /Farmácia/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Importar 2 transações' }));

    await waitFor(() => expect(confirmMutate).toHaveBeenCalled());
    const { items, accountId } = confirmMutate.mock.calls[0]![0].data;
    expect(accountId).toBe('account-default');
    expect(items.map((item: { externalId: string }) => item.externalId)).toEqual([
      'acc:1',
      'acc:2',
    ]);
    expect(items[0]).toMatchObject({ categoryId: CATEGORY.id, amount: 25, type: 'expense' });
  });
  it('warns about purchases without a defined category', async () => {
    previewItems = [...ITEMS, UNKNOWN('acc:5'), UNKNOWN('acc:6')];
    renderForm();
    uploadFile();

    expect(
      await screen.findByText(/2 compras não têm categoria definida e ficariam em Outros/)
    ).toBeInTheDocument();
    expect(screen.getAllByText('Sem categoria definida')).toHaveLength(2);
  });
});
