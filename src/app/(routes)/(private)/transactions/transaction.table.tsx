'use client';

import { FN_UTILS_NUMBERS } from '@/lib/number';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { BaseTable, BaseTableOptions } from '@/components/tables/base-table';
import { queryClient } from '@/contexts';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import { useAccounts } from '@/hooks/use-accounts';
import { CustomAxiosError } from '@/types/error.type';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, PencilIcon, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '@/forms/confirm-action';
import { UpsertTransactionForm } from '@/forms/upsert-transaction.form';
import { Transaction } from '@/api/generated';
import {
  getGetTransactionsQueryKey,
  getGetTransactionsSummaryQueryKey,
  useDeleteTransactionsId,
} from '@/api/generated/hooks/transactions/transactions';

interface TransactionTableProps extends BaseTableOptions {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionTable = ({
  transactions,
  tableOptions,
  onPaginationChange,
  isLoading,
}: TransactionTableProps) => {
  const { nameById } = useAccounts();
  const { mutate } = useDeleteTransactionsId({
    mutation: {
      onSuccess: () => {
        toast.success('Transação deletada com sucesso');
        queryClient.invalidateQueries({ queryKey: getGetTransactionsSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  return (
    <BaseTable
      data={transactions}
      title="Transações"
      emptyMessage="Nenhuma transação encontrada"
      pagination={tableOptions.pagination}
      onPaginationChange={onPaginationChange}
      loading={isLoading}
      keyExtractor={(item) => item.id || ''}
      mobileCard={(item) => {
        const isIncome = item.type === 'income';
        return (
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full',
                isIncome ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
              )}
              aria-hidden
            >
              {isIncome ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.category?.name || 'Nenhuma categoria'} · {nameById.get(item.accountId) ?? '—'}
              </p>
              <p className="text-xs text-muted-foreground">
                {FN_UTILS_DATE.formatInBusinessTZ(item.date, 'dd/MM/yyyy')}
                {item.recurringTransactionId && ' · Recorrente'}
              </p>
            </div>
            <span
              className={cn(
                'shrink-0 text-base font-semibold tabular-nums',
                isIncome ? 'text-income' : 'text-expense'
              )}
            >
              <span className="sr-only">{isIncome ? 'Entrada de ' : 'Saída de '}</span>
              {isIncome ? '+' : '−'} {FN_UTILS_NUMBERS.formatCurrency(item.amount ?? 0)}
            </span>
          </div>
        );
      }}
      actions={(item) => (
        <div className="flex items-center gap-2">
          <BaseDialog
            title="Editar transação"
            description="Editar transação"
            trigger={
              <BaseButton className="w-fit">
                <PencilIcon className="size-4" />
              </BaseButton>
            }
          >
            <UpsertTransactionForm transaction={item} />
          </BaseDialog>
          <ConfirmActionForm
            onConfirm={() => mutate({ id: item.id || '' })}
            title="Remover transação"
            description="Tem certeza que deseja remover esta transação?"
            trigger={
              <BaseButton variant="destructive" className="w-fit">
                <Trash2 className="size-4" />
              </BaseButton>
            }
          />
        </div>
      )}
      columns={[
        {
          header: 'Tipo',
          accessorKey: 'type',
          cell: (value) => {
            return (
              <Badge variant={value === 'income' ? 'default' : 'destructive'} className="w-24">
                {value === 'income' ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm font-medium">
                  {value === 'income' ? 'Entrada' : 'Saída'}
                </span>
              </Badge>
            );
          },
        },
        {
          header: 'Título',
          accessorKey: 'title',
          cell: (_, item) => {
            return (
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <span>{item.title}</span>
                {item.recurringTransactionId && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 h-5 font-normal border-primary/40 text-primary-strong"
                  >
                    Recorrente
                  </Badge>
                )}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{item.description === '' ? 'Nenhuma descrição' : item.description}</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          },
        },
        {
          header: 'Categoria',
          accessorKey: 'category',
          cell: (_, item) => {
            return (
              <span className="text-sm font-medium text-muted-foreground">
                {item.category?.name || 'Nenhuma categoria'}
              </span>
            );
          },
        },
        {
          header: 'Conta',
          accessorKey: 'accountId',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {nameById.get(item.accountId) ?? '—'}
            </span>
          ),
        },
        {
          header: 'Valor',
          accessorKey: 'amount',
          cell: (_, item) => {
            return (
              <span className="text-sm font-medium text-muted-foreground">
                {FN_UTILS_NUMBERS.formatCurrency(item.amount ?? 0)}
              </span>
            );
          },
        },
        {
          header: 'Criado em',
          accessorKey: 'createdAt',
          cell: (_, item) => {
            if (!item.createdAt) return null;
            return (
              <div className="flex flex-col text-sm font-medium text-muted-foreground">
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.createdAt, 'dd/MM/yyyy')}</span>
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.createdAt, 'HH:mm')}</span>
              </div>
            );
          },
        },
        {
          header: 'Atualizado em',
          accessorKey: 'updatedAt',
          cell: (_, item) => {
            if (!item.updatedAt) return null;
            return (
              <div className="flex flex-col text-sm font-medium text-muted-foreground">
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.updatedAt, 'dd/MM/yyyy')}</span>
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.updatedAt, 'HH:mm')}</span>
              </div>
            );
          },
        },
      ]}
    />
  );
};
