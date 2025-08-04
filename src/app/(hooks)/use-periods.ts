import { usePeriod } from "@/app/(contexts)/period-provider";
import { GetPeriodsRequest } from "@/app/(services)/period.service";
import { useEffect } from "react";

export const usePeriods = () => {
  const {
    selectedPeriodId,
    setSelectedPeriodId,
    periods,
    setPeriods,
    loading,
    setLoading,
  } = usePeriod();

  const { data: periodsData, isLoading: periodsLoading } = GetPeriodsRequest();

  // Atualizar períodos quando dados chegarem
  useEffect(() => {
    if (periodsData?.data) {
      setPeriods(periodsData.data);

      // Se não há período selecionado, selecionar o período atual ou o primeiro
      if (!selectedPeriodId && periodsData.data.length > 0) {
        const currentPeriod = periodsData.data.find(
          (period: any) => period.isCurrent
        );
        const firstPeriod = periodsData.data[0];
        setSelectedPeriodId(currentPeriod?.id || firstPeriod.id);
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
