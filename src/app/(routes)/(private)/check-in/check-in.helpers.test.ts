import type { TransactionImportPreview } from '@/api/generated/types/TransactionImportPreview';
import { describe, expect, it } from 'vitest';
import {
  buildImportPayload,
  type CheckInFile,
  checkInReducer,
  confirmableFiles,
  createCheckInFile,
  describeImportResult,
  describePreview,
  isException,
  mergePreview,
  sortCardsFirst,
  summarizeFiles,
} from './check-in.helpers';
import {
  type ImportPreviewItem,
  type ImportRowState,
  initialRowState,
  isUncategorized,
  toBase64Url,
} from './import-statement.helpers';

const OUTROS = '88888888-8888-8888-8888-888888888888';
const MERCADO = '99999999-9999-9999-9999-999999999999';
const DUPLICATE_OF = '11111111-1111-1111-1111-111111111111';

const item = (overrides: Partial<ImportPreviewItem>): ImportPreviewItem => ({
  externalId: 'acc:1',
  type: 'expense',
  amount: 2500,
  date: '2026-10-05T03:00:00.000Z',
  title: 'Padaria',
  status: 'new',
  duplicateOf: null,
  transferOf: null,
  suggestedCategoryId: MERCADO,
  suggestionSource: 'rule',
  ...overrides,
});

const categorizedItem = item({});
const uncategorizedItem = item({
  externalId: 'acc:2',
  title: 'BOX CHINA',
  suggestedCategoryId: OUTROS,
  suggestionSource: 'fallback',
});
const possibleDuplicate = item({
  externalId: 'acc:3',
  title: 'Farmácia',
  status: 'possible_duplicate',
  duplicateOf: DUPLICATE_OF,
});
const transferItem = item({
  externalId: 'acc:4',
  type: 'income',
  status: 'transfer',
  suggestionSource: 'fallback',
  transferOf: {
    transactionId: '77777777-7777-7777-7777-777777777777',
    accountId: '66666666-6666-6666-6666-666666666666',
  },
});
const billPayment = item({
  externalId: 'acc:5',
  type: 'income',
  amount: 382200,
  status: 'bill_payment',
  suggestionSource: 'fallback',
});
const importedItem = item({
  externalId: 'acc:6',
  status: 'imported',
  suggestionSource: 'fallback',
});

const preview = (
  items: ImportPreviewItem[],
  overrides: Partial<TransactionImportPreview> = {}
): TransactionImportPreview => ({
  accountId: 'account-1',
  needsAccount: false,
  accountKey: '077:123',
  through: '2026-11-01T03:00:00.000Z',
  bill: null,
  items,
  ...overrides,
});

const previewed = (id: string, items: ImportPreviewItem[], overrides = {}) =>
  checkInReducer([createCheckInFile(id, new File([], `${id}.ofx`))], {
    type: 'previewed',
    id,
    preview: preview(items, overrides),
    content: 'conteudo',
  })[0]!;

const rowFor = (target: ImportPreviewItem): ImportRowState => initialRowState(target);

describe('isException', () => {
  it('flags uncategorized rows and possible duplicates', () => {
    expect(isException(uncategorizedItem, rowFor(uncategorizedItem))).toBe(true);
    expect(isException(possibleDuplicate, rowFor(possibleDuplicate))).toBe(true);
  });

  it('leaves categorized rows, transfers, bill payments and imported rows out', () => {
    expect(isException(categorizedItem, rowFor(categorizedItem))).toBe(false);
    expect(isException(transferItem, rowFor(transferItem))).toBe(false);
    expect(isException(billPayment, rowFor(billPayment))).toBe(false);
    expect(isException(importedItem, rowFor(importedItem))).toBe(false);
  });

  it('ignores the row mode of a transfer', () => {
    expect(isException(transferItem, { ...rowFor(transferItem), mode: 'create' })).toBe(false);
  });
});

