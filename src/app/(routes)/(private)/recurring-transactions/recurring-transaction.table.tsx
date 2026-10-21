'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { BaseTable, BaseTableOptions } from '@/components/tables/base-table';
import { queryClient } from '@/contexts';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { FN_UTILS_STRING } from '@/lib/string';
import { CustomAxiosError } from '@/types/error.type';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Info,
  PencilIcon,
  PowerIcon,
  PowerOff,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '@/forms/confirm-action';
import { UpsertTransactionRecurringForm } from '@/forms/upsert-transaction-recurring.form';
import { RecurringTransaction } from '@/api/generated';
import {
  getGetRecurringTransactionsQueryKey,
  useDeleteRecurringTransactionsId,
  usePatchRecurringTransactionsIdDeactivate,
  usePatchRecurringTransactionsIdReactivate,
} from '@/api/generated/hooks/recurring-transactions/recurring-transactions';
import { formatFrequency } from './recurring-transaction.utils';
import { RecurringTransactionHistoryDialog } from './recurring-transaction-history.dialog';

interface RecurringTransactionTableProps extends BaseTableOptions {
  recurringTransactions: RecurringTransaction[];
  isLoading: boolean;
}

export const RecurringTransactionTable = ({
  recurringTransactions,
  isLoading,
  tableOptions,
  onPaginationChange,
}: RecurringTransactionTableProps) => {
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetRecurringTransactionsQueryKey() });

  const { mutate: deactivate } = usePatchRecurringTransactionsIdDeactivate({
    mutation: {
      onSuccess: () => {
        toast.success('Transação recorrente desativada');
        invalidate();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const { mutate: activate } = usePatchRecurringTransactionsIdReactivate({
    mutation: {
      onSuccess: () => {
        toast.success('Transação recorrente ativada');
        invalidate();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const { mutate: remove } = useDeleteRecurringTransactionsId({
    mutation: {
      onSuccess: () => {
        toast.success('Transação recorrente removida');
        invalidate();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  return (
    <BaseTable
      data={recurringTransactions}
      title="Transações Recorrentes"
      emptyMessage="Nenhuma transação recorrente encontrada"
      loading={isLoading}
      pagination={tableOptions.pagination}
      onPaginationChange={onPaginationChange}
      actions={(item) => {
        // Parcelada concluída: transações já materializadas — o back rejeita
        // editar/reativar (409), então nem oferecemos as ações.
        const isCompletedInstallment =
          item.totalInstallments != null && item.executedInstallments >= item.totalInstallments;

        return (
          <div className="flex items-center gap-2">
            <RecurringTransactionHistoryDialog
              recurringTransactionId={item.id}
              title={item.title}
            />
            {!isCompletedInstallment && (
              <BaseDialog
                title="Editar recorrente"
                description="Editar transação recorrente"
                trigger={
                  <BaseButton className="w-fit">
                    <PencilIcon className="size-4" />
                  </BaseButton>
                }
              >
                <UpsertTransactionRecurringForm recurringTransaction={item} />
              </BaseDialog>
            )}
            {!isCompletedInstallment && (
              <ConfirmActionForm
                variant={!item.isActive ? 'active' : 'default'}
                onConfirm={() =>
                  item.isActive ? deactivate({ id: item.id }) : activate({ id: item.id })
                }
                title={item.isActive ? 'Desativar recorrente' : 'Ativar recorrente'}
                description={
                  item.isActive
                    ? 'Desativar esta transação recorrente? Nenhuma nova execução será gerada.'
                    : 'Ativar esta transação recorrente? Nova execução será gerada.'
                }
                trigger={
                  <BaseButton variant="outline" className="w-fit">
                    {item.isActive ? (
                      <PowerOff className="size-4" />
                    ) : (
                      <PowerIcon className="size-4" />
                    )}
                  </BaseButton>
                }
              />
            )}
            <ConfirmActionForm
              onConfirm={() => remove({ id: item.id })}
              title="Remover recorrente"
              description="Tem certeza que deseja remover esta transação recorrente?"
              trigger={
                <BaseButton variant="destructive" className="w-fit">
                  <Trash2 className="size-4" />
                </BaseButton>
              }
            />
          </div>
        );
      }}
      columns={[
        {
          header: 'Tipo',
          accessorKey: 'type',
          cell: (value) => (
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
          ),
        },
        {
          header: 'Título',
          accessorKey: 'title',
          cell: (_, item) => (
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <span>{item.title}</span>
              {item.description && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{item.description}</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ),
        },
        {
          header: 'Valor',
          accessorKey: 'amount',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {FN_UTILS_NUMBERS.formatCurrency(item.amount ?? 0)}
            </span>
          ),
        },
        {
          header: 'Frequência',
          accessorKey: 'frequency',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatFrequency(item.frequency, item.dayOfWeek, item.dayOfMonth)}
            </span>
          ),
        },
        {
          header: 'Parcelas',
          accessorKey: 'executedInstallments',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {FN_UTILS_NUMBERS.formatInstallments(
                item.executedInstallments,
                item.totalInstallments
              )}
            </span>
          ),
        },
        {
          header: 'Próxima execução',
          accessorKey: 'nextExecution',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {item.nextExecution
                ? FN_UTILS_DATE.formatInBusinessTZ(item.nextExecution, 'dd/MM/yyyy')
                : '—'}
            </span>
          ),
        },
        {
          header: 'Status',
          accessorKey: 'isActive',
          cell: (value) => (
            <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Ativo' : 'Inativo'}</Badge>
          ),
        },
      ]}
    />
  );
};
