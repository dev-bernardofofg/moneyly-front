'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { getErrorMessage } from '@/lib/errors';
import { useAccounts } from '@/hooks/use-accounts';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import {
  getGetTransactionsQueryKey,
  getGetTransactionsSummaryQueryKey,
  usePostTransactionsImport,
  usePostTransactionsImportPreview,
} from '@/api/generated/hooks/transactions/transactions';
import { getGetAccountsQueryKey } from '@/api/generated/hooks/accounts/accounts';
import { getGetOverviewCardBillsQueryKey } from '@/api/generated/hooks/overview/overview';
import { getGetTransfersQueryKey } from '@/api/generated/hooks/transfers/transfers';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import type { CustomAxiosError } from '@/types/error.type';
import { Badge } from '@/components/ui/badge';
import { DialogClose } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImportCategoryPicker } from './import-category-picker';
import {
  type ImportPreviewItem,
  isUncategorized,
  type ImportRowState,
  initialRowState,
  toBase64Url,
} from './import-statement.helpers';

const STATUS_LABEL = {
  imported: 'Já importada',
  possible_duplicate: 'Já lançada no app',
  bill_payment: 'Pagamento de fatura',
  transfer: 'Transferência',
} as const;

export const ImportStatementForm = () => {
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState<ImportPreviewItem[]>([]);
  // Fatura em PDF: vencimento e total impressos nela.
  const [bill, setBill] = useState<{ dueDate: string; total: number | null } | null>(null);
  const { options: accountOptions, defaultAccountId, nameById } = useAccounts();
  const [chosenAccountId, setChosenAccountId] = useState<string>();
  // Até o usuário escolher, vale a conta padrão (carrega depois do primeiro render).
  const accountId = chosenAccountId ?? defaultAccountId;
  const [rows, setRows] = useState<Record<string, ImportRowState>>({});

  const onError = (error: unknown) => toast.error(getErrorMessage(error as CustomAxiosError));

  const preview = usePostTransactionsImportPreview({
    mutation: {
      onSuccess: (response) => {
        const previewItems = response.data?.items ?? [];
        setItems(previewItems);
        setBill(response.data?.bill ?? null);
        setRows(
          Object.fromEntries(previewItems.map((item) => [item.externalId, initialRowState(item)]))
        );
      },
      onError,
    },
  });

  const confirm = usePostTransactionsImport({
    mutation: {
      onSuccess: (response) => {
        const { created = 0, skipped = 0, billsPaid = 0, transfers = 0 } = response.data ?? {};
        const parts = [`${created} transações importadas`];
        if (skipped > 0) parts.push(`${skipped} já existiam`);
        const { linked = 0 } = response.data ?? {};
        if (linked > 0) parts.push(`${linked} ${linked === 1 ? 'confirmada' : 'confirmadas'}`);
        if (transfers > 0)
          parts.push(`${transfers} ${transfers === 1 ? 'transferência' : 'transferências'}`);
        if (billsPaid > 0)
          parts.push(`${billsPaid} ${billsPaid === 1 ? 'fatura paga' : 'faturas pagas'}`);
        toast.success(parts.join(', '));
        [
          getGetTransactionsQueryKey(),
          getGetTransactionsSummaryQueryKey(),
          getGetOverviewCardBillsQueryKey(),
          getGetAccountsQueryKey(),
          getGetTransfersQueryKey(),
          ...freeBalanceQueryKeys(),
        ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
        closeRef.current?.click();
      },
      onError,
    },
  });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    preview.mutate({ data: { file: toBase64Url(await file.arrayBuffer()), accountId } });
  };

  // A prévia casa transferências com a outra conta: trocar a conta invalida a prévia.
  const chooseAccount = (id: string) => {
    setChosenAccountId(id);
    setItems([]);
    setRows({});
    setBill(null);
  };

  const updateRow = (externalId: string, patch: Partial<ImportRowState>) =>
    setRows((current) => ({ ...current, [externalId]: { ...current[externalId]!, ...patch } }));

  // Mesma descrição = mesmo estabelecimento: a escolha vale para todas as linhas iguais.
  const chooseCategory = (title: string, categoryId: string) =>
    setRows((current) => {
      const next = { ...current };
      for (const item of items) {
        if (item.title === title && item.status !== 'imported') {
          next[item.externalId] = { ...next[item.externalId]!, categoryId };
        }
      }
      return next;
    });

  const selectedItems = items.filter((item) => rows[item.externalId]?.selected);
  const uncategorizedCount = selectedItems.filter((item) =>
    isUncategorized(item, rows[item.externalId]!)
  ).length;
  const missingCategory = selectedItems.some(
    (item) => rows[item.externalId]?.mode === 'create' && !rows[item.externalId]?.categoryId
  );
  // Pagamento de fatura marca a fatura como paga mesmo sem virar transação.
  const billPayments = items
    .filter((item) => item.status === 'bill_payment')
    .map(({ type, amount, date }) => ({ type, amount, date }));

  const handleConfirm = () =>
    confirm.mutate({
      data: {
        accountId: accountId!,
        items: selectedItems.map((item) => ({
          externalId: item.externalId,
          type: item.type,
          amount: item.amount,
          date: item.date,
          title: item.title,
          ...(rows[item.externalId]!.mode === 'transfer'
            ? { transferOf: item.transferOf!.transactionId }
            : rows[item.externalId]!.mode === 'link'
              ? { duplicateOf: item.duplicateOf! }
              : { categoryId: rows[item.externalId]!.categoryId }),
        })),
        billPayments,
        ...(bill && { billDueDate: bill.dueDate }),
      },
    });

  const billRowsTotal = items
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  return (
    <div className="space-y-4">
      <DialogClose ref={closeRef} className="hidden" />

      <div className="space-y-1">
        <span id="import-account-label" className="text-sm font-medium">
          Conta ou cartão do extrato
        </span>
        <Select value={accountId ?? ''} onValueChange={chooseAccount}>
          <SelectTrigger aria-labelledby="import-account-label">
            <SelectValue placeholder="Escolha a conta" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Num cartão, cada compra conta no período em que a fatura vence.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="ofx-file" className="text-sm font-medium">
          Extrato OFX ou fatura do Inter em PDF
        </label>
        <input
          id="ofx-file"
          type="file"
          accept=".ofx,.pdf,application/x-ofx,application/pdf"
          disabled={preview.isPending}
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Exporte o extrato em OFX no app do banco, ou envie o PDF da fatura do cartão Inter.
        </p>
      </div>

      {preview.isPending && <p className="text-sm text-muted-foreground">Lendo extrato...</p>}

      {items.length > 0 && (
        <>
          {bill && (
            <div className="rounded-md border p-3 text-sm">
              <p>
                Fatura com vencimento em{' '}
                <span className="font-medium">
                  {FN_UTILS_DATE.formatInBusinessTZ(bill.dueDate, 'dd/MM/yyyy')}
                </span>
                {bill.total != null && (
                  <>
                    {' · total '}
                    <span className="font-medium">
                      {FN_UTILS_NUMBERS.formatCurrency(bill.total)}
                    </span>
                  </>
                )}
                . Todas as linhas contam nessa fatura, inclusive parcelas de compras antigas.
              </p>
              {bill.total != null && bill.total !== billRowsTotal && (
                <p role="alert" className="mt-1 text-expense">
                  A soma das compras lidas ({FN_UTILS_NUMBERS.formatCurrency(billRowsTotal)}) não
                  bate com o total da fatura. Confira antes de importar.
                </p>
              )}
            </div>
          )}
          {uncategorizedCount > 0 && (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
              {uncategorizedCount === 1
                ? '1 compra não tem categoria definida e ficaria em Outros.'
                : `${uncategorizedCount} compras não têm categoria definida e ficariam em Outros.`}{' '}
              Escolha ou crie uma: o Moneyly lembra na próxima importação.
            </p>
          )}

          <ul
            className="max-h-[50vh] divide-y overflow-y-auto rounded-lg border"
            aria-label="Transações do extrato"
          >
            {items.map((item) => {
              const row = rows[item.externalId]!;
              const isImported = item.status === 'imported';
              const checkboxId = `import-${item.externalId}`;
              return (
                <li
                  key={item.externalId}
                  className={cn(
                    'grid gap-2 p-3 sm:grid-cols-[auto_1fr_12rem]',
                    isImported && 'opacity-60'
                  )}
                >
                  <input
                    id={checkboxId}
                    type="checkbox"
                    className="mt-1 size-4"
                    checked={row.selected}
                    disabled={isImported}
                    onChange={(event) =>
                      updateRow(item.externalId, { selected: event.target.checked })
                    }
                  />
                  <label htmlFor={checkboxId} className="min-w-0 space-y-1">
                    <span className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="tabular-nums text-muted-foreground">
                        {FN_UTILS_DATE.formatInBusinessTZ(item.date, 'dd/MM')}
                      </span>
                      <span className="truncate font-medium">{item.title}</span>
                      {item.status !== 'new' && (
                        <Badge variant="outline">
                          {STATUS_LABEL[item.status]}
                          {item.transferOf &&
                            ` ${item.type === 'income' ? 'de' : 'para'} ${nameById.get(item.transferOf.accountId) ?? 'outra conta'}`}
                        </Badge>
                      )}
                      {isUncategorized(item, row) && (
                        <Badge
                          variant="outline"
                          className="border-amber-400 text-amber-700 dark:text-amber-300"
                        >
                          Sem categoria definida
                        </Badge>
                      )}
                    </span>
                    <span
                      className={cn(
                        'block text-sm font-semibold tabular-nums',
                        item.type === 'expense' ? 'text-expense' : 'text-income'
                      )}
                    >
                      {item.type === 'expense' ? '−' : '+'}{' '}
                      {FN_UTILS_NUMBERS.formatCurrency(item.amount)}
                    </span>
                  </label>
                  {row.mode !== 'create' ? (
                    <div className="self-center space-y-1 text-xs text-muted-foreground">
                      <p>
                        {row.mode === 'transfer'
                          ? 'Junta com o lançamento da outra conta. Não conta como receita nem despesa.'
                          : 'Confirma o lançamento que já está no app, com o valor do arquivo. Não duplica.'}
                      </p>
                      <button
                        type="button"
                        className="font-medium text-primary-strong underline-offset-2 hover:underline"
                        onClick={() => updateRow(item.externalId, { mode: 'create' })}
                      >
                        {row.mode === 'transfer' ? 'Não é transferência' : 'É outro lançamento'}
                      </button>
                    </div>
                  ) : (
                    <ImportCategoryPicker
                      label={item.title}
                      value={row.categoryId}
                      disabled={isImported}
                      onChange={(categoryId) => chooseCategory(item.title, categoryId)}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {missingCategory && (
            <p role="alert" className="text-sm text-expense">
              Escolha a categoria de todas as transações selecionadas.
            </p>
          )}

          <BaseButton
            type="button"
            className="w-full"
            disabled={
              (selectedItems.length === 0 && billPayments.length === 0) ||
              missingCategory ||
              !accountId
            }
            isLoading={confirm.isPending}
            onClick={handleConfirm}
          >
            Importar {selectedItems.length}{' '}
            {selectedItems.length === 1 ? 'transação' : 'transações'}
          </BaseButton>
        </>
      )}
    </div>
  );
};
