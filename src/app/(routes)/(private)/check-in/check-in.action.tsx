import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import {
  getGetOverviewCardBillsQueryKey,
  getOverviewForecast,
} from '@/api/generated/hooks/overview/overview';
import {
  getGetTransactionsQueryKey,
  getGetTransactionsSummaryQueryKey,
  usePostTransactionsImport,
  usePostTransactionsImportPreview,
} from '@/api/generated/hooks/transactions/transactions';
import { getGetTransfersQueryKey } from '@/api/generated/hooks/transfers/transfers';
import { useAccounts } from '@/hooks/use-accounts';
import { getErrorMessage } from '@/lib/errors';
import type { CustomAxiosError } from '@/types/error.type';
import { useQueryClient } from '@tanstack/react-query';
import { useReducer, useRef, useState } from 'react';
import {
  buildImportPayload,
  type CheckInFile,
  checkInReducer,
  confirmableFiles,
  createCheckInFile,
  isSupportedFile,
} from './check-in.helpers';
import { type ImportRowState, toBase64Url } from './import-statement.helpers';

export interface FreeBalanceChange {
  before: number | null;
  after: number | null;
}

const messageOf = (error: unknown) => getErrorMessage(error as CustomAxiosError);

const readFreeBalance = async () => {
  try {
    const { data } = await getOverviewForecast();
    return data.freeBalance.total;
  } catch {
    return null;
  }
};

export const useCheckInAction = () => {
  const queryClient = useQueryClient();
  const { accounts, isLoading, isError, nameById, options } = useAccounts();
  const [files, dispatch] = useReducer(checkInReducer, []);
  const [balance, setBalance] = useState<FreeBalanceChange | null>(null);
  const [importing, setImporting] = useState(false);
  const nextId = useRef(0);
  const preview = usePostTransactionsImportPreview();
  const confirm = usePostTransactionsImport();

  const activeAccounts = accounts.filter((account) => account.isActive);
  const activeIds = new Set(activeAccounts.map((account) => account.id));
  const busy = importing || files.some((file) => file.status === 'previewing');
  const finished =
    !importing &&
    balance !== null &&
    files.every((file) => file.status === 'done' || file.status === 'failed');

  const previewFile = async (id: string, source: File, accountId?: string) => {
    if (!isSupportedFile(source.name)) {
      dispatch({ type: 'previewFailed', id, error: 'Envie um arquivo .ofx ou .pdf.' });
      return;
    }
    try {
      const file = toBase64Url(await source.arrayBuffer());
      const { data } = await preview.mutateAsync({ data: { file, accountId } });
      dispatch({ type: 'previewed', id, preview: data });
    } catch (error) {
      dispatch({ type: 'previewFailed', id, error: messageOf(error) });
    }
  };

  const addFiles = async (selected: File[]) => {
    const added = selected.map((source) => createCheckInFile(String(nextId.current++), source));
    dispatch({ type: 'added', files: added });
    for (const { id, source } of added) await previewFile(id, source);
  };

  const chooseAccount = async ({ id, source }: CheckInFile, accountId: string) => {
    dispatch({ type: 'previewing', id });
    await previewFile(id, source, accountId);
  };

  const invalidateImportedData = () =>
    [
      getGetTransactionsQueryKey(),
      getGetTransactionsSummaryQueryKey(),
      getGetOverviewCardBillsQueryKey(),
      getGetTransfersQueryKey(),
      ...freeBalanceQueryKeys(),
    ].forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

  const confirmFiles = async (targets: CheckInFile[]) => {
    setImporting(true);
    // Numa nova tentativa o saldo já pode ter mudado: "antes" é sempre o da primeira leitura.
    const before = balance ? balance.before : await readFreeBalance();

    let confirmedAny = false;
    for (const file of targets) {
      dispatch({ type: 'confirming', id: file.id });
      try {
        const { data } = await confirm.mutateAsync({ data: buildImportPayload(file) });
        dispatch({ type: 'confirmed', id: file.id, result: data });
        confirmedAny = true;
      } catch (error) {
        dispatch({ type: 'confirmFailed', id: file.id, error: messageOf(error) });
      }
    }

    if (confirmedAny) {
      invalidateImportedData();
      setBalance({ before, after: await readFreeBalance() });
    }
    setImporting(false);
  };

  return {
    files,
    busy,
    importing,
    finished,
    balance,
    activeAccounts,
    accountsLoading: isLoading,
    accountsError: isError,
    accountOptions: options.filter((option) => activeIds.has(option.value)),
    nameById,
    addFiles,
    chooseAccount,
    chooseCategory: (id: string, title: string, categoryId: string) =>
      dispatch({ type: 'categoryChosen', id, title, categoryId }),
    chooseMode: (id: string, externalId: string, mode: ImportRowState['mode']) =>
      dispatch({ type: 'modeChosen', id, externalId, mode }),
    removeFile: (id: string) => dispatch({ type: 'removed', id }),
    confirmAll: () => confirmFiles(confirmableFiles(files)),
    retryFile: (file: CheckInFile) => confirmFiles([file]),
    restart: () => {
      dispatch({ type: 'reset' });
      setBalance(null);
    },
  };
};
