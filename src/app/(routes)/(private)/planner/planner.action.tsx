import { usePeriod } from '@/app/(contexts)/period-provider';
import { useGetBudgets } from '@/app/(resources)/(generated)/hooks/budgets/budgets';
import { useGetGoals } from '@/app/(resources)/(generated)/hooks/goals/goals';
import { useGetOverviewPlanner } from '@/app/(resources)/(generated)/hooks/overview/overview';

export const usePlannerAction = () => {
  const { selectedPeriodId } = usePeriod();
  const periodId = selectedPeriodId || undefined;

  const { data: budgets, isLoading: isLoadingBudgets } = useGetBudgets({ periodId });
  const { data: goals, isLoading: isLoadingGoals } = useGetGoals();
  const {
    data: overviewPlanner,
    isLoading: isLoadingOverview,
    isError: isOverviewError,
  } = useGetOverviewPlanner({ periodId });

  return {
    data: {
      budgets: budgets?.data ?? [],
      goals: goals?.data ?? [],
      stats: overviewPlanner?.data?.stats,
      alerts: overviewPlanner?.data?.alerts ?? [],
      freeBalanceImpact: overviewPlanner?.data?.freeBalanceImpact,
    },
    loading: {
      isLoadingBudgets,
      isLoadingGoals,
      isLoadingOverview,
      isOverviewError,
    },
  };
};
