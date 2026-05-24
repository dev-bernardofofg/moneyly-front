'use client';

import { usePeriod } from '@/app/(contexts)/period-provider';
import {
  useGetOvertime,
  useGetOvertimeSummary,
} from '@/app/(resources)/(generated)/hooks/overtime/overtime';

export const useOvertimeAction = () => {
  const { selectedPeriodId } = usePeriod();

  const { data: overtimeData, isLoading: isLoadingRecords } = useGetOvertime({
    periodId: selectedPeriodId ?? undefined,
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useGetOvertimeSummary(
    { periodId: selectedPeriodId ?? '' },
    { query: { enabled: !!selectedPeriodId } }
  );

  return {
    records: overtimeData?.data ?? [],
    summary: summaryData?.data ?? null,
    isLoading: isLoadingRecords || isLoadingSummary,
  };
};
