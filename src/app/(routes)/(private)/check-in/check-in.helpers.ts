import type { PostTransactionsImportBody } from '@/api/generated/hooks/moneylyAPI.schemas';
import type { TransactionImportPreview } from '@/api/generated/types/TransactionImportPreview';
import type { TransactionImportResult } from '@/api/generated/types/TransactionImportResult';
import {
  type ImportPreviewItem,
  type ImportRowState,
  initialRowState,
  isUncategorized,
} from './import-statement.helpers';

export type CheckInStatus =
  | 'previewing'
  | 'needsAccount'
  | 'ready'
  | 'review'
  | 'failed'
  | 'confirming'
  | 'done'
  | 'confirmFailed';

export interface CheckInFile {
  id: string;
  source: File;
  // Base64url guardado na primeira leitura: a prévia é refeita sem reenvio do arquivo.
  content: string | null;
  status: CheckInStatus;
  preview: TransactionImportPreview | null;
  rows: Record<string, ImportRowState>;
  // Fixado na prévia: escolher a categoria não pode tirar a linha da revisão.
  exceptionIds: string[];
  error: string | null;
  result: TransactionImportResult | null;
}

export type CheckInAction =
  | { type: 'added'; files: CheckInFile[] }
  | { type: 'previewing'; id: string }
  | { type: 'previewed'; id: string; preview: TransactionImportPreview; content: string }
  | { type: 'refreshed'; id: string; preview: TransactionImportPreview }
  | { type: 'previewFailed'; id: string; error: string }
  | { type: 'categoryChosen'; id: string; title: string; categoryId: string }
  | { type: 'modeChosen'; id: string; externalId: string; mode: ImportRowState['mode'] }
  | { type: 'confirming'; id: string }
  | { type: 'confirmed'; id: string; result: TransactionImportResult }
  | { type: 'confirmFailed'; id: string; error: string }
  | { type: 'removed'; id: string }
  | { type: 'reset' };

export const isSupportedFile = (name: string) => /\.(ofx|pdf)$/i.test(name);

export const isException = (item: ImportPreviewItem, row: ImportRowState) =>
  item.status === 'possible_duplicate' || (item.status === 'new' && isUncategorized(item, row));

export const createCheckInFile = (id: string, source: File): CheckInFile => ({
  id,
  source,
  content: null,
  status: 'previewing',
  preview: null,
  rows: {},
  exceptionIds: [],
  error: null,
  result: null,
});

const applyPreview = (
  file: CheckInFile,
  preview: TransactionImportPreview,
  content: string
): CheckInFile => {
  const rows = Object.fromEntries(
    preview.items.map((item) => [item.externalId, initialRowState(item)])
  );
  const exceptionIds = preview.items
    .filter((item) => isException(item, rows[item.externalId]!))
    .map((item) => item.externalId);
  const status = preview.needsAccount
    ? 'needsAccount'
    : exceptionIds.length > 0
      ? 'review'
      : 'ready';

  return { ...file, status, preview, content, rows, exceptionIds, error: null };
};

const mergeRow = (
  item: ImportPreviewItem,
  previous: ImportPreviewItem | undefined,
  row: ImportRowState | undefined
): ImportRowState => {
  const initial = initialRowState(item);
  if (!previous || !row) return initial;

  const categoryChosen = row.categoryId !== (previous.suggestedCategoryId ?? '');
  // Fora de duplicada, o modo antigo pode apontar para uma ponta que já não existe.
  const keepsMode = item.status === 'possible_duplicate' && previous.status === item.status;

  return {
    ...initial,
    categoryId: categoryChosen ? row.categoryId : initial.categoryId,
    mode: keepsMode ? row.mode : initial.mode,
  };
};

// Roda durante a confirmação, sobre a prévia refeita depois de outro arquivo entrar no banco.
export const mergePreview = (file: CheckInFile, preview: TransactionImportPreview): CheckInFile => {
  const previousItems = new Map(file.preview?.items.map((item) => [item.externalId, item]));
  const reviewed = new Set(file.exceptionIds);
  const rows = Object.fromEntries(
    preview.items.map((item) => [
      item.externalId,
      mergeRow(item, previousItems.get(item.externalId), file.rows[item.externalId]),
    ])
  );
  const exceptionIds = preview.items
    .filter(
      (item) =>
        isException(item, rows[item.externalId]!) ||
        (item.status === 'new' && reviewed.has(item.externalId))
    )
    .map((item) => item.externalId);
  const awaitsReview = exceptionIds.some((id) => !reviewed.has(id));

  return {
    ...file,
    preview,
    rows,
    exceptionIds,
    status: awaitsReview ? 'review' : 'confirming',
    error: awaitsReview
      ? 'Apareceram novas exceções depois de importar os outros arquivos. Revise e importe de novo.'
      : null,
  };
};

// Mesma descrição = mesmo estabelecimento: a escolha vale para todas as linhas iguais.
const applyCategory = (file: CheckInFile, title: string, categoryId: string): CheckInFile => {
  const rows = { ...file.rows };
  for (const item of file.preview?.items ?? []) {
    if (item.title === title && item.status !== 'imported') {
      rows[item.externalId] = { ...rows[item.externalId]!, categoryId };
    }
  }
  return { ...file, rows };
};

