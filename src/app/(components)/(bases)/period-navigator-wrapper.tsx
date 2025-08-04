"use client";

import { usePeriods } from "@/app/(hooks)/use-periods";
import { PeriodNavigator } from "./period-navigator";

export const PeriodNavigatorWrapper = () => {
  const { periods, selectedPeriodId, onPeriodSelect, loading } = usePeriods();

  return (
    <PeriodNavigator
      periods={periods}
      selectedPeriodId={selectedPeriodId || ""}
      onPeriodSelect={onPeriodSelect}
      loading={loading}
    />
  );
}; 