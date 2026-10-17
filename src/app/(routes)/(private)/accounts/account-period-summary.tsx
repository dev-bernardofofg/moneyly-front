'use client';

import { usePeriod } from '@/app/(contexts)/period-provider';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { useGetTransactions } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountPeriodSummaryProps {
  accountId: string;
  isCard: boolean;
}

// limit 1: só o summary interessa; a lista paginada já traz os totais do filtro inteiro.
export const AccountPeriodSummary = ({ accountId, isCard }: AccountPeriodSummaryProps) => {
  const { selectedPeriodId } = usePeriod();
  const { data, isLoading } = useGetTransactions({
    page: 1,
    limit: 1,
    accountId,
    periodId: selectedPeriodId ?? undefined,
  });
  const summary = data?.summary;

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  if (isCard) {
    // No cartão o período da compra é o do vencimento: o total de despesas é a fatura que vence nele.
    return (
      <div className="rounded-md bg-muted/50 px-3 py-2">
        <p className="text-xs text-muted-foreground">Fatura que vence neste período</p>
        <p className="font-semibold tabular-nums text-expense">
          {FN_UTILS_NUMBERS.formatCurrency(summary?.totalExpense ?? 0)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 px-3 py-2">
      <div>
        <p className="text-xs text-muted-foreground">Entradas no período</p>
        <p className="font-semibold tabular-nums text-income">
          {FN_UTILS_NUMBERS.formatCurrency(summary?.totalIncome ?? 0)}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Saídas no período</p>
        <p className="font-semibold tabular-nums text-expense">
          {FN_UTILS_NUMBERS.formatCurrency(summary?.totalExpense ?? 0)}
        </p>
      </div>
    </div>
  );
};
