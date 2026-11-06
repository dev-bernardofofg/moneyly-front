import type { Account } from '@/api/generated/types/Account';
import type { TransactionImportPreview } from '@/api/generated/types/TransactionImportPreview';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import CheckInPage from './page';
import { type ImportPreviewItem, toBase64Url } from './import-statement.helpers';

const FILE_LABEL = /Solte os extratos aqui/;
const MERCADO = { id: '99999999-9999-9999-9999-999999999999', name: 'Mercado' };
const OUTROS = { id: '88888888-8888-8888-8888-888888888888', name: 'Outros' };
const INTER = '11111111-1111-1111-1111-111111111111';
const NUBANK = '22222222-2222-2222-2222-222222222222';
const DUPLICATE_OF = '33333333-3333-3333-3333-333333333333';

const account = (overrides: Partial<Account>): Account => ({
  id: INTER,
  userId: 'user',
  name: 'Inter',
  type: 'checking',
  closingDay: null,
  dueDay: null,
  creditLimit: null,
  openingBalance: 0,
  openingBalanceDate: null,
  dataThrough: new Date().toISOString(),
  statementKey: null,
  freshness: 'fresh',
  isDefault: true,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const item = (overrides: Partial<ImportPreviewItem>): ImportPreviewItem => ({
  externalId: 'acc:1',
  type: 'expense',
  amount: 2500,
  date: '2026-10-05T03:00:00.000Z',
  title: 'Padaria',
  status: 'new',
  duplicateOf: null,
  transferOf: null,
  suggestedCategoryId: MERCADO.id,
  suggestionSource: 'rule',
  ...overrides,
});

const CATEGORIZED = item({});
const UNCATEGORIZED = item({
  externalId: 'acc:2',
  title: 'BOX CHINA',
  suggestedCategoryId: OUTROS.id,
  suggestionSource: 'fallback',
});
const DUPLICATE = item({
  externalId: 'acc:3',
  title: 'Farmácia',
  status: 'possible_duplicate',
  duplicateOf: DUPLICATE_OF,
});
const IMPORTED = item({ externalId: 'acc:4', title: 'Salário', status: 'imported' });

const previewOf = (
  items: ImportPreviewItem[],
  overrides: Partial<TransactionImportPreview> = {}
): TransactionImportPreview => ({
  accountId: INTER,
  needsAccount: false,
  accountKey: '077:123',
  through: '2026-11-01T03:00:00.000Z',
  bill: null,
  items,
  ...overrides,
});

const NEEDS_ACCOUNT = previewOf([], {
  accountId: null,
  needsAccount: true,
  accountKey: 'nubank:9',
});

const contentOf = (name: string) =>
  toBase64Url(new TextEncoder().encode(name).buffer as ArrayBuffer);

let accounts: Account[];
let previewByFile: Record<string, () => Promise<{ data: TransactionImportPreview }>>;

const previewMutate = vi.fn(({ data }: { data: { file: string; accountId?: string } }) => {
  const entry = Object.entries(previewByFile).find(([name]) => contentOf(name) === data.file);
  return entry![1]();
});
const confirmMutate = vi.fn();
const readForecast = vi.fn();

vi.mock('@/components/layout/header', () => ({
  Header: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
vi.mock('@/api/generated/hooks/accounts/accounts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useGetAccounts: () => ({ data: { data: accounts }, isLoading: false, isError: false }),
}));
vi.mock('@/api/generated/hooks/categories/categories', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useGetCategories: () => ({ data: { data: [MERCADO, OUTROS] } }),
  usePostCategoriesCreate: () => ({ isPending: false, mutate: vi.fn() }),
}));
vi.mock('@/api/generated/hooks/overview/overview', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getOverviewForecast: () => readForecast(),
}));
vi.mock('@/api/generated/hooks/transactions/transactions', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePostTransactionsImportPreview: () => ({ mutateAsync: previewMutate }),
  usePostTransactionsImport: () => ({ mutateAsync: confirmMutate }),
}));

const renderPage = (client = new QueryClient()) =>
  render(<CheckInPage />, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryClientProvider>
    ),
  });

const upload = (...names: string[]) =>
  fireEvent.change(screen.getByLabelText(FILE_LABEL), {
    target: { files: names.map((name) => new File([name], name)) },
  });

