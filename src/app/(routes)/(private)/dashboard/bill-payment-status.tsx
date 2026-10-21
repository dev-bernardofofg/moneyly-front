'use client';

import {
  useDeleteAccountsIdBillPaymentDueDate,
  usePostAccountsIdBillPayment,
} from '@/api/generated/hooks/accounts/accounts';
import { getGetOverviewCardBillsQueryKey } from '@/api/generated/hooks/overview/overview';
import type { CardBills } from '@/api/generated/types/CardBills';
import { BaseButton } from '@/components/clickable/base-button';
import { Badge } from '@/components/ui/badge';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import type { CustomAxiosError } from '@/types/error.type';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Bill = CardBills['bills'][number];

export const BillPaymentStatus = ({ bill }: { bill: Bill }) => {
  const queryClient = useQueryClient();
  const mutation = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetOverviewCardBillsQueryKey() }),
    onError: (error: unknown) => toast.error(getErrorMessage(error as CustomAxiosError)),
  };
  const markPaid = usePostAccountsIdBillPayment({ mutation });
  const unmarkPaid = useDeleteAccountsIdBillPaymentDueDate({ mutation });

  if (!bill.dueDate) return null;
  const dueDay = FN_UTILS_DATE.formatInBusinessTZ(bill.dueDate, 'yyyy-MM-dd');
  const isPending = markPaid.isPending || unmarkPaid.isPending;

  if (bill.payment) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-income text-income">
          {bill.payment.source === 'import' ? 'Paga (extrato)' : 'Paga'}
        </Badge>
        <BaseButton
          variant="ghost"
          size="sm"
          isLoading={isPending}
          onClick={() => unmarkPaid.mutate({ id: bill.accountId, dueDate: dueDay })}
        >
          Desfazer
        </BaseButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">Pendente</Badge>
      {bill.total > 0 && (
        <BaseButton
          variant="outline"
          size="sm"
          isLoading={isPending}
          onClick={() => markPaid.mutate({ id: bill.accountId, data: { dueDate: dueDay } })}
        >
          Marcar como paga
        </BaseButton>
      )}
    </div>
  );
};
