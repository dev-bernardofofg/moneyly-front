'use client';

import { usePeriod } from '@/app/(contexts)/period-provider';
import {
  useGetOvertime,
  useGetOvertimeSummary,
} from '@/app/(resources)/(generated)/hooks/overtime/overtime';

const getMonthYear = (startDate: string) => {
  const d = new Date(startDate);
  return { month: d.getMonth() + 1, year: d.getFullYear() };
};

export const useOvertimeAction = (companyId?: string) => {
  const { selectedPeriodId, periods } = usePeriod();
  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);
  const monthYear = selectedPeriod ? getMonthYear(selectedPeriod.startDate) : null;

  const { data: overtimeData, isLoading: isLoadingRecords } = useGetOvertime(
    monthYear
      ? { month: monthYear.month, year: monthYear.year, companyId: companyId || undefined }
      : {},
    { query: { enabled: !!monthYear } }
  );

  const { data: summaryData, isLoading: isLoadingSummary } = useGetOvertimeSummary(
    monthYear ?? { month: 0, year: 0 },
    { query: { enabled: !!monthYear } }
  );

  return {
    records: overtimeData?.data ?? [],
    summary: summaryData?.data ?? null,
    isLoading: isLoadingRecords || isLoadingSummary,
  };
};
