'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseTable, BaseTableOptions } from '@/app/(components)/(bases)/(tables)/base-table';
import { queryClient } from '@/app/(contexts)';
import { getErrorMessage } from '@/app/(helpers)/errors';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { PencilIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '../../../(resources)/(forms)/confirm-action';
import { UpsertOvertimeForm } from '../../../(resources)/(forms)/upsert-overtime.form';
import { OvertimeRecord } from '../../../(resources)/(generated)';
import {
  getGetOvertimeQueryKey,
  getGetOvertimeSummaryQueryKey,
  useDeleteOvertimeId,
} from '../../../(resources)/(generated)/hooks/overtime/overtime';

interface OvertimeTableProps extends BaseTableOptions {
  records: OvertimeRecord[];
  isLoading: boolean;
}

const formatTime = (iso: string) => FN_UTILS_DATE.formatInBusinessTZ(iso, 'HH:mm');
const formatDate = (iso: string) => FN_UTILS_DATE.formatInBusinessTZ(iso, 'dd/MM/yyyy');

const formatHours = (hours: string) => {
  const n = parseFloat(hours);
  const h = Math.floor(n);
  const min = Math.round((n - h) * 60);
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
};

const formatAmount = (amount: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parseFloat(amount));
};

export const OvertimeTable = ({
  records,
  isLoading,
  tableOptions,
  onPaginationChange,
}: OvertimeTableProps) => {
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetOvertimeQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetOvertimeSummaryQueryKey() });
  };

  const { mutate: remove } = useDeleteOvertimeId({
    mutation: {
      onSuccess: () => {
        toast.success('Hora extra removida');
        invalidate();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  return (
    <BaseTable
      data={records}
      title="Horas Extras"
      emptyMessage="Nenhuma hora extra registrada"
      loading={isLoading}
      pagination={tableOptions?.pagination}
      onPaginationChange={onPaginationChange}
      keyExtractor={(item) => item.id}
      actions={(item) => (
        <div className="flex items-center gap-2">
          <BaseDialog
            title="Editar hora extra"
            description="Editar registro de hora extra"
            trigger={
              <BaseButton className="w-fit">
                <PencilIcon className="size-4" />
              </BaseButton>
            }
          >
            <UpsertOvertimeForm overtimeRecord={item} />
          </BaseDialog>
          <ConfirmActionForm
            onConfirm={() => remove({ id: item.id })}
            title="Remover hora extra"
            description="Tem certeza que deseja remover este registro de hora extra?"
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
          header: 'Empresa',
          accessorKey: 'company',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">{item.company.name}</span>
          ),
        },
        {
          header: 'Data',
          accessorKey: 'startTime',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(item.startTime)}
            </span>
          ),
        },
        {
          header: 'Horário',
          accessorKey: 'endTime',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatTime(item.startTime)} → {formatTime(item.endTime)}
            </span>
          ),
        },
        {
          header: 'Horas',
          accessorKey: 'hoursWorked',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatHours(item.hoursWorked)}
            </span>
          ),
        },
        {
          header: 'Valor',
          accessorKey: 'amount',
          cell: (_, item) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatAmount(item.amount)}
            </span>
          ),
        },
      ]}
    />
  );
};
