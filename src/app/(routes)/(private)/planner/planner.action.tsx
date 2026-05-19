import { usePeriod } from "@/app/(contexts)/period-provider";
import { useGetBudgets } from "@/app/(resources)/(generated)/hooks/budgets/budgets";
import { useGetGoals } from "@/app/(resources)/(generated)/hooks/goals/goals";
import { useGetOverviewPlanner } from "@/app/(resources)/(generated)/hooks/overview/overview";

export const usePlannerAction = () => {
  const { selectedPeriodId } = usePeriod();

  const { data: budgets, isFetching: isFetchingBudgets } = useGetBudgets({
    periodId: selectedPeriodId || undefined,
  });
  const { data: goals, isFetching: isFetchingGoals } = useGetGoals();
  const { data: overviewPlanner, isFetching: isFetchingOverview } =
    useGetOverviewPlanner();

  return {
    data: {
      budgets: budgets?.data ?? [],
      goals: goals?.data ?? [],
      stats: overviewPlanner?.data?.stats,
      alerts: overviewPlanner?.data?.alerts ?? [],
    },
    loading: {
      isFetchingBudgets,
      isFetchingGoals,
      isFetchingOverview,
    },
  };
};
