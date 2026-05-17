import { usePeriod } from "@/app/(contexts)/period-provider";
import {
  getUserFinancialPeriods,
  useGetUserFinancialPeriods,
} from "@/app/(resources)/(generated)/hooks/user/user";
import { FinancialPeriodSummary } from "@/app/(resources)/(generated)/types/FinancialPeriodSummary";
import { useEffect } from "react";
import { Period } from "../(types)/period.type";

const toPeriod = (fp: FinancialPeriodSummary): Period => ({
  id: fp.id,
  label: fp.label ?? "",
  startDate: fp.startDate,
  endDate: fp.endDate,
  transactionCount: fp.transactionCount ?? 0,
  isCurrent: fp.isCurrent ?? false,
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
      const sorted = [...periodsData.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      setPeriods(sorted.map(toPeriod));

      if (!selectedPeriodId && sorted.length > 0) {
        const current = sorted.find((p) => p.isCurrent);
        setSelectedPeriodId((current ?? sorted[0]).id);
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
