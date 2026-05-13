import { usePeriod } from "@/app/(contexts)/period-provider";
import {
  getUserFinancialPeriods,
  useGetUserFinancialPeriods,
} from "@/app/(resources)/(generated)/hooks/user/user";
import { FinancialPeriod } from "@/app/(resources)/(generated)/types/FinancialPeriod";
import { useEffect } from "react";
import { Period } from "../(types)/period.type";

const toPeriod = (fp: FinancialPeriod): Period => ({
  id: fp.id,
  label: fp.label ?? "",
  startDate: fp.startDate,
  endDate: fp.endDate,
  transactionCount: fp.transactionCount ?? 0,
});

export const usePeriods = () => {
  const {
    selectedPeriodId,
    setSelectedPeriodId,
    periods,
    setPeriods,
    loading,
    setLoading,
  } = usePeriod();

  const { data: periodsData, isLoading: periodsLoading } =
    useGetUserFinancialPeriods({
      query: {
        queryKey: [getUserFinancialPeriods],
      },
    });

  useEffect(() => {
    if (periodsData?.data) {
      setPeriods(periodsData.data.map(toPeriod));

      if (!selectedPeriodId && periodsData.data.length > 0) {
        setSelectedPeriodId(periodsData.data[0].id);
      }
    }
  }, [periodsData, selectedPeriodId, setPeriods, setSelectedPeriodId]);

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
