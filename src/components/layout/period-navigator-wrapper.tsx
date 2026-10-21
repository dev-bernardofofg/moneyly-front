'use client';

import { usePeriods } from '@/hooks/use-periods';
import { PeriodNavigator } from '@/components/layout/period-navigator';

export const PeriodNavigatorWrapper = () => {
  const { periods, selectedPeriodId, onPeriodSelect, loading } = usePeriods();

  return (
    <PeriodNavigator
      periods={periods}
      selectedPeriodId={selectedPeriodId || ''}
      onPeriodSelect={onPeriodSelect}
      loading={loading}
    />
  );
};
