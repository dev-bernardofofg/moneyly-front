import { useGetRecurringTransactions } from '@/app/(resources)/(generated)/hooks/recurring-transactions/recurring-transactions';
import { usePagination } from '@/hooks/use-pagination';
import { keepPreviousData } from '@tanstack/react-query';

export const useRecurringTransactionsAction = () => {
  const { paginationParams, setPaginationParams } = usePagination();

  const { data, isLoading, isFetching } = useGetRecurringTransactions(
    {
      includeInactive: true,
      page: paginationParams.page,
      limit: paginationParams.limit,
    },
    { query: { placeholderData: keepPreviousData } }
  );

  return {
    data,
    isLoading: isLoading || isFetching,
    paginationParams,
    setPaginationParams,
  };
};