const fileCard = (name: string) =>
  within(screen.getByRole('listitem', { name: `Arquivo ${name}` }));

const forecastOf = (total: number) => ({ data: { freeBalance: { total } } });
const RESULT = { data: { created: 1, skipped: 0, billsPaid: 0, transfers: 0, linked: 0 } };

// O Radix Select abre pelo teclado; jsdom não tem scrollIntoView.
const chooseOption = (trigger: HTMLElement, option: string) => {
  fireEvent.keyDown(trigger, { key: 'Enter' });
  fireEvent.click(screen.getByRole('option', { name: option }));
};

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

beforeEach(() => {
  accounts = [account({})];
  previewByFile = {};
  previewMutate.mockClear();
  confirmMutate.mockReset();
  confirmMutate.mockResolvedValue(RESULT);
  readForecast.mockReset();
  readForecast.mockResolvedValue(forecastOf(10000));
});

afterEach(cleanup);

describe('CheckInPage', () => {
  it('arquivo inválido mostra erro e mantém os demais', async () => {
    previewByFile = {
      'ruim.ofx': () => Promise.reject({ data: { error: 'Arquivo não é um extrato OFX válido' } }),
      'bom.ofx': async () => ({ data: previewOf([CATEGORIZED]) }),
    };
    renderPage();

    upload('ruim.ofx', 'bom.ofx');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Arquivo não é um extrato OFX válido'
    );
    await waitFor(() => expect(fileCard('bom.ofx').getByText('Pronto')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(confirmMutate).toHaveBeenCalledTimes(1);
  });

  it('recusa formato não aceito sem chamar a API', async () => {
    previewByFile = { 'bom.pdf': async () => ({ data: previewOf([CATEGORIZED]) }) };
    renderPage();

    upload('foto.png', 'bom.pdf');

    expect(await screen.findByRole('alert')).toHaveTextContent('Envie um arquivo .ofx ou .pdf');
    await waitFor(() => expect(previewMutate).toHaveBeenCalledTimes(1));
  });

  it('lê os arquivos um por vez', async () => {
    let finishFirst: (value: { data: TransactionImportPreview }) => void = () => {};
    previewByFile = {
      'a.ofx': () => new Promise((resolve) => (finishFirst = resolve)),
      'b.ofx': async () => ({ data: previewOf([CATEGORIZED]) }),
    };
    renderPage();

    upload('a.ofx', 'b.ofx');

    await waitFor(() => expect(previewMutate).toHaveBeenCalledTimes(1));
    finishFirst({ data: previewOf([CATEGORIZED]) });
    await waitFor(() => expect(previewMutate).toHaveBeenCalledTimes(2));
  });

  it('conta nova pergunta conta e repete preview', async () => {
    accounts = [
      account({}),
      account({ id: NUBANK, name: 'Nubank', isDefault: false }),
      account({ id: 'inativa', name: 'Antiga', isDefault: false, isActive: false }),
    ];
    previewByFile = {
      'novo.ofx': vi
        .fn()
        .mockResolvedValueOnce({ data: NEEDS_ACCOUNT })
        .mockResolvedValueOnce({ data: previewOf([CATEGORIZED], { accountId: NUBANK }) }),
    };
    renderPage();

    upload('novo.ofx');

    const select = await screen.findByRole('combobox', { name: 'Conta de novo.ofx' });
    expect(screen.getByRole('button', { name: 'Importar' })).toBeDisabled();

    fireEvent.keyDown(select, { key: 'Enter' });
    expect(screen.queryByRole('option', { name: 'Antiga' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Nubank' }));

    await waitFor(() => expect(fileCard('novo.ofx').getByText('Pronto')).toBeInTheDocument());
    expect(previewMutate.mock.calls[0]![0].data).not.toHaveProperty('accountId', NUBANK);
    expect(previewMutate.mock.calls[1]![0].data).toMatchObject({
      file: contentOf('novo.ofx'),
      accountId: NUBANK,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(confirmMutate.mock.calls[0]![0].data).toMatchObject({
      accountId: NUBANK,
      accountKey: '077:123',
      through: '2026-11-01T03:00:00.000Z',
    });
  });

  it('conta desconhecida não trava os demais arquivos', async () => {
    previewByFile = {
      'novo.ofx': async () => ({ data: NEEDS_ACCOUNT }),
      'bom.ofx': async () => ({ data: previewOf([CATEGORIZED]) }),
    };
    renderPage();

    upload('novo.ofx', 'bom.ofx');
    await waitFor(() => expect(fileCard('bom.ofx').getByText('Pronto')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await waitFor(() => expect(fileCard('bom.ofx').getByText('Importado')).toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'Conta de novo.ofx' })).toBeInTheDocument();
    expect(screen.queryByText('Saldo Livre depois')).not.toBeInTheDocument();

    fireEvent.click(fileCard('novo.ofx').getByRole('button', { name: 'Remover' }));

    expect(await screen.findByText('Saldo Livre depois')).toBeInTheDocument();
  });

  it('mesma conta em dois arquivos segue independente', async () => {
    previewByFile = {
      'a.ofx': async () => ({ data: previewOf([CATEGORIZED]) }),
      'b.ofx': async () => ({ data: previewOf([item({ externalId: 'acc:9' })]) }),
    };
    renderPage();

    upload('a.ofx', 'b.ofx');
    await waitFor(() => expect(fileCard('b.ofx').getByText('Pronto')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(confirmMutate).toHaveBeenCalledTimes(2);
  });

  it('revisa só as exceções e confirma o restante sem revisão', async () => {
    previewByFile = {
      'extrato.ofx': async () => ({
        data: previewOf([CATEGORIZED, UNCATEGORIZED, DUPLICATE, IMPORTED]),
      }),
    };
    renderPage();

    upload('extrato.ofx');

    expect(await screen.findByText('BOX CHINA')).toBeInTheDocument();
    expect(screen.getByText('Farmácia')).toBeInTheDocument();
    expect(screen.queryByText('Padaria')).not.toBeInTheDocument();
    expect(screen.queryByText('Salário')).not.toBeInTheDocument();
    expect(fileCard('extrato.ofx').getByText('Revisar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    const { items } = confirmMutate.mock.calls[0]![0].data;
    expect(items.map((row: { externalId: string }) => row.externalId)).toEqual([
      'acc:1',
      'acc:2',
      'acc:3',
    ]);
    expect(items[1]).toMatchObject({ categoryId: OUTROS.id });
    expect(items[2]).toMatchObject({ duplicateOf: DUPLICATE_OF });
  });

  it('mantém a linha visível depois de escolher a categoria', async () => {
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([UNCATEGORIZED]) }) };
    renderPage();

    upload('extrato.ofx');

    chooseOption(
      await screen.findByRole('combobox', { name: 'Categoria de BOX CHINA' }),
      MERCADO.name
    );

    expect(await screen.findByText('BOX CHINA')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(confirmMutate.mock.calls[0]![0].data.items[0]).toMatchObject({ categoryId: MERCADO.id });
  });

  it('possível duplicada pode virar novo lançamento', async () => {
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([DUPLICATE]) }) };
    renderPage();

    upload('extrato.ofx');

    expect(await screen.findByRole('radio', { name: 'Vincular ao lançamento' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: 'Criar novo lançamento' }));
    expect(screen.getByRole('combobox', { name: 'Categoria de Farmácia' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    const [row] = confirmMutate.mock.calls[0]![0].data.items;
    expect(row).toMatchObject({ categoryId: MERCADO.id });
    expect(row).not.toHaveProperty('duplicateOf');
  });

  it('não bloqueia arquivo sem nada novo', async () => {
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([IMPORTED]) }) };
    renderPage();

    upload('extrato.ofx');
    await waitFor(() => expect(fileCard('extrato.ofx').getByText('Pronto')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(confirmMutate.mock.calls[0]![0].data).toMatchObject({ items: [], billPayments: [] });
  });

  it('mostra vencimento e total da fatura no resumo', async () => {
    previewByFile = {
      'fatura.pdf': async () => ({
        data: previewOf([CATEGORIZED], {
          bill: { dueDate: '2026-11-10T03:00:00.000Z', total: 99900 },
        }),
      }),
    };
    renderPage();

    upload('fatura.pdf');

    expect(await screen.findByText(/Fatura com vencimento em/)).toHaveTextContent('10/11/2026');
    expect(screen.getByRole('alert')).toHaveTextContent('não bate com o total da fatura');
  });

  it('falha ao confirmar mantém revisão do arquivo', async () => {
    confirmMutate.mockRejectedValueOnce({ data: { error: 'Servidor indisponível' } });
    previewByFile = {
      'falha.ofx': async () => ({ data: previewOf([UNCATEGORIZED]) }),
      'bom.ofx': async () => ({ data: previewOf([CATEGORIZED]) }),
    };
    renderPage();

    upload('falha.ofx', 'bom.ofx');
    await waitFor(() => expect(fileCard('bom.ofx').getByText('Pronto')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Servidor indisponível');
    await waitFor(() => expect(fileCard('bom.ofx').getByText('Importado')).toBeInTheDocument());
    expect(screen.getByText('BOX CHINA')).toBeInTheDocument();
    expect(screen.queryByText('Saldo Livre depois')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Saldo Livre depois')).toBeInTheDocument();
    expect(confirmMutate).toHaveBeenCalledTimes(3);
  });

  it('tela final mostra Saldo Livre antes e depois', async () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    readForecast.mockResolvedValueOnce(forecastOf(10000)).mockResolvedValueOnce(forecastOf(7500));
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([CATEGORIZED]) }) };
    renderPage(client);

    upload('extrato.ofx');
    await waitFor(() => expect(fileCard('extrato.ofx').getByText('Pronto')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    const before = (await screen.findByText('Saldo Livre antes')).closest('div')!;
    const after = screen.getByText('Saldo Livre depois').closest('div')!;
    expect(before).toHaveTextContent('R$ 100,00');
    expect(after).toHaveTextContent('R$ 75,00');
    expect(screen.getByText(/1 transação importada/)).toBeInTheDocument();

    const invalidated = invalidate.mock.calls.map(([filters]) => filters?.queryKey?.[0]);
    expect(invalidated).toEqual(
      expect.arrayContaining([
        '/overview/forecast',
        '/overview/dashboard',
        '/accounts/',
        '/transactions/',
      ])
    );
  });

  it('lê o saldo antes da primeira confirmação', async () => {
    const order: string[] = [];
    readForecast.mockImplementation(async () => {
      order.push('forecast');
      return forecastOf(10000);
    });
    confirmMutate.mockImplementation(async () => {
      order.push('confirm');
      return RESULT;
    });
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([CATEGORIZED]) }) };
    renderPage();

    upload('extrato.ofx');
    await waitFor(() => expect(fileCard('extrato.ofx').getByText('Pronto')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    await screen.findByText('Saldo Livre depois');
    expect(order).toEqual(['forecast', 'confirm', 'forecast']);
  });

  it('sem o valor anterior mostra só o depois', async () => {
    readForecast.mockRejectedValueOnce(new Error('offline'));
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([CATEGORIZED]) }) };
    renderPage();

    upload('extrato.ofx');
    await waitFor(() => expect(fileCard('extrato.ofx').getByText('Pronto')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Importar' }));

    expect(await screen.findByText('Saldo Livre depois')).toBeInTheDocument();
    expect(screen.queryByText('Saldo Livre antes')).not.toBeInTheDocument();
  });

  it('mostra contas com frescor e link para corrigir saldo', () => {
    accounts = [
      account({}),
      account({ id: NUBANK, name: 'Nubank', dataThrough: null, freshness: 'empty' }),
      account({ id: 'inativa', name: 'Antiga', isActive: false }),
    ];
    renderPage();

    expect(screen.getByText('Inter em dia')).toBeInTheDocument();
    expect(screen.getByText('Nubank sem dados')).toBeInTheDocument();
    expect(screen.queryByText(/Antiga/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Corrigir saldo' })).toHaveAttribute(
      'href',
      '/accounts'
    );
  });

  it('sem conta ativa aponta para /accounts', () => {
    accounts = [account({ isActive: false })];
    renderPage();

    expect(screen.queryByLabelText(FILE_LABEL)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cadastrar conta' })).toHaveAttribute(
      'href',
      '/accounts'
    );
  });

  it('anuncia mudanças de status', async () => {
    previewByFile = { 'extrato.ofx': async () => ({ data: previewOf([UNCATEGORIZED]) }) };
    const { container } = renderPage();

    upload('extrato.ofx');

    await waitFor(() =>
      expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('Para revisar: 1')
    );
  });
});
