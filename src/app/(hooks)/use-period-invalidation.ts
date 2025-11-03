import { usePeriod } from "@/app/(contexts)/period-provider";
import { getBudgets } from "@/app/(resources)/(generated)/hooks/budgets/budgets";
import { getGoals } from "@/app/(resources)/(generated)/hooks/goals/goals";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePeriodInvalidation = () => {
  const queryClient = useQueryClient();
  const { selectedPeriodId } = usePeriod();

  useEffect(() => {
    if (selectedPeriodId) {
      queryClient.invalidateQueries({
        queryKey: [getGoals],
      });
      queryClient.invalidateQueries({
        queryKey: [getBudgets],
      });
    }
  }, [selectedPeriodId, queryClient]);
};
