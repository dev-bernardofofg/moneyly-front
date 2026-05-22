import { useGetTransactions } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import { usePagination } from '@/hooks/use-pagination';
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
  const { paginationParams, setPaginationParams } = usePagination();

  const { data, isLoading } = useGetTransactions({
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  return { data, isLoading, paginationParams, setPaginationParams };
};
