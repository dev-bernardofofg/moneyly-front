'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseTable, BaseTableOptions } from '@/app/(components)/(bases)/(tables)/base-table';
import { queryClient } from '@/app/(contexts)';
import { getErrorMessage } from '@/app/(helpers)/errors';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
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
import { ConfirmActionForm } from '../../../(resources)/(forms)/confirm-action';
import { UpsertTransactionRecurringForm } from '../../../(resources)/(forms)/upsert-transaction-recurring.form';
import { RecurringTransaction } from '../../../(resources)/(generated)';
import {
  getGetRecurringTransactionsQueryKey,
  useDeleteRecurringTransactionsId,
  usePatchRecurringTransactionsIdDeactivate,
  usePatchRecurringTransactionsIdReactivate,
} from '../../../(resources)/(generated)/hooks/recurring-transactions/recurring-transactions';
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
      actions={(item) => (
        <div className="flex items-center gap-2">
          <RecurringTransactionHistoryDialog recurringTransactionId={item.id} title={item.title} />
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
                {item.isActive ? <PowerOff className="size-4" /> : <PowerIcon className="size-4" />}
              </BaseButton>
            }
          />
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
      )}
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
              {FN_UTILS_STRING.formatNumberToCurrency(item.amount?.toString() || '0')}
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
              {item.nextExecution ? format(item.nextExecution, 'dd/MM/yyyy') : '—'}
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
