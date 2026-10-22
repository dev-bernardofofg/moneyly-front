'use client';

import { FN_UTILS_NUMBERS } from '@/lib/number';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { BaseTable, BaseTableOptions } from '@/components/tables/base-table';
import { queryClient } from '@/contexts';
import { getErrorMessage } from '@/lib/errors';
import { CustomAxiosError } from '@/types/error.type';
import { FN_UTILS_DATE } from '@/lib/date';
import { PencilIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmActionForm } from '@/forms/confirm-action';
import { UpsertOvertimeForm } from '@/forms/upsert-overtime.form';
import { OvertimeRecord } from '@/api/generated';
import { formatHoursLong } from './overtime-report.helpers';
import {
  getGetOvertimeQueryKey,
  getGetOvertimeSummaryQueryKey,
  useDeleteOvertimeId,
} from '@/api/generated/hooks/overtime/overtime';

interface OvertimeTableProps extends BaseTableOptions {
  records: OvertimeRecord[];
  isLoading: boolean;
  /** Total do mês inteiro (todas as páginas), não só das linhas visíveis. */
  totals?: { hours: number; amount: number } | null;
}

const formatTime = (iso: string) => FN_UTILS_DATE.formatInBusinessTZ(iso, 'HH:mm');
const formatDate = (iso: string) => FN_UTILS_DATE.formatInBusinessTZ(iso, 'dd/MM/yyyy');

const formatHours = (hours: string) => {
  const n = parseFloat(hours);
  const h = Math.floor(n);
  const min = Math.round((n - h) * 60);
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
};

export const OvertimeTable = ({
  records,
  isLoading,
  tableOptions,
  onPaginationChange,
  totals,
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
      footer={
        totals
          ? {
              company: 'Total do mês',
              hoursWorked: formatHoursLong(totals.hours),
              amount: FN_UTILS_NUMBERS.formatCurrency(totals.amount),
            }
          : undefined
      }
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
              {FN_UTILS_NUMBERS.formatCurrency(item.amount)}
            </span>
          ),
        },
      ]}
    />
  );
};