export const checkInReducer = (files: CheckInFile[], action: CheckInAction): CheckInFile[] => {
  if (action.type === 'added') return [...files, ...action.files];
  if (action.type === 'reset') return [];
  if (action.type === 'removed') return files.filter((file) => file.id !== action.id);

  const update = (patch: (file: CheckInFile) => CheckInFile) =>
    files.map((file) => (file.id === action.id ? patch(file) : file));

  switch (action.type) {
    case 'previewing':
      return update((file) => ({ ...file, status: 'previewing', error: null }));
    case 'previewed':
      return update((file) => applyPreview(file, action.preview, action.content));
    case 'refreshed':
      return update((file) => mergePreview(file, action.preview));
    case 'previewFailed':
      return update((file) => ({
        ...file,
        status: 'failed',
        preview: null,
        rows: {},
        exceptionIds: [],
        error: action.error,
      }));
    case 'categoryChosen':
      return update((file) => applyCategory(file, action.title, action.categoryId));
    case 'modeChosen':
      return update((file) => ({
        ...file,
        rows: {
          ...file.rows,
          [action.externalId]: { ...file.rows[action.externalId]!, mode: action.mode },
        },
      }));
    case 'confirming':
      return update((file) => ({ ...file, status: 'confirming', error: null }));
    case 'confirmed':
      return update((file) => ({ ...file, status: 'done', result: action.result }));
    case 'confirmFailed':
      return update((file) => ({ ...file, status: 'confirmFailed', error: action.error }));
  }
};

export const summarizeFiles = (files: CheckInFile[]) => ({
  ready: files.filter((file) => file.status === 'ready').length,
  review: files.filter((file) => file.status === 'review').length,
  failed: files.filter((file) => file.status === 'failed' || file.status === 'confirmFailed')
    .length,
});

const selectedItems = ({ preview, rows }: CheckInFile) =>
  (preview?.items ?? []).filter((item) => rows[item.externalId]?.selected);

// Sem "Outros" cadastrada a sugestão vem nula, e o back recusa linha nova sem categoria.
export const hasMissingCategory = (file: CheckInFile) =>
  selectedItems(file).some((item) => {
    const row = file.rows[item.externalId]!;
    return row.mode === 'create' && !row.categoryId;
  });

export const confirmableFiles = (files: CheckInFile[]) =>
  files.filter(
    (file) =>
      ['ready', 'review', 'confirmFailed'].includes(file.status) && !hasMissingCategory(file)
  );

// Com dois ou mais cartões, o pagamento no extrato só marca a fatura se o total dela já existir.
export const sortCardsFirst = (files: CheckInFile[], accounts: { id: string; type: string }[]) => {
  const cards = new Set(
    accounts.filter((account) => account.type === 'credit_card').map((account) => account.id)
  );
  const isCard = (file: CheckInFile) => cards.has(file.preview?.accountId ?? '');

  return [...files.filter(isCard), ...files.filter((file) => !isCard(file))];
};

export const buildImportPayload = (file: CheckInFile): PostTransactionsImportBody => {
  const { accountId, accountKey, through, items, bill } = file.preview!;

  return {
    accountId: accountId!,
    accountKey,
    through,
    items: selectedItems(file).map((item) => {
      const row = file.rows[item.externalId]!;
      return {
        externalId: item.externalId,
        type: item.type,
        amount: item.amount,
        date: item.date,
        title: item.title,
        ...(row.mode === 'transfer'
          ? { transferOf: item.transferOf!.transactionId }
          : row.mode === 'link'
            ? { duplicateOf: item.duplicateOf! }
            : { categoryId: row.categoryId }),
      };
    }),
    // Pagamento de fatura marca a fatura como paga mesmo sem virar transação.
    billPayments: items
      .filter((item) => item.status === 'bill_payment')
      .map(({ type, amount, date }) => ({ type, amount, date })),
    ...(bill && { billDueDate: bill.dueDate }),
  };
};

const count = (total: number, one: string, many: string) =>
  total > 0 ? [`${total} ${total === 1 ? one : many}`] : [];

export const describePreview = (items: ImportPreviewItem[]) => {
  const total = (status: ImportPreviewItem['status']) =>
    items.filter((item) => item.status === status).length;
  const incoming = [
    ...count(total('new'), 'nova', 'novas'),
    ...count(total('possible_duplicate'), 'já lançada', 'já lançadas'),
    ...count(total('transfer'), 'transferência', 'transferências'),
    ...count(total('bill_payment'), 'pagamento de fatura', 'pagamentos de fatura'),
  ];

  return [
    ...(incoming.length > 0 ? incoming : ['Nada novo']),
    ...count(total('imported'), 'já importada', 'já importadas'),
  ].join(' · ');
};

export const describeImportResult = ({
  created,
  skipped,
  linked,
  transfers,
  billsPaid,
}: TransactionImportResult) =>
  [
    `${created} ${created === 1 ? 'transação importada' : 'transações importadas'}`,
    ...count(skipped, 'já existia', 'já existiam'),
    ...count(linked, 'confirmada', 'confirmadas'),
    ...count(transfers, 'transferência', 'transferências'),
    ...count(billsPaid, 'fatura paga', 'faturas pagas'),
  ].join(', ');
