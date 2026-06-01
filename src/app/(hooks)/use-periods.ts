import { usePeriod } from '@/app/(contexts)/period-provider';
import { useGetUserFinancialPeriods } from '@/app/(resources)/(generated)/hooks/user/user';
import { FinancialPeriodSummary } from '@/app/(resources)/(generated)/types/FinancialPeriodSummary';
import { useEffect } from 'react';
import { Period } from '../(types)/period.type';

const toPeriod = (fp: FinancialPeriodSummary): Period => ({
  id: fp.id,
  label: fp.label ?? '',
  startDate: fp.startDate,
  endDate: fp.endDate,
  transactionCount: fp.transactionCount ?? 0,
  isCurrent: fp.isCurrent ?? false,
});

export const usePeriods = () => {
  const { selectedPeriodId, setSelectedPeriodId, periods, setPeriods, loading, setLoading } =
    usePeriod();

  const { data: periodsData, isLoading: periodsLoading } = useGetUserFinancialPeriods();

  useEffect(() => {
    if (!periodsData?.data) return;
    const sorted = [...periodsData.data]
      .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    setPeriods(sorted.map(toPeriod));
  }, [periodsData, setPeriods]);

  useEffect(() => {
    if (!selectedPeriodId && periods.length > 0) {
      const current = periods.find((p) => p.isCurrent);
      setSelectedPeriodId((current ?? periods[0]).id);
    }
  }, [selectedPeriodId, periods, setSelectedPeriodId]);

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
