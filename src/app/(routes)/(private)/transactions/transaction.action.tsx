import { usePeriod } from '@/app/(contexts)/period-provider';
import { useGetTransactions } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import { GetTransactionsQueryParamsTypeEnumKey } from '@/app/(resources)/(generated)/types/GetTransactions';
import { usePagination } from '@/hooks/use-pagination';
import { useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export const TRANSACTION_STATS_INTERATOR = [
  {
    name: 'Rendimento Mensal',
    indicator: 'monthlyIncome',
    icon: DollarSign,
    description: 'Rendimento mensal cadastrado',
    isMonetary: true,
    variant: 'default',
    loading: false,
  },
  {
    name: 'Entradas',
    indicator: 'totalIncome',
    icon: TrendingUp,
    description: 'Entradas totais',
    isMonetary: true,
    variant: 'default',
    loading: false,
  },
  {
    name: 'Saídas',
    indicator: 'totalExpense',
    icon: TrendingDown,
    description: 'Gastos totais',
    isMonetary: true,
    variant: 'destructive',
    loading: false,
  },
] as const;

export const useTransactionsAction = () => {
  const { selectedPeriodId } = usePeriod();
  const { paginationParams, setPaginationParams } = usePagination();
  const [typeFilter, setTypeFilter] = useState<GetTransactionsQueryParamsTypeEnumKey | undefined>(
    undefined
  );

  const { data, isLoading } = useGetTransactions({
    page: paginationParams.page,
    limit: paginationParams.limit,
    periodId: selectedPeriodId ?? undefined,
    type: typeFilter,
  });

  return { data, isLoading, paginationParams, setPaginationParams, typeFilter, setTypeFilter };
};