describe('summarizeFiles', () => {
  it('counts files by outcome', () => {
    const ready = previewed('a', [categorizedItem]);
    const withException = previewed('b', [uncategorizedItem]);
    const invalid = checkInReducer([createCheckInFile('c', new File([], 'c.ofx'))], {
      type: 'previewFailed',
      id: 'c',
      error: 'Arquivo inválido',
    })[0]!;

    expect(summarizeFiles([ready, withException, invalid])).toEqual({
      ready: 1,
      review: 1,
      failed: 1,
    });
  });

  it('counts a confirmation failure as failed', () => {
    const file = previewed('a', [categorizedItem]);
    const failed = checkInReducer([file], { type: 'confirmFailed', id: 'a', error: 'Falhou' })[0]!;

    expect(summarizeFiles([failed])).toEqual({ ready: 0, review: 0, failed: 1 });
  });
});

describe('checkInReducer', () => {
  it('asks for the account without rows when the account is unknown', () => {
    const file = previewed('a', [], { accountId: null, needsAccount: true });

    expect(file.status).toBe('needsAccount');
    expect(file.rows).toEqual({});
  });

  it('marks a file without exceptions as ready, even with nothing new', () => {
    expect(previewed('a', [categorizedItem]).status).toBe('ready');
    expect(previewed('b', []).status).toBe('ready');
    expect(previewed('c', [importedItem]).status).toBe('ready');
  });

  it('keeps a row under review after the user categorizes it', () => {
    const file = previewed('a', [uncategorizedItem]);

    const [next] = checkInReducer([file], {
      type: 'categoryChosen',
      id: 'a',
      title: uncategorizedItem.title,
      categoryId: MERCADO,
    });

    expect(next!.rows[uncategorizedItem.externalId]!.categoryId).toBe(MERCADO);
    expect(next!.exceptionIds).toEqual([uncategorizedItem.externalId]);
    expect(next!.status).toBe('review');
  });

  it('applies a chosen category to every row with the same title', () => {
    const twin = { ...uncategorizedItem, externalId: 'acc:9' };
    const file = previewed('a', [uncategorizedItem, twin]);

    const [next] = checkInReducer([file], {
      type: 'categoryChosen',
      id: 'a',
      title: uncategorizedItem.title,
      categoryId: MERCADO,
    });

    expect(next!.rows['acc:9']!.categoryId).toBe(MERCADO);
  });

  it('drops the previous preview when asking again fails', () => {
    const asked = previewed('a', [], { accountId: null, needsAccount: true });

    const [next] = checkInReducer([asked], { type: 'previewFailed', id: 'a', error: 'Falhou' });

    expect(next).toMatchObject({ status: 'failed', preview: null, error: 'Falhou' });
  });

  it('never touches another file', () => {
    const first = previewed('a', [categorizedItem]);
    const second = previewed('b', [uncategorizedItem]);

    const next = checkInReducer([first, second], {
      type: 'confirmFailed',
      id: 'a',
      error: 'Falhou',
    });

    expect(next[0]!.status).toBe('confirmFailed');
    expect(next[1]).toBe(second);
  });
});

