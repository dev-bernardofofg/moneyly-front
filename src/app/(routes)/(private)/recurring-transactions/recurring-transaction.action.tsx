import { useGetRecurringTransactions } from "@/app/(resources)/(generated)/hooks/recurring-transactions/recurring-transactions";
import { usePagination } from "@/hooks/use-pagination";

export const useRecurringTransactionsAction = () => {
  const { paginationParams, setPaginationParams } = usePagination();

  const { data, isLoading } = useGetRecurringTransactions({
    includeInactive: true,
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  return { data, isLoading, paginationParams, setPaginationParams };
};
