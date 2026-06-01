'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseTable, BaseTableOptions } from '@/app/(components)/(bases)/(tables)/base-table';
import { queryClient } from '@/app/(contexts)';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { getErrorMessage } from '@/app/(helpers)/errors';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, PencilIcon, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '../../../(resources)/(forms)/confirm-action';
import { UpsertTransactionForm } from '../../../(resources)/(forms)/upsert-transaction.form';
import { Transaction } from '../../../(resources)/(generated)';
import {
  getGetTransactionsQueryKey,
  getGetTransactionsSummaryQueryKey,
  useDeleteTransactionsId,
} from '../../../(resources)/(generated)/hooks/transactions/transactions';

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
                    className="text-xs px-1.5 py-0 h-5 font-normal border-primary/40 text-primary"
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
          header: 'Valor',
          accessorKey: 'amount',
          cell: (_, item) => {
            return (
              <span className="text-sm font-medium text-muted-foreground">
                {FN_UTILS_STRING.formatNumberToCurrency(item.amount?.toString() || '0')}
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