describe('mergePreview', () => {
  const choose = (file: CheckInFile, title: string, categoryId: string) =>
    checkInReducer([file], { type: 'categoryChosen', id: file.id, title, categoryId })[0]!;

  it('keeps the file content so nothing needs re-upload', () => {
    expect(previewed('a', []).content).toBe('conteudo');
  });

  it('keeps a chosen category and takes fresh suggestions for untouched rows', () => {
    const file = choose(
      previewed('a', [uncategorizedItem, categorizedItem]),
      uncategorizedItem.title,
      MERCADO
    );

    const merged = mergePreview(
      file,
      preview([uncategorizedItem, { ...categorizedItem, suggestedCategoryId: OUTROS }])
    );

    expect(merged.rows[uncategorizedItem.externalId]!.categoryId).toBe(MERCADO);
    expect(merged.rows[categorizedItem.externalId]!.categoryId).toBe(OUTROS);
    expect(merged.status).toBe('confirming');
  });

  it('keeps the choice of creating a possible duplicate', () => {
    const file = checkInReducer([previewed('a', [possibleDuplicate])], {
      type: 'modeChosen',
      id: 'a',
      externalId: possibleDuplicate.externalId,
      mode: 'create',
    })[0]!;

    const merged = mergePreview(file, preview([possibleDuplicate]));

    expect(merged.rows[possibleDuplicate.externalId]!.mode).toBe('create');
    expect(merged.status).toBe('confirming');
  });

  it('drops rows that are now imported', () => {
    const file = previewed('a', [uncategorizedItem]);

    const merged = mergePreview(file, preview([{ ...uncategorizedItem, status: 'imported' }]));

    expect(merged.exceptionIds).toEqual([]);
    expect(buildImportPayload(merged).items).toEqual([]);
  });

  it('turns a row into a transfer and takes it out of review', () => {
    const file = previewed('a', [uncategorizedItem]);
    const transfer = {
      ...uncategorizedItem,
      status: 'transfer' as const,
      transferOf: transferItem.transferOf,
    };

    const merged = mergePreview(file, preview([transfer]));

    expect(merged.rows[transfer.externalId]).toMatchObject({ mode: 'transfer', selected: true });
    expect(merged.exceptionIds).toEqual([]);
    expect(merged.status).toBe('confirming');
    expect(buildImportPayload(merged).items[0]).toMatchObject({
      transferOf: transferItem.transferOf!.transactionId,
    });
  });

  it('never sends a transfer that is gone', () => {
    const file = previewed('a', [transferItem]);
    const gone = { ...transferItem, status: 'new' as const, transferOf: null };

    const merged = mergePreview(file, preview([{ ...gone, suggestionSource: 'rule' }]));

    expect(merged.rows[gone.externalId]!.mode).toBe('create');
    expect(buildImportPayload(merged).items[0]).not.toHaveProperty('transferOf');
    expect(buildImportPayload(merged).items[0]).toMatchObject({ categoryId: MERCADO });
  });

  it('never links to a duplicate that is gone', () => {
    const file = previewed('a', [possibleDuplicate]);
    const gone = { ...possibleDuplicate, status: 'new' as const, duplicateOf: null };

    const merged = mergePreview(file, preview([gone]));

    expect(merged.rows[gone.externalId]!.mode).toBe('create');
    expect(buildImportPayload(merged).items[0]).not.toHaveProperty('duplicateOf');
  });

  it('keeps reviewed rows listed without asking for review again', () => {
    const file = choose(previewed('a', [uncategorizedItem]), uncategorizedItem.title, MERCADO);

    const merged = mergePreview(file, preview([uncategorizedItem]));

    expect(merged.exceptionIds).toEqual([uncategorizedItem.externalId]);
    expect(merged.status).toBe('confirming');
  });

  it('returns to review when the merge finds a new exception', () => {
    const file = previewed('a', [categorizedItem]);
    const duplicate = {
      ...categorizedItem,
      status: 'possible_duplicate' as const,
      duplicateOf: DUPLICATE_OF,
    };

    const merged = mergePreview(file, preview([duplicate]));

    expect(merged.status).toBe('review');
    expect(merged.exceptionIds).toEqual([categorizedItem.externalId]);
    expect(merged.rows[categorizedItem.externalId]!.mode).toBe('link');
    expect(merged.error).toMatch(/Apareceram novas exceções/);
  });
});

describe('sortCardsFirst', () => {
  it('puts card files first and keeps upload order inside each group', () => {
    const checkingA = previewed('a', [], { accountId: 'checking' });
    const cardB = previewed('b', [], { accountId: 'card' });
    const checkingC = previewed('c', [], { accountId: 'checking' });
    const cardD = previewed('d', [], { accountId: 'card' });
    const accounts = [
      { id: 'checking', type: 'checking' },
      { id: 'card', type: 'credit_card' },
    ];

    expect(sortCardsFirst([checkingA, cardB, checkingC, cardD], accounts)).toEqual([
      cardB,
      cardD,
      checkingA,
      checkingC,
    ]);
  });
});

describe('confirmableFiles', () => {
  it('takes ready, reviewed and retried files only', () => {
    const ready = previewed('a', [categorizedItem]);
    const review = previewed('b', [uncategorizedItem]);
    const retry = { ...previewed('c', [categorizedItem]), status: 'confirmFailed' as const };
    const others: CheckInFile[] = [
      previewed('d', [], { accountId: null, needsAccount: true }),
      { ...previewed('e', [categorizedItem]), status: 'done' },
      { ...previewed('f', [categorizedItem]), status: 'failed' },
    ];

    expect(confirmableFiles([ready, review, retry, ...others])).toEqual([ready, review, retry]);
  });

  it('holds a file back when a row has no category to fall back on', () => {
    const withoutOutros = previewed('a', [
      item({ suggestedCategoryId: null, suggestionSource: 'fallback' }),
    ]);

    expect(confirmableFiles([withoutOutros])).toEqual([]);
  });
});

