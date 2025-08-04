import { usePeriod } from "@/app/(contexts)/period-provider";
import { budgetQueryData } from "@/app/(services)/budget.service";
import { overviewQueryData } from "@/app/(services)/overview.service";
import { transactionQueryData } from "@/app/(services)/transaction.service";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const usePeriodInvalidation = () => {
  const queryClient = useQueryClient();
  const { selectedPeriodId } = usePeriod();

  useEffect(() => {
    if (selectedPeriodId) {
      // Invalidar queries que dependem do período
      queryClient.invalidateQueries({
        queryKey: [overviewQueryData.getOverview],
      });
      queryClient.invalidateQueries({
        queryKey: [transactionQueryData.getTransaction],
      });
      queryClient.invalidateQueries({
        queryKey: [budgetQueryData.getBudgets],
      });
    }
  }, [selectedPeriodId, queryClient]);
};
