import { usePeriod } from "@/app/(contexts)/period-provider";
import {
  getBudgets,
  useGetBudgets,
} from "@/app/(resources)/(generated)/hooks/budgets/budgets";
import { Budget } from "@/app/(resources)/(generated)/types/Budget";
import { useEffect } from "react";
import { BudgetStatus } from "../(resources)/(generated)/hooks/moneylyAPI.schemas";
import { Period } from "../(types)/period.type";

export const usePeriods = () => {
  const {
    selectedPeriodId,
    setSelectedPeriodId,
    periods,
    setPeriods,
    loading,
    setLoading,
  } = usePeriod();

  const { data: periodsData, isLoading: periodsLoading } = useGetBudgets({
    query: {
      queryKey: [getBudgets],
    },
  });

  // Atualizar períodos quando dados chegarem
  useEffect(() => {
    if (periodsData?.data) {
      setPeriods(periodsData.data.data as Period[]);

      // Se não há período selecionado, selecionar o período atual ou o primeiro
      if (
        !selectedPeriodId &&
        periodsData.data.data &&
        periodsData.data.data.length > 0
      ) {
        const currentPeriod = periodsData.data.data.find(
          (period: Budget) => period.status === BudgetStatus.safe
        );
        const firstPeriod = periodsData.data.data[0];
        setSelectedPeriodId(currentPeriod?.id || firstPeriod?.id || "");
      }
    }
  }, [periodsData, selectedPeriodId, setPeriods, setSelectedPeriodId]);

  // Atualizar loading state
  useEffect(() => {
    setLoading(periodsLoading);
  }, [periodsLoading, setLoading]);

  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriodId(periodId);
  };

  return {
    periods,
    selectedPeriodId,
    onPeriodSelect: handlePeriodSelect,
    loading: loading || periodsLoading,
  };
};