describe('buildImportPayload', () => {
  it('sends rows by mode, bill payments, coverage and the due date', () => {
    const file = previewed('a', [
      categorizedItem,
      possibleDuplicate,
      transferItem,
      billPayment,
      importedItem,
    ]);
    const dueDate = '2026-11-10T03:00:00.000Z';

    const payload = buildImportPayload({
      ...file,
      preview: { ...file.preview!, bill: { dueDate, total: 2500 } },
    });

    expect(payload).toMatchObject({
      accountId: 'account-1',
      accountKey: '077:123',
      through: '2026-11-01T03:00:00.000Z',
      billDueDate: dueDate,
      billPayments: [{ type: 'income', amount: 382200, date: billPayment.date }],
    });
    expect(payload.items.map((row) => row.externalId)).toEqual(['acc:1', 'acc:3', 'acc:4']);
    expect(payload.items[0]).toMatchObject({ categoryId: MERCADO });
    expect(payload.items[1]).toMatchObject({ duplicateOf: DUPLICATE_OF });
    expect(payload.items[1]).not.toHaveProperty('categoryId');
    expect(payload.items[2]).toMatchObject({ transferOf: transferItem.transferOf!.transactionId });
  });

  it('sends a file with nothing new, so coverage still updates', () => {
    const payload = buildImportPayload(previewed('a', []));

    expect(payload).toMatchObject({ items: [], billPayments: [], accountId: 'account-1' });
    expect(payload).not.toHaveProperty('billDueDate');
  });
});

describe('descriptions', () => {
  it('describes what a file brings', () => {
    expect(describePreview([categorizedItem, transferItem, billPayment, importedItem])).toBe(
      '1 nova · 1 transferência · 1 pagamento de fatura · 1 já importada'
    );
  });

  it('says when there is nothing new', () => {
    expect(describePreview([importedItem])).toBe('Nada novo · 1 já importada');
    expect(describePreview([])).toBe('Nada novo');
  });

  it('describes what the import did', () => {
    expect(
      describeImportResult({ created: 2, skipped: 1, billsPaid: 1, transfers: 1, linked: 1 })
    ).toBe('2 transações importadas, 1 já existia, 1 confirmada, 1 transferência, 1 fatura paga');
    expect(
      describeImportResult({ created: 1, skipped: 0, billsPaid: 0, transfers: 0, linked: 0 })
    ).toBe('1 transação importada');
  });
});

describe('import statement helpers', () => {
  it('encodes files as base64url without padding', () => {
    const encoded = toBase64Url(new TextEncoder().encode('<OFX>?>').buffer as ArrayBuffer);

    expect(encoded).toBe('PE9GWD4_Pg');
  });

  it('treats a fallback suggestion as uncategorized until the user changes it', () => {
    expect(
      isUncategorized(uncategorizedItem, { selected: true, categoryId: OUTROS, mode: 'create' })
    ).toBe(true);
    expect(
      isUncategorized(uncategorizedItem, { selected: true, categoryId: MERCADO, mode: 'create' })
    ).toBe(false);
    expect(
      isUncategorized(categorizedItem, { selected: true, categoryId: MERCADO, mode: 'create' })
    ).toBe(false);
  });

  it('selects a matched transfer as a transfer, without category', () => {
    const row = initialRowState(transferItem);

    expect(row).toMatchObject({ selected: true, mode: 'transfer' });
    expect(isUncategorized(transferItem, row)).toBe(false);
  });

  it('selects new rows and rows already in the app, never imported or bill payments', () => {
    const items = [categorizedItem, possibleDuplicate, billPayment, importedItem];

    expect(items.map((row) => initialRowState(row).selected)).toEqual([true, true, false, false]);
    expect(initialRowState(possibleDuplicate).mode).toBe('link');
  });
});
