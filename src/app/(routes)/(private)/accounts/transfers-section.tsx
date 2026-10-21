'use client';

import { getGetAccountsQueryKey } from '@/api/generated/hooks/accounts/accounts';
import {
  getGetTransfersQueryKey,
  useDeleteTransfersId,
  useGetTransfers,
} from '@/api/generated/hooks/transfers/transfers';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import { Section } from '@/components/cards/section';
import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { usePeriod } from '@/contexts/period-provider';
import { ConfirmActionForm } from '@/forms/confirm-action';
import { UpsertTransferForm } from '@/forms/upsert-transfer.form';
import { useAccounts } from '@/hooks/use-accounts';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { CustomAxiosError } from '@/types/error.type';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const TransfersSection = () => {
  const queryClient = useQueryClient();
  const { selectedPeriodId } = usePeriod();
  const { nameById } = useAccounts();
  const { data, isLoading } = useGetTransfers({ periodId: selectedPeriodId ?? undefined });
  const transfers = data?.data ?? [];

  const remove = useDeleteTransfersId({
    mutation: {
      onSuccess: () => {
        toast.success('Transferência removida');
        [getGetTransfersQueryKey(), getGetAccountsQueryKey(), ...freeBalanceQueryKeys()].forEach(
          (queryKey) => queryClient.invalidateQueries({ queryKey })
        );
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error as CustomAxiosError)),
    },
  });

  const accountName = (id: string) => nameById.get(id) ?? 'Conta removida';

  return (
    <Section Icon={ArrowLeftRight} title="Transferências do período">
      <div className="mb-3 flex justify-end">
        <BaseDialog
          title="Nova transferência"
          description="Dinheiro movido entre as suas contas"
          trigger={<BaseButton clickAction="create">Nova transferência</BaseButton>}
        >
          <UpsertTransferForm />
        </BaseDialog>
      </div>
      {isLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : transfers.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">Nenhuma transferência neste período.</p>
      ) : (
        <ul className="divide-y" aria-label="Transferências">
          {transfers.map((transfer) => (
            <li key={transfer.id} className="flex items-center gap-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {accountName(transfer.fromAccountId)} → {accountName(transfer.toAccountId)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {FN_UTILS_DATE.formatInBusinessTZ(transfer.date, 'dd/MM/yyyy')}
                  {transfer.description ? ` · ${transfer.description}` : ''}
                </p>
              </div>
              <span className="shrink-0 font-semibold tabular-nums">
                {FN_UTILS_NUMBERS.formatCurrency(transfer.amount)}
              </span>
              <ConfirmActionForm
                isLoading={remove.isPending}
                onConfirm={() => remove.mutate({ id: transfer.id })}
                title="Remover transferência"
                description="Os saldos das duas contas voltam ao que eram antes dela."
                trigger={
                  <BaseButton variant="ghost" aria-label="Remover transferência">
                    <Trash2 className="size-4" />
                  </BaseButton>
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
